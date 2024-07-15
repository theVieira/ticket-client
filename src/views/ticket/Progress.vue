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
        @ticket_finished="setFinishedTicket(ticket.id)"
      />
    </div>
    <Popup v-if="popup" class="popup" :msg="msg" :type="type" />
  </main>
</template>

<script setup>
import Popup from "@/components/Popup.vue";
import Ticket from "../../components/Ticket.vue";
import Filter from "@/components/Filter.vue";
import { onBeforeMount } from "vue";
import { SetTitle } from "@/assets/utils/SetTitle.js";
import { InitializeVars } from "@/assets/utils/InitializeVars";
import { GetTickets } from "@/assets/utils/GetTickets";

const { popup, token, tickets, msg, type, total } = InitializeVars();

SetTitle("Em progresso");

onBeforeMount(async () => {
  const data = await GetTickets("/ticket/list/all", token);
  tickets.value = data.filter((ticket) => ticket.status == "progress");
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

async function search({ data }) {
  tickets.value = data.filter((ticket) => ticket.status == "progress");
  total.value = tickets.value.length;
}
</script>
