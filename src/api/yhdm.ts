import { request } from "./request";

export function yhdmRender(url: string) {
  return request<string>({
    url: "https://coup-online.fun:3002" + "/render",
    method: "GET",
    params: {
      url,
    },
    headers: null as any,
  });
}

export function yhdmSearch(kw: string, page: number) {
  return yhdmRender(
    "https://www.yhdmtv.top/public/auto/search1.html?keyword=" +
      kw +
      "&page=" +
      page
  );
}

export function yhdmHref(href: string) {
  return yhdmRender("https://www.yhdmtv.top" + href);
}
