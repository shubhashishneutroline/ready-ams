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
import { useState } from "react"
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
import { parse, format } from "date-fns"
import { toZonedTime } from "date-fns-tz"

// Default form values (used as fallback)
const defaultValues = {
  // timeZone: "",
  // businessDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  // holidays: ["Sat", "Sun"],
  // availabilityMode: "default",
  // businessHours: {
  //   Mon: {
  //     work: [["08:00 AM", "10:00 AM"]],
  //     break: [
  //       ["12:00 PM", "01:00 PM"],
  //       ["02:00 PM", "03:00 PM"],
  //       ["03:00 PM", "04:00 PM"],
  //     ],
  //   },
  //   Tue: {
  //     work: [["09:00 AM", "05:00 PM"]],
  //     break: [["02:00 PM", "04:00 PM"]],
  //   },
  //   Wed: { work: [["09:00 AM", "05:00 PM"]], break: [] },
  //   Thu: { work: [["09:00 AM", "05:00 PM"]], break: [] },
  //   Fri: { work: [["09:00 AM", "05:00 PM"]], break: [] },
  //   Sat: { work: [], break: [] },
  //   Sun: { work: [], break: [] },
  // },
}

// Weekday mapping for transformation
const weekdayMap: { [key: string]: string } = {
  Mon: "MONDAY",
  Tue: "TUESDAY",
  Wed: "WEDNESDAY",
  Thu: "THURSDAY",
  Fri: "FRIDAY",
  Sat: "SATURDAY",
  Sun: "SUNDAY",
}

// Transform form data to API-compatible format
const transformFormDataForApi = (business: any, availabilityData: any) => {
  const { businessDays, holidays, businessHours, timeZone } = availabilityData

  // Log timeZone to debug
  console.log("Transforming data, timeZone:", timeZone)

  // Convert 12-hour AM/PM times to 24-hour format
  const convertTo24Hour = (time: string, businessTimeZone: string): string => {
    try {
      // Parse time with a dummy date
      const parsedTime = parse(time, "h:mm a", new Date())
      // Convert to business timezone
      const zonedTime = toZonedTime(parsedTime, businessTimeZone || "UTC")
      // Format to 24-hour "HH:mm:ss"
      return format(zonedTime, "HH:mm:ss")
    } catch (error) {
      console.error(`Error converting time: ${time}`, error)
      return time // Fallback to original time to avoid breaking
    }
  }

  // Transform business details
  const businessDetail = {
    id: business.id, // Include ID for updates
    name: business.businessName,
    industry: business.industry,
    email: business.email,
    phone: business.phone,
    website: business.website || "",
    businessRegistrationNumber: business.registrationNumber,
    businessOwner: "cmadr26aq0000msamhiabkpzu",
    status: business.visibility,
    timeZone: timeZone || "UTC",
    address: [
      {
        street: business.street,
        city: business.city,
        country: business.country,
        zipCode: business.zipCode,
        googleMap: business.googleMap || "",
      },
    ],
  }

  // Transform business availability with full weekday names and 24-hour times
  const businessAvailability = businessDays.flatMap((day: string) => {
    const hours = businessHours[day] || { work: [], break: [] }
    const slots = [
      ...hours.work.map((slot: [string, string]) => ({
        type: "WORK",
        startTime: convertTo24Hour(slot[0], timeZone || "UTC"),
        endTime: convertTo24Hour(slot[1], timeZone || "UTC"),
      })),
      ...hours.break.map((slot: [string, string]) => ({
        type: "BREAK",
        startTime: convertTo24Hour(slot[0], timeZone || "UTC"),
        endTime: convertTo24Hour(slot[1], timeZone || "UTC"),
      })),
    ]

    return slots.length > 0
      ? [
          {
            weekDay: weekdayMap[day] || day,
            type: "GENERAL",
            timeSlots: slots,
          },
        ]
      : []
  })

  // Transform holidays with full weekday names
  const holiday = holidays.map((day: string) => ({
    holiday: weekdayMap[day] || day,
    type: "GENERAL",
    date: "", // If you have a holiday date, you can include it here
  }))

  return {
    ...businessDetail,
    businessAvailability,
    holiday,
  }
}

export default function BusinessSettingsForm({ business }: { business?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dynamically set default values based on business prop
  const formDefaultValues = {
    timeZone: business?.timeZone || "",
    businessDays: business?.businessDays || defaultValues.businessDays,
    holidays: business?.holidays || defaultValues.holidays,
    availabilityMode:
      business?.availabilityMode || defaultValues.availabilityMode,
    businessHours: business?.businessHours || defaultValues.businessHours,
  }

  const form = useForm({
    defaultValues: formDefaultValues,
    resolver: async (data) => {
      const errors: any = {}
      if (!data.timeZone) {
        errors.timeZone = { type: "required", message: "Time zone is required" }
      }
      return {
        values: Object.keys(errors).length ? {} : data,
        errors,
      }
    },
  })
  const {
    watch,
    formState: { errors },
  } = form

  const onSubmit = async (data: any) => {
    console.log("Form data before transformation:", data)
    if (!business || !business.businessName) {
      toast.error("Please complete business details first.")
      return
    }
    console.log(
      "Form data after transformation:",
      transformFormDataForApi(business, data)
    )

    setIsSubmitting(true)
    try {
      // Transform the combined data
      const formattedData = transformFormDataForApi(business, data)

      console.log("Formatted data sent to API:", formattedData)

      // Make POST/PUT request to the API
      let response
      if (business.id) {
        response = await updateBusiness(business.id, formattedData)
      } else {
        response = await createBusiness(formattedData)
      }
      console.log("API response:", response)

      if (response.data) {
        toast.success(
          business.id
            ? "Business updated successfully!"
            : "Business created successfully!"
        )
      } else {
        toast.error(
          `Failed to ${business.id ? "update" : "create"} business: ${response.message}`
        )
      }
    } catch (error) {
      toast.error(
        `An error occurred while ${business.id ? "updating" : "submitting"} the form.`
      )
      console.error("Error submitting form:", error)
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
            ) : business.id ? (
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
