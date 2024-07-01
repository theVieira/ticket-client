<template>
  <img
    src="../assets/icons/menu.svg"
    alt="menu icon"
    class="menu"
    @click="showMenu"
  />
  <nav class="navbar-container">
    <div class="lists">
      <div class="list" @click="listIndex[0] = !listIndex[0]">
        <h2 class="hover">Chamados</h2>
        <ul v-show="listIndex[0]">
          <li class="hover">
            <RouterLink to="/home" class="link">Abertos</RouterLink>
          </li>
          <li class="hover" v-if="props.admin == 'true'">
            <RouterLink to="/finisheds" class="link">Finalizados</RouterLink>
          </li>
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
      <div
        class="list"
        @click="listIndex[2] = !listIndex[2]"
        v-if="props.admin == 'true'"
      >
        <h2 class="hover">Clientes</h2>
        <ul v-if="listIndex[2]">
          <li class="hover">Todos</li>
          <li class="hover">
            <RouterLink to="/create/client" class="link">Criar</RouterLink>
          </li>
        </ul>
      </div>
    </div>
    <div class="techControl">
      <p class="tech-name" :style="{ color: techColor }">
        {{ props.techName.toUpperCase() }}
      </p>
      <p class="quit" @click="quit">Sair</p>
    </div>
  </nav>
</template>

<script setup>
import router from "@/router";
import { ref, defineProps } from "vue";

const listIndex = ref([false, false, false]);

const techColor = localStorage.getItem("color");

const props = defineProps({
  techName: String,
  admin: String,
  create_ticket: String,
});

function quit() {
  localStorage.clear();
  router.push("/");
}

function showMenu() {
  const navbar = document.querySelector(".navbar-container");
  let display = navbar.style.display;

  if (display == "") {
    navbar.style.display = "flex";
    display = "flex";
  } else if (display == "flex") {
    navbar.style.display = "none";
    display = "none";
  } else {
    navbar.style.display = "flex";
    display = "flex";
  }
}
</script>

<style scoped>
.navbar-container {
  width: fit-content;
  height: 100%;
  padding: 3rem 2rem;
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

.techControl {
  font-size: 2rem;
}

.quit {
  color: #ca3838c0;
  text-align: center;
  font-weight: 600;
  cursor: pointer;
  padding: 1rem;
}

.menu {
  display: none;
  position: absolute;
  right: 0;
  top: 1rem;
}

@media (max-width: 800px) {
  .navbar-container {
    display: none;
  }
  .menu {
    display: block;
  }
}
</style>
