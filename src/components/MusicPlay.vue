<template>
  <!-- 最外层套一层根节点，方便样式隔离 -->
  <div id="audio-player">
    <!-- 歌曲信息 -->
    <div id="player-content1">
      <div class="music-name">{{ currentTrack.name }}</div>
      <div class="artist-name" v-show="currentTrack.artist">
        {{ currentTrack.artist }}
      </div>

      <div class="time">
        <div class="current-time">{{ formatTime(currentTime) }}</div>
        <div class="total-time">{{ formatTime(duration) }}</div>
      </div>

      <div id="s-area" ref="sArea">
        <div id="ins-time">{{ hoverTimeLabel }}</div>
        <div id="s-hover" :style="hoverStyle"></div>
        <div id="seek-bar" :style="seekBarStyle"></div>
      </div>

      <!-- 音量 -->
      <div class="volume-control">
        <svg class="icon" />
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="volume"
          @input="onVolumeChange"
        />
      </div>
    </div>

    <!-- 控制区 -->
    <div id="player-content2">
      <div class="music-control">
        <svg @click="toggleList" class="bi bi-list-ul"  />
        <svg @click="toggleLoop" :class="{ active: loop }" />
      </div>

      <div class="music-imgs">
        <div
          class="img"
          :style="{ backgroundImage: `url(${currentTrack.cover})` }"
        ></div>
        <div v-if="buffering" id="buffer-box">缓冲…</div>
      </div>

      <div class="player-controls">
        <div class="btn prev" @click="prev">&#xe603;</div>
        <div class="btn play-pause" @click="togglePlay">
          {{ playing ? "&#xe601;" : "&#xe600;" }}
        </div>
        <div class="btn next" @click="next">&#xe602;</div>
      </div>
    </div>

    <!-- 播放列表 -->
    <transition name="slide">
      <ul v-if="showList" class="music-list">
        <li
          v-for="(t, idx) in tracks"
          :key="idx"
          :class="{ active: idx === currentIndex }"
          @click="playIndex(idx)"
        >
          {{ t.name }} - {{ t.artist }}
        </li>
      </ul>
    </transition>

    <!-- 真正的 audio 元素 -->
    <audio
      ref="audio"
      :src="currentTrack.url"
      @loadedmetadata="onLoadedMeta"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @waiting="buffering = true"
      @canplay="buffering = false"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick,onMounted, onBeforeUnmount } from "vue";
import "./style.css"; // 原样式

/* ----------------- props & emits ----------------- */
interface Track {
  name: string;
  artist?: string;
  url: string;
  cover?: string;
}


const props = defineProps<{
  tracks: Track[]; // 外部注入歌单
  initialIndex?: number;
}>();
const emit = defineEmits(["change"]);

/* ----------------- 响应式数据 ----------------- */
const audio = ref<HTMLAudioElement>();
const sArea = ref<HTMLElement>();
const currentIndex = ref(props.initialIndex ?? 0);
const playing = ref(false);
const volume = ref(100);
const loop = ref(false);
const showList = ref(false);
const buffering = ref(false);

const currentTime = ref(0);
const duration = ref(0);
const hoverTimeLabel = ref("");
const hoverStyle = reactive({ width: "0%" });
const seekBarStyle = reactive({ width: "0%" });

const currentTrack = computed(() => props.tracks[currentIndex.value]);

/* ----------------- 工具函数 ----------------- */
const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" + s : s}`;
};

/* ----------------- 播放控制 ----------------- */
const togglePlay = () => {
  if (playing.value) audio.value!.pause();
  else audio.value!.play();
  playing.value = !playing.value;
};
const prev = () => {
  currentIndex.value =
    (currentIndex.value - 1 + props.tracks.length) % props.tracks.length;
};
const next = () => {
  currentIndex.value = (currentIndex.value + 1) % props.tracks.length;
};
const playIndex = (idx: number) => {
  currentIndex.value = idx;
  nextTick(() => {
    playing.value = true;
    audio.value!.play();
  });
};

/* ----------------- 音频事件 ----------------- */
const onLoadedMeta = (e: Event) => {
  duration.value = (e.target as HTMLAudioElement).duration;
};
const onTimeUpdate = (e: Event) => {
  currentTime.value = (e.target as HTMLAudioElement).currentTime;
  seekBarStyle.width = (currentTime.value / duration.value) * 100 + "%";
};
const onEnded = () => {
  if (loop.value) audio.value!.currentTime = 0;
  else next();
};
const onVolumeChange = () => {
  audio.value!.volume = volume.value / 100;
};

/* ----------------- 进度条交互 ----------------- */
const updateHover = (e: MouseEvent) => {
  const rect = sArea.value!.getBoundingClientRect();
  const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
  hoverStyle.width = percent * 100 + "%";
  hoverTimeLabel.value = formatTime(percent * duration.value);
};
const updateSeek = (e: MouseEvent) => {
  const rect = sArea.value!.getBoundingClientRect();
  audio.value!.currentTime =
    ((e.clientX - rect.left) / rect.width) * duration.value;
};
const clearHover = () => {
  hoverStyle.width = "0%";
  hoverTimeLabel.value = "";
};
onMounted(() => {
  sArea.value!.addEventListener("mousemove", updateHover);
  sArea.value!.addEventListener("mouseleave", clearHover);
  sArea.value!.addEventListener("click", updateSeek);
});
onBeforeUnmount(() => {
  sArea.value!.removeEventListener("mousemove", updateHover);
  sArea.value!.removeEventListener("mouseleave", clearHover);
  sArea.value!.removeEventListener("click", updateSeek);
});

/* ----------------- 其他 ----------------- */
const toggleList = () => (showList.value = !showList.value);
const toggleLoop = () => (loop.value = !loop.value);

watch(currentIndex, (n) => emit("change", n));
</script>