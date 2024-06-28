export function format_date(date) {
  const newDate = new Date(date);
  const day = newDate.getUTCDate();
  const month = newDate.getUTCMonth();
  const year = newDate.getUTCFullYear();

  return `${day}/${month}/${year}`;
}
