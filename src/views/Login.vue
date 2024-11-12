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
		<Popup class="popup" v-if="popup" :msg="msg" :type="type" />
	</div>
</template>

<script setup>
import Popup from '../components/Popup.vue'
import { onBeforeMount, ref } from 'vue'
import { baseUrl } from '../../conf'
import { SetTitle } from '@/assets/utils/SetTitle'
import { InitializeVars } from '@/assets/utils/InitializeVars'
import { ShowPopup } from '@/assets/utils/ShowPopup'
import router from '@/router'

SetTitle('Login')

const { msg, type, popup } = InitializeVars()

const name = ref('')
const password = ref('')

onBeforeMount(() => {
	const token = localStorage.getItem('token')
	const expires = localStorage.getItem('expiresToken')

	if (expires < Date.now() - 1000 * 60 * 60 * 12 && token) {
		router.push('/home')
	} else {
		localStorage.clear()
		router.push('/')
	}
})

async function login() {
	const res = await fetch(baseUrl + '/tech/auth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: name.value,
			password: password.value,
		}),
	})

	name.value = ''
	password.value = ''

	const data = await res.json()

	popup.value = true
	setTimeout(() => {
		popup.value = false
	}, 1000 * 3)

	if (res.status === 200) {
		ShowPopup(popup, msg, type, 'Logado com sucesso', 'success')

		localStorage.setItem('token', data.token)
		localStorage.setItem('techName', data.name)
		localStorage.setItem('admin', data.admin)
		localStorage.setItem('create_ticket', data.create_ticket)
		localStorage.setItem('delete_ticket', data.delete_ticket)
		localStorage.setItem('color', data.color)
		localStorage.setItem('expiresToken', Date.now())
		router.push('/home')
	} else {
		ShowPopup(popup, msg, type, 'Ops! Ocorreu algum erro!', 'error')

		console.error(data)

		const inputs = document.querySelectorAll('.form-input')
		inputs.forEach((input) => {
			input.style.border = '2px solid #d34242'
			setTimeout(() => {
				input.style.border = ''
			}, 1000 * 3)
		})
	}
	const token = localStorage.getItem('token')
	if (token) {
		router.push('/home')
	}
}
</script>

<style scoped>
h1 {
	font-weight: bold;
}

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
	justify-content: center;
	gap: 2rem;
	padding: 5rem;
	border-radius: 1.2rem;
}

.login-container form h1 {
	font-family: 'abode';
	margin-bottom: 2rem;
	font-size: 8rem;
}

.login-container form input {
	border: none;
	border-radius: 1.2rem;
	padding: 1rem 2rem;
	background: var(--light-color);
}

.login-container form input[type='submit'] {
	font-weight: 600;
	width: 100%;
	background: #4044ed;
	color: var(--light-color);
	font-size: 1.5rem;
	cursor: pointer;
	filter: brightness(85%);
	transition: 0.3s;
}

.login-container form input[type='submit']:hover {
	filter: brightness(100%);
}

.popup {
	position: absolute;
	top: 3rem;
}
</style>
