<template>
  <div class="w-full flex justify-center items-center" :style="{ 'color': configStore.textColor }">
    <el-collapse v-model="activeName" accordion expand-icon-position="left" class="lg:w-9/12 w-full">
      <el-collapse-item  :icon="Opportunity" name="1">
        <template #title>
          <span class="lg:text-2xl">
            What Is Gospel
          </span>
          什么是福音

        </template>
        <nav>
          <router-link to="/bibleTalk/gospel">
            <p class="mb-1">1. 关于神</p>
            <p class="mb-1">2. 关于罪和惩罚</p>
            <p class="mb-1">3. 关于耶稣基督</p>
            <p class="mb-1">4. 关于命令和应许</p>
          </router-link>
        </nav>
      </el-collapse-item>

      <el-collapse-item :icon="Stopwatch" name="2">
        <template #title>
          <span class="lg:text-2xl">
            The Important Of Evangelization
          </span>
          传福音的重要性
        </template>
        <nav>
          <router-link to="/bibleTalk/evangelization">
            <p class="mb-1">1. 传福音是我们的特权</p>
            <p class="mb-1">2. 传福音是耶稣基督的命令</p>
            <p class="mb-1">3. 神的爱激励我们</p>
            <p class="mb-1">4. 人有需要</p>
          </router-link>
        </nav>
      </el-collapse-item>

      <el-collapse-item :icon="Key" name="3">
        <template #title>
          <span class="lg:text-2xl">
            How To Preach The Gospel
          </span>
          如何传福音

        </template>
        <nav>
          <router-link to="/bibleTalk/preach-gospel">
            <p class="mb-1">1. 不要传错福音</p>
            <p class="mb-1">2. 彼此相爱</p>
            <p class="mb-1">3. 依靠神</p>
            <p class="mb-1">4. 不要害怕</p>
          </router-link>
        </nav>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { useConfigStore } from '@/store/configStore';
import { Stopwatch, Key, Opportunity } from '@element-plus/icons-vue';
import { ref } from 'vue'
const configStore = useConfigStore()
const activeName = ref()
</script>

<style></style>