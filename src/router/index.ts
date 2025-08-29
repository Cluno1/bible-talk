import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Home from "@/view/Home.vue";
import Bible from "@/view/Bible.vue";
import MusicAlbum from "@/view/music/MusicAlbum.vue";
import Audio from "@/view/music/index.vue";
const routes: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "home",
    component: Home,
    alias: "/",
    meta: { title: "Home", icon: "House", rank: 1 },
  },
  // {
  //   path: "/test",
  //   name: "test",
  //   component: FontTest,
  //   alias: "/",
  //   meta: { title: "FontTest", icon: "House", rank: 1 },
  // },
  {
    path: "/music-album",
    name: "music-album",
    component: MusicAlbum,
    meta: {
      title: "Music Album",
      icon: "Notification",
      rank: 20,
      hidden: true,
    },
  },
  {
    path: "/audio-play",
    name: "audio-play",
    component: Audio,
    meta: { title: "Audio Play", icon: "Headset", rank: 3, hidden: true },
  },
  {
    path: "/bible",
    name: "bible",
    component: Bible,
    meta: { title: "Bible", icon: "Reading", rank: 2, hidden: true }, // 不显示
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
