<script lang="ts" setup>
// Import styles.
import 'vidstack/player/styles/default/theme.css';
// Register elements.
import 'vidstack/player';
import 'vidstack/player/ui';
import 'vidstack/icons';

import {
  type MediaViewType,
} from 'vidstack';
import type { MediaPlayerElement } from 'vidstack/elements';
import { onMounted, onUnmounted, ref, watch } from 'vue';

import AudioLayout from './components/layouts/AudioLayout.vue';
import VideoLayout from './components/layouts/VideoLayout.vue';
import { useConfigStore } from '@/store/configStore';
import type { VideoType } from '@/type/video';

const config = useConfigStore()

const isM3u8 = ref(false)

const $player = ref<MediaPlayerElement>(),
  $src = ref(''),
  $viewType = ref<MediaViewType>('unknown');


const props = defineProps<{
  data: VideoType
}>()


// Initialize src.
function init() {


  for (const track of props.data.textTracks || []) $player.value!.textTracks.add(track);
  $src.value = props.data.videoUrl;
}

watch(() => props.data.videoUrl, () => {
  if (props.data.videoUrl.includes('m3u8')) {
    return;
  }
  init()
})

onMounted(() => {
  console.log('Player mounted')


  if (props.data.videoUrl.includes('m3u8')) {
    return;
  }
  init()

  return $player.value!.subscribe(({ paused, viewType }) => {
    $viewType.value = viewType;
    console.log('is paused?', '->', paused);
  });
});

onUnmounted(() => {

  console.log('Player unmounted')
  if ($player.value) {
    $player.value.src = ''        // 清空资源
    $player.value.pause()       // 强制暂停
    // 如果用了 hls 插件，Vidstack 内部会自动清理
  }
})
</script>

<template>
  <media-player :class="['player', 'dark']" v-if="!isM3u8" title="标题" :src="$src" crossOrigin playsInline ref="$player"
    :style="{
      '--media-focus-ring-color': config.mainColor,
      '--media-focus-ring': '0 0 0 3px var(--media-focus-ring-color)'
    }">
    <media-provider>
      <media-poster v-if="$viewType === 'video'" class="vds-poster" :src="data.videoAlbumUrl" alt="主页图片" />
    </media-provider>

    <AudioLayout v-if="$viewType === 'audio'" />
    <VideoLayout v-if="$viewType === 'video'" :thumbnails='data.thumbnailsUrl' />
  </media-player>

</template>

<style scoped>
* {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

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
  aspect-ratio: 16 /9;
  background-color: #212121;
  border-radius: var(--media-border-radius);
  contain: layout;
}

.player :deep(video),
media-poster {
  border-radius: var(--media-border-radius);
}

.src-buttons {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 40px;
  margin-inline: auto;
  max-width: 300px;
}
</style>
