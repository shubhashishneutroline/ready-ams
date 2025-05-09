// "use client"

// import { useForm, FormProvider, useFormContext } from "react-hook-form"

// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { CalendarDays, History, Hourglass } from "lucide-react"
// import BusinessHourSelector from "./business-hour-selector"
// import AvailabilityTabs from "@/components/custom-form-fields/availability-tabs"
// import BusinessDaysField from "@/components/custom-form-fields/business-settings/business-day-field"
// import HolidayField from "@/components/custom-form-fields/business-settings/business-holiday-field"
// import {
//   business,
//   businessId,
//   formatBusinessDetails,
//   transformFormData,
// } from "../action/action"
// import { updateBusiness } from "../api/api"
// import { toast } from "sonner"
// import { useRouter } from "next/navigation"

// // Default form values
// const defaultValues = {
//   timeZone: "",
//   businessDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
//   holidays: ["Sat", "Sun"],
//   availabilityMode: "default",
//   businessHours: {
//     Mon: {
//       work: [["08:00 AM", "10:00 AM"]],
//       break: [
//         ["12:00 PM", "01:00 PM"],
//         ["02:00 PM", "03:00 PM"],
//         ["03:00 PM", "04:00 PM"],
//       ],
//     },
//     Tue: {
//       work: [["09:00 AM", "05:00 PM"]],
//       break: [["02:00 PM", "04:00 PM"]],
//     },
//     Wed: { work: [["09:00 AM", "05:00 PM"]], break: [] },
//     Thu: { work: [["09:00 AM", "05:00 PM"]], break: [] },
//     Fri: { work: [["09:00 AM", "05:00 PM"]], break: [] },
//     Sat: { work: [], break: [] },
//     Sun: { work: [], break: [] },
//   },
// }

// const timeOptions = [
//   "08:00 AM",
//   "09:00 AM",
//   "10:00 AM",
//   "11:00 AM",
//   "12:00 PM",
//   "01:00 PM",
//   "02:00 PM",
//   "03:00 PM",
//   "04:00 PM",
//   "05:00 PM",
//   "06:00 PM",
//   "07:00 PM",
//   "08:00 PM",
// ]

// interface BusinessSettingFormProps {
//   business: any
// }

// export default function BusinessSettingsForm({
//   business,
// }: BusinessSettingFormProps) {
//   const router = useRouter()
//   const data = business
//   const dataToEdit = formatBusinessDetails(data)
//   const defaultValues = {
//     timeZone: dataToEdit?.timeZone,
//     businessDays: dataToEdit?.businessDays,
//     holidays: dataToEdit.holidays,
//     availabilityMode: dataToEdit.availabilityMode,
//     businessHours: dataToEdit.businessHours,
//   }
//   console.log(dataToEdit?.businessHours, "Business Hour")

//   const form = useForm({ defaultValues })
//   const { watch } = form

//   const onSubmit = async (formData: any) => {
//     console.log(formData, "From form ")
//     const updatedData = transformFormData(
//       formData,
//       data.businessAvailability,
//       data.id
//     )

//     const updatedBusiness = {
//       ...data,
//       ...updatedData,
//     }
//     console.log(updatedBusiness, "finally updated before submission")
//     try {
//       // Now you pass the actual updated data
//       const response = await updateBusiness(businessId, updatedBusiness)

//       // Handle success here, for example:
//       toast.success("Business updated successfully!")
//       router.push("/")
//     } catch (error) {
//       // Handle error here
//       toast.error("Failed to update business.")
//       console.error("Error updating business:", error)
//     }
//   }

//   return (
//     <FormProvider {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {/* Availability Mode */}
//         <AvailabilityTabs name="availabilityMode" icon={CalendarDays} />

//         {/* Time Zone Field */}
//         <TimeZoneField name="timeZone" />

//         {/* Business Days */}
//         <BusinessDaysField name="businessDays" holidayFieldName="holidays" />

//         {/* Business Hours */}
//         <BusinessHourSelector name="businessHours" icon={Hourglass} />

//         {/* Holidays */}
//         <HolidayField name="holidays" disableFieldName="businessDays" />

//         {/* Actions */}
//         <div className="flex flex-col gap-4">
//           <Button type="submit" className="bg-blue-500 text-white w-full">
//             Proceed
//           </Button>
//           <Button type="button" variant="secondary" className="w-full">
//             Save and Exit
//           </Button>
//         </div>
//       </form>
//     </FormProvider>
//   )
// }

// // Time Zone Selector
// const TimeZoneField = ({ name }: { name: string }) => {
//   const { watch, setValue } = useFormContext()
//   const value = watch(name)
//   return (
//     <div className="space-y-1 ">
//       <div className="flex gap-2 items-center">
//         <History className="size-4 text-gray-500" />
//         <Label>Time Zone</Label>
//       </div>
//       <Select value={value} onValueChange={(val) => setValue(name, val)}>
//         <SelectTrigger className="w-full">
//           <SelectValue placeholder="Select Time Zone" />
//         </SelectTrigger>
//         <SelectContent>
//           {[
//             "UTC",
//             "GMT",
//             "Asia/Kathmandu",
//             "America/New_York",
//             "Europe/London",
//           ].map((zone) => (
//             <SelectItem key={zone} value={zone}>
//               {zone}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   )
// }
//  -----
// "use client"

// import { useForm, FormProvider, useFormContext } from "react-hook-form"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   CalendarDays,
//   Clock,
//   History,
//   Hourglass,
//   Plus,
//   Trash2,
// } from "lucide-react"
// import BusinessHourSelector from "./business-hour-selector"
// import AvailabilityTabs from "@/components/custom-form-fields/availability-tabs"
// import BusinessDaysField from "@/components/custom-form-fields/business-settings/business-day-field"
// import HolidayField from "@/components/custom-form-fields/business-settings/business-holiday-field"

// // Default form values
// const defaultValues = {
//   timeZone: "",
//   businessDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
//   holidays: ["Sat", "Sun"],
//   availabilityMode: "default",
//   businessHours: {
//     Mon: {
//       work: [["08:00 AM", "10:00 AM"]],
//       break: [
//         ["12:00 PM", "01:00 PM"],
//         ["02:00 PM", "03:00 PM"],
//         ["03:00 PM", "04:00 PM"],
//       ],
//     },
//     Tue: {
//       work: [["09:00 AM", "05:00 PM"]],
//       break: [["02:00 PM", "04:00 PM"]],
//     },
//     Wed: { work: [["09:00 AM", "05:00 PM"]], break: [] },
//     Thu: { work: [["09:00 AM", "05:00 PM"]], break: [] },
//     Fri: { work: [["09:00 AM", "05:00 PM"]], break: [] },
//     Sat: { work: [], break: [] },
//     Sun: { work: [], break: [] },
//   },
// }

// const timeOptions = [
//   "08:00 AM",
//   "09:00 AM",
//   "10:00 AM",
//   "11:00 AM",
//   "12:00 PM",
//   "01:00 PM",
//   "02:00 PM",
//   "03:00 PM",
//   "04:00 PM",
//   "05:00 PM",
//   "06:00 PM",
//   "07:00 PM",
//   "08:00 PM",
// ]

// export default function BusinessSettingsForm({ business }: { business?: any }) {
//   const form = useForm({ defaultValues })
//   const { watch } = form

//   const onSubmit = (data: any) => console.log("Final Submit:", data)

//   return (
//     <FormProvider {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//         {/* Availability Mode */}
//         <AvailabilityTabs name="availabilityMode" icon={CalendarDays} />

//         {/* Time Zone Field */}
//         <TimeZoneField name="timeZone" />

//         {/* Business Days */}
//         <BusinessDaysField name="businessDays" holidayFieldName="holidays" />

//         {/* Business Hours */}
//         <BusinessHourSelector name="businessHours" icon={Hourglass} />

//         {/* Holidays */}
//         <HolidayField name="holidays" disableFieldName="businessDays" />

//         {/* Actions */}
//         <div className="flex flex-col gap-4">
//           <Button type="submit" className="bg-blue-500 text-white w-full">
//             Proceed
//           </Button>
//           <Button type="button" variant="secondary" className="w-full">
//             Save and Exit
//           </Button>
//         </div>
//       </form>
//     </FormProvider>
//   )
// }

// // Time Zone Selector
// const TimeZoneField = ({ name }: { name: string }) => {
//   const { watch, setValue } = useFormContext()
//   const value = watch(name)
//   return (
//     <div className="space-y-1 ">
//       <div className="flex gap-2 items-center">
//         <History className="size-4 text-gray-500" />
//         <Label>Time Zone</Label>
//       </div>
//       <Select value={value} onValueChange={(val) => setValue(name, val)}>
//         <SelectTrigger className="w-full">
//           <SelectValue placeholder="Select Time Zone" />
//         </SelectTrigger>
//         <SelectContent>
//           {[
//             "UTC",
//             "GMT",
//             "Asia/Kathmandu",
//             "America/New_York",
//             "Europe/London",
//           ].map((zone) => (
//             <SelectItem key={zone} value={zone}>
//               {zone}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   )
// }
"use client"

import { useForm, FormProvider, useFormContext } from "react-hook-form"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarDays, History, Hourglass, Loader2 } from "lucide-react"
import BusinessHourSelector from "./business-hour-selector"
import AvailabilityTabs from "@/components/custom-form-fields/availability-tabs"
import BusinessDaysField from "@/components/custom-form-fields/business-settings/business-day-field"
import HolidayField from "@/components/custom-form-fields/business-settings/business-holiday-field"
import { toast } from "sonner"
import { createBusiness, updateBusiness } from "../api/api"

// Weekday mapping for form ↔ database conversion
const weekdayMap: { [key: string]: string } = {
  Mon: "MONDAY",
  MONDAY: "Mon",
  Tue: "TUESDAY",
  TUESDAY: "Tue",
  Wed: "WEDNESDAY",
  WEDNESDAY: "Wed",
  Thu: "THURSDAY",
  THURSDAY: "Thu",
  Fri: "FRIDAY",
  FRIDAY: "Fri",
  Sat: "SATURDAY",
  SATURDAY: "Sat",
  Sun: "SUNDAY",
  SUNDAY: "Sun",
}

// Time options matching BusinessHourSelector
const timeOptions = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
]

// Default form values (used as fallback)
const defaultValues = {
  timeZone: "UTC",
  businessDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  holidays: ["Sat", "Sun"],
  availabilityMode: "default",
  businessHours: {
    Mon: {
      work: [["08:00 AM", "08:00 PM"]],
      break: [["12:00 PM", "01:00 PM"]],
    },
    Tue: {
      work: [["09:00 AM", "05:00 PM"]],
      break: [["12:00 PM", "01:00 PM"]],
    },
    Wed: {
      work: [["09:00 AM", "05:00 PM"]],
      break: [["12:00 PM", "01:00 PM"]],
    },
    Thu: {
      work: [["09:00 AM", "05:00 PM"]],
      break: [["12:00 PM", "01:00 PM"]],
    },
    Fri: {
      work: [["09:00 AM", "05:00 PM"]],
      break: [["12:00 PM", "01:00 PM"]],
    },
    Sat: { work: [], break: [] },
    Sun: { work: [], break: [] },
  },
}

// Transform availability data for form
const transformAvailabilityForForm = (availability: any[]) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const businessHours: any = {}

  // Initialize all days with empty work and break arrays
  days.forEach((day) => {
    businessHours[day] = { work: [], break: [] }
  })

  // Map availability to businessHours
  availability.forEach((avail) => {
    const dayKey = weekdayMap[avail.weekDay]
    if (!dayKey || !businessHours[dayKey]) {
      console.warn(`Invalid dayKey for weekDay: ${avail.weekDay}`)
      return
    }
    const workSlots: [string, string][] = []
    const breakSlots: [string, string][] = []

    // Process time slots
    avail.timeSlots.forEach((slot: any) => {
      const startTime = slot.startTime
      const endTime = slot.endTime
      // Validate times against timeOptions
      if (!timeOptions.includes(startTime) || !timeOptions.includes(endTime)) {
        console.warn(`Invalid time slot for ${dayKey}: ${startTime}-${endTime}`)
        return
      }
      const slotPair: [string, string] = [startTime, endTime]
      if (slot.type === "BREAK") {
        breakSlots.push(slotPair)
      } else if (slot.type === "WORK") {
        workSlots.push(slotPair)
      } else {
        console.warn(`Unknown slot type for ${dayKey}: ${slot.type}`)
      }
    })

    // Sort slots by startTime
    const sortByStartTime = (slots: [string, string][]) =>
      slots.sort((a, b) => {
        const timeA = new Date(`1970-01-01 ${a[0]}`)
        const timeB = new Date(`1970-01-01 ${b[0]}`)
        return timeA.getTime() - timeB.getTime()
      })

    businessHours[dayKey].work = sortByStartTime(workSlots)
    businessHours[dayKey].break = sortByStartTime(breakSlots)
  })

  // console.log(
  //   "Transformed businessHours:",
  //   JSON.stringify(businessHours, null, 2)
  // )
  return businessHours
}

// Transform form data to API-compatible format
const transformFormDataForApi = (business: any, availabilityData: any) => {
  console.log("availabilityData", availabilityData)
  console.log("business", business)
  const { businessDays, holidays, businessHours, timeZone } = availabilityData

  // Transform business details
  const businessDetail = {
    id: business?.id || undefined,
    name: business?.businessName || "",
    industry: business?.industry || "",
    email: business?.email || "",
    phone: business?.phone || "",
    website: business?.website || "",
    businessRegistrationNumber: business?.registrationNumber || "",
    businessOwner: business?.businessOwner || "cmaf54tao0000mstgofhtes4y",
    status: business?.visibility || "PENDING",
    timeZone: timeZone || "UTC",
    address: [
      {
        street: business?.street || "",
        city: business?.city || "",
        country: business?.country || "",
        zipCode: business?.zipCode || "",
        googleMap: business?.googleMap || "",
      },
    ],
  }

  // Transform business availability with 12-hour AM/PM times
  const businessAvailability = businessDays.flatMap((day: string) => {
    const hours = businessHours[day] || { work: [], break: [] }
    const slots = [
      ...hours.work.map((slot: [string, string]) => ({
        type: "WORK",
        startTime: slot[0],
        endTime: slot[1],
      })),
      ...hours.break.map((slot: [string, string]) => ({
        type: "BREAK",
        startTime: slot[0],
        endTime: slot[1],
      })),
    ]

    // Sort slots by startTime
    const sortByStartTime = (slots: any[]) =>
      slots.sort((a, b) => {
        const timeA = new Date(`1970-01-01 ${a.startTime}`)
        const timeB = new Date(`1970-01-01 ${b.startTime}`)
        return timeA.getTime() - timeB.getTime()
      })

    return slots.length > 0
      ? [
          {
            weekDay: weekdayMap[day] || day,
            type: "GENERAL",
            timeSlots: sortByStartTime(slots),
          },
        ]
      : []
  })

  // Transform holidays with full weekday names
  const holiday = holidays.map((day: string) => ({
    holiday: weekdayMap[day] || day,
    type: "GENERAL",
    date: "",
  }))

  console.log(
    "API businessAvailability:",
    JSON.stringify(businessAvailability, null, 2)
  )
  return {
    ...businessDetail,
    businessAvailability,
    holiday,
  }
}

export default function BusinessSettingsForm({ business }: { business?: any }) {
  console.log("Incoming business details:", JSON.stringify(business, null, 2))
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Derive businessDays and holidays from business data
  const derivedBusinessDays = business?.businessAvailability
    ? Array.from(
        new Set(
          business.businessAvailability
            .map((avail: any) => weekdayMap[avail.weekDay])
            .filter((day: string) =>
              ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(day)
            )
        )
      )
    : defaultValues.businessDays

  const derivedHolidays = business?.holiday
    ? business.holiday
        .map((h: any) => weekdayMap[h.holiday])
        .filter((day: string) =>
          ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].includes(day)
        )
    : defaultValues.holidays

  // Dynamically set default values based on business prop
  const formDefaultValues = {
    timeZone: business?.timeZone || defaultValues.timeZone,
    businessDays: derivedBusinessDays,
    holidays: derivedHolidays,
    availabilityMode:
      business?.availabilityMode || defaultValues.availabilityMode,
    businessHours: business?.businessAvailability?.length
      ? transformAvailabilityForForm(business.businessAvailability)
      : defaultValues.businessHours,
  }

  // console.log(
  //   "Form default values:",
  //   JSON.stringify(formDefaultValues, null, 2)
  // )
  const form = useForm({
    defaultValues: formDefaultValues,
    resolver: async (data) => {
      const errors: any = {}
      if (!data.timeZone) {
        errors.timeZone = { type: "required", message: "Time zone is required" }
      }
      // Validate that each business day has at least one work slot
      data.businessDays.forEach((day: string) => {
        if (!data.businessHours[day]?.work?.length) {
          errors.businessHours = {
            type: "required",
            message: `At least one work slot is required for ${day}`,
          }
        }
      })
      return {
        values: Object.keys(errors).length ? {} : data,
        errors,
      }
    },
  })

  const {
    watch,
    reset,
    formState: { errors },
  } = form

  // Reset form when business prop changes
  useEffect(() => {
    // console.log(
    //   "Resetting form with default values:",
    //   JSON.stringify(formDefaultValues, null, 2)
    // )
    reset(formDefaultValues, { keepDefaultValues: false })
  }, [reset, JSON.stringify(formDefaultValues)])

  const isUpdateMode = !!business?.id

  const onSubmit = async (data: any) => {
    // console.log(
    //   "Form data before transformation:",
    //   JSON.stringify(data, null, 2)
    // )

    // Validate business details
    if (!business?.businessName) {
      toast.error("Please complete business details first.")
      return
    }

    setIsSubmitting(true)
    try {
      // Transform the combined data
      const formattedData = transformFormDataForApi(business, data)

      // Make POST/PUT request to the API
      let response
      if (isUpdateMode) {
        console.log(`Calling updateBusiness with id: ${formattedData.id}`)
        response = await updateBusiness(formattedData.id, formattedData)
      } else {
        console.log("Calling createBusiness")
        response = await createBusiness(formattedData)
      }
      console.log("API response:", JSON.stringify(response, null, 2))

      if (!response) {
        throw new Error("API response is undefined")
      }

      if (response.data) {
        toast.success(
          isUpdateMode
            ? "Business updated successfully!"
            : "Business created successfully!"
        )
        reset(formDefaultValues)
      } else {
        throw new Error(
          response.message ||
            `Failed to ${isUpdateMode ? "update" : "create"} business`
        )
      }
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred"
      toast.error(
        `An error occurred while ${isUpdateMode ? "updating" : "submitting"} the form: ${errorMessage}`
      )
      console.error(
        `Error ${isUpdateMode ? "updating" : "submitting"} form:`,
        error
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Availability Mode */}
        <AvailabilityTabs name="availabilityMode" icon={CalendarDays} />

        {/* Time Zone Field */}
        <TimeZoneField name="timeZone" error={errors.timeZone?.message} />

        {/* Business Days */}
        <BusinessDaysField name="businessDays" holidayFieldName="holidays" />

        {/* Business Hours */}
        <BusinessHourSelector name="businessHours" icon={Hourglass} />

        {/* Holidays */}
        <HolidayField name="holidays" disableFieldName="businessDays" />

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className="bg-blue-500 text-white w-full flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Submitting...
              </>
            ) : isUpdateMode ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() =>
              toast.info("Save and exit clicked. Data not persisted.")
            }
          >
            Save and Exit
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

// Time Zone Selector
const TimeZoneField = ({ name, error }: { name: string; error?: string }) => {
  const { watch, setValue } = useFormContext()
  const value = watch(name)
  return (
    <div className="space-y-1">
      <div className="flex gap-2 items-center">
        <History className="size-4 text-gray-500" />
        <Label>Time Zone</Label>
      </div>
      <Select
        value={value}
        onValueChange={(val) => setValue(name, val, { shouldValidate: true })}
      >
        <SelectTrigger className={`w-full ${error ? "border-red-500" : ""}`}>
          <SelectValue placeholder="Select Time Zone" />
        </SelectTrigger>
        <SelectContent>
          {[
            "UTC",
            "GMT",
            "Asia/Kathmandu",
            "America/New_York",
            "Europe/London",
          ].map((zone) => (
            <SelectItem key={zone} value={zone}>
              {zone}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
