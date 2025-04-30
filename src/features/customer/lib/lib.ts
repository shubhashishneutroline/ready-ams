export const getRoleStyles = (role: string) => {
  switch (role) {
    case "ADMIN":
      return {
        bg: "bg-purple-300/50",
        dot: "bg-purple-500",
        text: "text-purple-600",
      }
    case "USER":
      return {
        bg: "bg-indigo-300/50",
        dot: "bg-indigo-500",
        text: "text-indigo-600",
      }
    case "SUPERADMIN":
      return {
        bg: "bg-orange-300/50",
        dot: "bg-orange-500",
        text: "text-orange-600",
      }
    default:
      return {
        bg: "bg-gray-200",
        dot: "bg-gray-400",
        text: "text-gray-500",
      }
  }
}

export const getActiveStatusStyles = (status: boolean | undefined ) => {
  switch (status) {
    case true :
      return {
        bg: "bg-green-300/50",
        dot: "bg-green-500",
        text: "text-green-600",
      }
    case false:
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
