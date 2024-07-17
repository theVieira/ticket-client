<template>
  <main class="account-container">
    <section class="settings-container">
      <form class="form-account" @submit.prevent="replacePassword">
        <h3>Trocar senha</h3>
        <div class="input-form">
          <label for="password">Senha atual</label>
          <input
            type="password"
            name="password"
            id="password"
            v-model="password"
          />
        </div>
        <div class="input-form">
          <label for="newPassword">Nova senha</label>
          <input
            type="password"
            name="password"
            id="newPassword"
            v-model="newPassword"
          />
        </div>
        <div class="input-form">
          <input type="submit" value="Alterar senha" />
        </div>
        <Popup v-if="popup" class="popup" :msg="msg" :type="type" />
      </form>
    </section>
  </main>
</template>

<script setup>
import { InitializeVars } from "@/assets/utils/InitializeVars";
import { SetTitle } from "@/assets/utils/SetTitle";
import { baseUrl } from "../../../conf";
import { ref } from "vue";
import Popup from "@/components/Popup.vue";
import { ShowPopup } from "@/assets/utils/ShowPopup";

SetTitle("Sua Conta");
const { msg, type, popup, token, techName } = InitializeVars();

const password = ref("");
const newPassword = ref("");

async function replacePassword() {
  const res = await fetch(baseUrl + "/tech/replacePassword", {
    method: "PUT",
    headers: {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: techName,
      password: password.value,
      newPassword: newPassword.value,
    }),
  });

  const data = await res.json();

  if (res.status != 200) {
    ShowPopup(popup, msg, type, "Ops! Ocorreu algum erro!", "error");
    console.error(data);
  } else {
    ShowPopup(popup, msg, type, "Senha alterada com sucesso!", "success");
  }

  password.value = "";
  newPassword.value = "";
}
</script>

<style scoped>
.account-container {
  min-height: 100vh;
  height: 100%;
  display: flex;
}

.settings-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-account {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  background: var(--medium-background);
  padding: 3rem;
  border-radius: 1.2rem;
  color: var(--light-color);
}

.input-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.input-form input {
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 1.2rem;
  background: var(--light-background);
  color: var(--light-color);
}

.input-form input[type="submit"] {
  padding: 1rem 2rem;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.input-form input[type="submit"]:hover {
  filter: brightness(120%);
}
</style>
