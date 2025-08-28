import { defineStore } from "pinia";
import { useConfigStore } from "./configStore";
import { useMenuStore } from "./menuStore";
import { btDataDemo2 } from "@/test/bt.text";

export type Reference = {
  text: string;
  link: string;
};
export interface Section {
  //标识该段落是要斜体还是正体   每一个section仅仅有一个paragraphs 或者 quote;
  paragraphs?: string; //段落   ** **为加粗
  quote?: string; //引用 斜体   ** **为加粗
}

export interface BibleTalkDataType {
  id: number | string;
  hasOverview?:boolean;//是否有overview 主题预览, 如果没有该条或者false ,都是没有主题预览,即直接渲染一个路由,其他当作文章标题
  title?: string | null; //主题
  subTitle?: string | null; //副标题
  titleLeftColor?: string | null; //颜色
  titleColor?: string | null; //颜色
  name: string; //路由名称    ---推荐bible talk      注意 name 不能是 home 或 bible,否则会删除掉基础的页面!  显示的名称,可以是中文或英文
  englishName: string; //路由名称  ---推荐bibletalk  必须英文小写 没有空格  //用他做路由总依据  禁止为overview bible home
  children?: BibleTalkDataType[]; //下一级
  content?: Section[]; //
  reference?: Reference[] | null; //引用文献
  icon?: string | null;
  meta?: any; //保留字段
  rank?: number; //排序大小 从小到大
}

export const useBibleTalkStore = defineStore("bibleTalk", () => {
  const menuStore = useMenuStore();

  const datastorage = new Map<string, BibleTalkDataType>();

  const config = useConfigStore();
  function getData(searchVal: string) {
    if (searchVal == "james") {
      const data = btDataDemo2;
      datastorage.set(data.englishName, data); 
      config.addBibleTalkRouters(data); //添加路由
      menuStore.menuVersion++;
    }
  }

  return { datastorage, getData };
});
