<template>
  <main class="tickets-container">
    <div class="tickets-header">
      <p>
        <strong>Total: {{ total }}</strong>
      </p>
      <div class="filter">
        <Filter
          @searchByOrder="searchByOrder"
          @searchByClient="searchByClient"
        />
      </div>
    </div>
    <div class="tickets-list">
      <Ticket
        class="ticket"
        v-for="ticket in tickets"
        :key="ticket.id"
        :ticket="ticket"
        @ticket_deleted="removeTicketFomFinished(ticket.id)"
        @ticket_reopen="reopenTicket(ticket.id)"
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

const { tickets, total, popup, msg, type, token } = InitializeVars();

SetTitle("Finalizados");

onBeforeMount(async () => {
  const data = await GetTickets("/ticket/list/all", token);
  tickets.value = data.filter((ticket) => ticket.status == "finished");
  total.value = tickets.value.length;
});

function removeTicketFomFinished(id) {
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
