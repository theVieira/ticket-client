<template>
  <main class="create-tech-container">
    <form @submit.prevent="createTech">
      <div class="input-data">
        <label for="name">Nome</label>
        <input type="text" name="name" id="name" v-model="name" />
      </div>
      <div class="input-data">
        <label for="password">Senha</label>
        <input type="password" name="password" id="password" v-model="password" />
      </div>
      <div class="input-data">
        <label for="phone">Telefone</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          v-model="phone"
          placeholder="(00) 00000-0000"
        />
      </div>
      <div class="input-data">
        <label for="color">Cor</label>
        <input
          type="color"
          name="color"
          id="color"
          v-model="color"
          :style="{ background: color }"
        />
      </div>
      <div class="input-data">
        <label for="permissions">Permissões</label>
        <div class="option">
          <label for="admin">Administrador</label>
          <input type="checkbox" name="admin" id="admin" v-model="admin" />
        </div>
        <div class="option">
          <label for="create_ticket">Criar Ticket</label>
          <input
            type="checkbox"
            name="create_ticket"
            id="create_ticket"
            v-model="create_ticket"
          />
        </div>
        <div class="option">
          <label for="delete_ticket">
            <label for="delete_ticket">Deletar Ticket</label>
          </label>
          <input
            type="checkbox"
            name="delete_ticket"
            id="delete_ticket"
            v-model="delete_ticket"
          />
        </div>
      </div>
      <input type="submit" value="Criar Técnico" class="submit" />
    </form>
    <Popup v-if="popup" :msg="msg" :type="type" class="popup" />
  </main>
</template>

<script setup>
import { InitializeVars } from '@/assets/utils/InitializeVars'
import { ref } from 'vue'
import { baseUrl } from '../../../conf'
import { ShowPopup } from '@/assets/utils/ShowPopup'
import Popup from '@/components/Popup.vue'

const { token, popup, msg, type } = InitializeVars()

const name = ref('')
const password = ref('')
const phone = ref('')
const admin = ref(false)
const create_ticket = ref(false)
const delete_ticket = ref(false)
const color = ref('')

async function createTech() {
  const res = await fetch(baseUrl + '/tech/create', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.value,
      password: password.value,
      phone: phone.value.replace(/\D/g, ''),
      admin: admin.value,
      create_ticket: create_ticket.value,
      delete_ticket: delete_ticket.value,
      color: color.value,
    }),
  })

  const data = await res.json()

  if (res.status != 201) {
    console.error(data)
    ShowPopup(popup, msg, type, 'Ops! Ocorreu um erro!', 'error')
  } else {
    ShowPopup(popup, msg, type, 'Técnico criado com sucesso!', 'success')
  }

  name.value = ''
  password.value = ''
  phone.value = ''
  admin.value = false
  create_ticket.value = false
  delete_ticket.value = false
  color.value = ''
}
</script>

<style scoped>
.create-tech-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.create-tech-container form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: var(--medium-background);
  padding: 5rem;
  border-radius: 1.2rem;
}

.create-tech-container form .input-data {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  color: var(--light-color);
  font-weight: 600;
}

.create-tech-container form .input-data input {
  border-radius: 1.2rem;
  border: none;
  padding: 1rem 2rem;
  background: var(--dark-background);
  color: var(--light-color);
  width: 100%;
}

.create-tech-container form .input-data .option {
  display: flex;
  white-space: nowrap;
  font-size: 1.2rem;
  width: 60%;
  justify-content: space-between;
}

.create-tech-container form .input-data .option input {
  width: fit-content;
}

.create-tech-container form .submit {
  padding: 1rem 2rem;
  border-radius: 1.2rem;
  background: var(--dark-background);
  color: var(--light-color);
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.create-tech-container form .submit:hover {
  filter: brightness(120%);
}
</style>
