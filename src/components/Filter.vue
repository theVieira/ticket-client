<template>
	<div class="filter">
		<div class="filter-input">
			<input
				type="text"
				name="find"
				id="find"
				class="search"
				placeholder="Buscar por cliente"
				v-model="clientName"
			/>
		</div>
		<div class="filter-input">
			<select name="order" id="order" v-model="order" class="search">
				<option value="all" selected>Todos</option>
				<option value="daily">Diários</option>
				<option value="delivery">Entregas</option>
				<option value="budget">Orçamentos</option>
			</select>
			<input type="button" value="Buscar" class="search" @click.prevent="search" />
		</div>
	</div>
</template>

<script setup>
import { FetchAPI } from '@/assets/utils/FetchAPI'
import { InitializeVars } from '@/assets/utils/InitializeVars'

const { order, clientName, token } = InitializeVars()

const emit = defineEmits(['search'])

const props = defineProps({
	url: String,
})

addEventListener('keydown', (ev) => {
	if (ev.key == 'Enter') {
		search()
	}
})

async function search() {
	const res = await FetchAPI(`/ticket/list${props.url}/${order.value}`, token)
	const data = res.filter((ticket) =>
		ticket.clientName.toLowerCase().includes(clientName.value.toLowerCase())
	)

	clientName.value = ''

	emit('search', { data })
}
</script>

<style scoped>
.filter {
	display: flex;
	flex-wrap: wrap;
}

.filter .filter-input {
	display: flex;
	gap: 4rem;
	height: 4rem;
}

.filter .search {
	padding: 0 2rem;
	border-radius: 1.2rem;
	border: none;
	box-shadow: inset 0 0 0.2rem white;
	background: var(--dark-background);
	color: var(--light-color);
	font-weight: 600;
	cursor: pointer;
	transition: 0.3s;
}

#find {
	width: 90%;
}

.filter .search:hover {
	filter: brightness(120%);
}

select {
	background: var(--dark-background);
	border: none;
	border-radius: 1.2rem;
	padding: 1rem 2rem;
	color: var(--light-color);
	font-weight: 600;
}

@media (max-width: 900px) {
	.filter {
		gap: 1rem;
	}

	.filter .filter-input {
		gap: 1rem;
	}
}
</style>
