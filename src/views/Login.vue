<template>
  <Login />
</template>

<script setup>
import { onMounted } from "vue";
import Login from "../pages/Login.vue";

onMounted(() => {
  document.title = "Login";
});
</script>
