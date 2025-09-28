<!-- PlayerHls.vue -->
<template>
    <!-- 1. 用 Video.js 的 video 标签，class 必须带 "video-js" -->
    <video ref="videoEl" class="video-js md:min-w-[560px] vjs-big-play-centered w-full" controls preload="auto" width="100%"
        height="100%" playsinline />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
// 官方免费主题之一（city/sea/fantasy 可换）
// import '@videojs/themes/dist/sea/index.css'
import Hls from 'hls.js'
import type { VideoType } from '@/type/video'
import type Player from 'video.js/dist/types/player'

/* -------------------- props -------------------- */
const props = defineProps<{ data: VideoType }>()

/* -------------------- ref / 实例 -------------------- */
const videoEl = ref<HTMLVideoElement>()
let player: Player | null = null
let hls: Hls | null = null

/* -------------------- 初始化 -------------------- */
let isInit = false
function init() {
    nextTick(() => {
        if (isInit) return
        isInit = true

        /* 销毁旧实例 */
        hls?.destroy()
        hls = null
        if (player) {
            player.dispose()   // Video.js 释放
            player = null
        }

        /* 兜底：确保 DOM 已渲染 */
        if (!videoEl.value) return

        /* 创建 Video.js 播放器 */
        player = videojs(videoEl.value, {
            controls: true,
            autoplay: false,
            muted: false,
            fluid: true,
            controlBar: {               // ← 加这段
                volumePanel: { inline: false },     // 音量滑块（竖着）
                playbackRateMenuButton: true,       // 倍速
                currentTimeDisplay: true,           // 当前时间
                timeDivider: true,                  // “/”
                durationDisplay: true,              // 总时长
                remainingTimeDisplay: false,        // 可关掉剩余时间  // progressControl: { seekBar: true }, // 进度条
               
                fullscreenToggle: true              // 全屏
            },
            sources: []
        })

        /* ---------- 2. 把 Hls.js 灌进去 ---------- */
        if (Hls.isSupported()) {
            hls = new Hls({ debug: false })
            hls.loadSource(props.data.videoUrl)
            hls.attachMedia(videoEl.value!)

            // 可选：解析完清单再自动播放
            // hls.on(Hls.Events.MANIFEST_PARSED, () => player?.play())
        } else if (videoEl.value!.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari 原生 HLS
            player.src({ type: 'application/x-mpegURL', src: props.data.videoUrl })
            // player.ready(() => player.play())
        } else {
            videojs.log.error('浏览器不支持 HLS 播放')
        }

        /* 500ms 内禁止重复 init，避免接口抖动 */
        setTimeout(() => (isInit = false), 500)
    })
}

/* -------------------- 监听 url 变化 -------------------- */
watch(() => props.data.videoUrl, init, { immediate: true })

/* -------------------- 生命周期 -------------------- */
onMounted(init)

onUnmounted(() => {
    nextTick(() => {
        hls?.destroy()
        player?.dispose()
    })
})
</script>

<style scoped>


</style>