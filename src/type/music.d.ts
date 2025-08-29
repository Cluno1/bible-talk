export type MusicType = {
  id: number | string;
  link: string;
  pic?: string[]; //歌曲图片 封面
  songTitle?: string;
  songEnglishTitle?: string;
  artistName?: string;
  lyricsLink?: string;
  album?: string;     //albumTitle  不能传递id,这样人就可以根据id搜索到该歌本了  不可以
  albumPic?:string[];
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