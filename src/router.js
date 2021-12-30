import { createWebHistory, createRouter } from "vue-router";

import Home from "@/views/Home.vue";
import About from "@/views/About.vue";
import CoinDetail from "@/views/CoinDetail.vue";
import Error from "@/views/Error.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/coin/:id",
    name: "coin-detail",
    component: CoinDetail,
  },
  {
    path: "/:catchAll(.*)",
    name: "Error",
    component: Error,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
