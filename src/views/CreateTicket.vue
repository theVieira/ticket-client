<template>
  <main class="create-ticket-container">
    <section class="navbar-section">
      <Navbar />
    </section>
    <section class="form-section">
      <form class="form">
        <div class="form-data">
          <label for="clientName">Cliente</label>
          <select name="clientName" id="clientName" v-model="clientName">
            <option value="" selected disabled>Selecione</option>
            <option
              v-for="client in clients"
              :key="client.id"
              :value="client.name"
            >
              {{ client.name.toUpperCase() }}
            </option>
          </select>
        </div>
        <div class="form-data">
          <label for="priority">Prioridade</label>
          <select name="priority" id="priority" v-model="priority">
            <option value="" selected disabled>Selecione</option>
            <option value="urgent">URGENTE</option>
            <option value="high">ALTA</option>
            <option value="medium">MÉDIA</option>
            <option value="low">BAIXA</option>
          </select>
        </div>
        <div class="form-data">
          <label for="category">Categoria</label>
          <select name="category" id="category" v-model="category">
            <option value="" selected disabled>Selecione</option>
            <option value="daily">Diário</option>
            <option value="delivery">Entrega</option>
            <option value="budget">Orçamento</option>
          </select>
        </div>
        <div class="form-data">
          <label for="description">Descrição</label>
          <textarea
            name="description"
            id="description"
            cols="30"
            rows="10"
            v-model="description"
          ></textarea>
        </div>
        <input
          type="submit"
          value="Salvar"
          class="submit"
          @click.prevent="createTicket"
        />
      </form>
      <Popup class="popup" v-if="popup">
        <template #msg>{{ msg }}</template>
        <template #type>{{ type }}</template>
      </Popup>
    </section>
  </main>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Popup from "@/components/Popup.vue";
import router from "@/router";
import { onBeforeMount, ref, onMounted } from "vue";
import { baseUrl } from "@/../conf.js";

const popup = ref(false);

const clientName = ref("");
const priority = ref("");
const category = ref("");
const description = ref("");

const msg = ref("Ticket criado com sucesso!");
const type = ref("success");

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}

const clients = ref();

onMounted(() => {
  document.title = "Criar Ticket";
});

onBeforeMount(async () => {
  const res = await fetch(baseUrl + "/client/list", {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();
  clients.value = data;
});

async function createTicket() {
  const res = await fetch(baseUrl + "/ticket/create", {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      clientName: clientName.value,
      description: description.value,
      priority: priority.value,
      category: category.value,
    }),
  });

  clientName.value = "";
  priority.value = "";
  description.value = "";
  category.value = "";

  const data = await res.json();

  popup.value = true;
  if (res.status == 201) {
    msg.value = "Ticket criado com sucesso!";
    type.value = "success";
  } else {
    msg.value = "Ops! algo deu errado.";
    type.value = "error";
    console.error(data);
  }

  setTimeout(() => {
    popup.value = false;
  }, 1000 * 3);
}
</script>

<style scoped>
.create-ticket-container {
  width: 100%;
  height: 100vh;
  background: var(--light-background);
  display: flex;
}

.form-section {
  padding: 3rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form {
  background: var(--medium-background);
  padding: 3rem;
  border-radius: 1.2rem;
  color: var(--light-color);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-data {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-weight: 600;
}

.form-data select {
  border: 1px solid var(--light-color);
  border-radius: 1.2rem;
  padding: 0.5rem 1rem;
  background: var(--medium-background);
  color: var(--light-color);
}

.form-data textarea {
  border-radius: 1.2rem;
  padding: 1rem;
  background: var(--medium-background);
  color: var(--light-color);
}

.form-section input[type="submit"] {
  border-radius: 1.2rem;
  border: none;
  padding: 1.2rem 2rem;
  background: var(--dark-background);
  color: var(--light-color);
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.form-section input[type="submit"]:hover {
  filter: brightness(140%);
}

.popup {
  position: absolute;
  top: 3rem;
}
</style>
