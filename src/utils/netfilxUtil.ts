import type {
  EpisodeItem,
  NetflixPaginationType,
  NetflixVideoCardType,
  netflixVideoEpisodeType,
} from "@/type/video";
import * as cheerio from "cheerio";

/**
 * 从html解析到netflix对象 仅仅tiantangdianyin 有效
 * @param html
 * @returns
 */
export function netflixExtract(html: string): {
  pagination: NetflixPaginationType;
  cards: NetflixVideoCardType[];
} {
  const $ = cheerio.load(html);

  /* ---------- 1. 分页 ---------- */
  const now = Number($("#fed-now").text().trim()) || 1;
  const total =
    Number($(".fed-page-info a[data-total]").attr("data-total")) || 1;

  const headPageHref =
    $('.fed-page-info a:contains("首页")').attr("href") || "";
  const lastPageHref =
    $('.fed-page-info a:contains("上页")').attr("href") || "";
  const nextPageHref =
    $('.fed-page-info a:contains("下页")').attr("href") || "";
  const tailPageHref =
    $('.fed-page-info a:contains("尾页")').attr("href") || "";

  const pagination: NetflixPaginationType = {
    now,
    total,
    headPageHref,
    lastPageHref,
    nextPageHref,
    tailPageHref,
  };

  /* ---------- 2. 视频卡片 ---------- */
  const cards: NetflixVideoCardType[] = $("dl.fed-deta-info")
    .map((_, el) => {
      const $el = $(el);

      // 图片
      const videoPic = $el
        .find("a.fed-list-pics")
        .attr("data-original")
        ?.trim();
      // 评分
      const score = $el.find(".fed-list-score").text().trim();
      // 备注  如:更新至161集
      const remarks = $el.find(".fed-list-remarks").text().trim();

      // 标题 & 详情页地址
      const $titleA = $el.find("h1.fed-part-eone a");
      const title = $titleA.text().replace(/\s+/g, " ").trim();
      const href = $titleA.attr("href")?.trim() || "";

      // meta 信息
      const meta: NetflixVideoCardType["meta"] = {
        director: undefined,
        roles: undefined,
        category: undefined, //分类
        region: undefined,
        date: undefined,
        update: undefined,
        introduction: undefined,
        other: [],
      };
      $el.find("li").each((_, li) => {
        const $li = $(li);
        const key = $li.find(".fed-text-muted").text().replace("：", "").trim();
        const val = $li
          .text()
          .replace(/^[^：]+：/, "")
          .replace(/\s+/g, " ")
          .trim();

        switch (key) {
          case "主演":
            (meta.roles ||= []).push(val);
            break;
          case "导演":
            meta.director = val;
            break;
          case "分类":
            meta.category = val;
            break;
          case "地区":
            meta.region = val;
            break;
          case "年份":
            meta.date = val;
            break;
          case "更新":
            meta.update = val;
            break;
          case "简介":
            meta.introduction = val;
            break;
          default:
            // 其它字段统一塞进 other
            const exist = meta.other!.find((i) => i.key === key);
            if (exist) {
              exist.val.push(val);
            } else {
              meta.other!.push({ key, val: [val] });
            }
        }
      });

      return { videoPic, score, remarks, title, href, meta };
    })
    .get();

  return { pagination, cards };
}

/**
 * 从樱花动漫详情/播放页解析卡片+选集
 * 支持 detail.html 与 yhdm.html 两种结构
 */
export function yhdmDetailExtract(
  html: string,
  href: string // 当前播放页 href，用于反查激活项
): {
  card: NetflixVideoCardType;
  episode: netflixVideoEpisodeType;
  m3u8: string | null;
} {
  const $ = cheerio.load(html);

  /* 0. 页面类型 */
  const isPlayPage =
    $(".module-player").length > 0 && $("#playSwiper").length > 0;

  /* 1. 卡片通用字段 */
  let videoPic: string | undefined;
  let title: string;
  let score = "";
  let remarks = "";
  const meta: NetflixVideoCardType["meta"] = {
    director: undefined,
    roles: undefined,
    category: undefined,
    region: undefined,
    date: undefined,
    update: undefined,
    introduction: undefined,
    other: [],
  };

  /* 1-1 播放页（yhdm.html） */
  if (isPlayPage) {
    videoPic =
      $(".module-player-info .module-item-pic img")
        .attr("data-original")
        ?.trim() ||
      $(".module-player-info .module-item-pic img").attr("src")?.trim();
    title = $(".module-player-info h1").text().trim();

    /* 地区 */
    meta.region = $(".module-player-info .module-info-tag-link div")
      .attr("title")
      ?.trim();

    /* 豆瓣分 */
    const doubanText = $(".module-player-info")
      .parent()
      .find('.module-info-item:contains("豆瓣")')
      .text();
    const m = doubanText.match(/(\d+\.\d+)/);
    if (m) score = m[1];
  } else {
    /* 1-2 详情页（detail.html） */
    videoPic =
      $(".module-item-pic img").attr("data-original")?.trim() ||
      $(".module-item-pic img").attr("src")?.trim();
    title = $(".module-info-heading h1").text().trim();

    /* 年份 & 地区 */
    $(".module-info-tag-link div").each((_, div) => {
      const txt = $(div).text().trim();
      if (/^\d{4}$/.test(txt)) meta.date = txt;
      else if (txt) meta.region = txt;
    });

    /* 豆瓣分 */
    const doubanNode = $('.module-info-item a[href*="douban"]');
    if (doubanNode.length) score = doubanNode.text().trim();

    /* 更新文字 */
    remarks = $('.module-info-item:contains("更新")')
      .text()
      .replace(/更新：/, "")
      .trim();

    meta.introduction = $(".module-info-introduction-content p").text().trim();
  }

  /* 1-3 公共 meta 块 */
  $(".module-info-item").each((_, li) => {
    const $li = $(li);
    const key = $li
      .find(".module-info-item-title")
      .text()
      .replace("：", "")
      .trim();
    const val = $li.find(".module-info-item-content").text().trim();
    switch (key) {
      case "导演":
        meta.director = val;
        break;
      case "主演":
        meta.roles = val.split("/").map((v) => v.trim());
        break;
      case "分类":
        meta.category = val;
        break;
      case "地区":
        meta.region = val;
        break;
      case "年份":
        meta.date = val;
        break;
      case "更新":
        meta.update = val;
        break;
      case "简介":
        meta.introduction = $li
          .find(".module-info-introduction-content p")
          .text()
          .trim();
        break;
      default:
        const exist = meta.other!.find((i) => i.key === key);
        exist ? exist.val.push(val) : meta.other!.push({ key, val: [val] });
    }
  });

  const card: NetflixVideoCardType = {
    videoPic,
    score,
    remarks,
    title,
    href,
    meta,
  };

  /* 2. 选集 & 播放源 */
  const playerOrigin: string[] = [];
  const playerOriginEpisodeNum: number[] = [];
  const playerOriginEpisodeList: EpisodeItem[][] = [];

  let activePlayerOrigin: string | undefined;
  let activeEpisode: EpisodeItem | undefined;

  if (isPlayPage) {
    /* 2-1 播放页：收集所有源 + 所有集 */
    $("#playSwiper .tab-item").each((_, el) => {
      playerOrigin.push(
        $(el).attr("data-dropdown-value")?.trim() || $(el).text().trim()
      );
    });
    $(".play-tab-list").each((_, panel) => {
      const items: EpisodeItem[] = [];
      $(panel)
        .find("a.module-play-list-link")
        .each((_, a) => {
          const $a = $(a);
          items.push({
            href: $a.attr("href")?.trim() || "",
            title: $a.attr("title")?.trim() || $a.text().trim(),
          });
        });
      playerOriginEpisodeList.push(items);
      playerOriginEpisodeNum.push(items.length);
    });

    /* 2-2 反查当前激活项 */
    outer: for (let i = 0; i < playerOriginEpisodeList.length; i++) {
      const list = playerOriginEpisodeList[i];
      for (let j = 0; j < list.length; j++) {
        if (list[j].href === href) {
          activePlayerOrigin = playerOrigin[i];
          activeEpisode = list[j];
          break outer;
        }
      }
    }
    /* 兜底 */
    if (!activePlayerOrigin) {
      activePlayerOrigin = playerOrigin[0];
      activeEpisode = playerOriginEpisodeList[0]?.[0];
    }
  } else {
    /* 2-3 详情页：只收集，不激活 */
    $("#y-playList .tab-item").each((_, el) => {
      playerOrigin.push(
        $(el).attr("data-dropdown-value")?.trim() || $(el).text().trim()
      );
    });
    $(".module-list.sort-list.tab-list").each((_, panel) => {
      const items: EpisodeItem[] = [];
      $(panel)
        .find("a.module-play-list-link")
        .each((_, a) => {
          const $a = $(a);
          items.push({
            href: $a.attr("href")?.trim() || "",
            title: $a.attr("title")?.trim() || $a.text().trim(),
          });
        });
      playerOriginEpisodeList.push(items);
      playerOriginEpisodeNum.push(items.length);
    });
  }

  /* 3. m3u8 */
  let m3u8: string | null = null;
  if (isPlayPage) {
    /* 从嵌入的 iframe src 里拆出第一条 m3u8 */
    m3u8 = netflixGetM3u8(html);
  }

  return {
    card,
    episode: {
      playerOrigin,
      activePlayerOrigin,
      activeEpisode,
      playerOriginEpisodeNum,
      playerOriginEpisodeList,
    },
    m3u8,
  };
}

/**
 * getM3u8 by html
 * @param html
 * @returns
 */
export function netflixGetM3u8(html: string) {
  // 匹配 url= 后面到第一个 ' 或 " 之前的全部内容
  const m = html.match(/\bsrc=['"][^'"]*\?url=([^'"]+)['"]/);

  if (m) {
    const url = decodeURIComponent(m[1]); // 如果 url 被 encode 过就解一下
    console.log(url); // -> https://8.bf8bf.com/video/fanrenxiuxianchuan/第160集/index.m3u8
    return url;
  } else {
    console.log("没抓到");
    return "";
  }
}


/**
 * 深合并两个任意值，规则：
 * 1. 一方为 undefined / null 时取另一方；
 * 2. 都是数组时，去重合并；
 * 3. 都是对象时，递归合并字段；
 * 4. 其余情况取「更全」的一方（非空优先）。
 */
function deepMerge<T>(a: T, b: T): T {
  if (a === undefined || a === null) return b;
  if (b === undefined || b === null) return a;

  if (Array.isArray(a) && Array.isArray(b)) {
    // 去重合并
    return Array.from(new Set([...a, ...b])) as unknown as T;
  }

  if (typeof a === 'object' && typeof b === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const res: any = {};
    keys.forEach(k => {
      res[k] = deepMerge((a as any)[k], (b as any)[k]);
    });
    return res;
  }

  // 非空优先
  return (a !== '' && a !== 0) ? a : b;
}

/**
 * 对比两个 NetflixVideoCardType，返回「更全」的一份。
 * 不会修改原始对象。
 */
export function pickBetterVideoCard(
  val1: NetflixVideoCardType,
  val2: NetflixVideoCardType
): NetflixVideoCardType {
  // 先处理顶层字段
  const base = deepMerge(val1, val2);

  // 再单独处理 meta.other 数组，按 key 合并 val
  if (val1.meta?.other || val2.meta?.other) {
    const map = new Map<string, string[]>();

    const collect = (other?: Array<{ key: string; val: string[] }>) => {
      other?.forEach(({ key, val }) => {
        const old = map.get(key) ?? [];
        map.set(key, Array.from(new Set([...old, ...val])));
      });
    };

    collect(val1.meta?.other);
    collect(val2.meta?.other);

    base.meta ??= {};
    base.meta.other = Array.from(map.entries()).map(([key, val]) => ({ key, val }));
  }

  return base;
}
