<template>
	<main class="create-client-container">
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
			<Popup v-if="popup" class="popup" :msg="msg" :type="type" />
		</section>
	</main>
</template>

<script setup>
import { InitializeVars } from '@/assets/utils/InitializeVars'
import { SetTitle } from '@/assets/utils/SetTitle'
import { baseUrl } from '../../../conf'
import Popup from '@/components/Popup.vue'
import { ref } from 'vue'
import { ShowPopup } from '@/assets/utils/ShowPopup'

const { popup, msg, type, token } = InitializeVars()

const name = ref('')

SetTitle('Criar Cliente')

async function createClient() {
	const res = await fetch(baseUrl + '/client/create', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			name: name.value,
		}),
	})

	const data = await res.json()

	name.value = ''

	if (res.status == 201) {
		ShowPopup(popup, msg, type, 'Cliente criado com sucesso!', 'success')
	} else {
		ShowPopup(popup, msg, type, 'Ops! Ocorreu algum erro!')
		console.error(data)
	}
}
</script>

<style scoped>
.create-client-container {
	height: 100%;
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
	box-shadow: inset 0 0 0.2rem white;
}

.create-client-form .form-data input[type='submit'] {
	font-weight: 600;
	width: 100%;
	cursor: pointer;
	transition: 0.3s;
}

.create-client-form .form-data input[type='submit']:hover {
	filter: brightness(130%);
}
</style>
