<template>
  <main class="tickets-container">
    <div class="tickets-header">
      <strong>Total: {{ total }}</strong>
      <Filter @search="search" :url="'Progress'" />
    </div>
    <div class="tickets-list">
      <Ticket
        v-for="ticket in tickets"
        :key="ticket.id"
        :ticket="ticket"
        :techs="techs"
        @deleted="_deleteTicket"
        @finished="_finishTicket"
        @edited="_editTicket"
        @noted="_notedTicket"
      />
    </div>
    <Popup v-if="popup" class="popup" :msg="msg" :type="type" />
  </main>
</template>

<script setup>
import Popup from '@/components/Popup.vue'
import Ticket from '../../components/Ticket.vue'
import Filter from '@/components/Filter.vue'
import { onBeforeMount } from 'vue'
import { SetTitle } from '@/assets/utils/SetTitle.js'
import { InitializeVars } from '@/assets/utils/InitializeVars'
import { FetchAPI } from '@/assets/utils/FetchAPI'
import {
  deleteTicket,
  editTicket,
  finishedTicket,
  notedTicket,
} from '@/assets/utils/TicketActions'

const { popup, token, tickets, msg, type, total, techs } = InitializeVars()

SetTitle('Em progresso')

onBeforeMount(async () => {
  const data = await FetchAPI('/ticket/listProgress/all', token)
  tickets.value = data
  total.value = tickets.value.length

  const res = await FetchAPI('/tech/list', token)
  techs.value = res
})

function _deleteTicket({ id, status }) {
  deleteTicket(tickets, id, popup, msg, type, status)
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

async function search({ data }) {
  tickets.value = data.filter((ticket) => ticket.status == 'progress')
  total.value = tickets.value.length
}
</script>
