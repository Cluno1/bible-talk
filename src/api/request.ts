import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import type { CustomConfig, ResData } from "@/type/request";


/* ---------- 工具 ---------- */
export function tansParams(params: any): string {
  if (!params) return "";
  const parts: string[] = [];
  Object.keys(params).forEach((key) => {
    const val = params[key];
    if (val == null || val === "") return;
    if (
      Array.isArray(val) ||
      Object.prototype.toString.call(val) === "[object Object]"
    ) {
      Object.keys(val).forEach((subKey) => {
        const subVal = val[subKey];
        if (subVal != null && subVal !== "") {
          parts.push(
            `${encodeURIComponent(`${key}[${subKey}]`)}=${encodeURIComponent(
              subVal
            )}`
          );
        }
      });
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
    }
  });
  return parts.join("&");
}

/* ---------- 实例 ---------- */
const http: AxiosInstance = axios.create({
  timeout: 18_000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=UTF-8",
  },
});

/* ---------- 请求拦截 ---------- */
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig & { custom?: CustomConfig }) => {
    /* 1. token */
    const token = localStorage.getItem("token");
    if (token) config.headers!.Authorization = `Bearer ${token}`;

    /* 2. GET 参数拼 url */
    if (config.method === "get" && config.params) {
      const search = tansParams(config.params);
      if (search)
        config.url += (config.url!.includes("?") ? "&" : "?") + search;
      delete config.params;
    }

    /** .. 拓展 如loading...等 */

    return config;
  },
  (err: AxiosError) => Promise.reject(err)
);

/* ---------- 响应拦截 ---------- */
http.interceptors.response.use(
  (res: AxiosResponse<ResData>) => {
    /* 只检查业务码，不拆包，保持 AxiosResponse 外壳 */
    if (res.data.code !== 200) {
      /* 需要统一错误提示可在这里做 */
      console.error("error in request return  --64");
      return Promise.reject(res.data);
    }
    return res; // ✅ 返回完整 AxiosResponse
  },
  (err: AxiosError) => {
    /* 网络/HTTP 错误统一处理 */
    // router.push({
    //   path: '/error',
    //   query: {
    //     code: '500',
    //     msg: '网络或者服务器问题'
    //   }
    // })
    return Promise.reject(err);
  }
);

/* ---------- 对外方法 ---------- */
export async function request<T = any>(
  config: InternalAxiosRequestConfig & { custom?: CustomConfig }
): Promise<ResData<T>> {
  const axiosRes = await http.request<ResData<T>>(config);
  return axiosRes.data; // 类型就是 ResData<T>
}
