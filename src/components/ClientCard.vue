<template>
  <div class="client-card">
    <img
      src="@/assets/icons/zoom.png"
      alt="zoom icon"
      class="zoom"
      @click="openInfo"
    />
    <h4>
      {{ props.name.toUpperCase() }}
    </h4>
    <div class="info">
      <p>
        <strong>Chamados: {{ props.tickets.length }}</strong>
      </p>
    </div>
    <div
      class="client-info"
      v-show="showInfo"
      v-for="ticket in props.tickets"
      :key="ticket.id"
    >
      <div class="info">
        <p class="top">Descrição</p>
        <p>{{ ticket.description }}</p>
      </div>
      <div class="info">
        <div class="top">Status</div>
        <p>{{ ticket.status }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";

const showInfo = ref(false);

const props = defineProps({
  name: String,
  tickets: {},
});

function openInfo() {
  showInfo.value = !showInfo.value;
}
</script>

<style scoped>
.client-card {
  width: 20rem;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: var(--light-background);
  padding: 5rem 3rem;
  border-radius: 1.2rem;
  position: relative;
}

.client-card h4 {
  text-align: center;
}

.client-info {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
  color: var(--light-color);
  background: rgb(41, 41, 41);
  border-radius: 1.2rem;
  display: flex;
}

.client-info .info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.client-info .info .top {
  font-weight: 600;
}

.zoom {
  position: absolute;
  filter: brightness(150%);
  top: 1rem;
  right: 1rem;
  cursor: pointer;
}
</style>
