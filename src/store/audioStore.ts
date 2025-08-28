import { defineStore } from "pinia";
import { ref, watch } from "vue";

export type MusicType = {
  id: number | string;
  link: string;
  pic?: string[]; //歌曲图片 封面
  songTitle?: string;
  songEnglishTitle?: string;
  artistName?: string;
  lyricsLink?: string;
  meta?: any; //预留字段
};

export const useAudioConfigStore = defineStore("audioConfig", () => {
  const list = ref<MusicType[]>([]);

  /* ---------- 数据 ---------- */
  const historyAudio = ref<MusicType[]>([]); // 上一首历史（最多 10 条）
  const currentAudio = ref<MusicType | null>(null);

  function setCurrentAudio(val: MusicType | MusicType[]) {
    if (Array.isArray(val)) {
      currentAudio.value = val[0];
    } else {
      currentAudio.value = val;
    }
  }
  function addAudioList(val: MusicType | MusicType[]) {
    if (Array.isArray(val)) {
      list.value = val;
    } else {
      list.value.push(val);
    }
  }
  function clearAudioList() {
    list.value = [];
  }
  watch(currentAudio, () => {
    console.log(currentAudio.value, "currentAudio new");
  });

  return {
    list,
    historyAudio,
    currentAudio,
    setCurrentAudio,
    addAudioList,
    clearAudioList,
  };
});
