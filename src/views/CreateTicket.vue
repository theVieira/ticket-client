<template>
  <Navbar :tech="tech" />
  <form @click.prevent="createTicket"></form>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import { onBeforeMount, ref } from "vue";
import { baseUrl } from "../../conf";
import router from "@/router";

const clients = ref();
const tech = ref();

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}

onBeforeMount(async () => {
  const res = await fetch(baseUrl + "/tech/list", {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  tech.value = data.tech;
  clients.value = data.clients;
});

async function createTicket() {
  const res = await fetch(baseUrl + "/ticket/create", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      clientName,
    }),
  });

  const data = await res.json();
  console.log(data);
}
</script>
