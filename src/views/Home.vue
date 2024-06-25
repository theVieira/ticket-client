<template>
  <main class="home-main">
    <section class="navbar-section">
      <Navbar :tech="tech" />
    </section>
    <section class="tickets-section">
      <p>
        <strong>Total {{ total }}</strong>
      </p>
      <div class="tickets">
        <Ticket
          v-for="ticket in tickets"
          :key="ticket.id"
          :ticket="ticket"
          :permissions="tech.permissions"
        >
          <template #clientName>{{ ticket.clientName }}</template>
          <template #description>{{ ticket.description }}</template>
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
import { onMounted, ref } from "vue";
import router from "../router";

const tickets = ref([]);
const total = ref(tickets.value.length);
const tech = ref({});

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}

onMounted(async () => {
  const res = await fetch(baseUrl + "/ticket/list", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await res.json();
  tickets.value = data.tickets;
  tech.value = data.tech;
});

function formatDate(date) {
  const newDate = new Date(date);
  const day = newDate.getUTCDate();
  const month = newDate.getUTCMonth();
  const year = newDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
</script>

<style scoped>
.home-main {
  display: flex;
}

.tickets-section {
  width: 100%;
  padding: 3rem;
  background: #121518;
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
  background: #1a1e22;
  border-radius: 1.2rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
