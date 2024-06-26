<template>
  <main class="create-client-container">
    <Navbar :admin="admin" :techName="techName" />
    <section class="form-section">
      <form action="" class="create-client-form" @submit="createClient">
        <div class="form-data">
          <label for="name">Nome</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Insira o nome do cliente"
          />
        </div>
        <div class="form-data">
          <input type="submit" value="Salvar" />
        </div>
      </form>
    </section>
  </main>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";

const token = localStorage.getItem("token");
const admin = localStorage.getItem("admin");
const techName = localStorage.getItem("techName");
</script>

<style scoped>
.create-client-container {
  width: 100%;
  height: 100vh;
  background: var(--medium-background);
  display: flex;
}

.form-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-client-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--dark-background);
  padding: 3rem;
  border-radius: 1.2rem;
  color: var(--light-color);
  font-weight: 600;
  gap: 2rem;
}

.create-client-form .form-data {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  width: 100%;
}

.create-client-form .form-data input {
  padding: 1rem 2rem;
  border-radius: 1.2rem;
  border: none;
  background: var(--medium-background);
  color: var(--light-color);
}

.create-client-form .form-data input[type="submit"] {
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  transition: 0.3s;
}

.create-client-form .form-data input[type="submit"]:hover {
  filter: brightness(130%);
}
</style>
