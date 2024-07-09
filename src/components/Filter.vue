<template>
  <div class="filter">
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
</template>

<script setup>
import { ref, defineEmits } from "vue";

const order = ref("all");
const emit = defineEmits(["search"]);

function search() {
  emit("search", { order: order.value });
}
</script>

<style scoped>
.filter {
  display: flex;
  gap: 2rem;
  width: fit-content;
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
