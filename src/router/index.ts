import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Home from "@/view/Home.vue";
import Bible from "@/view/Bible.vue";
import MusicAlbum from "@/view/music/MusicAlbum.vue";
import Audio from "@/view/music/index.vue";
import Setting from "@/view/Setting.vue";
import Video from "@/view/video/index.vue";
import Error from "@/view/Error.vue";
import Search from "@/view/video/Search.vue";
import RouterView from "@/view/video/RouterView.vue";
import OriginsTest from "@/view/test/OriginsTest.vue";
const routes: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "home",
    component: Home,
    alias: "/",
    meta: { title: "Home", icon: "House", rank: 1 },
  },
  {
    path: "/setting",
    name: "setting",
    component: Setting,
    meta: { title: "Setting", icon: "Setting", rank: 3, hidden: true },
  },
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
    path: "/video",
    name: "video",
    component: RouterView,
    children: [
      {
        path: "",
        name: "video-index",
        component: Video,
        meta: { title: "video show", icon: "Reading", rank: 1, hidden: true }, // 不显示
      },
      {
        path: "search",
        name: "video-search",
        component: Search,
        meta: { title: "video search", icon: "Reading", rank: 2, hidden: true }, // 不显示
      },
    ],
    meta: { title: "Video Play", icon: "Headset", rank: 3, hidden: true },
  },
  {
    path: "/bible",
    name: "bible",
    component: Bible,
    meta: { title: "Bible", icon: "Reading", rank: 2, hidden: true }, // 不显示
  },
  {
    path: "/test",
    name: "test",
    component: OriginsTest,
    meta: { title: "OriginsTest", icon: "Reading", rank: 2, hidden: false }, // 不显示
  },
  {
    path: "/error",
    name: "error",
    component: Error,
    meta: { title: "error", icon: "Reading", rank: 2, hidden: true }, // 不显示
  },

  // {
  //   path: "/yhdmtest",
  //   name: "yhdm-test",
  //   component: YHDMTest,
  //   meta: { title: "YHDM Test", icon: "Reading", rank: 2, hidden: true },
  // },
];

const router = createRouter({
  history: createWebHistory("/bible-talk/"),
  routes,
});

export default router;
