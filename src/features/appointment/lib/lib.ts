export const getStatusStyles = (status: string) => {
  switch (status) {
    case "SCHEDULED":
      return {
        bg: "bg-yellow-300/50",
        dot: "bg-yellow-500",
        text: "text-yellow-600",
      }
    case "COMPLETED":
      return {
        bg: "bg-green-300/50",
        dot: "bg-green-500",
        text: "text-green-600",
      }
    case "MISSED":
      return {
        bg: "bg-red-300/50",
        dot: "bg-red-500",
        text: "text-red-600",
      }
    case "CANCELLED":
      return {
        bg: "bg-gray-300/50",
        dot: "bg-gray-500",
        text: "text-gray-600",
      }
    case "FOLLOW_UP":
      return {
        bg: "bg-blue-300/50",
        dot: "bg-blue-500",
        text: "text-blue-600",
      }
    default:
      return {
        bg: "bg-gray-200",
        dot: "bg-gray-400",
        text: "text-gray-500",
      }
  }
}
