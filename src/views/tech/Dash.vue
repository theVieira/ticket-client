<template>
	<main class="dashboard-container">
		<section class="dashboard-section" v-show="!ticketSection">
			<div class="controls">
				<select name="option" id="option" v-model="option">
					<option value="select-date">Selecione a data</option>
					<option value="annual">Anual</option>
					<option value="tech">Técnicos</option>
				</select>

				<div class="dateInput" v-if="option == 'select-date'">
					<span>De</span>
					<input
						type="date"
						name="date"
						id="dateInput"
						class="date"
						v-model="startDate"
						@change="find"
					/>
				</div>

				<div class="dateInput" v-if="option == 'select-date'">
					<span>Até</span>
					<input
						type="date"
						name="date"
						class="date"
						v-model="endDate"
						@change="find"
					/>
				</div>
			</div>
			<canvas id="chart"></canvas>
		</section>
		<section class="tickets-container" v-if="ticketSection">
			<input type="button" value="X" id="close" @click="closeTicketSection" />
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
		</section>
		<Popup v-if="popup" :msg="msg" :type="type" />
	</main>
</template>

<script setup>
import Ticket from '@/components/Ticket.vue'
import Popup from '@/components/Popup.vue'
import { onMounted, ref, watch } from 'vue'
import { InitializeVars } from '@/assets/utils/InitializeVars'
import { FetchAPI } from '@/assets/utils/FetchAPI'
import Chart from 'chart.js/auto'
import {
	deleteTicket,
	editTicket,
	finishedTicket,
	notedTicket,
	progressTicket,
} from '@/assets/utils/TicketActions'
import { SetTitle } from '@/assets/utils/SetTitle'

const option = ref('tech')
const ticketSection = ref(false)
const ticketFocus = ref(false)
const startDate = ref()
const endDate = ref()

const { token, popup, tickets, msg, type, techs } = InitializeVars()

// <Ticket Functions
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
		ticketSection.value = false
		return
	}

	ticketSection.value = true
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

async function find() {
	const findTechs = await FetchAPI('/tech/list', token)
	const datasetData = FilterDate(findTechs, [startDate.value, endDate.value])
	return datasetData
}

onMounted(async () => {
	SetTitle('Dashboard - Técnicos')
	const res = await FetchAPI('/tech/list', token)
	techs.value = res

	const ctx = document.querySelector('#chart')
	const datasetData = FilterTech(techs.value)
	const chart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: [MapMonth(new Date().getMonth() + 1)],
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
				const name = FindIam(ev, datasetData)
				tickets.value = datasetData.filter((el) => el.label == name)[0].tickets
				ticketSection.value = true
			},
		},
	})

	function FindIam(ev, dataset) {
		const i = chart.getElementsAtEventForMode(ev, 'nearest', {
			intersect: true,
		})[0].datasetIndex

		return dataset[i].label
	}

	watch(option, async (val) => {
		switch (val) {
			case 'select-date': {
				watch([endDate, startDate], async () => {
					const datasetData = await find()
					chart.data.datasets = datasetData
					chart.data.labels = [MapMonth(new Date().getMonth() + 1)]
					chart.options.onClick = (ev) => {
						const name = FindIam(ev, datasetData)
						tickets.value = datasetData.filter((el) => el.label == name)[0].tickets
						ticketSection.value = true
					}
					chart.update()
				})
				break
			}

			case 'annual': {
				const datasetData = FilterAnnual(techs.value)
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
				chart.options.onClick = (ev, elements) => {
					const name = FindIam(ev, datasetData)
					const annualTickets = datasetData.filter((el) => el.label == name)[0]
						.tickets

					if (elements.length) {
						const element = elements[0]
						const i = element.index
						tickets.value = annualTickets[i]
						ticketSection.value = true
					}
				}
				chart.update()
				break
			}

			case 'tech': {
				const datasetData = FilterTech(techs.value)
				chart.data.datasets = datasetData
				chart.data.labels = ['Técnicos']
				chart.options.onClick = (ev) => {
					const name = FindIam(ev, datasetData)
					tickets.value = datasetData.filter((el) => el.label == name)[0].tickets
					ticketSection.value = true
				}
				chart.update()
			}
		}
	})
})

// <Mapper
function MapMonth(month) {
	switch (month) {
		case 1:
			return 'Janeiro'
		case 2:
			return 'Fevereiro'
		case 3:
			return 'Março'
		case 4:
			return 'Abril'
		case 5:
			return 'Maio'
		case 6:
			return 'Junho'
		case 7:
			return 'Julho'
		case 8:
			return 'Agosto'
		case 9:
			return 'Setembro'
		case 10:
			return 'Outubro'
		case 11:
			return 'Novembro'
		case 12:
			return 'Dezembro'
		default:
			throw new Error('unknown month')
	}
}
// Mapper />
</script>

<style scoped>
.tickets-container {
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

.dashboard-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
	gap: 3rem;
}

.controls {
	display: flex;
	gap: 2rem;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
}

.controls input,
select {
	border: 1px solid var(--light-color);
	border-radius: 1.2rem;
	padding: 1rem 2rem;
	background: var(--medium-background);
	color: var(--light-color);
	font-weight: 600;
	cursor: pointer;
}

.dateInput {
	color: var(--light-color);
	display: flex;
	align-items: center;
	gap: 1rem;
	background: var(--medium-background);
	padding: 0 0 0 1rem;
	border-radius: 1.2rem;
	border: 1px solid var(--light-color);
}

.dateInput input {
	border: none;
	color: var(--light-color);
	filter: brightness(130%);
}

#chart {
	max-width: 100%;
	max-height: 80%;
}

@media (max-width: 800px) {
	#close {
		left: 3rem;
	}
}
</style>
