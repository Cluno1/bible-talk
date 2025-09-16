import type { MusicAlbum, MusicType } from "@/type/music";
import type { VideoType } from "@/type/video";

const musicdemo_study_training: MusicType = {
  id: "zld_st-1",
  pic: ["https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/pic/R-C.jpg"],
  songTitle: "study training",
  artistName: "飞凡",
  link: "https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/global-learn/zld/strudy-training-1.m4a",
};

//青岛牧师
const musicdemo2: MusicType = {
  id: "zld_sun_1",
  pic: ["https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/pic/R-C.jpg"],
  songTitle: "青岛牧师sunday讲道",
  artistName: "青岛牧师",
  link: "https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/global-learn/zld/%E9%9D%92%E5%B2%9B%E7%89%A7%E5%B8%88Sunday.m4a",
};

//MP4

export const Sunday1: VideoType = {
  id: "SUN_20250914_1",
  title: "2025.9.14Sunday",
  describe: "琶洲酒店,讲道牧师:飞凡;圣餐分享:Grace",
  albumId: "zld",
  videoUrl:
    "https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/global-learn/sunday/VID_20250914_101441.mp4",
};

export const musicdemo_zld: MusicAlbum = {
  id: "zld",
  pic: ["https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/pic/R-C.jpg"],
  authorName: "张连登",
  albumTitle: "教会录音文件",
  musics: [musicdemo_study_training, musicdemo2],
  videos: [Sunday1],
};
