import { btDataDemo } from "@/test/bibleTalk.text";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useConfigStore } from "./configStore";
import { useMenuStore } from "./menuStore";

export type Reference = {
  text: string;
  link: string;
};
export interface Section {
  paragraphs?: string; //段落   ** **为加粗
  quote?: string; //引用 斜体
}

export interface BibleTalkDataType {
  id?: number | string;
  title?: string | null; //主题
  subTitle?: string | null; //副标题
  titleLeftColor?: string | null; //颜色
  titleColor?: string | null; //颜色
  name: string; //路由名称    ---推荐bible talk      注意 name 不能是 home 或 bible,否则会删除掉基础的页面!
  englishName: string; //路由名称  ---推荐bible talk
  children?: BibleTalkDataType[]; //下一级
  content?: Section[]; //
  reference?: Reference[] | null; //引用文献
  meta?: any; //保留字段
  rank?: number; //排序大小 从小到大
}

export const useBibleTalkStore = defineStore("bibleTalk", () => {
  const menuStore = useMenuStore();
  const data = ref<BibleTalkDataType | null>(null);

  const config = useConfigStore();
  function getData() {
    data.value = btDataDemo;
    config.addBibleTalkRouters(data.value); //添加路由
    menuStore.menuVersion++;
  }

  return { data, getData };
});
