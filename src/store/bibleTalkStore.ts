import { defineStore } from "pinia";
import { useConfigStore } from "./configStore";
import { btDataDemo2 } from "@/utils/default/page/bt";
import { helpDoc } from "@/utils/default/page/help";
import type { BibleTalkDataType } from "@/type/page";

export const useBibleTalkStore = defineStore("bibleTalk", () => {
  const datastorage = new Map<string, BibleTalkDataType>(); // id  => data

  const config = useConfigStore();
  /**
   * 联网查询 文字页面  严格查询id
   *
   * 如果返回true则 添加成功 如果返回false 则是找不到没有该id的 页面;如果error 抛出 则是 '已有该页面'
   * @param id
   * @returns
   */
  function getData(id: string): boolean {
    const a = [btDataDemo2, helpDoc].find((_i) => _i.id === id);
    console.log('getdata',a)
    //这里本地查询
    if (a) {
      if (datastorage.has(a.id)) {
        throw new Error("已有该页面");
      }

      datastorage.set(a.id, a); //设置map id
      config.addBibleTalkRouters(a); //添加路由

      return true;
    } else {
      //联网查询...
    }
    return false;
  }
  function removeData(id: string) {
    console.log("remove data by id:", id);
    datastorage.delete(id);
  }

  return { datastorage, getData, removeData };
});
