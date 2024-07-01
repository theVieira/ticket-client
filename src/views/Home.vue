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
        <strong>Total: {{ total }}</strong>
      </p>
      <div class="tickets">
        <Ticket
          v-for="ticket in tickets"
          :key="ticket.id"
          :ticket="ticket"
          :admin="admin"
          :delete_ticket="delete_ticket"
          @ticket_deleted="removeTicketFromArray(ticket.id)"
          @ticket_progress="setProgressTicket(ticket.id)"
          @ticket_finished="setFinishedTicket(ticket.id)"
        >
          <template #clientName>{{ ticket.clientName.toUpperCase() }}</template>
          <template #description>{{ ticket.description }}</template>
          <template #priority>{{ ticket.priority.toUpperCase() }}</template>
          <template #status>{{ ticket.status.toUpperCase() }}</template>
          <template #reccurrent v-if="ticket.reccurrent == true">
            {{ ticket.reccurrent }}
          </template>
          <template #techName v-if="ticket.techName">
            <span :style="{ color: ticket.techColor }">{{
              ticket.techName.toUpperCase()
            }}</span>
          </template>
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
import Popup from "@/components/Popup.vue";
import Navbar from "../components/Navbar.vue";
import Ticket from "../components/Ticket.vue";
import { baseUrl } from "../../conf";
import { onBeforeMount, onMounted, ref } from "vue";
import router from "../router";
import { format_date } from "@/assets/utils/FormatDate";

const popup = ref(false);
const msg = ref("");
const type = ref("");

const tickets = ref();
const total = ref();

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}

const admin = localStorage.getItem("admin");
const create_ticket = localStorage.getItem("create_ticket");
const techName = localStorage.getItem("techName");
const delete_ticket = localStorage.getItem("delete_ticket");

onMounted(() => {
  document.title = "Home";
});

onBeforeMount(async () => {
  const res = await fetch(baseUrl + "/ticket/list", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();

  tickets.value = data.filter((ticket) => ticket.status != "finished");
  total.value = tickets.value.length;

  if (res.status != 200) {
    console.error(data);
  }
});

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

function setProgressTicket(id) {
  const ticketIndex = tickets.value.findIndex((ticket) => ticket.id == id);
  tickets.value[ticketIndex].status = "progress";
  tickets.value[ticketIndex].techName = techName;
  msg.value = "Ticket em progresso!";
  type.value = "success";
  popup.value = true;
  setTimeout(() => {
    popup.value = false;
    msg.value = "";
    type.value = "";
  }, 1000 * 3);
}

function setFinishedTicket(id) {
  const ticketIndex = tickets.value.findIndex((ticket) => ticket.id == id);
  tickets.value.splice(ticketIndex, 1);
  msg.value = "Ticket finalizado!";
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
  min-height: 100vh;
  height: 100%;
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
}

.tickets {
  width: 100%;
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
