<template>
    <!-- 1. 普通 video 标签 -->
    <video ref="videoEl" controls playsinline />
</template>

<script setup lang="ts">

import { onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import Hls from 'hls.js'   // 官方包
import type { VideoType } from '@/type/video';


const props = defineProps<{
    data: VideoType
}>()

const videoEl: any = ref(null)
let hls: any = null


watch(() => props.data.videoUrl, () => {
    init()
})

let isInit = false;
function init() {
    nextTick(() => {
        if (isInit) return;
        isInit = true;
        // 确保旧实例销毁完成
        hls?.destroy()
        hls = null

        if (Hls.isSupported()) {
            hls = new Hls({ debug: false })
            hls.loadSource(props.data.videoUrl)
            hls.attachMedia(videoEl.value)
            // hls.on(Hls.Events.MANIFEST_PARSED, () => videoEl.value.play())
        } else if (videoEl.value.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari 原生支持
            videoEl.value.src = props.data.videoUrl
            videoEl.value.addEventListener('loadedmetadata', () => videoEl.value.play())
        } else {
            alert('浏览器不支持 HLS 播放')
        }

        setTimeout(() => {
            isInit = false
        }, 500);
    })
}

onMounted(() => {
    console.log('PlayerHls mounted')
    init()
})

onUnmounted(() => {
    nextTick(() => {
        console.log('PlayerHls unmounted')
        hls?.destroy()
    })

})
</script>