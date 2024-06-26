import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import CreateTicket from "@/views/CreateTicket.vue";
import CreateClient from "@/views/CreateClient.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Login,
    },
    {
      path: "/home",
      component: Home,
    },
    {
      path: "/create/ticket",
      component: CreateTicket,
    },
    {
      path: "/create/client",
      component: CreateClient,
    },
  ],
});

export default router;
