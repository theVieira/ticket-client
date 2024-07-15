<template>
  <div class="techs-container" v-if="!techDialog">
    <PersonCard
      v-for="tech in techs"
      :key="tech.id"
      :name="tech.name"
      :tickets="tech.tickets"
      @showInfo="showTech(tech)"
    />
  </div>
  <div class="tech-info" v-if="techDialog">
    <div class="top-info">
      <h3><span>Nome</span>{{ tech.name.toUpperCase() }}</h3>
      <h3><span>Chamados</span>{{ tech.tickets.length }}</h3>
      <span id="close-button" @click="techDialog = false">X</span>
    </div>
    <div class="actions">
      <div class="action">
        <img src="@/assets/icons/block.svg" alt="block icon" />
        <p><strong>Inativar</strong></p>
      </div>
      <div class="action">
        <img src="@/assets/icons/trash.png" alt="trash icon" />
        <p><strong>Deletar</strong></p>
      </div>
    </div>
    <div class="tickets">
      <Ticket
        v-for="ticket in tech.tickets"
        :key="ticket.id"
        :ticket="ticket"
        @ticket_deleted="removeTicketFromArray(ticket.id)"
        @ticket_progress="setProgressTicket(ticket.id)"
        @ticket_finished="setFinishedTicket(ticket.id)"
        @ticket_reopen="setReopenTicket(ticket.id)"
      />
    </div>
    <Popup class="popup" v-if="popup">
      <template #msg>{{ msg }}</template>
      <template #type>{{ type }}</template>
    </Popup>
  </div>
</template>

<script setup>
import PersonCard from "@/components/PersonCard.vue";
import Ticket from "@/components/Ticket.vue";
import Popup from "@/components/Popup.vue";
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import { baseUrl } from "../../../conf";

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}
const techName = localStorage.getItem("techName");

const popup = ref(false);
const msg = ref("");
const type = ref("");

const techDialog = ref(false);

const techs = ref([]);

const tech = ref({});
const tickets = ref([]);

onBeforeMount(async () => {
  const res = await fetch(baseUrl + "/tech/list", {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  techs.value = data;
});

function showTech(info) {
  tech.value = info;
  tickets.value = info.tickets;
  techDialog.value = true;
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
.techs-container {
  color: var(--light-color);
  display: flex;
  gap: 4rem;
  padding: 5rem;
  flex-wrap: wrap;
  height: fit-content;
}

.tech-info {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4rem;
  color: var(--light-color);
  gap: 3rem;
}

.tech-info .tickets {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tech-info .top-info {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.tech-info .top-info h3 {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tech-info .top-info h3 span {
  filter: brightness(80%);
}

#close-button {
  color: #b93737;
  font-weight: 800;
  font-size: 2.6rem;
  position: absolute;
  top: 1rem;
  left: 1rem;
  cursor: pointer;
}

.actions {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.action {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.action img {
  width: 3.2rem;
}

.popup {
  position: absolute;
  top: 3rem;
}
</style>
