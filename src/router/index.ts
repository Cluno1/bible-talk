import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
import Home from "@/view/Home.vue";
import Bible from "@/view/Bible.vue";
import FontTest from "@/view/test/FontTest.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "home",
    component: Home,
    alias: "/",
    meta: { title: "Home", icon: "House", rank: 1 },
  },
  {
    path: "/test",
    name: "test",
    component: FontTest,
    meta: { title: "Test Font", icon: "Reading", rank: 2 },
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
