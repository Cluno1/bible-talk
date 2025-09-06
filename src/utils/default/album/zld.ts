import type { MusicAlbum, MusicType } from "@/type/music";


const musicdemo_study_training: MusicType = {
  id: "zld_st-1",
  pic: [
    "https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/pic/R-C.jpg",
  ],
  songTitle: "study training",
  artistName: "飞凡",
  link: "https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/global-learn/zld/strudy-training-1.m4a",
};


//青岛牧师
const musicdemo2: MusicType = {
  id: "zld_sun_1",
  pic: [
    "https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/pic/R-C.jpg",
  ],
  songTitle: "青岛牧师sunday讲道",
  artistName: "青岛牧师",
  link: "https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/global-learn/zld/%E9%9D%92%E5%B2%9B%E7%89%A7%E5%B8%88Sunday.m4a",
};


export const musicdemo_zld: MusicAlbum = {
    id: "zld",
    pic: [
        "https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/pic/R-C.jpg",
    ],
    authorName: "张连登",
    albumTitle: "教会录音文件",
    musics: [musicdemo_study_training,musicdemo2]
};


