<template>
  <main class="tickets-container">
    <div class="tickets-header">
      <p>
        <strong>Total: {{ total }}</strong>
      </p>
      <div class="filter">
        <Filter @search="search" :url="'Finished'" />
      </div>
    </div>
    <div class="tickets-list">
      <Ticket
        class="ticket"
        v-for="ticket in tickets"
        :key="ticket.id"
        :ticket="ticket"
        :techs="techs"
        @deleted="_deleteTicket"
        @reopen="_reopenTicket"
        @edited="_editTicket"
        @noted="_notedTicket"
      />
    </div>
    <Popup v-if="popup" class="popup" :msg="msg" :type="type" />
  </main>
</template>

<script setup>
import Ticket from '@/components/Ticket.vue'
import Popup from '@/components/Popup.vue'
import Filter from '@/components/Filter.vue'
import { onBeforeMount } from 'vue'
import { InitializeVars } from '@/assets/utils/InitializeVars'
import { SetTitle } from '@/assets/utils/SetTitle'
import { FetchAPI } from '@/assets/utils/FetchAPI'
import {
  deleteTicket,
  editTicket,
  notedTicket,
  reopenTicket,
} from '@/assets/utils/TicketActions'

const { tickets, total, popup, msg, type, token, techs } = InitializeVars()

SetTitle('Chamados Finalizados')

onBeforeMount(async () => {
  const data = await FetchAPI('/ticket/listFinished/all', token)
  tickets.value = data
  total.value = tickets.value.length

  const res = await FetchAPI('/tech/list', token)
  techs.value = res
})

function _deleteTicket({ id, status }) {
  deleteTicket(tickets, id, popup, msg, type, status)
}

function _reopenTicket({ id, status }) {
  reopenTicket(tickets, id, popup, msg, type, status, true)
}

function _editTicket({ id, status, data }) {
  editTicket(tickets, id, popup, msg, type, data, status)
}

function _notedTicket({ id, status, data }) {
  notedTicket(tickets, id, popup, msg, type, data, status)
}

async function search({ data }) {
  tickets.value = data.filter((ticket) => ticket.status == 'finished')
  total.value = tickets.value.length
}
</script>
