export default function FilterElement(elements) {
	return elements.map((element) => {
		const filterFinished = element.tickets.filter((ticket) => ticket.finished)

		if (element.color) {
			return new Object({
				label: element.name,
				borderWidth: 1,
				backgroundColor: element.color,
				data: [filterFinished.length],
				tickets: filterFinished,
			})
		} else {
			return new Object({
				label: element.name,
				borderWidth: 1,
				data: [filterFinished.length],
				tickets: filterFinished,
			})
		}
	})
}
