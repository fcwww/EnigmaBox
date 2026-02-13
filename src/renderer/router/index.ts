import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

import { cipherProviders } from "@modules/index";

const routes: RouteRecordRaw[] = [
  { path: "/", redirect: cipherProviders[0]?.route ?? "/a1z26" },
  ...cipherProviders.map((p) => ({
    path: p.route,
    name: p.id,
    component: p.component
  }))
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;

