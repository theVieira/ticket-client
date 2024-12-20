import CreateClient from '@/views/client/Create.vue'
import ListClients from '@/views/client/List.vue'
import ClientDashboard from '@/views/dashboards/ClientDashboard.vue'

const clientRoutes = [
	{
		path: '/create/client',
		component: CreateClient,
	},
	{
		path: '/list/clients',
		component: ListClients,
	},
	{
		path: '/dash/client',
		component: ClientDashboard,
	},
]

export { clientRoutes }
