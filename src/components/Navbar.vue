<template>
  <nav class="navbar-container">
    <div class="lists">
      <div class="list" @click="listIndex[0] = !listIndex[0]">
        <h2 class="hover">Chamados</h2>
        <ul v-show="listIndex[0]">
          <li class="hover">
            <RouterLink to="/home" class="link">Abertos</RouterLink>
          </li>
          <li class="hover" v-if="props.admin == 'true'">Finalizados</li>
          <li class="hover" v-if="props.admin == 'true'">
            <RouterLink to="/create/ticket" class="link">Criar</RouterLink>
          </li>
        </ul>
      </div>
      <div class="list" @click="listIndex[1] = !listIndex[1]">
        <h2 class="hover">Técnicos</h2>
        <ul v-if="listIndex[1]">
          <li class="hover" v-if="props.admin == 'true'">Criar</li>
          <li class="hover">Seus chamados</li>
          <li class="hover" v-if="props.admin == 'true'">Ver Relatório</li>
          <li class="hover" v-if="props.admin == 'true'">Gerenciar</li>
        </ul>
      </div>
      <div class="list" @click="listIndex[2] = !listIndex[2]">
        <h2 class="hover">Clientes</h2>
        <ul v-if="listIndex[2]">
          <li class="hover">Todos</li>
          <li class="hover" v-if="props.admin">
            <RouterLink to="/create/client" class="link">Criar</RouterLink>
          </li>
        </ul>
      </div>
    </div>
    <p class="tech-name">{{ props.techName.toUpperCase() }}</p>
  </nav>
</template>

<script setup>
import { ref, defineProps } from "vue";
const listIndex = ref([false, false, false]);

const props = defineProps({
  techName: String,
  admin: String,
  create_ticket: String,
});
</script>

<style scoped>
.navbar-container {
  width: fit-content;
  height: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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

.link {
  color: var(--light-color);
}
</style>
