import TechAccount from '@/views/tech/Account.vue'
import ListTechs from '@/views/tech/List.vue'
import CreateTech from '@/views/tech/Create.vue'
import TechDashboard from '@/views/dashboards/TechDashboard.vue'

const techRoutes = [
	{
		path: '/account',
		component: TechAccount,
	},

	{
		path: '/manage/tech',
		component: ListTechs,
	},
	{
		path: '/create/tech',
		component: CreateTech,
	},
	{
		path: '/dash/tech',
		component: TechDashboard,
	},
]

export { techRoutes }
