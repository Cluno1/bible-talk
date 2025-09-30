import type { MusicType } from "@/type/music";
import {
  getInitLyrics,
  loadLrc,
  parseLrcTest,
  type LrcLine,
} from "@/utils/lyrics";
import { defineStore } from "pinia";
import { reactive, ref, watch } from "vue";

export const useAudioConfigStore = defineStore("audioConfig", () => {
  /* ---------- 数据 ---------- */
  const list = ref<MusicType[]>([]); //用户播放列表清单

  const historyAudio = ref<MusicType[]>([]); // 上一首历史（最多 10 条）
  const currentAudio = ref<MusicType | null>(null); //当前歌曲
  const currentLyrics = ref<{ time: number; text: string }[]>(getInitLyrics()); //当前歌曲解析出来的歌词

  const searchData = reactive({
    searchResults: [] as MusicType[],
    searchVal: "", //维护搜索的信息
    total: 0, //当前页面的信息有多少条
    pagenow: 0,
    pagesize: 0,
    pagecount: 1,
  });

  watch(currentAudio, async (newVal) => {
    
    if (newVal?.lyricsLink) {
      try {
        currentLyrics.value = await loadLrc(newVal.lyricsLink);
      } catch (e: any) {
        currentLyrics.value = getInitLyrics();
      }
    } else if (newVal?.lyrics) {
      
      currentLyrics.value = parseLrcTest(newVal.lyrics);
      
    } else {
      currentLyrics.value = getInitLyrics();
    }
  });

  function setCurrentLyrics(val: LrcLine[]) {
    currentLyrics.value = val;
  }

  function setCurrentAudio(val: MusicType | MusicType[]) {
    if (Array.isArray(val)) {
      currentAudio.value = val[0];
    } else {
      currentAudio.value = val;
    }
  }
  /**
   * 添加到播放列表
   * @param val
   */
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
      id: "-1",
      link: "",
      pic: [], //歌曲图片 封面
    };
  }
  //从列表里面删除某音乐
  function deleteAudioFromList(val: MusicType) {
    list.value = list.value.filter((_i) => _i.id !== val.id);
  }

  /**让该音乐从播放器彻底消失  包括:删除列表里,历史里, 当前的 */
  function removeAudio(val: MusicType) {
    deleteAudioFromList(val);
    historyAudio.value = historyAudio.value.filter((_i) => _i.id !== val.id);
    if (currentAudio.value?.id === val.id) {
      currentAudio.value = null;
    }
  }

  /**
   * 清除所有列表歌曲
   */
  function clearAudioList() {
    list.value = [];
  }

  return {
    list,
    historyAudio,
    currentAudio,
    setCurrentAudio,
    addAudioList,
    clearAudioList,
    deleteAudioFromList,
    getInitAudio,
    currentLyrics,
    removeAudio,
    searchData,
    setCurrentLyrics,
  };
});
