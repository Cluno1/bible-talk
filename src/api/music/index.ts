
import { request } from "../request";
import type { GDSearchType, GDSourceType } from "@/type/music";

const BASE_URL = "https://music-api.gdstudio.xyz/api.php";

// 搜索音乐/专辑/歌手/歌单
export function searchMusic<T = any>({
  keyword,
  page = 1,
  pageSize = 20,
  source = "netease",
  type = "music"
}: {
  keyword: string;
  page?: number;
  pageSize?: number;
  source?: GDSourceType;
  type?: GDSearchType;
}) {
  let apiSource = source;
  if (type === "album") apiSource += "_album";
  // 其他类型直接用source
  return request<T>({
    url: BASE_URL,
    method: "GET",
    params: {
      types: "search",
      source: apiSource,
      name: keyword,
      count: pageSize,
      pages: page
    },
    custom:{
        noResponseInterceptor:true
    },
    headers: null as any,
  });
}

// 获取歌曲播放链接   API文档: https://music-api.gdstudio.xyz/api.php
export function getMusicUrl<T = any>({
  id,
  source = "netease",
  br = 999
}: {
  id: string;
  source?: string;
  br?: number;
}) {
  return request<T>({
    url: BASE_URL,
    method: "GET",
    params: {
      types: "url",
      source,
      id,
      br
    },
    custom:{
        noResponseInterceptor:true
    },
    headers: null as any,
  });
}

// 获取专辑图
export function getMusicPic<T = any>({
  id,
  source = "netease",
  size = 500
}: {
  id: string;
  source?: string;
  size?: number;
}) {
  return request<T>({
    url: BASE_URL,
    method: "GET",
    params: {
      types: "pic",
      source,
      id,
      size
    },
    custom:{
        noResponseInterceptor:true
    },
    headers: null as any,
  });
}

// 获取歌词
export function getMusicLyric<T = any>({
  id,
  source = "netease"
}: {
  id: string;
  source?: string;
}) {
  return request<T>({
    url: BASE_URL,
    method: "GET",
    params: {
      types: "lyric",
      source,
      id
    },
    custom:{
        noResponseInterceptor:true
    },
    headers: null as any,
  });
}

