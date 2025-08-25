<!-- src/layout/components/SideMenu.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, type RouteRecordNormalized } from 'vue-router'
import { useMenuStore } from '@/store/menuStore'
import { useConfigStore } from '@/store/configStore'
import MenuItem from './MenuItem.vue'
const router = useRouter()
const menuStore = useMenuStore()
const configStore = useConfigStore()

// 过滤掉 hidden 的顶层路由
const menuRoutes = computed(() => {
  const _a = router.getRoutes().filter(
    (r) => {
      if (r.path) {
        const a = r.path.split('/')
        if (a.length > 2) {
          return false
        } else {
          if (!a[1]) {
            return false
          }
        }
      }
      return !r.meta?.hidden
    }
  )

  function sortRank(_routerArray: RouteRecordNormalized[]) {

    _routerArray.forEach((_r) => {
      if (_r.children && _r.children.length > 1) {
        sortRank(_r.children as RouteRecordNormalized[])
      }
    })
    return _routerArray.sort((a, b) => Number(a.meta?.rank || 0) - Number(b.meta?.rank || 0))
  }

  console.log(_a, 'menu')
  return sortRank(_a)
}
)

</script>

<template>
  <!-- 移动端：横向菜单 -->
  <div class="lg:hidden">
    <el-menu router mode="horizontal" :default-active="$route.path" :style="{
      '--el-menu-active-color': configStore.mainColor,
      '--el-menu-bg-color': configStore.layoutColor,
      '--el-menu-text-color': configStore.textColor
    }">
      <MenuItem v-for="r in menuRoutes" :key="String(r.name || '') + String(r.path)" :route="r" :base-path="''" />
    </el-menu>
  </div>

  <!-- PC 端：纵向菜单 -->
  <div class="hidden lg:block">
    <el-switch v-model="menuStore.isCollapse" class="mt-2 ml-6" inline-prompt
      :style="{ '--el-switch-on-color': configStore.mainColor }" />

    <el-menu router :collapse="!menuStore.isCollapse" :default-active="$route.path" :style="{
      '--el-menu-active-color': configStore.mainColor,
      '--el-menu-bg-color': configStore.layoutColor,
      '--el-menu-text-color': configStore.textColor
    }">
      <MenuItem v-for="r in menuRoutes" :key="String(r.name || '') + String(r.path)" :route="r" :base-path="''" />
    </el-menu>
  </div>
</template>

<style scoped>
.el-menu--horizontal {
  --el-menu-horizontal-height: 4rem;
}
</style>