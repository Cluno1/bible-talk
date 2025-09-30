import type { GDJsonMusicType, MusicType } from "@/type/music";
export function tranMusicType(item: GDJsonMusicType): MusicType {
  return {
    id: item.id,
    link: "",
    songTitle: item.title,
    artistName: item.artist,
    album: item.album,
    meta: {
      source: item.source,
      pic_id: item.pic_id,
      lyric_id: item.lyric_id,
    },
  };
}
