import { BusinessDetail } from "@/features/business-detail/types/types"
import {
  BusinessAvailability,
  WeekDay,
} from "../components/admin/form/add/service-form"

const fetchService = async () => {
  const serviceData = await getServices()
  return serviceData
}

export const serviceData = await fetchService()

function toShortDay(day: string): WeekDay {
  const map: Record<string, WeekDay> = {
    Monday: "Mon",
    MONDAY: "Mon",
    Tuesday: "Tue",
    TUESDAY: "Tue",
    Wednesday: "Wed",
    WEDNESDAY: "Wed",
    Thursday: "Thu",
    THURSDAY: "Thu",
    Friday: "Fri",
    FRIDAY: "Fri",
    Saturday: "Sat",
    SATURDAY: "Sat",
    Sunday: "Sun",
    SUNDAY: "Sun",
  }

  return map[day] ?? "Mon" // fallback just in case
}

interface TimeSlot {
  id: string
  serviceAvailabilityId: string
  startTime: string
  endTime: string
}

interface ServiceAvailabilityItem {
  id: string
  serviceId: string
  weekDay: string // like "MONDAY"
  timeSlots: TimeSlot[]
}

const weekDayMap: Record<string, WeekDayShort> = {
  MONDAY: "MON",
  TUESDAY: "TUE",
  WEDNESDAY: "WED",
  THURSDAY: "THU",
  FRIDAY: "FRI",
  SATURDAY: "SAT",
  SUNDAY: "SUN",
}

const allDaysShort: WeekDayShort[] = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
]

// Function for formatting the business availability break and holiday data
export function transformBusinessAvailabilityData(
  apiData: BusinessDetail
): BusinessAvailability {
  const { businessAvailability: businessAvailabilities, holiday } = apiData

  // Initialize breaks with empty arrays for each day
  const breaks: Record<WeekDay, [string, string][]> = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  }

  // Process each availability entry from API data
  businessAvailabilities?.forEach((availability) => {
    const day = toShortDay(availability.weekDay) // Convert full day name to short form (Mon, Tue, etc.)

    // Initialize the array for the day if it doesn't exist
    if (!breaks[day as WeekDay]) {
      breaks[day as WeekDay] = []
    }

    availability.timeSlots.forEach((slot) => {
      // Check if the type is "BREAK"
      if (slot.type === "BREAK") {
        const start = new Date(slot.startTime).toISOString().slice(11, 16) // Extract start time
        const end = new Date(slot.endTime).toISOString().slice(11, 16) // Extract end time
        breaks[day as WeekDay].push([start, end]) // Add the time slot to the respective day
      }
    })
  })

  // Map holidays from API data to WeekDay format
  const holidays: WeekDay[] = holiday?.map((h) => toShortDay(h.holiday))
  console.log(breaks, holiday, "inside the function")
  return { breaks, holidays }
}

import { format } from "date-fns"
import { getServices } from "../api/api"

type WeekDayShort = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN"

type TimeSlotTuple = [string, string]
type ServiceHours = Record<WeekDayShort, TimeSlotTuple[]>

// Function for the service availability day and timestamp
export function convertServiceAvailabilityToShortHours(
  serviceAvailability: ServiceAvailabilityItem[]
): ServiceHours {
  const allDaysShort: WeekDayShort[] = [
    "MON",
    "TUE",
    "WED",
    "THU",
    "FRI",
    "SAT",
    "SUN",
  ]

  return allDaysShort.reduce((acc, shortDay) => {
    const dayAvailability = serviceAvailability.find(
      (entry) => entry.weekDay.slice(0, 3).toUpperCase() === shortDay
    )

    const slots: TimeSlotTuple[] = dayAvailability
      ? dayAvailability.timeSlots.map((slot) => [
          format(new Date(slot.startTime), "hh:mm a"),
          format(new Date(slot.endTime), "hh:mm a"),
        ])
      : []

    acc[shortDay] = slots
    return acc
  }, {} as ServiceHours)
}
