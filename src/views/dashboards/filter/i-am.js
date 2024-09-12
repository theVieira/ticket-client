export default function FindIam(ev, dataset, chart) {
	const i = chart.getElementsAtEventForMode(ev, 'nearest', {
		intersect: true,
	})[0].datasetIndex

	return dataset[i].label
}
