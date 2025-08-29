import type { MusicType } from "@/type/music";
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAudioConfigStore = defineStore("audioConfig", () => {
  /* ---------- 数据 ---------- */
  const list = ref<MusicType[]>([]); //用户播放列表清单

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
      val.forEach((item) => addAudioList(item));
    } else {
      deleteAudioFromList(val);
      list.value.push(val);
    }
  }

  function getInitAudio(): MusicType {
    return {
      id: -1,
      link: "",
      pic: [], //歌曲图片 封面
    };
  }

  function deleteAudioFromList(val: MusicType) {
    list.value = list.value.filter((_i) => _i.id !== val.id);
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
    deleteAudioFromList,
    getInitAudio,
  };
});
