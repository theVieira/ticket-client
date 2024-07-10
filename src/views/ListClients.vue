<template>
  <main class="list-clients-container">
    <section class="navbar-section">
      <Navbar />
    </section>
    <section class="list-clients-section">
      <ClientCard
        v-for="client in clients"
        :key="client.id"
        :name="client.name"
        :tickets="client.tickets"
      />
    </section>
  </main>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import ClientCard from "@/components/ClientCard.vue";
import { onBeforeMount, ref } from "vue";
import { baseUrl } from "../../conf";

const token = localStorage.getItem("token");

const clients = ref();

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
</style>
