<script setup lang="ts">

import Header from './components/Header.vue';
import Menu from './components/Menu.vue';
import { useConfigStore } from './store/configStore';

const configStore = useConfigStore()
</script>

<template>

  <div class="common-layout h-screen w-screen overflow-hidden hidden lg:block"
    :style="{ 'background-color': configStore.layoutColor, '--el-bg-color': configStore.layoutColor, '--el-color-primary': configStore.mainColor, 'color': configStore.textColor }">
    <el-container>
      <!-- 头部 -->
      <el-header height="4rem">
        <Header />
      </el-header>
      <el-container>
        <!-- side -->
        <el-aside width="10rem">
          <Menu />
        </el-aside>
        <!-- main -->
        <el-main>
          <div :style="{ 'width': '100%', 'height': '90vh', 'overflow': 'auto' }">
            <router-view />
          </div>

        </el-main>
      </el-container>
    </el-container>
  </div>

  <!-- 手机端显示 -->
  <div class="common-layout h-screen w-screen lg:hidden overflow-hidden"
    :style="{ 'background-color': configStore.layoutColor, '--el-bg-color': configStore.layoutColor, '--el-color-primary': configStore.mainColor, 'color': configStore.textColor }">
    <el-container>
      <!-- side -->
      <el-header>
        <Menu />
      </el-header>
      <!-- main -->
      <el-main>
        <div :style="{ 'width': '100%', 'maxHeight': '78vh', 'overflow': 'auto' }">
          <router-view />
        </div>

      </el-main>
    </el-container>
  </div>




</template>

<style scoped></style>
