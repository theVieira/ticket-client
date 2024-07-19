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
        @deleted="_deleteTicket"
        @progress="_progressTicket"
        @finished="_finishTicket"
        @edited="_editTicket"
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
import {
  deleteTicket,
  editTicket,
  finishedTicket,
  progressTicket,
} from "@/assets/utils/TicketActions";

const { tickets, total, token, popup, msg, type } = InitializeVars();

SetTitle("Home");

onBeforeMount(async () => {
  const data = await GetTickets("/ticket/list/all", token);
  tickets.value = data.filter((ticket) => ticket.status != "finished");
  total.value = tickets.value.length;
});

function _deleteTicket({ id, status }) {
  deleteTicket(tickets, id, popup, msg, type, status);
}

function _progressTicket({ id, status }) {
  progressTicket(tickets, id, popup, msg, type, status);
}

function _finishTicket({ id, status }) {
  finishedTicket(tickets, id, popup, msg, type, status, true);
}

function _editTicket({ id, status, data }) {
  editTicket(tickets, id, popup, msg, type, data, status);
}

async function search({ data }) {
  tickets.value = data.filter((ticket) => ticket.status != "finished");
  total.value = tickets.value.length;
}
</script>
