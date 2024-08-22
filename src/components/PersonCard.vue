<template>
	<div class="client-card" @click="openInfo">
		<h4>
			{{ props.name.toUpperCase() }}
		</h4>
		<div class="length-info">
			<p>
				<strong>Chamados: {{ tickets.length }}</strong>
			</p>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue'

const showInfo = ref(false)

const emit = defineEmits(['showInfo'])

const props = defineProps({
	name: String,
	tickets: {
		type: Array,
		default: () => [],
	},
})

function openInfo() {
	showInfo.value = !showInfo.value
	emit('showInfo')
}
</script>

<style scoped>
.client-card {
	width: fit-content;
	height: fit-content;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	background: var(--medium-background);
	padding: 5rem 3rem;
	border-radius: 1.2rem;
	position: relative;
	cursor: pointer;
	transition: 0.3s;
}

.client-card:hover {
	filter: brightness(120%);
}

.client-card h4 {
	text-align: center;
}

.length-info {
	text-align: center;
	filter: brightness(80%);
}
</style>
