<template>
  <main class="tickets-container">
    <div class="tickets-header">
      <p>
        <strong>Total: {{ total }}</strong>
      </p>
      <div class="filter">
        <Filter @search="search" />
      </div>
    </div>
    <div class="tickets-list">
      <Ticket
        class="ticket"
        v-for="ticket in tickets"
        :key="ticket.id"
        :ticket="ticket"
        @deleted="_deleteTicket"
        @reopen="_reopenTicket"
        @edited="_editTicket"
      />
    </div>
    <Popup v-if="popup" class="popup" :msg="msg" :type="type" />
  </main>
</template>

<script setup>
import Ticket from "@/components/Ticket.vue";
import Popup from "@/components/Popup.vue";
import Filter from "@/components/Filter.vue";
import { onBeforeMount } from "vue";
import { InitializeVars } from "@/assets/utils/InitializeVars";
import { SetTitle } from "@/assets/utils/SetTitle";
import { GetTickets } from "@/assets/utils/GetTickets";
import { reopenTicket } from "@/assets/utils/TicketActions";

const { tickets, total, popup, msg, type, token } = InitializeVars();

SetTitle("Finalizados");

onBeforeMount(async () => {
  const data = await GetTickets("/ticket/list/all", token);
  tickets.value = data.filter((ticket) => ticket.status === "finished");
  total.value = tickets.value.length;
});

function _deleteTicket({ id, status }) {
  deleteTicket(tickets, id, popup, msg, type, status);
}

function _reopenTicket({ id, status }) {
  reopenTicket(tickets, id, popup, msg, type, status, true);
}

function _editTicket({ id, status, data }) {
  editTicket(tickets, id, popup, msg, type, data, status);
}

async function search({ data }) {
  tickets.value = data.filter((ticket) => ticket.status == "finished");
  total.value = tickets.value.length;
}
</script>
