<template>
  <div class="filter">
    <div class="filter-input">
      <input
        type="text"
        name="find"
        id="find"
        class="search"
        placeholder="Buscar por cliente"
        v-model="nameFind"
      />
      <input type="button" value="Buscar" class="search" @click="findClient" />
    </div>
    <div class="filter-input">
      <select name="order" id="order" v-model="order">
        <option value="all" selected>Todos</option>
        <option value="daily">Diários</option>
        <option value="delivery">Entregas</option>
        <option value="budget">Orçamentos</option>
      </select>
      <input
        type="button"
        value="Buscar"
        class="search"
        @click.prevent="search"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const nameFind = ref("");

const order = ref("all");
const emit = defineEmits(["search", "findClient"]);

function search() {
  emit("search", { order: order.value });
  order.value = "all";
}

function findClient() {
  emit("findClient", { name: nameFind.value, order: order.value });
  nameFind.value = "";
}
</script>

<style scoped>
.filter {
  display: flex;
  gap: 3rem;
  height: max-content;
  width: fit-content;
  flex-wrap: wrap;
}

.filter .filter-input {
  display: flex;
  gap: 1rem;
  height: 4rem;
}

.filter .search {
  padding: 0 2rem;
  border-radius: 1.2rem;
  border: none;
  background: var(--dark-background);
  color: var(--light-color);
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

#find {
  width: 90%;
}

.filter .search:hover {
  filter: brightness(120%);
}

select {
  background: var(--dark-background);
  border: none;
  border-radius: 1.2rem;
  padding: 1rem 2rem;
  color: var(--light-color);
  font-weight: 600;
}
</style>
