export default function FilterAnnual(elements) {
	return elements.map((element) => {
		const months = [[], [], [], [], [], [], [], [], [], [], [], []]

		const filterFinished = element.tickets.filter((ticket) => ticket.finished)

		filterFinished.forEach((ticket) => {
			const ticketDate = new Date(ticket.finished).getMonth()
			return months[ticketDate].push(ticket)
		})

		if (element.color) {
			return new Object({
				label: element.name,
				borderWidth: 1,
				backgroundColor: element.color,
				data: months.map((el) => el.length),
				tickets: months,
			})
		} else {
			return new Object({
				label: element.name,
				borderWidth: 1,
				backgroundColor: element.color,
				data: months.map((el) => el.length),
				tickets: months,
			})
		}
	})
}
