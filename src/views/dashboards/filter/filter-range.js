import { FetchAPI } from '@/assets/utils/FetchAPI'
import FilterDate from './filter-date'

export default async function FilterRange(url, token, range) {
	// range = [start, end] dates
	const response = await FetchAPI(url, token)
	const datasetData = FilterDate(response, range)
	return datasetData
}
