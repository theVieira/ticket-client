<template>
  <main class="finished-tickets-container">
    <section class="nav-section">
      <Navbar
        :admin="admin"
        :tech-name="techName"
        :create_ticket="create_ticket"
      />
    </section>
    <section class="tickets-section">
      <div class="tickets">
        <Ticket
          class="ticket"
          v-for="ticket in tickets"
          :key="ticket.id"
          :admin="admin"
          :delete_ticket="delete_ticket"
          :ticket="ticket"
          @ticket_deleted="removeTicketFomFinisheds(ticket.id)"
          @ticket_reopen="reopenTicket(ticket.id)"
        >
          <template #clientName>{{ ticket.clientName }}</template>
          <template #description>{{ ticket.description }}</template>
          <template #priority>{{ ticket.priority }}</template>
          <template #status>{{ ticket.status }}</template>
          <template #reccurrent v-if="ticket.reccurrent == 'true'">{{
            ticket.reccurrent
          }}</template>
          <template #techName>{{ ticket.techName.toUpperCase() }}</template>
          <template #createdAt>{{ format_date(ticket.createdAt) }}</template>
        </Ticket>
      </div>
      <Popup v-if="popup" class="popup">
        <template #msg>{{ msg }}</template>
        <template #type>{{ type }}</template>
      </Popup>
    </section>
  </main>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Ticket from "@/components/Ticket.vue";
import Popup from "@/components/Popup.vue";
import router from "../router/index.js";
import { onBeforeMount, onMounted, ref } from "vue";
import { format_date } from "@/assets/utils/FormatDate.js";
import { baseUrl } from "../../conf.js";

const tickets = ref();
const popup = ref(false);
const msg = ref("");
const type = ref("");

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}
const admin = localStorage.getItem("admin");
const techName = localStorage.getItem("techName");
const create_ticket = localStorage.getItem("create_ticket");
const delete_ticket = localStorage.getItem("delete_ticket");

onMounted(() => {
  document.title = "Finalizados";
});

onBeforeMount(async () => {
  const res = await fetch(baseUrl + "/ticket/list", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  tickets.value = data
    .filter((ticket) => ticket.status == "finished")
    .reverse();
});

function removeTicketFomFinisheds(id) {
  const ticketIndex = tickets.value.findIndex((ticket) => (ticket.id = id));
  tickets.value.splice(ticketIndex, 1);

  popup.value = true;
  msg.value = "Ticket deletado com sucesso!";
  type.value = "success";
  setTimeout(() => {
    popup.value = false;
    msg.value = "";
    type.value = "";
  }, 1000 * 3);
}

function reopenTicket(id) {
  const ticketIndex = tickets.value.findIndex((ticket) => (ticket.id = id));
  tickets.value.splice(ticketIndex, 1);

  popup.value = true;
  msg.value = "Ticket reaberto!";
  type.value = "success";
  setTimeout(() => {
    popup.value = false;
    msg.value = "";
    type.value = "";
  }, 1000 * 3);
}
</script>

<style scoped>
.finished-tickets-container {
  display: flex;
  height: 100vh;
  background: var(--light-background);
}

.tickets {
  margin: 3.5rem 0;
  width: 100%;
  background: var(--medium-background);
  padding: 3rem;
  border-radius: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tickets-section {
  color: var(--light-color);
  width: 100%;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

.ticket {
  width: 100%;
}

.popup {
  position: absolute;
  top: 3rem;
}
</style>
