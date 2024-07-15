<template>
  <section class="list-clients-container" v-if="!showClientDialog">
    <PersonCard
      v-for="client in clients"
      :key="client.id"
      :name="client.name"
      :tickets="client.tickets"
      @showInfo="showClient(client)"
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
      />
    </div>
    <Popup v-if="popup" class="popup">
      <template #msg>{{ msg }}</template>
      <template #type>{{ type }}</template>
    </Popup>
  </div>
</template>

<script setup>
import Popup from "@/components/Popup.vue";
import Ticket from "@/components/Ticket.vue";
import PersonCard from "@/components/PersonCard.vue";
import { onBeforeMount, ref } from "vue";
import { baseUrl } from "../../../conf";
import { InitializeVars } from "@/assets/utils/InitializeVars";

const { token, techName, clients, tickets, popup, msg, type } =
  InitializeVars();

const client = ref({});

const showClientDialog = ref(false);

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
  color: var(--light-color);
  padding: 3rem;
  display: flex;
  justify-content: center;
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
