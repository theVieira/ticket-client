<template>
  <div class="popup-container">
    <span class="type" v-show="false"><slot name="type"></slot></span>
    <p>
      <slot name="msg"></slot>
    </p>
  </div>
</template>

<style scoped>
.pop-up-container {
  width: fit-content;
  height: fit-content;
  padding: 2rem 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const popup = document.querySelector(".popup-container");
  const type = document.querySelector(".type");

  if (type.textContent === "error") {
    popup.style.background = "#d34242";
  } else if (type.textContent === "success") {
    popup.style.background = "#4ed16b";
  } else {
  }
});
</script>

<style scoped>
.popup-container {
  padding: 1rem 3rem;
  border-radius: 1.2rem;
  font-weight: 600;
  color: var(--dark-background);
}
</style>
