<!-- HtmlOrVideo.vue -->
<template>
  <div class="w-full">
    <!-- 情况 A：纯视频 -->
    <div v-if="!isHtml && !isHtmlLoading" class="w-full">
      <media-player ref="$player" :src="videoUrl" crossorigin playsinline title="标题" :class="['player', 'dark']" :style="{
        '--media-focus-ring-color': config.mainColor,
        '--media-focus-ring': '0 0 0 3px var(--media-focus-ring-color)'
      }">
        <media-provider>
          <media-poster v-if="$viewType === 'video'" class="vds-poster" :src="data.videoAlbumUrl" alt="主页图片" />
        </media-provider>

        <AudioLayout v-if="$viewType === 'audio'" />
        <VideoLayout v-if="$viewType === 'video'" :thumbnails="data.thumbnailsUrl" />
      </media-player>
    </div>

    <!-- 情况 B：返回的是 html -->
    <div v-else-if="isHtml && !isHtmlLoading" class="w-full aspect-video">
      <iframe :src="videoUrl" class="w-full h-full rounded-lg" frameborder="0" allowfullscreen />
    </div>

    <!-- 加载中 -->
    <div v-else class="w-full aspect-video grid place-content-center text-white bg-gray-900">
      <span>识别资源类型中…</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onUnmounted } from 'vue'
import type { MediaPlayerElement } from 'vidstack/elements'
import { useConfigStore } from '@/store/configStore'
import AudioLayout from './components/layouts/AudioLayout.vue'
import VideoLayout from './components/layouts/VideoLayout.vue'
import type { VideoType } from '@/type/video'
import type { MediaViewType } from 'vidstack'

/* ---------- props & store ---------- */
const props = defineProps<{ data: VideoType }>()
const config = useConfigStore()

/* ---------- 状态 ---------- */
const $player = ref<MediaPlayerElement>(),
  $viewType = ref<MediaViewType>('unknown');

const isHtml = ref(false)          // 最终判定
const isHtmlLoading = ref(true)    // 识别中
const videoUrl = ref(props.data.videoUrl)

/* ---------- 识别函数 ---------- */
async function detectContentType(url: string) {
  console.log(url, 'url')
  if (url.includes('.m3u8') || url.includes('mp4')) {
    isHtml.value = false;

  } else {
    isHtml.value = true
  }

  isHtmlLoading.value = false
  // try {
  //   // const r = await fetch(url, { method: 'HEAD', mode: 'no-cors' })
  //   // 在 no-cors 下 headers 拿不到，但我们可以取巧：
  //   // 直接 fetch 一段，看能否解析成视频/音频资源
  //   const probe = await fetch(url, { method: 'GET', mode: 'no-cors' })
  //   const blob = await probe.blob()
  //   console.log('ok ')
  //   if (blob.type.startsWith('video') || blob.type.startsWith('audio') || url.includes('.m3u8')) {
  //     isHtml.value = false
  //   } else if (blob.type.includes('text/html')) {
  //     isHtml.value = true
  //   } else {
  //     // 保守 fallback：带 .html 就当 html
  //     isHtml.value = url.includes('.html')
  //   }
  // } catch {
  //   // 网络错误时也按 html 处理
  //   isHtml.value = true;
  // } finally {
  //   ElMessage.info('是否 html: ' + isHtml.value)
  //   isHtmlLoading.value = false
  // }
}

/* ---------- 生命周期 ---------- */
watchEffect(() => {
  // 支持动态换 src
  videoUrl.value = props.data.videoUrl
  isHtmlLoading.value = true
  detectContentType(videoUrl.value)
})

onUnmounted(() => {
  if ($player.value) {
    $player.value.src = ''
    $player.value.pause()
  }
})
</script>

<style scoped>
/* 仅保留与 Vidstack 变量相关的样式，其余全用 Tailwind */
.player {
  --media-brand: #f5f5f5;
}

.player[data-view-type='audio'] {
  --media-tooltip-y-offset: 44px;
  --media-menu-y-offset: 40px;
  --media-slider-chapter-title-color: black;
  --media-border-radius: 4px;
  background-color: #212121;
  border-radius: var(--media-border-radius);
  contain: layout;
}

.player[data-view-type='video'] {
  --media-tooltip-y-offset: 30px;
  --media-menu-y-offset: 30px;
  aspect-ratio: 16/9;
  background-color: #212121;
  border-radius: var(--media-border-radius);
  contain: layout;
}

.player :deep(video),
media-poster {
  border-radius: var(--media-border-radius);
}
</style>