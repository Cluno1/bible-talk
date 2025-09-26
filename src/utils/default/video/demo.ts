import type { VideoType } from "@/type/video";
import type { TextTrackInit } from "vidstack";
import { localMusicAlbums } from "../album";

const textTracks: TextTrackInit[] = [
  // Subtitles
  {
    src: "https://files.vidstack.io/sprite-fight/subs/english.vtt",
    label: "English",
    language: "en-US",
    kind: "subtitles",
    default: true,
  },
  {
    src: "https://files.vidstack.io/sprite-fight/subs/spanish.vtt",
    label: "Spanish",
    language: "es-ES",
    kind: "subtitles",
  },
  // Chapters
  {
    src: "https://files.vidstack.io/sprite-fight/chapters.vtt",
    kind: "chapters",
    language: "en-US",
    default: true,
  },
];

export const videoDemo: VideoType = {
  id: "videodemo",
  title: "Sprite Fright",
  describe:
    "Sprite Fright is a 2021 animated slasher Horror Comedy and produced as the thirteenth Blender Foundation Open Movie." +
    "A group of rowdy, city-slicking teens set camp in a secluded part of the woods for their biology project. There, they encounter mushroom-like, gnome beings called Sprites who are the peaceful and cheery protectors of the woods. However, as night falls, the campers discover how cruel nature can be." +
    "Due to the movie's short runtime of around ten minutes, spoilers will be left unmarked." +
    "The short film can be watched on YouTube in full here.",
  videoUrl: "https://files.vidstack.io/sprite-fight/720p.mp4",
  textTracks: textTracks,
  thumbnailsUrl: "https://files.vidstack.io/sprite-fight/thumbnails.vtt",
  videoAlbumUrl: "https://files.vidstack.io/sprite-fight/poster.webp",
};

export const videoDemo2: VideoType = {
  id: "守候",
  title: "守候 - 赵英俊 Live",
  describe:
    "《守候》是2017年赵英俊为电影《大闹天竺》创作并演唱的主题曲，收录于其2020年专辑《以电影的名义歌唱》.歌曲以'总有人要远走，总来不及挽留'等歌词展现离别情境，通过赵英俊兼具洒脱与深情的演唱形成独特表达 [6]。2021年赵英俊逝世后，好友大鹏在纪念活动中弹唱该曲引发广泛共鸣 [9]。2022年那英在综艺节目中改编演绎该曲，以平实的尾音处理与温暖基调重新诠释作品 [8]。" +
    "2024年11月15日，在时光音乐会第四季中李霄云、王铮亮演唱了该歌曲。",

  videoUrl:
    "https://bible-1328751369.cos.ap-guangzhou.myqcloud.com/video/%E5%AE%88%E5%80%99%20-%20%E8%B5%B5%E8%8B%B1%E4%BF%8A%20live.mp4",
};


export const videoDemo3: VideoType = {
  id: "demo_2",
  title: "demo_2",
  describe:
    "demo_2",

  videoUrl:
    "https://vip.dytt-cinema.com/20250407/19290_989f7898/index.m3u8",
};

//https://vip.dytt-hot.com/20250520/90511_055b8d75/index.m3u8

const localVideos = [videoDemo, videoDemo2,videoDemo3];

localMusicAlbums.forEach((i) => {
  (i?.videos || []).forEach((i) => localVideos.push(i));
});

export  {
  localVideos
}