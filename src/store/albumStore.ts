import type { MusicAlbum, MusicType } from "@/type/music";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import Fuse from "fuse.js";
import { useAudioConfigStore } from "./audioStore";
import { localAudios } from "@/utils/default/audio/audio";
import { localMusicAlbums } from "@/utils/default/album";

export const useAlbumConfigStore = defineStore("albumConfig", () => {
  const audioConfig = useAudioConfigStore();
  /* ===================== 状态 ===================== */
  // 专辑映射  id -> MusicAlbum
  const albumsVersion = ref(0);
  const albums = new Map<string, MusicAlbum>();

  // 单曲映射  id -> MusicType
  const musics = new Map<string, MusicType>();
  const musicsVersion = ref(0);

  /* ===== Fuse 索引 =====
   * 用 computed 包一层：当 musics 变化时自动重建索引
   */
  const fuseIndex = computed(() => {
    console.log(musicsVersion.value, "musicsVersion update"); // 订阅版本更新  不要删除该代码
    //todo
    const list = Array.from(musics.values());
    return new Fuse(list, {
      keys: [
        { name: "id", weight: 1.0 },
        { name: "songTitle", weight: 0.9 },
        { name: "songEnglishTitle", weight: 0.8 },
        { name: "artistName", weight: 0.5 },
      ],
      threshold: 0.4, // 容错程度 0=完全匹配 1=全匹配
      includeScore: true, // 如需得分可改成 true
      ignoreLocation: true,
    });
  });

  /* ===================== 专辑相关 ===================== */

  /** 新增/覆盖整张专辑（包含其歌曲列表） */
  function addAlbum(album: MusicAlbum) {
    albums.set(album.id, album);
    addMusic(album.musics); // 把专辑里的所有单曲也存进 musics 表 方便搜索
    albumsVersion.value++;
  }

  /**
   * 删除整张专辑（包括里面包含的歌曲）
   * @param id 专辑id
   * @returns
   */
  function clearAlbum(id: string) {
    console.log(id, "id val");
    const album = albums.get(id);
    if (!album) return;

    album.musics?.forEach((music) => {
      musics.delete(music.id);
    });

    albums.delete(id);
    musicsVersion.value++;
    albumsVersion.value++;
  }

  /** 相册 严格查询 联网查询 根据 id 查找专辑，不存在返回 undefined */
  function searchAlbumByClound(
    searchVal: string | number
  ): MusicAlbum | undefined {
    //id全部转成字符串去搜索

    let id = String(searchVal);
    if (id.charAt(0) === "@") {
      id = id.slice(1);
    }

    const _a = albums.get(id);
    if (_a) {
      return _a;
    } else {
      //这里搜索本地
      const a=localMusicAlbums.find(i=>i.id===id)

      if (a) {
        addAlbum(a);
        return a;
      }

      //联网搜索,搜索线上的album;
    }
    return undefined;
  }

  /** 相册 模糊查询 根据 字眼 查找专辑，不存在返回 空[] */
  function searchAlbum(val: string | number): MusicAlbum[] {
    let str = String(val);
    if (str.charAt(0) === "@") {
      str = str.slice(1);
    }
    const re: MusicAlbum[] = [];
    albums.forEach((_val, _key) => {
      if (
        String(_key).includes(String(str)) ||
        String(_val.albumTitle).includes(String(str)) ||
        String(_val.albumEnglishTitle).includes(String(str))
      ) {
        re.push(_val);
      }
    });
    return re;
  }

  /** 新增/覆盖单曲 开放给其他页面使用  每增加一次就更新版本 */
  function addMusic(music: MusicType | MusicType[]) {
    if (Array.isArray(music)) {
      music.forEach((_i) => musics.set(_i.id, _i));
    } else {
      musics.set(music.id, music);
    }

    musicsVersion.value++;
  }

  /** 删除单曲  也从对应专辑里面删除 TODO */
  function clearMusic(id: string) {
    //music Id
    const music = musics.get(id);
    if (!music) return;
    if (music.album) {
      //album的name
      let hasAlbum;
      for (const [, v] of albums.entries()) {
        if (v.albumTitle == music.album || v.albumEnglishTitle == music.album) {
          hasAlbum = v;
        }
      }
      if (hasAlbum) {
        hasAlbum.musics = hasAlbum.musics.filter((_i) => _i.id !== music.id);
      }
    }
    musics.delete(id);
    //再删除对应audio里面的列表
    audioConfig.removeAudio(music);
    musicsVersion.value++;
  }

  /** 根据 id 查找 已经缓存在本地的 单曲，不存在返回 undefined */
  function searchMusic(id: string): MusicType | undefined {
    return musics.get(id);
  }

  /**
   * 模糊查询,不会查询 联网
   * 先用 val 当 id 查；查不到再用 val 当歌曲名称查
   */
  function searchMusicByVal(v: string): MusicType[] {
    let val = v;
    if (val.charAt(0) === "!") {
      val = val.slice(1);
    }

    if (val !== "0" && !val) {
      return Array.from(musics.values());
    }
    const re = [];
    const _a = searchMusic(val);
    if (_a) {
      re.push(_a);
    } else {
      const _i = fuseIndex.value.search(String(val));
      console.log(_i, "what fuse array");
      return _i.map((_j) => {
        return _j.item;
      });
    }

    return [];
  }

  /**
   * 严格查询
   * 查询歌曲 通过id 联网查询
   * @param id
   */
  function searchMusicById(v: string): MusicType | undefined {
    let id = v;
    if (id.charAt(0) === "!") {
      id = id.slice(1);
    }

    const a = searchMusic(id);
    if (a) {
      //添加到 播放列表
      audioConfig.addAudioList(a);
      return a;
    } else {
      //现在本地查询:
      const _a = localAudios.find((_i) => _i.id === id);
      if (_a) {
        addMusic(_a);
        audioConfig.addAudioList(_a);
        return _a;
      }
      //联网查询  todo ...

      return undefined;
    }
  }

  /* ===================== 对外暴露 ===================== */
  return {
    albums: albums,
    musics: musics,
    addAlbum,
    clearAlbum,
    searchAlbum,
    addMusic,
    clearMusic,
    searchMusic,
    searchMusicByVal,
    searchAlbumByClound,
    searchMusicById,
    musicsVersion,
    albumsVersion,
  };
});
