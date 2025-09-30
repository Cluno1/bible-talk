import { defineStore } from "pinia";
import { ref, watch } from "vue";
import {
  audioPlayGradient,
  audioPlayTextColorArray,
  black,
  blue,
  pink,
  white,
} from "../utils/color";
import {
  getContrastTextColor,
  getDarkerActiveColor,
  getLighterActiveColor,
} from "../utils/getAutoColor";
import { useDark, useToggle } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useMenuStore } from "./menuStore";
import type { BibleTalkDataType } from "@/type/page";

/**
 * 组件配置
 */
export const useConfigStore = defineStore("config", () => {
  const isDark = useDark();
  const toggleDark = useToggle(isDark);
  const router = useRouter();
  const menuStore = useMenuStore();

  /**
   * 当前  组件 统一风格的颜色  激活组件颜色
   */
  const mainColor = ref(pink); //当前主颜色
  const lightMainColor = ref(""); //浅一点的颜色  用于??背景
  const darkMainColor = ref(""); //黑一点的颜色  用于按钮加深
  const textColor = ref("white"); //文本 适应背景的颜色
  const audioPlayBgColor = ref(audioPlayGradient[0]); //音乐播放器背景颜色
  const audioPlayTextColor = ref(audioPlayTextColorArray[0]);
  /**
   * 当前 布局背景 颜色  white or black
   */
  const layoutColor = ref(black); //布局背景 颜色

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
    lightMainColor.value = getLighterActiveColor(mainCor, 0.4);
    darkMainColor.value = getDarkerActiveColor(mainCor, 0.2);
    textColor.value = getContrastTextColor(layoutCor);
    audioPlayBgColor.value = modeDark.value
      ? audioPlayGradient[0]
      : audioPlayGradient[1];
    audioPlayTextColor.value = modeDark.value
      ? audioPlayTextColorArray[0]
      : audioPlayTextColorArray[1];
  }

  function setDark() {
    setColor(pink, black);
  }
  function setLight() {
    setColor(blue, white);
  }
  /**
   * 删除name 所在的 根路由  路由有唯一名称,根据名称删除
   * 返回true 则删除成功,返回false则删除失败, 因为要删除基础路由 home or bible
   * @param name
   * @returns
   */
  function removeRoute(name: string): boolean {
    if (name === "home") {
      return false;
    }
    // 如果已存在同名路由，先删除
    if (router.hasRoute(name)) {
      router.removeRoute(name);
      menuStore.menuVersion++;
    }

    return true;
  }

  /**
   * 嵌套添加路由 , 目前最多只添加2层, 如 /computer/cpu
   * 一开始不要赋值baseName  baseName确保是英文小写 没有空格 和路径一样名称
   *
   * 子路由 名称name 是 父name+'-'+子name
   * @param data
   * @param baseRouter
   * @param baseName
   */
  function addBibleTalkRouters(data: BibleTalkDataType, baseName?: string) {
    console.log(data, "data in addBibleTalkRouters");
    //子路由
    if (baseName || !data.hasOverview) {
      if (baseName) {
        if (!removeRoute(baseName + "-" + data.englishName)) {
          return;
        }
        console.log("baseName有值", baseName + "-" + data.englishName);
        router.addRoute(baseName, {
          path: baseName + "-" + data.englishName, // 如:cpu
          name: baseName + "-" + data.englishName,
          component: () => import("@/view/page/index.vue"),
          meta: {
            title: data.name,
            rank: data.rank || 100,
            icon: data.icon || "PieChart",
            dataId: data.id,
          }, //没有rank,固定都是100
        });
      } else {
        //就是个单页面
        console.log(
          "baseName没有值但是 hasOverView false或没有",
          "/" + data.englishName
        );
        if (!removeRoute(data.englishName)) {
          return;
        }
        router.addRoute({
          path: "/" + data.englishName, // 如:cpu
          name: data.englishName,
          component: () => import("@/view/page/index.vue"),
          meta: {
            title: data.name,
            rank: data.rank || 100,
            icon: data.icon || "CollectionTag",
            dataId: data.id,
          }, //没有rank,固定都是100
        });
      }
    } else {
      //顶格父路由
      const routeName = data.englishName;
      const fullPath = "/" + routeName;
      if (!removeRoute(routeName)) {
        return;
      }

      //父路由有孩子节点
      if (data.children && data.children.length > 0) {
        //先添加空的 父节点
        console.log("添加一个空占位路由,就是父路由", fullPath, routeName);
        router.addRoute({
          path: fullPath, // 如:/computer
          name: routeName,
          component: () => import("@/view/page/PlaceHold.vue"),
          meta: {
            title: data.name,
            rank: data.rank || 100,
            icon: data.icon || "Pointer",
            dataId: data.id,
          }, //没有rank,固定都是100
        });

        //添加总览页面
        removeRoute(routeName + "-" + "overview");
        console.log("添加一个子路由,path和name", routeName + "-" + "overview");
        router.addRoute(routeName, {
          path: routeName + "-" + "overview",
          name: routeName + "-" + "overview",
          component: () => import("@/view/page/index.vue"),
          meta: {
            title: "overview",
            rank: 0,
            icon: data.icon || "PieChart",
            dataId: data.id,
          }, //overview 固定都是0
        });

        data.children.forEach((_i) => addBibleTalkRouters(_i, routeName));
      } else {
        //父路由无孩子节点,仅仅添加父路由
        console.log("添加一个单路由", fullPath, routeName);
        router.addRoute({
          path: fullPath,
          name: routeName,
          component: () => import("@/view/page/index.vue"),
          meta: {
            title: data.name,
            rank: data.rank || 100,
            icon: data.icon || "CollectionTag",
            dataId: data.id,
          }, //没有rank,固定都是100
        });
      }
    }
    return menuStore.menuVersion++;
  }

  function defaultRouterSwitch(
    type: "setting" | "music-album" | "music-search" | "audio-play" | "video" | "video-index" | "video-search" | "bible" | "error",
    show: boolean = true
  ) {
    const ob = router.getRoutes().find((_i) => _i.name === type);
    console.log(ob, "ob");
    if (ob) {
      if (show) {
        ob.meta.hidden = false;
      } else {
        ob.meta.hidden = true;
      }
      menuStore.menuVersion++;
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
    audioPlayBgColor,
    audioPlayTextColor,
    addBibleTalkRouters,
    removeRoute,
    defaultRouterSwitch,
  };
});
