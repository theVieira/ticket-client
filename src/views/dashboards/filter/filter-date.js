export default function FilterDate(elements, range) {
	// range = [startDate, endDate]
	if (range[0] == undefined) {
		range[0] = range[1]
	}

	if (range[1] == undefined) {
		range[1] = range[0]
	}

	return elements.map((element) => {
		const filterFinished = element.tickets.filter((ticket) => ticket.finished)
		const filterTickets = filterFinished.filter((ticket) => {
			const ticketDate = new Date(ticket.finished)
			const ticketDateFormat = `${ticketDate.getFullYear()}-${(
				ticketDate.getMonth() + 1
			)
				.toString()
				.padStart(2, '0')}-${ticketDate.getDate().toString().padStart(2, '0')}`

			if (ticketDateFormat >= range[0] && ticketDateFormat <= range[1]) {
				return ticket
			}
		})

		if (element.color) {
			return new Object({
				label: element.name,
				borderWidth: 1,
				backgroundColor: element.color,
				data: [filterTickets.length],
				tickets: filterTickets,
			})
		} else {
			return new Object({
				label: element.name,
				borderWidth: 1,
				backgroundColor: element.color,
				data: [filterTickets.length],
				tickets: filterTickets,
			})
		}
	})
}
