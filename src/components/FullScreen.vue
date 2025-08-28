<template>
    <!-- new full-screen button -->
    <!-- pc  -->
    <div class="hidden lg:block">
        <el-button class="ml-4" size="small" @click="toggleFullscreen">
            <font-awesome-icon icon="fa-solid fa-expand" style="color: gray;" v-show="!isFullscreen" />
            <font-awesome-icon icon="fa-solid fa-compress" style="color: gray;" v-show="isFullscreen" />
            {{ isFullscreen ? 'Exit' : 'Fullscreen' }}
        </el-button>
    </div>
    <!-- mobile -->
    <div class="lg:hidden">
        <el-button class="ml-4" size='large' @click="toggleFullscreen">
            <font-awesome-icon icon="fa-solid fa-expand" style="color: gray;" v-show="!isFullscreen" />
            <font-awesome-icon icon="fa-solid fa-compress" style="color: gray;" v-show="isFullscreen" />

        </el-button>
    </div>

</template>
<script lang="ts" setup>

import { ref } from 'vue';

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