<template>
  <main class="account-container">
    <section class="navbar-section">
      <Navbar />
    </section>
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
        <div class="message" :class="messageClass">{{ message }}</div>
      </form>
    </section>
  </main>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import router from "@/router";
import { ref } from "vue";
import { baseUrl } from "../../conf";

const token = localStorage.getItem("token");
if (!token) {
  router.push("/");
}

const message = ref("");
const showMessage = ref(false);
const messageClass = ref("");

const techName = localStorage.getItem("techName");

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
    console.error(data);
    message.value = "Ocorreu um erro!";
    messageClass.value = "errorReplace";
  } else {
    message.value = "Senha alterada!";
    messageClass.value = "successReplace";
  }

  showMessage.value = true;
  setTimeout(() => {
    showMessage.value = false;
    message.value = "";
    messageClass.value = "";
  }, 1000 * 3);

  password.value = "";
  newPassword.value = "";
}
</script>

<style scoped>
.account-container {
  background: var(--medium-background);
  height: 100vh;
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

.message {
  width: 100%;
  padding: 0.8rem 2rem;
  text-align: center;
  border-radius: 1.2rem;
  color: var(--dark-background);
  font-weight: 600;
}

.successReplace {
  background: #4ed16b;
}

.errorReplace {
  background: #d34242;
}
</style>
