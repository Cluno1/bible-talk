import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Home from "@/view/Home.vue";
import Bible from "@/view/Bible.vue";
import BibleTalk from "@/view/BibleTalk/index.vue";
import Gospel from "@/view/BibleTalk/Gospel.vue";
import PreachGospel from "@/view/BibleTalk/PreachGospel.vue";
import Evangelization from "@/view/BibleTalk/Evangelization.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "home",
    component: Home,
    alias: "/",
    meta: { title: "Home", icon: "House", rank: 1 },
  },
  {
    path: "/bible",
    name: "bible",
    component: Bible,
    meta: { title: "Bible", icon: "Reading", rank: 2, hidden: true }, // 不显示
  },
  {
    path: "/bibletalk",
    name: "bibletalk",
    // component: BibleTalk,//一定要
    meta: { title: "Bible Talk", rank: 3, icon: "ChatDotSquare" },
    children: [
      {
        path: "overview",
        name: "overview",
        component: BibleTalk,
        meta: { title: "Overview", rank: 10 },
      },
      {
        path: "gospel",
        name: "gospel",
        component: Gospel,
        meta: { title: "Gospel", rank: 20 },
      },
      {
        path: "evangelization",
        name: "evangelization",
        component: Evangelization,
        meta: { title: "Evangelization", rank: 30 },
      },
      {
        path: "preachgospel",
        name: "preachgospel",
        component: PreachGospel,
        meta: { title: "Preach Gospel", rank: 40 },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
