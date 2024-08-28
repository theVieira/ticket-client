<template>
	<main class="dashboard-container">
		<div class="dataContainer">
			<select name="dashOption" id="dashOption" v-model="dashOption">
				<option value="date">{{ dateInput }}</option>
				<option value="now">Finalizados Hoje</option>
				<option value="current" selected>Últimos 30 dias</option>
				<option value="anual">Anual</option>
				<option value="tech">Técnico</option>
			</select>

			<input
				type="date"
				name="dataInput"
				class="dataInput"
				v-if="dashOption == 'date'"
				v-model="date"
			/>

			<input
				type="button"
				value="Buscar"
				class="dataInput"
				id="findByDateBtn"
				v-if="dashOption == 'date'"
			/>
		</div>

		<canvas id="chart"></canvas>
	</main>
</template>

<script setup>
import { FetchAPI } from '@/assets/utils/FetchAPI'
import { InitializeVars } from '@/assets/utils/InitializeVars'
import Chart from 'chart.js/auto'
import { onMounted, ref, watch } from 'vue'

const dashOption = ref('current')
const dateInput = ref('Selecione a data')
const date = ref('')

function mapMonth(month) {
	switch (month) {
		case 0:
			return 'Janeiro'
		case 1:
			return 'Fevereiro'
		case 2:
			return 'Março'
		case 3:
			return 'Abril'
		case 4:
			return 'Maio'
		case 5:
			return 'Junho'
		case 6:
			return 'Julho'
		case 7:
			return 'Agosto'
		case 8:
			return 'Setembro'
		case 9:
			return 'Outubro'
		case 10:
			return 'Novembro'
		case 11:
			return 'Dezembro'
	}
}

const { token } = InitializeVars()

onMounted(async () => {
	const res = await FetchAPI('/tech/list', token)
	const ctx = document.querySelector('#chart')

	const current = res.map((tech) => {
		const now = new Date()
		const tickets = tech.tickets.map((ticket) => {
			const ticketDate = new Date(ticket.createdAt)

			if (ticketDate.getUTCDate() > now.getUTCDate() - 30) {
				return ticket
			} else {
				return
			}
		})

		tech.tickets = tickets
		return tech
	})

	const datasetData = current.map((el) => {
		const data = new Array()
		data.push(el.tickets.length)

		const obj = new Object({
			label: el.name,
			data,
			borderWidth: 1,
			backgroundColor: el.color,
		})

		return obj
	})

	const chart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: [mapMonth(new Date().getMonth())],
			datasets: datasetData,
		},
		options: {
			animation: true,
			scales: {
				y: {
					beginAtZero: true,
				},
			},
		},
	})

	watch(dashOption, () => {
		if (dashOption.value == 'date') {
			document.querySelector('#findByDateBtn').addEventListener('click', (ev) => {
				const selectedDate = new Date(date.value)
				const selectedCompare = `${selectedDate.getDate() + 1}-${(
					selectedDate.getMonth() + 1
				)
					.toString()
					.padStart(2, '0')}-${selectedDate.getFullYear()}`

				const datasetData = res.map((tech) => {
					const filterTickets = tech.tickets.filter((ticket) => {
						const ticketDate = new Date(ticket.finished)
						const ticketCompare = `${ticketDate.getDate()}-${(
							ticketDate.getMonth() + 1
						)
							.toString()
							.padStart(2, '0')}-${ticketDate.getFullYear()}`

						if (ticketCompare == selectedCompare) {
							return ticket
						}
					})

					return new Object({
						label: tech.name,
						borderWidth: 1,
						backgroundColor: tech.color,
						data: [filterTickets.length],
					})
				})

				chart.data.datasets = datasetData
				chart.data.labels = [selectedCompare]
				chart.update()
			})
		}
		if (dashOption.value == 'now') {
			const datasetData = current.map((tech) => {
				const filterNowTickets = tech.tickets.filter((ticket) => {
					const ticketDate = `${new Date(
						ticket.finished
					).getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
					const now = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`

					if (now == ticketDate) {
						return ticket
					}
				})

				return new Object({
					label: tech.name,
					borderWidth: 1,
					backgroundColor: tech.color,
					data: [filterNowTickets.length],
				})
			})

			chart.data.datasets = datasetData
			chart.data.labels = [
				`Dia ${new Date().getDate()} de ${mapMonth(new Date().getUTCMonth())}`,
			]
			chart.update()
		}
		if (dashOption.value == 'current') {
			const datasetData = current.map((el) => {
				const data = new Array()
				data.push(el.tickets.length)

				const obj = new Object({
					label: el.name,
					data,
					borderWidth: 1,
					backgroundColor: el.color,
				})

				return obj
			})

			chart.data.labels = [mapMonth(new Date().getMonth())]
			chart.data.datasets = datasetData
			chart.update()
		}

		if (dashOption.value == 'anual') {
			const datasetData = res.map((tech) => {
				const months = [[], [], [], [], [], [], [], [], [], [], [], []]

				const newTech = new Object({
					label: tech.name,
					data: months,
					borderWidth: 1,
					backgroundColor: tech.color,
				})

				tech.tickets.forEach((ticket) => {
					const ticketDate = new Date(ticket.createdAt).getUTCMonth()
					newTech.data[ticketDate]++
				})

				return newTech
			})

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

			chart.data.datasets = datasetData
			chart.update()
		}

		if (dashOption.value == 'tech') {
			const datasetData = res.map((tech) => {
				return new Object({
					label: tech.name,
					data: [tech.tickets.length],
					borderWidth: 1,
					backgroundColor: tech.color,
				})
			})

			chart.data.labels = ['Técnicos']
			chart.data.datasets = datasetData

			chart.update()
		}
	})
})
</script>

<style scoped>
.dashboard-container {
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: 5rem;
}

#dashOption {
	background: var(--medium-background);
	color: var(--light-color);
	padding: 1rem 2rem;
	border-radius: 1.2rem;
}

.dataContainer {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	margin-bottom: 2rem;
}

.dataInput {
	border-radius: 1.2rem;
	padding: 1rem 2rem;
	background: var(--medium-background);
	color: var(--light-color);
	border: none;
	cursor: pointer;
}
</style>
