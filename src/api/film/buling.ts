import type { ResData } from "@/type/request";
import { yhdmRender } from "../yhdm";

export function getBuLing(kw: string, page: number = 1) {
  return yhdmRender<ResData<string>>(
    `https://d3gbed2ley04jq.sgatwbd.cc/search/${encodeURIComponent(
      kw
    )}/${page}/`
  );
}

//https://d3gbed2ley04jq.sgatwbd.cc/search/%E7%A6%8F%E5%88%A9/3/
