<template>
  <main class="create-client-container">
    <Navbar />
    <section class="form-section">
      <form action="" class="create-client-form" @submit.prevent="createClient">
        <div class="form-data">
          <label for="name">Nome</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Insira o nome do cliente"
            v-model="name"
          />
        </div>
        <div class="form-data">
          <input type="submit" value="Salvar" />
        </div>
      </form>
      <Popup v-if="popup" class="popup">
        <template #msg>{{ msg }}</template>
        <template #type>{{ type }}</template>
      </Popup>
    </section>
  </main>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Popup from "@/components/Popup.vue";
import router from "@/router/index.js";
import { baseUrl } from "@/../conf.js";
import { onMounted, ref } from "vue";

const popup = ref(false);
const msg = ref("");
const type = ref("");

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}

const name = ref("");

onMounted(() => {
  document.title = "Criar Cliente";
});

async function createClient() {
  const res = await fetch(baseUrl + "/client/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name.value,
    }),
  });

  const data = await res.json();

  name.value = "";

  if (res.status == 201) {
    msg.value = "Cliente criado com sucesso";
    type.value = "success";
  } else {
    msg.value = "Ops! ocorreu algum erro.";
    type.value = "error";
    console.error(data);
  }

  popup.value = true;
  setTimeout(() => {
    popup.value = false;
    msg.value = "";
    type.value = "";
  }, 1000 * 3);
}
</script>

<style scoped>
.create-client-container {
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: var(--medium-background);
  display: flex;
}

.form-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
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

.popup {
  position: absolute;
  top: 3rem;
}
</style>
