<template>
  <main class="app-container">
    <section class="navbar-section" v-if="$route.path != '/'">
      <Navbar />
    </section>
    <section class="app-section">
      <RouterView />
    </section>
  </main>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  min-width: 100vw;
  width: 100%;
  display: flex;
}

.app-section {
  width: 100%;
}
</style>
