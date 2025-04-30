export function formatLocalDateTime(dateStr: string, timeStr: string): string {
  const date = new Date(dateStr)
  const time = new Date(timeStr)

  // Apply time to date (in local time)
  date.setHours(time.getHours(), time.getMinutes(), 0, 0)

  const day = date.getDate().toString().padStart(2, "0")
  const month = date.toLocaleString("default", { month: "short" })
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12 || 12

  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`
}
