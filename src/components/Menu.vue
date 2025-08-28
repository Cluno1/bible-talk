<!-- src/layout/components/SideMenu.vue -->
<script setup lang="ts">

import { useMenuStore } from '@/store/menuStore'
import { useConfigStore } from '@/store/configStore'
import MenuItem from './MenuItem.vue'
import { ref } from 'vue'

const menuStore = useMenuStore()
const configStore = useConfigStore()
const isActive = ref(false)
function setOpacityLight() {
  setTimeout(() => {
    isActive.value = false
  }, 3000);
}



</script>

<template>
  <div :style="{
    '--el-menu-active-color': configStore.mainColor,
    '--el-menu-bg-color': configStore.layoutColor,
    '--el-menu-text-color': configStore.textColor,
    '--el-color-primary': configStore.mainColor
  }">
    <!-- 移动端：横向菜单 -->
    <div class="lg:hidden">
      <el-menu router mode="horizontal" :default-active="$route.path">
        <MenuItem v-for="r in menuStore.menuRouters" :key="String(r.name || '') + String(r.path)" :route="r" :base-path="''" />
      </el-menu>
    </div>

    <!-- PC 端：纵向菜单 -->
    <div class="hidden lg:block">
      <el-switch v-model="menuStore.isCollapse" :class="['mt-2', 'ml-6', isActive ? 'opacity-100' : 'opacity-40']"
        inline-prompt :style="{ '--el-switch-on-color': configStore.mainColor }"
        @change="isActive = true; setOpacityLight()" />

      <el-menu router :collapse="!menuStore.isCollapse" :default-active="$route.path">
        <MenuItem v-for="r in menuStore.menuRouters" :key="String(r.name || '') + String(r.path)" :route="r" :base-path="''" />
      </el-menu>
    </div>
  </div>
</template>


<style scoped>
.el-menu--horizontal {
  --el-menu-horizontal-height: 4rem;
}
</style>