import MusicDemo from "@/test/music/MusicDemo.vue";
import OriginsTest from "@/view/test/OriginsTest.vue";
import { type RouteRecordRaw } from "vue-router";
import LyricsDemo1 from "@/test/lyrics/demo1.vue";
export const testRoutes: RouteRecordRaw[] = [
  {
    path: "/musictest",
    name: "musictest",
    component: MusicDemo,
    alias: "/",
    meta: { title: "music Test", icon: "Reading", rank: 1, hidden: true },
  },
  {
    path: "/video-test",
    name: "video-test",
    component: OriginsTest,
    meta: { title: "Video Test", icon: "Reading", rank: 2, hidden: true }, // 不显示
  },
  {
    path: "/test-test",
    name: "test-test",
    component: LyricsDemo1,
    meta: { title: "test demo1", icon: "Reading", rank: 2, hidden: true }, // 不显示
  },
];
