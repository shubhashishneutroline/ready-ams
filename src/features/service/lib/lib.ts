export const getActiveStatusStyles = (status: string | undefined) => {
  switch (status) {
    case "ACTIVE":
      return {
        bg: "bg-green-300/50",
        dot: "bg-green-500",
        text: "text-green-600",
      }
    case "INACTIVE":
      return {
        bg: "bg-red-300/50",
        dot: "bg-red-500",
        text: "text-red-600",
      }
    default:
      return {
        bg: "bg-gray-200",
        dot: "bg-gray-400",
        text: "text-gray-500",
      }
  }
}

export const formatDuration = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours && minutes) return `${hours} hr ${minutes} min`
  if (hours) return `${hours} hr`
  return `${minutes} min`
}
