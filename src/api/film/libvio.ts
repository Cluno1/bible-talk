import { API_CONFIG } from "@/config/originApiSearch";
import type { SiteType } from "@/type/video";
import { yhdmRender } from "../yhdm";

/**
 * 构造 LibreTV 搜索/详情请求 URL
 * @param {Object} site     必须：{ api, name, detail?, selected? }
 * @param {String} type     必须：'search' | 'detail'
 * @param {String} query    search 时必填：关键词
 * @param {String} ids      detail 时必填：vod_id
 * @returns {String}        可直接 fetch 的终态 URL
 */
export function buildLibreTVUrl(
  site: SiteType,
  type: "search" | "detail",
  { query = "", ids = "" } = {}
) {
  if (!site || !site.api) throw new Error("buildLibreTVUrl: site.api 缺失");

  // const PROXY_URL = "https://libretv.liumingye.cn/proxy/";
  const cfg = API_CONFIG || {}; // 容错：防止未加载 config.js
  const searchCfg = cfg.search || { path: "?ac=videolist&wd=" };
  const detailCfg = cfg.detail || { path: "?ac=videolist&ids=" };

  let rawUrl;

  if (type === "search") {
    if (!query) throw new Error("buildLibreTVUrl: search 模式必须提供 query");
    rawUrl = `${site.api}${searchCfg.path}${encodeURIComponent(query)}`;
  } else if (type === "detail") {
    if (!ids) throw new Error("buildLibreTVUrl: detail 模式必须提供 ids");
    rawUrl = `${site.detail || site.api}${detailCfg.path}${encodeURIComponent(
      ids
    )}`;
  } else {
    throw new Error("buildLibreTVUrl: type 仅支持 search | detail");
  }
  // 代理前缀 + URL 编码
  // let proxied = PROXY_URL + encodeURIComponent(rawUrl);
  let proxied = rawUrl;

  return yhdmRender(proxied);
}
