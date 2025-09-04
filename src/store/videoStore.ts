import { defineStore } from "pinia";
import type { VideoType } from "@/type/video";
import { ref } from "vue";
import { localVideos } from "@/utils/default/video/demo";

export const useVideoStore = defineStore("videoStore", () => {
  const videoData = ref<VideoType[]>([]);

  function addVideo(item: VideoType) {
    // 防重：以 id 为唯一键
    const exist = videoData.value.some((v) => v.id === item.id);
    if (!exist) {
      videoData.value.push(item);
    }
  }

  /** 删除一条视频 */
  function deleteVideo(id: string) {
    const idx = videoData.value.findIndex((v) => v.id === id);
    if (idx > -1) videoData.value.splice(idx, 1);
  }

  /** 本地搜索：支持 id 或 title 模糊匹配 */
  function searchVideo(keyword: string): VideoType[] {
    let val=keyword
    if(keyword.charAt(0)==='%'){
        val=val.slice(1)
    }
    return (
      videoData.value.filter(
        (v) =>
          String(v.id).includes(val) ||
          (v.title || "").toLowerCase().includes(val.toLowerCase())
      ) ||[]
    );
  }



  //用户要添加该条视频 到本地存储 严格查询
  function searchVideoClound(id: string): VideoType | null {
    if (!id) return null;

    //本地存储里:
    let a: VideoType[] |VideoType|undefined = searchVideo(id);
    if (a.length>0) {
      return a[0];
    }

    //by fetch

    //本地数据里:
    a = localVideos.find((i) => i.id === id);

    if (a) {
      addVideo(a);
      return a;
    }

    return null;
  }

  return {
    videoData,
    addVideo,
    deleteVideo,
    searchVideo,
    searchVideoClound,
  };
});
