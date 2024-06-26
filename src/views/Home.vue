<template>
  <main class="home-main">
    <section class="navbar-section">
      <Navbar
        :admin="admin"
        :create_ticket="create_ticket"
        :techName="techName"
      />
    </section>
    <section class="tickets-section">
      <p>
        <strong>Total {{ tickets.length }}</strong>
      </p>
      <div class="tickets">
        <Ticket
          v-for="ticket in tickets"
          :key="ticket.id"
          :ticket="ticket"
          :admin="admin"
          :delete_ticket="delete_ticket"
          @ticket_deleted="removeTicketFromArray(ticket.id)"
        >
          <template #clientName>{{ ticket.clientName.toUpperCase() }}</template>
          <template #description>{{ ticket.description }}</template>
          <template #priority>{{ ticket.priority.toUpperCase() }}</template>
          <template #status>{{ ticket.status.toUpperCase() }}</template>
          <template #reccurrent v-if="ticket.reccurrent">
            {{ ticket.reccurrent }}
          </template>
          <template #techName v-if="ticket.techName">
            {{ ticket.techName }}
          </template>
          <template #createdAt>{{ formatDate(ticket.createdAt) }}</template>
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
import Popup from "@/components/Popup.vue";
import Navbar from "../components/Navbar.vue";
import Ticket from "../components/Ticket.vue";
import { baseUrl } from "../../conf";
import { onBeforeMount, ref } from "vue";
import router from "../router";

const popup = ref(false);
const msg = ref("");
const type = ref("");

const tickets = ref();

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}

const admin = localStorage.getItem("admin");
const create_ticket = localStorage.getItem("create_ticket");
const techName = localStorage.getItem("techName");
const delete_ticket = localStorage.getItem("delete_ticket");

onBeforeMount(async () => {
  const res = await fetch(baseUrl + "/ticket/list", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  tickets.value = data;
});

function formatDate(date) {
  const newDate = new Date(date);
  const day = newDate.getUTCDate();
  const month = newDate.getUTCMonth();
  const year = newDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

function removeTicketFromArray(id) {
  const ticketIndex = tickets.value.findIndex((ticket) => ticket.id == id);
  tickets.value.splice(ticketIndex, 1);
  msg.value = "Ticket deletado com sucesso!";
  type.value = "success";
  popup.value = true;
  setTimeout(() => {
    popup.value = false;
    msg.value = "";
    type.value = "";
  }, 1000 * 3);
}
</script>

<style scoped>
.home-main {
  display: flex;
  height: 100vh;
}

.tickets-section {
  width: 100%;
  padding: 3rem;
  background: var(--light-background);
  color: var(--light-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  justify-content: center;
}

.tickets {
  width: 100%;
  height: 100%;
  background: var(--medium-background);
  border-radius: 1.2rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tickets-section p {
  width: 100%;
  text-align: start;
}

.popup {
  position: absolute;
  top: 3rem;
}
</style>
