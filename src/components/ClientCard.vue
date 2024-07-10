<template>
  <div class="client-card">
    <img
      src="@/assets/icons/zoom.svg"
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
  </div>
</template>

<script setup>
import { ref } from "vue";

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
  background: var(--medium-background);
  padding: 5rem 3rem;
  border-radius: 1.2rem;
  position: relative;
}

.client-card h4 {
  text-align: center;
}

.info {
  text-align: center;
}

.zoom {
  position: absolute;
  filter: brightness(150%);
  top: 1rem;
  right: 1rem;
  cursor: pointer;
}
</style>
