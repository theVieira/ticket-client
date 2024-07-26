import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import CreateTicket from "@/views/ticket/Create.vue";
import CreateClient from "@/views/client/Create.vue";
import Finished from "@/views/ticket/Finished.vue";
import Clients from "@/views/client/List.vue";
import Account from "@/views/tech/Account.vue";
import Progress from "@/views/ticket/Progress.vue";
import Techs from "@/views/tech/List.vue";
import CreateTech from "@/views/tech/Create.vue";

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
    {
      path: "/finisheds",
      component: Finished,
    },
    {
      path: "/list/clients",
      component: Clients,
    },
    {
      path: "/account",
      component: Account,
    },
    {
      path: "/progress",
      component: Progress,
    },
    {
      path: "/manage/tech",
      component: Techs,
    },
    {
      path: "/create/tech",
      component: CreateTech,
    },
  ],
});

export default router;
