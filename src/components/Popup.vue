<template>
	<div class="popup-container">
		<p>
			<slot name="msg">{{ msg }}</slot>
		</p>
	</div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
	msg: String,
	type: String,
})

onMounted(() => {
	const popup = document.querySelector('.popup-container')

	if (props.type === 'error') {
		popup.style.background = '#d34242'
	} else if (props.type === 'success') {
		popup.style.background = '#4ed16b'
	}
})
</script>

<style scoped>
.popup-container {
	padding: 1rem 3rem;
	border-radius: 1.2rem;
	font-weight: 600;
	color: var(--dark-background);
	width: fit-content;
	height: fit-content;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
