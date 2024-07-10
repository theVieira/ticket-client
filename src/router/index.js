import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";
import CreateTicket from "@/views/CreateTicket.vue";
import CreateClient from "@/views/CreateClient.vue";
import FinishedTickets from "@/views/FinishedTickets.vue";
import ListClients from "@/views/ListClients.vue";
import Account from "@/views/Account.vue";
import ProgressTickets from "@/views/ProgressTickets.vue";

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
  ],
});

export default router;
