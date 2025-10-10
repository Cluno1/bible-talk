// src/utils/parsePostList.ts
import { request } from "@/api/request";
import type {
  NetflixPaginationType,
  NetflixVideoCardType,
  SiteType,
} from "@/type/video";
import * as cheerio from "cheerio";



export function parseM3u8Buling(html: string): string {
  try {
    const $ = cheerio.load(html);

    // 1. 找到第一个 dplayer 节点
    const configRaw = $('.dplayer').first().attr('data-config');
    if (!configRaw) return '';

    // 2. 解析 JSON
    const cfg = JSON.parse(configRaw);

    // 3. 取出 video.url
    return cfg?.video?.url ?? '';
  } catch {
    return '';
  }
}

/* =====  2. 原主函数（仅改动 videoPic 一行） ===== */
export async function parseBuling(
  html: string,
  originSite: SiteType = { api: "", name: "", selected: true }
): Promise<{
  cards: NetflixVideoCardType[];
  pagination: NetflixPaginationType;
}> {
  const $ = cheerio.load(html);
  const cards: NetflixVideoCardType[] = [];
  let pagination: NetflixPaginationType = {};

  /* 1. 先把 DOM 列表拿出来 */
  const articles = $("#archive article").toArray();

  /* 2. 串行解析 */
  for (const article of articles) {
    // $("#archive article").each((_, article) => {
    const $$ = cheerio.load(article);

    const title = $$('h2[itemprop="headline"]').text().trim();
    const href = $$("a[href]").first().attr("href")?.trim() || "";

    // /*  调用封装函数  */
    // const arr = await extractDecryptedImages($$.html());
    // const videoPic = arr[0] || "";
    const videoPic = "";
    const author = $$('span[itemprop="author"]')
      .text()
      .replace(/[•\s]+$/g, "");
    const date = $$('span[itemprop="datePublished"]')
      .text()
      .replace(/[•\s]+$/g, "");
    const cate = $$(".post-card-info").contents().last().text().trim();
    const introduction = [author, date, cate].filter(Boolean).join(" · ");

    cards.push({
      videoPic,
      title,
      href,
      meta: { introduction, category: cate, date, roles: [author] },
      score: "",
      remarks: "",
      originSite,
      episodes: undefined,
    });
  }

  const txt = $(".page-info").text().trim();
  const arr = txt.split("/").map((n) => Number(n) || 1);
  pagination = { now: arr[0] || 1, total: arr[1] || 1 };

  console.log(cards, "cards");
  return { cards, pagination };
}

function decryptBuffer(buf: ArrayBuffer): string {
  const u8 = new Uint8Array(buf);
  for (let i = 0; i < u8.length; i++) {
    u8[i] ^= 0x65;
  }
  const binary = Array.from(u8, (b) => String.fromCharCode(b)).join("");
  return btoa(binary);
}

function getMimeType(buffer: ArrayBuffer): string {
  const arr = new Uint8Array(buffer.slice(0, 12)); // WebP 需要 12 字节
  if (arr[0] === 0xff && arr[1] === 0xd8) return "image/jpeg";
  if (arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4e && arr[3] === 0x47)
    return "image/png";
  if (arr[0] === 0x47 && arr[1] === 0x49 && arr[2] === 0x46) return "image/gif";
  if (
    arr[0] === 0x52 &&
    arr[1] === 0x49 &&
    arr[2] === 0x46 &&
    arr[3] === 0x46 &&
    arr[8] === 0x57 &&
    arr[9] === 0x45 &&
    arr[10] === 0x42 &&
    arr[11] === 0x50
  )
    return "image/webp";
  return "image/jpeg";
}

export async function extractDecryptedImages(html: string): Promise<string[]> {
  const IMG_RE = /loadBanner(?:Direct)?\s*\(\s*['"`](.*?)['"`]/gi;
  const urls: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = IMG_RE.exec(html)) !== null) urls.push(m[1].trim());
  if (!urls.length) return [];

  const NEED_DECRYPT = (u: string) =>
    ["/xiao/", "/usr/", "/upload_01/", "/upload/upload/"].some((k) =>
      u.includes(k)
    );

  return Promise.all(
    urls.map(async (u) => {
      if (!NEED_DECRYPT(u)) return u;
      try {
        const buf = await request<ArrayBuffer>({
          url: u,
          responseType: "arraybuffer",
          custom: { noResponseInterceptor: true },
          headers: undefined as any,
        });

        const decrypted = decryptBuffer(buf);
        const mime = getMimeType(buf);
        return `data:${mime};base64,${decrypted}`;
      } catch {
        return u;
      }
    })
  );
}
