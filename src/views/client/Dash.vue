<template>
  <main class="client-dashboard-container">
    <h1>Página em construção</h1>
    <!-- <select name="clientOption" id="clientOption" v-model="clientOption">
      <option value="" selected disabled>Selecione</option>
      <option value="all">Todos</option>
      <option value="month">Mensal</option>
    </select>
    <canvas id="chart"></canvas> -->
  </main>
</template>

<!-- <script setup>
import { FetchAPI } from '@/assets/utils/FetchAPI'
import { InitializeVars } from '@/assets/utils/InitializeVars'
import { Chart } from 'chart.js/auto'
import { onMounted, ref, watch } from 'vue'

const { token } = InitializeVars()

const clientOption = ref('all')

onMounted(async () => {
	const data = await FetchAPI('/client/list', token)
	const ctx = document.querySelector('#chart')

	const datasetData = data.map((client) => {
		return new Object({
			label: client.name,
			data: [client.tickets.length],
		})
	})

	const chart = new Chart(ctx, {
		type: 'polarArea',
		data: {
			labels: ['Clientes'],
			datasets: datasetData,
		},
	})

	watch(clientOption, () => {
		switch (clientOption.value) {
			case 'all':
				const allData = data.map((client) => {
					return new Object({
						label: client.name,
						data: [client.tickets.length],
					})
				})

				chart.data.datasets = allData

				break
			case 'month':
				const nowMonth = new Date().getUTCMonth()

				const datasetData = data.map((client) => {
					const monthTickets = client.tickets.filter(
						(ticket) => new Date(ticket.createdAt).getUTCMonth() - nowMonth <= 30
					)

					return new Object({
						label: client.name,
						data: monthTickets.length,
					})
				})

				chart.data.datasets = datasetData
				chart.update()

				break

			case 'anual':
				break

			default:
				console.error('unknow dashboard option')
				break
		}
	})
})
</script> -->

<style scoped>
.client-dashboard-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  padding: 3rem;
}

#clientOption {
  background: var(--medium-background);
  padding: 1rem 2rem;
  border-radius: 1.2rem;
  color: var(--light-color);
  cursor: pointer;
}
</style>
