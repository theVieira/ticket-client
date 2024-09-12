import dayjs from 'dayjs'

export function FormatDate(date) {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}
