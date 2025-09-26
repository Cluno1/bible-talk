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
  //拓展 meta...
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
