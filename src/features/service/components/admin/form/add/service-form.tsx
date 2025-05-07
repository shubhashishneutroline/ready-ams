"use client"

import { useForm, FormProvider } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
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
import { createService } from "@/features/service/api/api"
import { toDate } from "@/lib/lib"

// Weekdays type
export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"

export type BusinessAvailability = {
  breaks: Record<WeekDay, [string, string][]>
  holidays: WeekDay[]
}

export const toFullDay = (day: string): string => {
  const map: Record<string, string> = {
    Mon: "MONDAY",
    Tue: "TUESDAY",
    Wed: "WEDNESDAY",
    Thu: "THURSDAY",
    Fri: "FRIDAY",
    Sat: "SATURDAY",
    Sun: "SUNDAY",
  }
  return map[day] ?? "MONDAY"
}

const formatAvailabilityNote = () => {
  return "Holidays and break times are set in Business Availability. Update in Business Settings > Business Availability."
}

interface Props {
  businessAvailability: BusinessAvailability
  businessId: string
}

export default function ServiceForm({
  businessAvailability,
  businessId,
}: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const days: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  // Dynamically set default serviceDays to exclude holidays
  const defaultServiceDays = days.filter(
    (day) => !businessAvailability.holidays.includes(day)
  )

  // Dynamically set default serviceHours, empty for holidays
  const defaultServiceHours = days.reduce(
    (acc, day) => ({
      ...acc,
      [day]: businessAvailability.holidays.includes(day)
        ? []
        : [["09:00", "17:00"]], // Use HH:mm to match useBusinessStore
    }),
    {} as Record<WeekDay, [string, string][]>
  )

  const form = useForm({
    defaultValues: {
      serviceName: "",
      description: "",
      image: null,
      availabilityMode: "default",
      serviceDays: defaultServiceDays,
      serviceHours: defaultServiceHours,
      isAvailable: true,
      duration: "",
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
      setLoading(true)
      const serviceData = {
        title: data.serviceName,
        description: data.description,
        estimatedDuration: parseInt(data.duration),
        status: data.isAvailable ? "ACTIVE" : "INACTIVE",
        serviceAvailability: data.serviceDays.map((day) => ({
          weekDay: toFullDay(day),
          timeSlots: (data.serviceHours[day] || []).map(
            ([startTime, endTime]) => ({
              startTime: toDate(startTime),
              endTime: toDate(endTime),
            })
          ),
        })),
        businessDetailId: businessId,
      }
      console.log("ServiceForm: onSubmit: serviceData =", serviceData)
      const { success, message } = await createService(serviceData)
      if (success) {
        toast.success("Service created successfully", { id: "create-service" })
        router.push("/service")
      } else {
        toast.error(message || "Failed to create service", {
          id: "create-service",
        })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create service"
      console.error("ServiceForm: onSubmit: Error =", error)
      toast.error(errorMessage, { id: "create-service" })
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/service")
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <ImageUploadField name="image" label="Cover Picture" icon={ImageUp} />
          <AvailabilityTabs name="availabilityMode" icon={CalendarClock} />
          <div className="flex items-start gap-2 rounded-md bg-muted/50 py-2 px-3 text-xs text-muted-foreground max-w-md">
            <Info className="size-4 mt-0.5 flex-shrink-0" />
            <p>{formatAvailabilityNote()}</p>
          </div>
          <ServiceDaySelector
            name="serviceDays"
            businessAvailability={businessAvailability}
          />
          <ServiceHoursSelector
            name="serviceHours"
            businessBreaks={businessAvailability.breaks}
          />
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <ToggleSwitch name="isAvailable" label="Availability" />
            <DurationSelect name="duration" label="Duration:" />
          </div>
        </div>
        <div className="flex flex-col gap-3 md:flex-row justify-between mt-6">
          <Button
            disabled={loading}
            type="button"
            variant="outline"
            className="w-full sm:w-auto hover:opacity-95 active:translate-y-0.5 transition-transform duration-200"
            onClick={handleBack}
          >
            ← Back
          </Button>
          <Button
            disabled={loading || !businessId}
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
