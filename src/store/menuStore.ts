import type { MenuItemRouteType } from "@/type/menu";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
export const useMenuStore = defineStore("menu", () => {
  /**
   * 是否展开 false:不展开  true:展开
   */
  const isCollapse = ref(false);
  const router = useRouter();

  // 1. 用一个 ref 充当“版本号 / 触发器”
  const menuVersion = ref(0);

  const menuRouters = computed<MenuItemRouteType[]>(() => {
    const flatRoutes: MenuItemRouteType[] = router
      .getRoutes()
      .filter((r) => r.path !== "/" && !r.meta?.hidden)
      .sort((a, b) => {
        const levelA = a.path.split("/").filter(Boolean).length;
        const levelB = b.path.split("/").filter(Boolean).length;

        if (levelA !== levelB) {
          return levelA - levelB; // 层级优先，升序
        }

        // 层级相同再按 rank 升序
        return Number(a.meta?.rank ?? 0) - Number(b.meta?.rank ?? 0);
      })
      .map((_i) => {
        return {
          children: [] as MenuItemRouteType[],
          path: _i.path,
          meta: {
            title: _i.meta.title as string,
            rank: _i.meta.rank as number,
            icon: _i.meta.icon as string,
          },
          name: _i.name as string,
        };
      });

    // 3. 用真正的树形结构组装
    const tree: MenuItemRouteType[] = [];
    // key: 完整 path，value: 对应的节点
    const pathMap = new Map<string, MenuItemRouteType>();
    for (const route of flatRoutes) {
      route.children = []; // 先清空，后面自己填
      pathMap.set(route.path, route); // 登记一下  通过path路径 找到实体

      const segments = route.path.split("/").filter(Boolean); //数组  几层  1- n层
      if (segments.length === 1) {
        // 一级路由直接挂到 tree 上
        tree.push(route);
      } else {
        // 二级及以上：把父级 path 拼出来
        const parentPath = "/" + segments.slice(0, -1).join("/");
        const parent = pathMap.get(parentPath);
        if (parent) {
          parent.children!.push(route);
        }
      }
    }
    console.log(menuVersion.value, "menu version"); //不能删除
    console.log(tree, "tree");
    return tree;
  });

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

  return { isCollapse, toggle, menuVersion, menuRouters };
});
