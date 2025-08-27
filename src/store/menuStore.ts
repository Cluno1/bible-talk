import { defineStore } from "pinia";
import { ref } from "vue";

export const useMenuStore = defineStore("menu", () => {
  /**
   * 是否展开 false:不展开  true:展开
   */
  const isCollapse = ref(false);

  // 1. 用一个 ref 充当“版本号 / 触发器”
  const menuVersion = ref(0);

  /**
   * 切换 是否展开
   * @param val 切换值 boolean
   */
  function toggle(val?: boolean) {
    if (typeof val === "boolean") {
      isCollapse.value = val;
    } else {
      isCollapse.value = !isCollapse.value;
    }
  }

  return { isCollapse, toggle,menuVersion };
});
