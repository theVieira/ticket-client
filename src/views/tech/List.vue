<template>
	<div class="techs-container" v-if="!techDialog">
		<PersonCard
			v-for="tech in techs"
			:key="tech.id"
			:name="tech.name"
			:tickets="tech.tickets"
			@showInfo="showTech(tech)"
		/>
	</div>
	<div class="tech-info" v-if="techDialog">
		<div class="top-info">
			<h3><span>Nome</span>{{ tech.name.toUpperCase() }}</h3>
			<h3><span>Chamados</span>{{ tech.tickets.length }}</h3>
			<h3><span>Telefone</span>{{ tech.phone }}</h3>
			<span id="close-button" @click="techDialog = false">X</span>
		</div>
		<div class="actions">
			<div class="action">
				<img src="@/assets/icons/block.svg" alt="block icon" />
				<p><strong>Inativar</strong></p>
			</div>
			<div class="action">
				<img src="@/assets/icons/trash.png" alt="trash icon" />
				<p><strong>Deletar</strong></p>
			</div>
			<select name="filter" id="filter" v-model="filterOption">
				<option value="all" selected>Todos</option>
				<option value="now">Finalizados Hoje</option>
				<option value="week">Esta semana</option>
			</select>
		</div>
		<div class="tickets">
			<Ticket
				v-for="ticket in filterTickets"
				:key="ticket.id"
				:ticket="ticket"
				:techs="techs"
				@deleted="_deleteTicket"
				@progress="_progressTicket"
				@finished="_finishTicket"
				@reopen="_reopenTicket"
				@edited="_editTicket"
				@noted="_notedTicket"
			/>
		</div>
		<Popup class="popup" v-if="popup" :msg="msg" :type="type" />
	</div>
</template>

<script setup>
import PersonCard from '@/components/PersonCard.vue'
import Ticket from '@/components/Ticket.vue'
import Popup from '@/components/Popup.vue'
import { onBeforeMount, ref, watch } from 'vue'
import { InitializeVars } from '@/assets/utils/InitializeVars'
import { SetTitle } from '@/assets/utils/SetTitle'
import {
	editTicket,
	deleteTicket,
	finishedTicket,
	progressTicket,
	reopenTicket,
	notedTicket,
} from '@/assets/utils/TicketActions'
import { FetchAPI } from '@/assets/utils/FetchAPI'

const { token, popup, type, msg, techs, tickets } = InitializeVars()

const techDialog = ref(false)
const tech = ref({})
const filterTickets = ref([])
const filterOption = ref('all')

SetTitle('Técnicos')

onBeforeMount(async () => {
	const data = await FetchAPI('/tech/list', token)
	techs.value = data
})

watch(filterOption, (newValue) => {
	switch (newValue) {
		case 'all': {
			tickets.value = tech.value.tickets
			filterTickets.value = tech.value.tickets
			return
		}
		case 'now': {
			filterTickets.value = tech.value.tickets.map((ticket) => {
				const ticketDate = new Date(ticket.finished).getTime()
				const now = new Date().getTime()
				const diffInHours = Math.floor(now - ticketDate) / (1000 * 60 * 60)

				if (diffInHours <= 24) {
					return ticket
				}
			})

			return
		}
		case 'week': {
			filterTickets.value = tech.value.tickets.map((ticket) => {
				const ticketDate = new Date(ticket.finished).getTime()
				const now = new Date().getTime()
				const diffInDays = Math.floor(now - ticketDate) / (1000 * 60 * 60 * 24)

				if (diffInDays <= 7) {
					return ticket
				}
			})

			return
		}
		default: {
			console.error('unknown filter option!')
		}
	}
})

function showTech(info) {
	tech.value = info
	tickets.value = info.tickets
	techDialog.value = true
	filterTickets.value = tech.value.tickets
}

function _deleteTicket({ id, status }) {
	deleteTicket(tickets, id, popup, msg, type, status)
}

function _progressTicket({ id, status }) {
	progressTicket(tickets, id, popup, msg, type, status)
}

function _finishTicket({ id, status }) {
	finishedTicket(tickets, id, popup, msg, type, status, false)
}

function _reopenTicket({ id, status }) {
	reopenTicket(tickets, id, popup, msg, type, status, false)
}

function _editTicket({ id, status, data }) {
	editTicket(tickets, id, popup, msg, type, data, status)
}

function _notedTicket({ id, status, data }) {
	notedTicket(tickets, id, popup, msg, type, data, status)
}
</script>

<style scoped>
.techs-container {
	color: var(--light-color);
	display: flex;
	gap: 4rem;
	padding: 5rem;
	flex-wrap: wrap;
	height: fit-content;
}

.tech-info {
	width: 100%;
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 4rem;
	color: var(--light-color);
	gap: 3rem;
}

.tech-info .tickets {
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.tech-info .top-info {
	display: flex;
	align-items: center;
	gap: 3rem;
}

.tech-info .top-info h3 {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.tech-info .top-info h3 span {
	filter: brightness(80%);
}

#close-button {
	color: #b93737;
	font-weight: 800;
	font-size: 2.6rem;
	position: absolute;
	top: 1rem;
	left: 1rem;
	cursor: pointer;
}

.actions {
	display: flex;
	align-items: center;
	gap: 3rem;
}

.action {
	display: flex;
	align-items: center;
	gap: 1rem;
	cursor: pointer;
}

.action img {
	width: 3.2rem;
}

#filter {
	background: var(--medium-background);
	color: var(--light-color);
	padding: 1rem 2.5rem;
	border-radius: 1.2rem;
	cursor: pointer;
}
</style>
