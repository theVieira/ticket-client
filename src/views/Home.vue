<template>
  <main class="tickets-container">
    <div class="tickets-header">
      <strong>Total: {{ total }}</strong>
      <Filter @search="search" />
    </div>
    <div class="tickets-list">
      <Ticket
        v-for="ticket in tickets"
        :key="ticket.id"
        :ticket="ticket"
        @ticket_deleted="removeTicketFromArray(ticket.id)"
        @ticket_progress="setProgressTicket(ticket.id)"
        @ticket_finished="setFinishedTicket(ticket.id)"
        @ticket_edited="setEditedTicket"
      />
    </div>
    <Popup v-if="popup" class="popup" :msg="msg" :type="type" />
  </main>
</template>

<script setup>
import Popup from "@/components/Popup.vue";
import Ticket from "../components/Ticket.vue";
import Filter from "@/components/Filter.vue";
import { onBeforeMount } from "vue";
import { GetTickets } from "@/assets/utils/GetTickets";
import { SetTitle } from "@/assets/utils/SetTitle";
import { InitializeVars } from "@/assets/utils/InitializeVars";

const { tickets, total, token, popup, msg, type, techName } = InitializeVars();

SetTitle("Home");

onBeforeMount(async () => {
  const data = await GetTickets("/ticket/list/all", token);
  tickets.value = data.filter((ticket) => ticket.status != "finished");
  total.value = tickets.value.length;
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

function setEditedTicket({ data }) {
  const ticketIndex = tickets.value.findIndex((ticket) => ticket.id == data.id);
  tickets.value[ticketIndex].description = data.description;
  tickets.value[ticketIndex].category = data.category;
  msg.value = "Ticket editado!";
  type.value = "success";
  popup.value = true;
  setTimeout(() => {
    popup.value = false;
    msg.value = "";
    type.value = "";
  }, 1000 * 3);
}

async function search({ data }) {
  tickets.value = data.filter((ticket) => ticket.status != "finished");
  total.value = tickets.value.length;
}
</script>
