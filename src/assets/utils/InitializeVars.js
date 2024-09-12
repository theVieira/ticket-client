import { ref } from 'vue'

export function InitializeVars() {
	const admin = localStorage.getItem('admin')
	const create_ticket = localStorage.getItem('create_ticket')
	const delete_ticket = localStorage.getItem('delete_ticket')
	const token = localStorage.getItem('token')
	const techName = localStorage.getItem('techName')
	const techColor = localStorage.getItem('techColor')
	const expires = localStorage.getItem('expiresToken')
	const popup = ref(false)
	const msg = ref('')
	const type = ref('')
	const tickets = ref([])
	const clients = ref([])
	const techs = ref([])
	const total = ref(0)
	const clientName = ref('')
	const order = ref('all')

	return {
		token,
		techName,
		techColor,
		popup,
		msg,
		type,
		tickets,
		clients,
		techs,
		total,
		clientName,
		order,
		admin,
		create_ticket,
		delete_ticket,
		expires,
	}
}
