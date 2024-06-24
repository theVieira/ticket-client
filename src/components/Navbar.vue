<template>
  <nav class="navbar-container">
    <div class="lists">
      <div class="list" @click="listIndex[0] = !listIndex[0]">
        <h2 class="hover">Chamados</h2>
        <ul v-show="listIndex[0]">
          <li class="hover">Todos</li>
          <li class="hover">Abertos</li>
          <li class="hover">Criar</li>
        </ul>
      </div>
      <div class="list" @click="listIndex[1] = !listIndex[1]">
        <h2 class="hover">Técnicos</h2>
        <ul v-if="listIndex[1]">
          <li class="hover">Criar</li>
          <li class="hover">Ver Relatório</li>
          <li class="hover">Gerenciar</li>
        </ul>
      </div>
      <div class="list" @click="listIndex[2] = !listIndex[2]">
        <h2 class="hover">Clientes</h2>
        <ul v-if="listIndex[2]">
          <li class="hover">Todos</li>
          <li class="hover">Criar</li>
        </ul>
      </div>
    </div>
    <p class="tech-name">
      {{ techName }}
    </p>
  </nav>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
const listIndex = ref([false, false, false]);

const instance = getCurrentInstance();
const tech = instance.appContext.config.globalProperties.$tech;

const techName = tech.name.toUpperCase();
</script>

<style scoped>
.navbar-container {
  width: fit-content;
  height: 100vh;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--dark-background);
  color: var(--light-color);
}

.navbar-container .lists {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: end;
}

.navbar-container .list {
  cursor: pointer;
  transition: 2s;
}

.navbar-container .list ul {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.hover:hover {
  filter: brightness(130%);
  transition: 0.3s;
  color: #fafafa;
}

.navbar-container .tech-name {
  font-weight: 600;
  text-align: center;
}
</style>
