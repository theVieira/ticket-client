export function format_date(date) {
  const newDate = new Date(date);
  const day = newDate.getUTCDate();
  const month = newDate.getUTCMonth();
  const year = newDate.getUTCFullYear();
  const hours = newDate.getUTCHours();
  const minutes = newDate.getUTCMinutes();

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
