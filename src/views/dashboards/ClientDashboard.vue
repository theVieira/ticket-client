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
		<div class="tickets-container" v-if="showTickets">
			<span id="close" @click="closeTicketSection">X</span>
			<Ticket
				v-for="ticket in tickets"
				:key="ticket.id"
				:ticket="ticket"
				:techs="techs"
				@deleted="_deleteTicket"
				@progress="_progressTicket"
				@finished="_finishTicket"
				@edited="_editTicket"
				@noted="_notedTicket"
				@focus="ticketFocusFn"
				class="ticket"
			/>
		</div>
	</main>
</template>

<script setup>
import { FetchAPI } from '@/assets/utils/FetchAPI'
import { InitializeVars } from '@/assets/utils/InitializeVars'
import { Chart } from 'chart.js/auto'
import { onMounted, ref, watch } from 'vue'
import FilterElement from './filter/filter-element'
import FindIam from './filter/i-am'
import FilterAnnual from './filter/filter-annual'
import FilterRange from './filter/filter-range'
import Ticket from '@/components/Ticket.vue'
import {
	deleteTicket,
	editTicket,
	finishedTicket,
	notedTicket,
	progressTicket,
} from '@/assets/utils/TicketActions'

const option = ref('client')
const showTickets = ref(false)
const startDate = ref()
const endDate = ref()
const ticketFocus = ref(false)

const { token, clients, popup, tickets, msg, type } = InitializeVars()

// <Ticket Functions >
function _deleteTicket({ id, status }) {
	deleteTicket(tickets, id, popup, msg, type, status)
}

function _progressTicket({ id, status }) {
	progressTicket(tickets, id, popup, msg, type, status)
}

function _finishTicket({ id, status }) {
	finishedTicket(tickets, id, popup, msg, type, status, true)
}

function _editTicket({ id, status, data }) {
	editTicket(tickets, id, popup, msg, type, data, status)
}

function _notedTicket({ id, status, data }) {
	notedTicket(tickets, id, popup, msg, type, data, status)
}

function closeTicketSection(ev) {
	if (!ticketFocus.value || ev.type == 'click') {
		showTickets.value = false
		return
	}

	showTickets.value = true
}

function ticketFocusFn({ data }) {
	ticketFocus.value = data
}

addEventListener('keydown', (ev) => {
	if (ev.key == 'Escape') {
		closeTicketSection()
	}
})
// Ticket Functions />
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
			responsive: true,
			aspectRatio: 2 / 2,
			plugins: {
				legend: {
					position: 'bottom',
				},
			},
			onClick: (ev) => {
				const name = FindIam(ev, datasetData, chart)
				tickets.value = datasetData.filter((el) => el.label == name)[0].tickets
				showTickets.value = true
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
				chart.options.onClick = (ev) => {
					const name = FindIam(ev, datasetData, chart)
					tickets.value = datasetData.filter((el) => el.label == name)[0].tickets
					showTickets.value = true
				}
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
						showTickets.value = true
					}
					chart.update()
				})
				break
			}

			case 'client': {
				const datasetData = FilterElement(clients.value)
				chart.data.datasets = datasetData
				chart.data.labels = ['Clientes']
				chart.options.onClick = (ev) => {
					const name = FindIam(ev, datasetData, chart)
					tickets.value = datasetData.filter((el) => el.label == name)[0].tickets
					showTickets.value = true
				}
				chart.update()
				break
			}
		}
	})
})
</script>

<style scoped>
.dashboard {
	width: 100%;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 3rem;
}

#chart {
	max-height: 85%;
	max-width: 85%;
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

.tickets-container {
	width: 100%;
	margin-top: 5rem;
}

.ticket {
	width: 100%;
}

#close {
	position: absolute;
	top: 2rem;
	left: 20rem;
	background: none;
	border: none;
	color: red;
	font-size: 3rem;
	font-weight: 600;
	cursor: pointer;
}

@media (max-width: 800px) {
	#close {
		left: 3rem;
	}

	#chart {
		max-height: 100% !important;
		max-width: 100% !important;
	}
}
</style>
