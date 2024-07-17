<template>
  <main class="create-ticket-container">
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
            <option value="medium">NORMAL</option>
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
      <Popup class="popup" v-if="popup" :msg="msg" :type="type" />
    </section>
  </main>
</template>

<script setup>
import Popup from "@/components/Popup.vue";
import { onBeforeMount, ref } from "vue";
import { baseUrl } from "@/../conf.js";
import { InitializeVars } from "@/assets/utils/InitializeVars";
import { SetTitle } from "@/assets/utils/SetTitle";
import { ShowPopup } from "@/assets/utils/ShowPopup";

const { popup, clientName, msg, type, token, clients } = InitializeVars();

const priority = ref("");
const category = ref("");
const description = ref("");

SetTitle("Criar Ticket");

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

  if (res.status == 201) {
    ShowPopup(popup, msg, type, "Ticket criado com sucesso", "success");
  } else {
    ShowPopup(popup, msg, type, "Ops! Ocorreu algum erro!", "error");
    console.error(data);
  }
}
</script>

<style scoped>
.create-ticket-container {
  height: 100vh;
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
