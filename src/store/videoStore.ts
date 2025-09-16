import { defineStore } from "pinia";
import type { VideoType } from "@/type/video";
import { ref } from "vue";
import { localVideos } from "@/utils/default/video/demo";
import { useAlbumConfigStore } from "./albumStore";

export const useVideoStore = defineStore("videoStore", () => {
  const albumConfig = useAlbumConfigStore();

  const videoData = ref<VideoType[]>([]);

  function addVideo(item: VideoType | VideoType[]): void {
    // 统一成数组处理
    const items = Array.isArray(item) ? item : [item];

    items.forEach((v) => {
      if (!videoData.value.some((ex) => ex.id === v.id)) {
        videoData.value.push(v);
      }
    });
  }

  /** 删除一条视频 */
  function deleteVideo(item: VideoType) {
    const idx = videoData.value.findIndex((v) => v.id === item.id);
    if (idx > -1) videoData.value.splice(idx, 1);

    //也从对应专辑里面删除
    if (item.albumId) {
      const a = albumConfig.albums.get(item.albumId);
      if (a) {
        a.videos = a.videos?.filter((i) => i.id !== item.id);
      }
    }
  }

  /** 本地搜索：支持 id 或 title 模糊匹配 */
  function searchVideo(keyword: string): VideoType[] {
    let val = keyword;
    if (keyword.charAt(0) === "%") {
      val = val.slice(1);
    }
    return (
      videoData.value.filter(
        (v) =>
          String(v.id).includes(val) ||
          (v.title || "").toLowerCase().includes(val.toLowerCase())
      ) || []
    );
  }

  //用户要添加该条视频 到本地存储 严格查询
  function searchVideoClound(id: string): VideoType | null {
    if (!id) return null;

    //本地存储里:
    let a: VideoType[] | VideoType | undefined = searchVideo(id);
    if (a.length > 0) {
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
