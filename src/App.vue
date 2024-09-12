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
import Navbar from '@/components/Navbar.vue'
import { InitializeVars } from './assets/utils/InitializeVars'
import router from './router'

const { expires } = InitializeVars()

if (!expires || expires < Date.now() - 1000 * 60 * 60 * 12) {
	localStorage.clear()
	router.push('/')
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
}

.app-section {
  width: 100%;
  min-height: 100%;
  background: var(--light-background);
}

.navbar-section {
  z-index: 10;
}
</style>
