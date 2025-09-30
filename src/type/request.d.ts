export interface ResData<T = any> {
  code: number;
  data: T;
  msg?: string;
  message?: string;
  total?: number;
  rows?: T[];
}

export interface CustomConfig {
  showSuccess?: boolean;
  successMsg?: string;
  showError?: boolean;
  errorMsg?: string;
  showLoading?: boolean;
  loadingMsg?: string;
  auth?: boolean;
  /** 跳过响应拦截器 */
  noResponseInterceptor?: boolean;
  //拓展 meta...
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
