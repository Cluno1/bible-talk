<template>
  <div class="flex justify-start items-center h-16 w-full">
    <div class="flex justify-start items-center h-full w-1/3">
      <el-switch v-model="config.modeDark" class="ml-3" inline-prompt :active-icon="Moon" :inactive-icon="Sunny" :style="{
        '--el-switch-on-color': pink,
        '--el-switch-off-color': blue,
      }" />

      <!-- new full-screen button -->
      <el-button class="ml-4" size="small" :icon="isFullscreen ? ZoomOut : ZoomIn" @click="toggleFullscreen">
        {{ isFullscreen ? 'Exit' : 'Fullscreen' }}
      </el-button>
    </div>
    <div class="flex justify-center items-center h-full w-1/3">
      <GlobalSearch/>
    </div>
    <div class="flex justify-end items-center h-full w-1/3">
      <div class="flex flex-col justify-center items-center">
        <el-avatar src="https://bible-avatar-1328751369.cos.ap-guangzhou.myqcloud.com/zld-avatar.jpg">James</el-avatar>
        <span class="text-sm">James</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Moon, Sunny, ZoomIn, ZoomOut } from '@element-plus/icons-vue';
import { useConfigStore } from '../store/configStore';
import { blue, pink } from '../utils/color';
import { ref } from 'vue';
import GlobalSearch from './GlobalSearch.vue';

const config = useConfigStore();




const isFullscreen = ref(false);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true;
    });
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;
    });
  }
}

document.addEventListener('fullscreenchange', () => {
  isFullscreen.value = Boolean(document.fullscreenElement);
});
</script>