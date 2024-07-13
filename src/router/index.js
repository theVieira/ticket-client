import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import CreateTicket from "@/views/ticket/CreateTicket.vue";
import CreateClient from "@/views/client/CreateClient.vue";
import FinishedTickets from "@/views/ticket/FinishedTickets.vue";
import ListClients from "@/views/client/ListClients.vue";
import Account from "@/views/tech/Account.vue";
import ProgressTickets from "@/views/ticket/ProgressTickets.vue";
import ListTech from "@/views/tech/ListTech.vue";

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
      component: FinishedTickets,
    },
    {
      path: "/list/clients",
      component: ListClients,
    },
    {
      path: "/account",
      component: Account,
    },
    {
      path: "/progress",
      component: ProgressTickets,
    },
    {
      path: "/manage/tech",
      component: ListTech,
    },
  ],
});

export default router;
