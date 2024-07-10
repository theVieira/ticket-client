<template>
  <main class="list-clients-container">
    <section class="navbar-section">
      <Navbar />
    </section>
    <section class="list-clients-section" v-if="!showClientDialog">
      <ClientCard
        v-for="client in clients"
        :key="client.id"
        :name="client.name"
        :tickets="client.tickets"
        @showClientInfo="showClient(client)"
      />
    </section>
    <div class="client-info" v-if="showClientDialog">
      <span id="close-button" @click="showClientDialog = false">X</span>
      <div class="top-info">
        <h3><span>Cliente</span> {{ client.name }}</h3>
        <h3><span>Chamados</span>{{ client.tickets.length }}</h3>
      </div>
      <div class="actions">
        <div class="action">
          <img src="@/assets/icons/trash.png" alt="trash icon" />
          <p><strong>Deletar</strong></p>
        </div>
        <div class="action">
          <img src="@/assets/icons/pencil.png" alt="pencil icon" />
          <p><strong>Editar</strong></p>
        </div>
      </div>
      <div class="tickets">
        <Ticket
          v-for="ticket in client.tickets"
          :key="ticket.id"
          :ticket="ticket"
          @ticket_deleted="removeTicketFromArray(ticket.id)"
          @ticket_progress="setProgressTicket(ticket.id)"
          @ticket_finished="setFinishedTicket(ticket.id)"
          @ticket_reopen="setReopenTicket(ticket.id)"
        >
          <template #category>{{
            Translate(ticket.category).toUpperCase()
          }}</template>
          <template #clientName>{{ ticket.clientName }}</template>
          <template #createdAt>{{ format_date(ticket.createdAt) }}</template>
          <template #description>{{ ticket.description }}</template>
          <template #priority>{{
            Translate(ticket.priority).toUpperCase()
          }}</template>
          <template #reccurrent v-if="ticket.reccurrent">{{
            ticket.reccurrent
          }}</template>
          <template #status>{{
            Translate(ticket.status).toUpperCase()
          }}</template>
          <template #techName v-if="ticket.techName"
            ><span :style="{ color: ticket.techColor }">{{
              ticket.techName.toUpperCase()
            }}</span></template
          >
        </Ticket>
      </div>
      <Popup v-if="popup" class="popup">
        <template #msg>{{ msg }}</template>
        <template #type>{{ type }}</template>
      </Popup>
    </div>
  </main>
</template>

<script setup>
import Popup from "@/components/Popup.vue";
import Ticket from "@/components/Ticket.vue";
import Navbar from "@/components/Navbar.vue";
import ClientCard from "@/components/ClientCard.vue";
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import { baseUrl } from "../../conf";
import { Translate } from "@/assets/utils/Translate";
import { format_date } from "@/assets/utils/FormatDate";

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}

const techName = localStorage.getItem("techName");

const clients = ref([]);

const client = ref({});
const tickets = ref([]);

const showClientDialog = ref(false);

const popup = ref(false);
const msg = ref("");
const type = ref("");

onBeforeMount(async () => {
  const res = await fetch(baseUrl + "/client/list", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (res.status != 200) {
    console.error(data);
  } else {
    clients.value = data;
  }
});

function showClient(info) {
  showClientDialog.value = true;
  client.value = info;
  tickets.value = info.tickets;
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
  tickets.value[ticketIndex].techName = techName.value;
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
  tickets.value[ticketIndex].status = "finished";
  msg.value = "Ticket finalizado!";
  type.value = "success";
  popup.value = true;
  setTimeout(() => {
    popup.value = false;
    msg.value = "";
    type.value = "";
  }, 1000 * 3);
}

function setReopenTicket(id) {
  const ticketIndex = tickets.value.findIndex((ticket) => ticket.id == id);
  tickets.value[ticketIndex].status = "open";
  msg.value = "Ticket reaberto!";
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
.list-clients-container {
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  background: var(--light-background);
  display: flex;
}

.list-clients-section {
  height: fit-content;
  color: var(--light-color);
  padding: 5rem;
  display: flex;
  flex-wrap: wrap;
  gap: 4rem;
}

.client-info {
  width: 100%;
  color: var(--light-color);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
}

.client-info .top-info {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.client-info h3 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.client-info h3 span {
  filter: brightness(80%);
}

.client-info .actions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.client-info .actions .action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.client-info .tickets {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
  margin-top: 4rem;
}

.popup {
  position: absolute;
  top: 3rem;
}

#close-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  color: #b93737;
  font-weight: 800;
  font-size: 2.6rem;
  cursor: pointer;
}
</style>
