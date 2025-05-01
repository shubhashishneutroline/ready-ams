import { AnnouncementOrOffer } from "@/data/structure"

export function shortenText(text: string, maxLength = 20): string {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export const getReminderTypeStyles = (status: string | undefined) => {
  switch (status) {
    case "REMINDER":
      return {
        bg: "bg-blue-200/50",
        dot: "bg-blue-500",
        text: "text-blue-700",
      }
    case "FOLLOW_UP":
      return {
        bg: "bg-purple-200/50",
        dot: "bg-purple-500",
        text: "text-purple-700",
      }
    case "CANCELLATION":
      return {
        bg: "bg-rose-200/50",
        dot: "bg-rose-500",
        text: "text-rose-700",
      }
    case "MISSED":
      return {
        bg: "bg-orange-200/50",
        dot: "bg-orange-500",
        text: "text-orange-700",
      }
    case "CUSTOM":
      return {
        bg: "bg-teal-200/50",
        dot: "bg-teal-500",
        text: "text-teal-700",
      }
    default:
      return {
        bg: "bg-gray-200",
        dot: "bg-gray-400",
        text: "text-gray-600",
      }
  }
}

export const getExpiryDuration = (expiry: string): number => {
  switch (expiry) {
    case "ONE_DAY":
      return 1 * 24 * 60 * 60 * 1000
    case "THREE_DAYS":
      return 3 * 24 * 60 * 60 * 1000
    case "SEVEN_DAYS":
      return 7 * 24 * 60 * 60 * 1000
    case "NEVER":
      return (7 * 24 * 60 * 60 * 1) / 0
    default:
      return 0
  }
}

export const getAnnouncementStatus = (
  item: AnnouncementOrOffer
): "sent" | "scheduled" | "expired" => {
  const now = Date.now()
  const scheduled = new Date(item.scheduledAt).getTime()
  const expiryMs = getExpiryDuration(item.expiredAt)
  const expiryTime = scheduled + expiryMs

  if (now > expiryTime) return "expired"
  if (item.isImmediate || scheduled <= now) return "sent"
  return "scheduled"
}

export function formatOffset(minutes: number): string {
  const days = Math.floor(minutes / (24 * 60))
  const hours = Math.floor((minutes % (24 * 60)) / 60)
  const mins = minutes % 60

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (mins > 0) parts.push(`${mins}m`)

  return parts.join(" ")
}

export const getAnnouncementShowOnStyles = (type: string) => {
  switch (type) {
    case "EMAIL":
      return {
        bg: "bg-indigo-200/50",
        dot: "bg-indigo-500",
        text: "text-indigo-700",
      }
    case "SMS":
      return {
        bg: "bg-green-200/50",
        dot: "bg-green-500",
        text: "text-green-700",
      }
    case "PUSH":
      return {
        bg: "bg-yellow-200/50",
        dot: "bg-yellow-500",
        text: "text-yellow-700",
      }
    default:
      return {
        bg: "bg-gray-200",
        dot: "bg-gray-400",
        text: "text-gray-600",
      }
  }
}

export const getBadgeColor = (value: string) => {
  switch (value) {
    case "APPOINTED_USERS":
      return {
        bg: "bg-blue-200/50", // Light blue background
        text: "text-blue-700", // Dark blue text
        dot: "bg-blue-500", // Blue dot
      }
    case "CANCELLED_USERS":
      return {
        bg: "bg-red-200/50", // Light red background
        text: "text-red-700", // Dark red text
        dot: "bg-red-500", // Red dot
      }
    case "ALL":
      return {
        bg: "bg-gray-200/50", // Light gray background
        text: "text-gray-700", // Dark gray text
        dot: "bg-gray-500", // Gray dot
      }
    default:
      return {
        bg: "bg-gray-200", // Default light gray
        text: "text-gray-600", // Default dark gray text
        dot: "bg-gray-400", // Default gray dot
      }
  }
}


export const getAudienceLabel = (value: string) => {
  switch (value) {
    case "APPOINTED_USERS":
      return "Appointed"; // Maps "APPOINTED_USERS" to "Appointed"
    case "CANCELLED_USERS":
      return "Cancelled";
    case "ALL":
      return "All";
    default:
      return "Unknown"; // Handles any unknown values
  }
}