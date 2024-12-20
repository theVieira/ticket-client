import CreateTicket from '@/views/ticket/Create.vue'
import FinishedTickets from '@/views/ticket/Finished.vue'
import ProgressTickets from '@/views/ticket/Progress.vue'

const ticketRoutes = [
	{
		path: '/create/ticket',
		component: CreateTicket,
	},
	{
		path: '/finisheds',
		component: FinishedTickets,
	},
	{
		path: '/progress',
		component: ProgressTickets,
	},
]

export { ticketRoutes }
