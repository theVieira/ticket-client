<template>
  <div class="login-container">
    <form action="post" @submit.prevent="login">
      <h1>LOGIN</h1>
      <input
        type="text"
        name="name"
        id="name"
        maxlength="50"
        placeholder="Digite seu nome"
        v-model="name"
        class="form-input"
      />
      <input
        type="password"
        name="password"
        id="password"
        maxlength="50"
        placeholder="Digite sua senha"
        v-model="password"
        class="form-input"
      />
      <input type="submit" value="Entrar" />
    </form>
    <Popup class="popup" v-if="popup">
      <template #msg="">{{ msg }}</template>
      <template #type="">{{ type }}</template>
    </Popup>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getCurrentInstance } from "vue";
import { baseUrl } from "../../../conf";
import Popup from "../Popup.vue";

const instance = getCurrentInstance();
const tech = ref(instance.appContext.config.globalProperties.$tech);

const name = ref("");
const password = ref("");

const msg = ref("");
const type = ref("");

const popup = ref(false);

async function login() {
  const res = await fetch(baseUrl + "/tech/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name.value,
      password: password.value,
    }),
  });

  name.value = "";
  password.value = "";

  const data = await res.json();

  popup.value = true;
  setTimeout(() => {
    popup.value = false;
  }, 1000 * 3);

  if (res.status === 200) {
    type.value = "success";
    msg.value = "Logado com sucesso";

    localStorage.setItem("token", data.token);

    tech.value = data;

    /* router.push("/home"); */
  } else {
    type.value = "error";
    msg.value = "Ops! algo deu errado";
    console.error(data);

    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.style.border = "2px solid #d34242";
      setTimeout(() => {
        input.style.border = "";
      }, 1000 * 3);
    });
  }
}
</script>

<style scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--dark-background);
  color: var(--light-color);
}

.login-container form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  padding: 5rem;
  border-radius: 1.2rem;
  background: rgb(90, 88, 230);
}

.login-container form input {
  border: none;
  border-radius: 1.2rem;
  padding: 1rem 2rem;
  background: var(--light-color);
}

.login-container form input[type="submit"] {
  font-weight: 600;
  width: 100%;
  background: rgba(86, 92, 179, 0.667);
  color: var(--light-color);
  font-size: 1.5rem;
  cursor: pointer;
  filter: brightness(85%);
  transition: 0.3s;
}

.login-container form input[type="submit"]:hover {
  filter: brightness(100%);
}

.popup {
  position: absolute;
  top: 3rem;
}
</style>
