<template>
  <main class="home-main">
    <section class="navbar-section">
      <Navbar />
    </section>
    <section class="tickets-section">
      <div class="header">
        <strong>Total: {{ total }}</strong>
        <Filter @search="getTickets" @findClient="findClientByName" />
      </div>
      <div class="tickets">
        <Ticket
          v-for="ticket in tickets"
          :key="ticket.id"
          :ticket="ticket"
          @ticket_deleted="removeTicketFromArray(ticket.id)"
          @ticket_progress="setProgressTicket(ticket.id)"
          @ticket_finished="setFinishedTicket(ticket.id)"
          @ticket_edited="setEditedTicket"
        >
          <template #clientName>{{ ticket.clientName.toUpperCase() }}</template>
          <template #description>{{ ticket.description }}</template>
          <template #priority>{{
            Translate(ticket.priority).toUpperCase()
          }}</template>
          <template #category>{{
            Translate(ticket.category).toUpperCase()
          }}</template>
          <template #status>{{
            Translate(ticket.status).toUpperCase()
          }}</template>
          <template #reccurrent v-if="ticket.reccurrent == true">
            {{ ticket.reccurrent }}
          </template>
          <template #techName v-if="ticket.techName">
            <span :style="{ color: ticket.techColor }">{{
              ticket.techName.toUpperCase()
            }}</span>
          </template>
          <template #createdAt>{{ FormatDate(ticket.createdAt) }}</template>
          <template #updatedAt v-if="ticket.status != 'open'">{{
            FormatDate(ticket.updatedAt)
          }}</template>
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
import Filter from "@/components/Filter.vue";
import { onBeforeMount, onMounted, ref } from "vue";
import router from "../router";
import { FormatDate } from "@/assets/utils/FormatDate";
import { baseUrl } from "../../conf.js";
import { Translate } from "@/assets/utils/Translate";

const popup = ref(false);
const msg = ref("");
const type = ref("");

const tickets = ref([]);
const total = ref(0);

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}
const techName = localStorage.getItem("techName");

onMounted(() => {
  document.title = "Home";
});

onBeforeMount(async () => {
  const res = await fetch(baseUrl + "/ticket/list/all", {
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

async function getTickets(order) {
  const res = await fetch(baseUrl + "/ticket/list/" + order.order, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  tickets.value = data.filter((ticket) => ticket.status !== "finished");
  total.value = tickets.value.length;

  if (res.status != 200) {
    console.error(data);
  }

  return tickets.value;
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

async function findClientByName({ name, order }) {
  if (name == "") {
    const data = await getTickets({ order });
    tickets.value = data;
    total.value = tickets.value.length;
  } else {
    const filter = tickets.value.filter((ticket) =>
      ticket.clientName.toLowerCase().includes(name.toLowerCase())
    );

    tickets.value = filter;
    total.value = tickets.value.length;
  }
}

function setEditedTicket({ id, description }) {
  const ticketIndex = tickets.value.findIndex((ticket) => ticket.id == id);
  tickets.value[ticketIndex].description = description;
  msg.value = "Ticket editado!";
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
  padding: 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.popup {
  position: absolute;
  top: 3rem;
}

.header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
  gap: 3rem;
}

@media (max-width: 800px) {
  .header {
    padding: 0 6rem 0 0;
  }
}
</style>
