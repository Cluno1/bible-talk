import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { black, blue, pink, white } from "../utils/color";
import {
  getContrastTextColor,
  getDarkerActiveColor,
  getLighterActiveColor,
} from "../utils/getAutoColor";
import { useDark, useToggle } from "@vueuse/core";
/**
 * 组件配置
 */
export const useConfigStore = defineStore("menu", () => {
  const isDark = useDark();
  const toggleDark = useToggle(isDark);

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

    console.log(mainCor, layoutCor, textColor.value);
  }

  function setDark() {
    setColor(pink, black);
  }
  function setLight() {
    setColor(blue, white);
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
  };
});
