<template>
  <div class="flex w-full flex-col justify-end items-end ">
    <div class="flex justify-start items-center h-16 w-full">
      <div class="flex justify-start items-center h-full w-1/3">
        <Dark />
        <FullScreen />
      </div>
      <div class="flex justify-center items-center h-full w-1/3">
        <GlobalSearch type="global" />
      </div>
      <div class="flex justify-end items-center h-full w-1/3">
        <div class="flex flex-col justify-center items-center">
          <el-avatar
            src="https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/avatar/my%20avatar.jpg">James</el-avatar>
          <span class="text-sm">James</span>
        </div>
      </div>
    </div>
    <!-- <div class="w-10/12">
      <el-divider />
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import GlobalSearch from './GlobalSearch.vue';
import FullScreen from './FullScreen.vue';
import Dark from './Dark.vue';




</script>