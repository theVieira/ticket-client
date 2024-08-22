<template>
	<section class="list-clients-container" v-if="!showClientDialog">
		<PersonCard
			v-for="client in clients"
			:key="client.id"
			:name="client.name"
			:tickets="client.tickets"
			@showInfo="showClient(client)"
		/>
	</section>
	<div class="client-info" v-if="showClientDialog">
		<span id="close-button" @click="showClientDialog = false">X</span>
		<div class="top-info">
			<h3><span>Cliente</span> {{ client.name }}</h3>
			<h3><span>Chamados</span>{{ client.tickets.length }}</h3>
		</div>
		<div class="actions">
			<div class="action">
				<img src="@/assets/icons/trash.png" alt="trash icon" />
				<p><strong>Deletar</strong></p>
			</div>
			<div class="action">
				<img src="@/assets/icons/pencil.png" alt="pencil icon" />
				<p><strong>Editar</strong></p>
			</div>
		</div>
		<div class="tickets">
			<Ticket
				v-for="ticket in client.tickets"
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

		<Popup v-if="popup" class="popup" :msg="msg" :type="type" />
	</div>
</template>

<script setup>
import Popup from '@/components/Popup.vue'
import Ticket from '@/components/Ticket.vue'
import PersonCard from '@/components/PersonCard.vue'
import { onBeforeMount, ref } from 'vue'
import { InitializeVars } from '@/assets/utils/InitializeVars'
import {
	editTicket,
	deleteTicket,
	finishedTicket,
	reopenTicket,
	progressTicket,
	notedTicket,
} from '@/assets/utils/TicketActions'
import { FetchAPI } from '@/assets/utils/FetchAPI'

const { token, clients, tickets, popup, msg, type, techs } = InitializeVars()

const client = ref({})

const showClientDialog = ref(false)

addEventListener('keydown', (ev) => {
	if (ev.key == 'Escape') {
		showClientDialog.value = false
	}
})

onBeforeMount(async () => {
	const data = await FetchAPI('/client/list', token)
	clients.value = data

	const res = await FetchAPI('/tech/list', token)
	techs.value = res
})

function showClient(info) {
	showClientDialog.value = true
	client.value = info
	tickets.value = info.tickets
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
.list-clients-container {
	color: var(--light-color);
	padding: 3rem;
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 4rem;
}

.client-info {
	width: 100%;
	color: var(--light-color);
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 4rem;
}

.client-info .top-info {
	display: flex;
	align-items: center;
	gap: 3rem;
}

.client-info h3 {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.client-info h3 span {
	filter: brightness(80%);
}

.client-info .actions {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 2rem;
	margin-top: 2rem;
}

.client-info .actions .action {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	cursor: pointer;
}

.client-info .tickets {
	display: flex;
	flex-direction: column;
	width: 100%;
	gap: 1rem;
	margin-top: 4rem;
}

.popup {
	position: absolute;
	top: 3rem;
}

#close-button {
	position: absolute;
	top: 1rem;
	left: 1rem;
	color: #b93737;
	font-weight: 800;
	font-size: 2.6rem;
	cursor: pointer;
}
</style>
