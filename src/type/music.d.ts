export type MusicType = {
  id: number | string;
  link: string;
  pic?: string[]; //歌曲图片 封面
  songTitle?: string;
  songEnglishTitle?: string;
  artistName?: string;
  lyricsLink?: string;
  album?: string;
  meta?: any; //预留字段
};

export type MusicAlbum = {
  id: number | string;
  albumTitle?: string;
  albumEnglishTitle?: string;
  authorName?: string;
  pic?: string[];
  meta?: any;
  musics: MusicType[];
};