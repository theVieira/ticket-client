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
        <strong>Total {{ tickets.length }}</strong>
      </p>
      <div class="tickets">
        <Ticket
          @teste="removeTicketFromArray"
          v-for="ticket in tickets"
          :key="ticket.id"
          :ticket="ticket"
          :admin="admin"
          :delete_ticket="delete_ticket"
        >
          <template #clientName>{{ ticket.clientName }}</template>
          <template #description>{{ ticket.description }}</template>
          <template #priority>{{ ticket.priority }}</template>
          <template #status>{{ ticket.status }}</template>
          <template #reccurrent v-if="ticket.reccurrent">
            {{ ticket.reccurrent }}
          </template>
          <template #techName v-if="ticket.techName">
            {{ ticket.techName }}
          </template>
          <template #createdAt>{{ formatDate(ticket.createdAt) }}</template>
        </Ticket>
      </div>
    </section>
  </main>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import Ticket from "../components/Ticket.vue";
import { baseUrl } from "../../conf";
import { onBeforeMount, ref, getCurrentInstance } from "vue";
import router from "../router";

const instance = getCurrentInstance();

const tickets = ref([]);

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}

const admin = Boolean(localStorage.getItem("admin"));
const create_ticket = Boolean(localStorage.getItem("create_ticket"));
const techName = localStorage.getItem("techName");
const delete_ticket = Boolean(localStorage.getItem("delete_ticket"));

onBeforeMount(async () => {
  const res = await fetch(baseUrl + "/ticket/list", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  tickets.value = data;
  instance.appContext.config.globalProperties.$tickets = data;
});

function formatDate(date) {
  const newDate = new Date(date);
  const day = newDate.getUTCDate();
  const month = newDate.getUTCMonth();
  const year = newDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

const removeTicketFromArray = () => {};
</script>

<style scoped>
.home-main {
  display: flex;
}

.tickets-section {
  width: 100%;
  padding: 3rem;
  background: var(--light-background);
  color: var(--light-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: start;
  justify-content: center;
}

.tickets {
  width: 100%;
  height: 100%;
  background: var(--medium-background);
  border-radius: 1.2rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
