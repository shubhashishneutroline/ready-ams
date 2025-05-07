import { BusinessDetail } from "@/features/business-detail/types/types"
import { isoToNormalTime, normalOrFormTimeToIso } from "@/utils/utils"

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"

export type BusinessAvailability = {
  breaks: Record<WeekDay, [string, string][]>
  holidays: WeekDay[]
}

export const defaultBusinessAvailability: BusinessAvailability = {
  breaks: { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] },
  holidays: [],
}

// Convert WeekDay to full day name
export const toFullDay = (day: WeekDay): string => {
  const dayMap: Record<WeekDay, string> = {
    Mon: "MONDAY",
    Tue: "TUESDAY",
    Wed: "WEDNESDAY",
    Thu: "THURSDAY",
    Fri: "FRIDAY",
    Sat: "SATURDAY",
    Sun: "SUNDAY",
  }
  return dayMap[day]
}

// Convert full day name to WeekDay
export const toShortDay = (day: string): WeekDay => {
  const map: Record<string, WeekDay> = {
    MONDAY: "Mon",
    TUESDAY: "Tue",
    WEDNESDAY: "Wed",
    THURSDAY: "Thu",
    FRIDAY: "Fri",
    SATURDAY: "Sat",
    SUNDAY: "Sun",
  }
  return map[day.toUpperCase()] ?? "Mon"
}

// Transform BusinessDetail to BusinessAvailability
export function transformBusinessAvailabilityData(
  apiData: BusinessDetail
): BusinessAvailability {
  const { businessAvailability: businessAvailabilities, holiday } = apiData

  const breaks: Record<WeekDay, [string, string][]> = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  }

  businessAvailabilities?.forEach((availability) => {
    const day = toShortDay(availability.weekDay)
    const breakSlots = availability.timeSlots
      .filter((slot) => slot.type === "BREAK")
      .map(
        (slot) =>
          [isoToNormalTime(slot.startTime), isoToNormalTime(slot.endTime)] as [
            string,
            string,
          ]
      )
    breaks[day] = breakSlots
  })

  const holidays: WeekDay[] = holiday?.map((h) => toShortDay(h.holiday)) || []
  console.log(
    "transformBusinessAvailabilityData: breaks =",
    breaks,
    "holidays =",
    holidays
  )
  return { breaks, holidays }
}

// Convert time string (e.g., "08:00 AM") to ISO 8601
export const toDate = (time: string): string => {
  const date = new Date()
  return normalOrFormTimeToIso(date, time)
}

// Format availability note
export const formatAvailabilityNote = (): string =>
  "Holidays and break times are set in Business Availability. Update in Business Settings > Business Availability."
