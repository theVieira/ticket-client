<template>
	<main class="client-dashboard-container">
		<div class="dashboard" v-show="!showTickets">
			<div class="controls">
				<select name="option" id="option" v-model="option">
					<option value="date">Selecione a data</option>
					<option value="annual">Anual</option>
					<option value="client">Clientes</option>
				</select>

				<input
					type="date"
					name="start-date"
					id="start-date"
					v-if="option == 'date'"
					v-model="startDate"
				/>

				<input
					type="date"
					name="end-date"
					id="end-date"
					v-if="option == 'date'"
					v-model="endDate"
				/>
			</div>
			<canvas id="chart"></canvas>
		</div>
	</main>
</template>

<script setup>
import { FetchAPI } from '@/assets/utils/FetchAPI'
import { InitializeVars } from '@/assets/utils/InitializeVars'
import { animator, Chart } from 'chart.js/auto'
import { onMounted, ref, watch } from 'vue'
import FilterElement from './filter/filter-element'
import MapMonth from './mapper/map-month'
import FindIam from './filter/i-am'
import FilterAnnual from './filter/filter-annual'
import FilterDate from './filter/filter-date'
import FilterRange from './filter/filter-range'

const option = ref('client')
const showTickets = ref(false)
const startDate = ref()
const endDate = ref()

const { token, clients, popup, tickets, msg, type } = InitializeVars()

async function find() {
	const findTechs = await FetchAPI('/tech/list', token)
	const datasetData = FilterDate(findTechs, [startDate.value, endDate.value])
	return datasetData
}

onMounted(async () => {
	const ctx = document.querySelector('#chart')

	const res = await FetchAPI('/client/list', token)
	clients.value = res

	const datasetData = FilterElement(clients.value)

	const chart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ['Clientes'],
			datasets: datasetData,
		},
		options: {
			color: '#CECECE',
			animation: true,
			layout: {
				padding: 30,
			},
			plugins: {
				legend: {
					position: 'bottom',
				},
			},
			responsive: true,
			aspectRatio: 2 / 1.5,
			onClick: (ev) => {
				const name = FindIam(ev, datasetData, chart)
				tickets.value = datasetData.filter((el) => el.label == name)[0].tickets
				showTickets.value = true
			},
		},
	})

	watch(option, (val) => {
		switch (val) {
			case 'annual': {
				const datasetData = FilterAnnual(clients.value)
				chart.data.datasets = datasetData
				chart.data.labels = [
					'Janeiro',
					'Fevereiro',
					'Março',
					'Abril',
					'Maio',
					'Junho',
					'Julho',
					'Agosto',
					'Setembro',
					'Outubro',
					'Novembro',
					'Dezembro',
				]
				chart.update()
				break
			}

			case 'date': {
				watch([startDate, endDate], async () => {
					const datasetData = await FilterRange('/client/list', token, [
						startDate.value,
						endDate.value,
					])
					chart.data.datasets = datasetData
					chart.data.labels = [`${startDate.value} até ${endDate.value}`]
					chart.options.onClick = (ev) => {
						const name = FindIam(ev, datasetData, chart)
						tickets.value = datasetData.filter((el) => el.label == name)[0].tickets
						console.log(tickets.value)
					}
					chart.update()
				})
				break
			}

			case 'client': {
				const datasetData = FilterElement(clients.value)
				chart.data.datasets = datasetData
				chart.data.labels = ['Clientes']
				chart.update()
				break
			}
		}
	})
})
</script>

<style scoped>
.client-dashboard-container {
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.dashboard {
	max-width: 90%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4rem;
}

.controls {
	display: flex;
	gap: 2rem;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
}

.controls select,
input[type='date'] {
	padding: 1rem 2rem;
	background: var(--medium-background);
	color: var(--light-color);
	border-radius: 1.2rem;
	border: 1px solid var(--light-color);
}
</style>
