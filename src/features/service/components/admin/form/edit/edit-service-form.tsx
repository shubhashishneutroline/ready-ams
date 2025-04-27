"use client"

import { useForm, FormProvider } from "react-hook-form"
import { Button } from "@/components/ui/button"
import InputField from "@/components/custom-form-fields/input-field"
import TextAreaField from "@/components/custom-form-fields/textarea-field"
import ImageUploadField from "@/components/custom-form-fields/image-upload"
import AvailabilityTabs from "@/components/custom-form-fields/availability-tabs"
import ServiceDaySelector from "@/components/custom-form-fields/serivce/service-day-selector"
import ServiceHoursSelector from "@/components/custom-form-fields/serivce/service-hours-selector"
import ToggleSwitch from "@/components/custom-form-fields/toggle-switch"
import DurationSelect from "@/components/custom-form-fields/duration-select"
import {
  CalendarClock,
  ImageUp,
  ScrollText,
  UserRoundCog,
  Info,
} from "lucide-react"
import { toast, Toaster } from "sonner"
import { timeOptions, toMin } from "@/lib/lib"
import { updateService } from "@/features/service/api/api"
import { useRouter } from "next/navigation"

// Define types
export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
export type BusinessAvailability = {
  breaks: Record<WeekDay, [string, string][]>
  holidays: WeekDay[]
}

// Time formatting utility
const formatTime = (date: string): string => {
  const d = new Date(date)
  const hours = d.getHours().toString().padStart(2, "0")
  const minutes = d.getMinutes().toString().padStart(2, "0")
  const ampm = d.getHours() >= 12 ? "PM" : "AM"
  const formattedHours = hours === "00" ? "12" : d.getHours() % 12 || 12
  return `${formattedHours}:${minutes} ${ampm}`
}

// Convert WeekDay to full day name
const toFullDay = (day: WeekDay): string => {
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

// Convert time string (e.g., "08:00 AM") to ISO 8601
const toDate = (time: string): string => {
  const [timePart, modifier] = time.split(" ")
  let [hours, minutes] = timePart.split(":").map(Number)

  if (modifier === "PM" && hours !== 12) hours += 12
  if (modifier === "AM" && hours === 12) hours = 0

  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return date.toISOString()
}

// Format availability note
const formatAvailabilityNote = () => {
  return "Holidays and break times are set in Business Availability. Update in Business Settings > Business Availability."
}

export default function ServiceForm({ serviceDetail }: { serviceDetail: any }) {
  // Derive holidays dynamically
  const holidays: WeekDay[] = serviceDetail.BusinessDetail.holiday.map(
    (h: any) => {
      const dayMap: Record<string, WeekDay> = {
        MONDAY: "Mon",
        TUESDAY: "Tue",
        WEDNESDAY: "Wed",
        THURSDAY: "Thu",
        FRIDAY: "Fri",
        SATURDAY: "Sat",
        SUNDAY: "Sun",
      }
      return dayMap[h.holiday]
    }
  )

  const router = useRouter()

  // Derive breaks dynamically
  const businessBreaks: Record<WeekDay, [string, string][]> = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  }

  serviceDetail.BusinessDetail.businessAvailability.forEach((avail: any) => {
    const dayMap: Record<string, WeekDay> = {
      MONDAY: "Mon",
      TUESDAY: "Tue",
      WEDNESDAY: "Wed",
      THURSDAY: "Thu",
      FRIDAY: "Fri",
      SATURDAY: "Sat",
      SUNDAY: "Sun",
    }
    const weekDay = dayMap[avail.weekDay]
    if (weekDay) {
      const breaks = avail.timeSlots
        .filter((slot: any) => slot.type === "BREAK")
        .map(
          (slot: any) =>
            [formatTime(slot.startTime), formatTime(slot.endTime)] as [
              string,
              string,
            ]
        )
      businessBreaks[weekDay] = breaks
    }
  })

  // Derive service hours with time snapping
  const days: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const defaultServiceHours = days.reduce(
    (acc, day) => {
      if (holidays.includes(day)) {
        return { ...acc, [day]: [] }
      }
      const serviceDay = {
        Mon: "MONDAY",
        Tue: "TUESDAY",
        Wed: "WEDNESDAY",
        Thu: "THURSDAY",
        Fri: "FRIDAY",
        Sat: "SATURDAY",
        Sun: "SUNDAY",
      }[day]
      const availability = serviceDetail.serviceAvailability.find(
        (sa: any) => sa.weekDay === serviceDay
      )
      if (availability) {
        const timeSlots = availability.timeSlots.map((slot: any) => {
          const start = formatTime(slot.startTime)
          const end = formatTime(slot.endTime)
          // Snap to nearest timeOptions entry
          const closestStart = timeOptions.reduce((prev, curr) =>
            Math.abs(toMin(curr) - toMin(start)) <
            Math.abs(toMin(prev) - toMin(start))
              ? curr
              : prev
          )
          const closestEnd = timeOptions.reduce((prev, curr) =>
            Math.abs(toMin(curr) - toMin(end)) <
            Math.abs(toMin(prev) - toMin(end))
              ? curr
              : prev
          )
          return [closestStart, closestEnd] as [string, string]
        })
        return { ...acc, [day]: timeSlots }
      }
      // Ensure default times are in timeOptions
      const defaultStart = timeOptions.includes("09:00 AM")
        ? "09:00 AM"
        : timeOptions[0] || "09:00 AM"
      const defaultEnd = timeOptions.includes("05:00 PM")
        ? "05:00 PM"
        : timeOptions[1] || "05:00 PM"
      return { ...acc, [day]: [[defaultStart, defaultEnd]] }
    },
    {} as Record<WeekDay, [string, string][]>
  )

  // Debug logs
  console.log("ServiceForm Debug - defaultServiceHours:", defaultServiceHours)
  console.log("ServiceForm Debug - timeOptions:", timeOptions)

  // Derive service days
  const defaultServiceDays = days.filter((day) => !holidays.includes(day))

  console.log("ServiceForm - serviceDetail:", serviceDetail)
  const form = useForm({
    defaultValues: {
      serviceName: serviceDetail.title,
      description: serviceDetail.description,
      image: null,
      availabilityMode: "default",
      serviceDays: defaultServiceDays,
      serviceHours: defaultServiceHours,
      isAvailable: serviceDetail.status === "ACTIVE",
      duration: serviceDetail.estimatedDuration.toString(),
    },
  })

  const onSubmit = async (data: {
    serviceName: string
    description: string
    image: File | null
    availabilityMode: string
    serviceDays: WeekDay[]
    serviceHours: Record<WeekDay, [string, string][]>
    isAvailable: boolean
    duration: string
  }) => {
    try {
      const serviceData = {
        title: data.serviceName,
        description: data.description,
        estimatedDuration: parseInt(data.duration),
        status: data.isAvailable ? "ACTIVE" : "INACTIVE",
        serviceAvailability: data.serviceDays
          .filter((day) => data.serviceHours[day]?.length > 0) // Only include days with time slots
          .map((day) => ({
            weekDay: toFullDay(day),
            timeSlots: (data.serviceHours[day] || []).map(
              ([startTime, endTime]) => ({
                startTime: toDate(startTime),
                endTime: toDate(endTime),
              })
            ),
          })),
        businessDetailId: serviceDetail.businessDetailId,
      }

      // // Handle image upload if necessary
      // if (data.image) {
      //   const reader = new FileReader()
      //   reader.readAsDataURL(data.image)
      //   await new Promise((resolve) => {
      //     reader.onload = () => {
      //       serviceData.image = reader.result // Adjust based on backend requirements
      //       resolve()
      //     }
      //   })
      // }

      console.log("servicedata inside onSubmit:", serviceData)
      await updateService(serviceDetail.id, serviceData)
      toast.success("Service updated successfully")
      router.push("/service")

      form.reset()
    } catch (error: any) {
      toast.error(
        `Failed to update service: ${error.message || "Unknown error"}`
      )
      console.error("Error updating service:", error)
    }
  }

  const handleBack = () => {
    router.push("/service")
  }

  return (
    <FormProvider {...form}>
      <Toaster position="top-right" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="">
          <div className="space-y-6">
            <InputField
              name="serviceName"
              label="Service Name"
              icon={UserRoundCog}
            />
            <TextAreaField
              name="description"
              label="Description"
              icon={ScrollText}
            />
            <ImageUploadField
              name="image"
              label="Cover Picture"
              icon={ImageUp}
            />
            <AvailabilityTabs name="availabilityMode" icon={CalendarClock} />
            <div className="flex items-start gap-2 rounded-md bg-muted/50 py-2 px-3 text-xs text-muted-foreground max-w-md">
              <Info className="size-4 mt-0.5 flex-shrink-0" />
              <p>{formatAvailabilityNote()}</p>
            </div>
            <ServiceDaySelector
              name="serviceDays"
              businessAvailability={{ breaks: businessBreaks, holidays }}
            />
            <ServiceHoursSelector
              name="serviceHours"
              businessBreaks={businessBreaks}
            />
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <ToggleSwitch name="isAvailable" label="Availability" />
              <DurationSelect name="duration" label="Duration:" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 md:flex-row justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
            onClick={handleBack}
          >
            ← Back
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
          >
            Create Service
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
