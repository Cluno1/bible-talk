/*
 * @Date: 2025-10-01 03:24:09
 * @LastEditors: zld 17875477802@163.com
 * @LastEditTime: 2025-10-01 14:46:55
 * @FilePath: \bible-talk\src\type\music.d.ts
 */
import type { VideoType } from "./video";
import { GDSources } from "@/config/GDmusicSource";
export type MusicType = {
  id: string;
  link: string;
  pic?: string[]; //歌曲图片 封面
  songTitle?: string;
  songEnglishTitle?: string;
  artistName?: string;
  lyricsLink?: string;
  lyrics?: string; //直接就是这个歌词了,不是链接;
  album?: string; //albumTitle  不能传递id,这样人就可以根据id搜索到该歌本了  不可以
  albumPic?: string[];
  meta?: { source?: GDSourceType; pic_id?: string; lyric_id?: string,tlyric?:string }; //预留字段
};

export type MusicAlbum = {
  id: string;
  albumTitle?: string;
  albumEnglishTitle?: string;
  authorName?: string;
  pic?: string[];
  meta?: any;
  musics: MusicType[];
  videos?: VideoType[];
};

export interface GDJsonMusicType {
  id: string;
  title: string;
  artist: string; // 演唱者
  album: string; //string
  pic_id: string ; //string | number
  lyric_id: string ; //string|number
  source: GDSourceType; //string
}

export type GDSourceType = (typeof GDSources)[number];

export type GDSearchType = "music" | "album" | "artist" | "sheet";
