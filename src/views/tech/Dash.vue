<template>
	<main class="dashboard-container">
		<section class="dashboard-section" v-show="!ticketSection">
			<div class="controls">
				<select name="option" id="option" v-model="option">
					<option value="select-date">Selecione a data</option>
					<option value="today">Finalizados hoje</option>
					<option value="month">Este mês</option>
					<option value="annual">Anual</option>
					<option value="tech">Técnicos</option>
				</select>

				<input
					type="date"
					name="date"
					id="dateInput"
					v-if="option == 'select-date'"
					class="date"
					v-model="date"
					@change="find"
				/>
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

const option = ref('month')
const date = ref('Selecione a data')
const ticketSection = ref(false)
const ticketFocus = ref(false)

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
	const datasetData = FilterDate(findTechs, date.value)
	return datasetData
}

onMounted(async () => {
	const res = await FetchAPI('/tech/list', token)
	techs.value = res

	const ctx = document.querySelector('#chart')
	const datasetData = FilterMonth(techs.value)
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
		const i = chart.getElementsAtEventForMode(ev, 'nearest', { intersect: true })[0]
			.datasetIndex

		return dataset[i].label
	}

	watch(option, async (val) => {
		switch (val) {
			case 'select-date': {
				watch(date, async () => {
					const datasetData = await find()
					chart.data.datasets = datasetData
					chart.data.labels = [MapMonth(new Date(date.value).getMonth() + 1)]
					chart.options.onClick = (ev) => {
						const name = FindIam(ev, datasetData)
						tickets.value = datasetData.filter((el) => el.label == name)[0].tickets
						ticketSection.value = true
					}
					chart.update()
				})
				break
			}

			case 'today': {
				const date = new Date()
				const dateString = `${date.getDate()}/${(date.getMonth() + 1)
					.toString()
					.padStart(2, '0')}/${date.getFullYear()}`

				const datasetData = FilterToday(techs.value)
				chart.data.datasets = datasetData
				chart.data.labels = [dateString]
				chart.options.onClick = (ev) => {
					const name = FindIam(ev, datasetData)
					tickets.value = datasetData.filter((el) => el.label == name)[0].tickets
					ticketSection.value = true
				}
				chart.update()
				break
			}

			case 'month': {
				const datasetData = FilterMonth(techs.value)
				chart.data.datasets = datasetData
				chart.data.labels = [MapMonth(new Date().getMonth() + 1)]
				chart.options.onClick = (ev) => {
					const name = FindIam(ev, datasetData)
					tickets.value = datasetData.filter((el) => el.label == name)[0].tickets
					ticketSection.value = true
				}
				chart.update()
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

//	<Filters
function FilterMonth(techs) {
	return techs.map((tech) => {
		const nowDate = new Date()
		const compareNow = `${nowDate.getMonth()}/${nowDate.getFullYear()}`
		const filterFinished = tech.tickets.filter((ticket) => ticket.finished)

		const filterMonth = filterFinished.filter((ticket) => {
			const ticketDate = new Date(ticket.finished)
			const compareTicket = `${ticketDate.getMonth()}/${ticketDate.getFullYear()}`

			if (compareNow.toString() === compareTicket.toString()) {
				return ticket
			}
		})

		return new Object({
			label: tech.name,
			borderWidth: 1,
			backgroundColor: tech.color,
			data: [filterMonth.length],
			tickets: filterMonth,
		})
	})
}

function FilterDate(techs, date) {
	return techs.map((tech) => {
		const filterFinished = tech.tickets.filter((ticket) => ticket.finished)
		const filterTickets = filterFinished.filter((ticket) => {
			const ticketDate = new Date(ticket.finished)
			const ticketDateFormat = `${ticketDate.getFullYear()}-${(
				ticketDate.getMonth() + 1
			)
				.toString()
				.padStart(2, '0')}-${ticketDate.getDate()}`

			if (ticketDateFormat == date) {
				return ticket
			}
		})

		return new Object({
			label: tech.name,
			borderWidth: 1,
			backgroundColor: tech.color,
			data: [filterTickets.length],
			tickets: filterTickets,
		})
	})
}

function FilterToday(techs) {
	const nowDate = new Date()
	const nowCompare = `${nowDate.getDate()}-${nowDate.getMonth()}-${nowDate.getFullYear()}`

	return techs.map((tech) => {
		const filterFinished = tech.tickets.filter((ticket) => ticket.finished)
		const filterToday = filterFinished.filter((ticket) => {
			const ticketDate = new Date(ticket.finished)
			const ticketCompare = `${ticketDate.getDate()}-${ticketDate.getMonth()}-${ticketDate.getFullYear()}`

			if (nowCompare === ticketCompare) {
				return ticket
			}
		})

		return new Object({
			label: tech.name,
			borderWidth: 1,
			backgroundColor: tech.color,
			data: [filterToday.length],
			tickets: filterToday,
		})
	})
}

function FilterAnnual(techs) {
	return techs.map((tech) => {
		const months = [[], [], [], [], [], [], [], [], [], [], [], []]

		const filterFinished = tech.tickets.filter((ticket) => ticket.finished)

		filterFinished.forEach((ticket) => {
			const ticketDate = new Date(ticket.finished).getMonth()
			return months[ticketDate].push(ticket)
		})

		return new Object({
			label: tech.name,
			borderWidth: 1,
			backgroundColor: tech.color,
			data: months.map((el) => el.length),
			tickets: months,
		})
	})
}

function FilterTech(techs) {
	return techs.map((tech) => {
		const filterFinished = tech.tickets.filter((ticket) => ticket.finished)

		return new Object({
			label: tech.name,
			borderWidth: 1,
			backgroundColor: tech.color,
			data: [filterFinished.length],
			tickets: filterFinished,
		})
	})
}
// Filter />

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
