import type {
  EpisodeItem,
  NetflixVideoCardType,
  netflixVideoEpisodeType,
  SiteType,
} from "@/type/video";

/**
 * 入口函数
 */
export function parseJson2Netflix(
  jsonStr: string,
  originSite?: SiteType
): {
  cards: NetflixVideoCardType[];
} {
  const raw = JSON.parse(jsonStr) as { list?: RawItem[] };
  const list = raw?.list ?? [];

  const cards: NetflixVideoCardType[] = [];
  const episodes: netflixVideoEpisodeType[] = [];

  list.forEach((it) => {
    /* 2. 构造剧集 */
    // const episodeList = parseEpisodes(it.vod_play_url);

    const episodeData = parseEpisodes(it.vod_play_url || "");

    const episodesPre = {
      playerOrigin: episodeData.playerOrigin,
      playerOriginEpisodeNum: episodeData.playerOriginEpisodeNum,
      playerOriginEpisodeList: episodeData.playerOriginEpisodeList,
    };

    episodes.push(episodesPre);
    // if (episodeList.length) {
    //   episodes.push({
    //     playerOrigin: ["正片"], // 当前只有这一个源
    //     playerOriginEpisodeNum: [episodeList.length],
    //     playerOriginEpisodeList: [episodeList],
    //   });
    // }

    /* 1. 构造卡片 */
    const card: NetflixVideoCardType = {
      title: it.vod_name,
      href: buildHref(it.vod_id),
      videoPic: it.vod_pic,
      score: it.vod_douban_score || it.vod_score || undefined,
      remarks: it.vod_remarks || undefined,
      meta: {
        director: it.vod_director || undefined,
        roles: it.vod_actor
          ? it.vod_actor.split(",").map((s) => s.trim())
          : undefined,
        category: it.type_name,
        region: it.vod_area || undefined,
        date: it.vod_pubdate || undefined,
        update: it.vod_time || undefined,
        introduction: stripHtml(it.vod_content || it.vod_blurb),
      },
      originSite,
      // episodes: {
      //   playerOrigin: ["正片"], // 当前只有这一个源
      //   playerOriginEpisodeNum: [episodeList.length],
      //   playerOriginEpisodeList: [episodeList],
      // },
      episodes: episodesPre,
    };
    cards.push(card);
  });

  return { cards };
}

/* ------------------------------------------------------------------ */
/* --------------------------- 内部工具 ------------------------------ */
/* ------------------------------------------------------------------ */

interface RawItem {
  vod_id: number | string;
  vod_name: string;
  vod_pic: string;
  vod_douban_score?: string;
  vod_score?: string;
  vod_remarks?: string;
  vod_director?: string;
  vod_actor?: string;
  type_name?: string;
  vod_area?: string;
  vod_pubdate?: string;
  vod_time?: string;
  vod_content?: string;
  vod_blurb?: string;
  vod_play_url?: string;
}

/** 根据 vod_id 拼一个详情页假链接 */
function buildHref(id: number | string): string {
  return `/detail/${id}`;
}

/** 简单去掉 html 标签 */
function stripHtml(html = ""): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

/**
 * 把 "第01集$url#第02集$url..." 解析成 EpisodeItem[]
 */
// function parseEpisodes(playUrl = ""): EpisodeItem[] {
//   if (!playUrl) return [];
//   return playUrl.split("#").reduce((arr: EpisodeItem[], chunk) => {
//     const [title, player_url] = chunk.split("$");
//     if (title && player_url)
//       arr.push({ title: title.trim(), player_url: player_url.trim() });
//     return arr;
//   }, []);
// }
function parseEpisodes(vod_play_url: string): {
  playerOrigin: string[];
  playerOriginEpisodeList: EpisodeItem[][];
  playerOriginEpisodeNum: number[];
} {
  const lines = vod_play_url.split("#").filter(Boolean);

  const sources: EpisodeItem[][] = []; // 每个源是一个数组
  let currentSource: EpisodeItem[] = [];
  const seenInCurrent = new Set<string>();

  for (const line of lines) {
    const [title, url] = line.split("$");
    if (!title || !url) continue;

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (seenInCurrent.has(trimmedTitle)) {
      // 当前源已存在这个 title → 冲突 → 封存当前源，新开一个
      sources.push(currentSource);
      currentSource = [];
      seenInCurrent.clear();
    }

    currentSource.push({ title: trimmedTitle, player_url: trimmedUrl });
    seenInCurrent.add(trimmedTitle);
  }

  if (currentSource.length) sources.push(currentSource);

  return {
    playerOrigin: sources.map((_, i) => `源${i + 1}`),
    playerOriginEpisodeList: sources,
    playerOriginEpisodeNum: sources.map((s) => s.length),
  };
}
