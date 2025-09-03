import type { MusicType } from "@/type/music";
import { ihopeAlbum } from "../album/ihope";

export const musicdemo_1: MusicType = {
  id: 'old-man-sea',
  pic: [
    "https://img.alicdn.com/imgextra/i3/O1CN01HKF8IE21NglxmBjwj_!!6000000006973-2-tps-456-502.png",
  ],
  songTitle: "老人と海",
  songEnglishTitle:"The Old Man and the Sea",
  artistName: "ヨルシカ",
  link: "https://video-1328751369.cos.ap-guangzhou.myqcloud.com/%E3%83%A8%E3%83%AB%E3%82%B7%E3%82%AB%20-%20%E8%80%81%E4%BA%BA%E3%81%A8%E6%B5%B7%281%29.mp3",
};

export const musicdemo_2: MusicType = {
  id: '方的言',
  pic: [
    "https://img.alicdn.com/imgextra/i3/O1CN01HKF8IE21NglxmBjwj_!!6000000006973-2-tps-456-502.png",
  ],
  songTitle: "方的言",
  artistName: "赵英俊",
  link: "https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/global-learn/%E6%96%B9%E7%9A%84%E8%A8%80-%E8%B5%B5%E8%8B%B1%E4%BF%8A.flac",
  lyricsLink:'https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/global-learn/%E6%96%B9%E7%9A%84%E8%A8%80-%E8%B5%B5%E8%8B%B1%E4%BF%8A-%E6%AD%8C%E8%AF%8D.lrc'
};


export const localAudios:MusicType[]=[musicdemo_1,musicdemo_2,...ihopeAlbum.musics]//包括了预设的音乐和 本地专辑的音乐
