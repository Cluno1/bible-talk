import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { black, blue, pink, white } from "../utils/color";
import {
  getContrastTextColor,
  getDarkerActiveColor,
  getLighterActiveColor,
} from "../utils/getAutoColor";
import { useDark, useToggle } from "@vueuse/core";
import type { BibleTalkDataType } from "./bibleTalkStore";
import { useRouter } from "vue-router";
/**
 * 组件配置
 */
export const useConfigStore = defineStore("config", () => {
  const isDark = useDark();
  const toggleDark = useToggle(isDark);
  const router = useRouter();

  /**
   * 当前  组件 统一风格的颜色  激活组件颜色
   */
  const mainColor = ref(pink);

  const lightMainColor = ref("");

  const darkMainColor = ref("");
  const textColor = ref("white");
  /**
   * 当前 布局背景 颜色  white or black
   */
  const layoutColor = ref(black);
  /**
   * 是否暗黑模式
   */
  const modeDark = ref(isDark.value); //true:light, false:dark

  function validMode() {
    toggleDark(modeDark.value);
    if (modeDark.value) {
      setDark();
    } else {
      setLight();
    }
  }

  function setColor(mainCor: string, layoutCor: string) {
    mainColor.value = mainCor;
    layoutColor.value = layoutCor;
    lightMainColor.value = getLighterActiveColor(mainCor);
    darkMainColor.value = getDarkerActiveColor(mainCor);
    textColor.value = getContrastTextColor(layoutCor);
  }

  function setDark() {
    setColor(pink, black);
  }
  function setLight() {
    setColor(blue, white);
  }
  /**
   * 删除name 所在的 根路由
   * 返回true 则删除成功,返回false则删除失败, 因为要删除基础路由 home or bible
   * @param name
   * @returns
   */
  function removeRoute(name: string): boolean {
    if (name === "home" || name === "bible") {
      return false;
    }
    // 如果已存在同名路由，先删除
    if (router.hasRoute(name)) {
      router.removeRoute(name);
    }
    console.log(name, "name");
    return true;
  }

  /**
   * 嵌套添加路由 , 目前最多只添加2层, 如 /computer/cpu
   * @param data
   * @param baseRouter
   * @param baseName
   */
  function addBibleTalkRouters(data: BibleTalkDataType, baseName?: string) {
    const routeName = data.name;

    if (!removeRoute(routeName)) {
      return;
    }

    //子路由
    if (baseName && baseName !== "/") {
      router.addRoute(baseName, {
        path: data.name.toLowerCase(), // 如:cpu
        name: data.name,
        component: () => import("@/view/play/index.vue"),
        meta: { title: data.name, rank: data.rank || 100 }, //没有rank,固定都是100
      });
      return;
    } else {
      //顶格父路由
      const fullPath = ("/" + data.name.toLowerCase()).replace(/\/+/g, "/");

      //父路由有孩子节点
      if (data.children && data.children.length > 0) {
        //先添加空的 父节点
        router.addRoute({
          path: fullPath, // 如:/computer
          name: data.name,
          component: () => import("@/view/play/PlaceHold.vue"),
          meta: { title: data.name, rank: data.rank || 100 }, //没有rank,固定都是100
        });
        //添加总览页面
        removeRoute("overview");
        router.addRoute(data.name, {
          path: "overview",
          name: "overview",
          component: () => import("@/view/play/index.vue"),
          meta: { title: "overview", rank: 0 }, //overview 固定都是0
        });

        data.children.forEach((_i) => addBibleTalkRouters(_i, data.name));
      } else {
        //父路由无孩子节点,仅仅添加父路由
        router.addRoute({
          path: fullPath,
          name: data.name,
          component: () => import("@/view/play/index.vue"),
          meta: { title: data.name, rank: data.rank || 100 }, //没有rank,固定都是100
        });
      }
    }
  }

  watch(modeDark, validMode);
  validMode();

  return {
    mainColor,
    layoutColor,
    modeDark,
    textColor,
    darkMainColor,
    lightMainColor,
    addBibleTalkRouters,
    removeRoute,
  };
});
