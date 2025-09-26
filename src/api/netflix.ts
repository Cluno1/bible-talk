import type { ResData } from "@/type/request";
import { request } from "./request";

const baseUrl = "http://localhost:3000";

export async function netflixSearch(keyWord: string, page: number) {
  if (page > 1) {
    return request<string>({
      url: baseUrl + "/video",
      method: "GET",
      params: {
        val:
          "/vodsearch/" +
          encodeURIComponent(keyWord.trim()) +
          `----------${page}---.html`,
      },
      headers: null as any,
    });
  } else
    return request<string>({
      url: baseUrl + "/video",
      method: "GET",
      params: {
        val:
          "/vodsearch/-------------.html?wd=" +
          encodeURIComponent(keyWord.trim()),
      },
      headers: null as any,
    });
}

import htmlString from "@/test/t.html?raw";

export async function testSearch(
  keyWord: string,
  page: number
): Promise<ResData<string>> {
  console.log(keyWord, "kw");
  if (page > 1) {
    // 仅第一页有数据，其余页直接空结果
    return { data: "", code: 200 };
  }
  // ② 把 html 字符串包装成和后端返回一样的格式
  return { data: htmlString, code: 200 };
}

export async function netflixCapture(href: string) {
  return request<string>({
    url: baseUrl + "/capture",
    method: "GET",
    params: {
      val: href,
    },
    headers: null as any,
  });
}

export async function netflixRender(url: string) {
  return request<string>({
    url: "http://localhost:3002" + "/render",
    method: "GET",
    params: {
      url,
    },
    headers: null as any,
  });
}
