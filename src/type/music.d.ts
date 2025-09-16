import type { VideoType } from "./video";

export type MusicType = {
  id: string;
  link: string;
  pic?: string[]; //歌曲图片 封面
  songTitle?: string;
  songEnglishTitle?: string;
  artistName?: string;
  lyricsLink?: string;
  album?: string; //albumTitle  不能传递id,这样人就可以根据id搜索到该歌本了  不可以
  albumPic?: string[];
  meta?: any; //预留字段
};

export type MusicAlbum = {
  id: string;
  albumTitle?: string;
  albumEnglishTitle?: string;
  authorName?: string;
  pic?: string[];
  meta?: any;
  musics: MusicType[];
  videos?:VideoType[];
};
