export function FormatDate(date) {
  const newDate = new Date(date);
  const day = newDate.getUTCDate();
  const month = newDate.getUTCMonth() + 1;
  const year = newDate.getUTCFullYear();
  const hours = newDate.getUTCHours() - 4;
  const minutes = newDate.getUTCMinutes();

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
