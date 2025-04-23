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
import {
  CalendarDays,
  Clock,
  History,
  Hourglass,
  Plus,
  Trash2,
} from "lucide-react"
import BusinessHourSelector from "./business-hour-selector"
import AvailabilityTabs from "@/components/custom-form-fields/availability-tabs"
import BusinessDaysField from "@/components/custom-form-fields/business-settings/business-day-field"
import HolidayField from "@/components/custom-form-fields/business-settings/business-holiday-field"

// Default form values
const defaultValues = {
  timeZone: "",
  businessDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  holidays: ["Sat", "Sun"],
  availabilityMode: "default",
  businessHours: {
    Mon: {
      work: [["08:00 AM", "10:00 AM"]],
      break: [
        ["12:00 PM", "01:00 PM"],
        ["02:00 PM", "03:00 PM"],
        ["03:00 PM", "04:00 PM"],
      ],
    },
    Tue: {
      work: [["09:00 AM", "05:00 PM"]],
      break: [["02:00 PM", "04:00 PM"]],
    },
    Wed: { work: [["09:00 AM", "05:00 PM"]], break: [] },
    Thu: { work: [["09:00 AM", "05:00 PM"]], break: [] },
    Fri: { work: [["09:00 AM", "05:00 PM"]], break: [] },
    Sat: { work: [], break: [] },
    Sun: { work: [], break: [] },
  },
}

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

export default function BusinessSettingsForm() {
  const form = useForm({ defaultValues })
  const { watch } = form

  const onSubmit = (data: any) => console.log("Final Submit:", data)

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Availability Mode */}
        <AvailabilityTabs name="availabilityMode" icon={CalendarDays} />

        {/* Time Zone Field */}
        <TimeZoneField name="timeZone" />

        {/* Business Days */}
        <BusinessDaysField name="businessDays" holidayFieldName="holidays" />

        {/* Business Hours */}
        <BusinessHourSelector name="businessHours" icon={Hourglass} />

        {/* Holidays */}
        <HolidayField name="holidays" disableFieldName="businessDays" />

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Button type="submit" className="bg-blue-500 text-white w-full">
            Proceed
          </Button>
          <Button type="button" variant="secondary" className="w-full">
            Save and Exit
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

// Time Zone Selector
const TimeZoneField = ({ name }: { name: string }) => {
  const { watch, setValue } = useFormContext()
  const value = watch(name)
  return (
    <div className="space-y-1 ">
      <div className="flex gap-2 items-center">
        <History className="size-4 text-gray-500" />
        <Label>Time Zone</Label>
      </div>
      <Select value={value} onValueChange={(val) => setValue(name, val)}>
        <SelectTrigger className="w-full">
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
    </div>
  )
}

// // Business Days Selector
// const BusinessDaysField = ({ name, holidayFieldName }: any) => {
//   const { watch, setValue } = useFormContext()
//   const selected = watch(name) || []
//   const holidays = watch(holidayFieldName) || []

//   const toggle = (day: string) => {
//     const updated = selected.includes(day)
//       ? selected.filter((d: string) => d !== day)
//       : [...selected, day]
//     setValue(name, updated)
//   }

//   return (
//     <div className="space-y-1">
//       <Label>Business Days</Label>
//       <div className="flex gap-2 flex-wrap">
//         {days.map((day) => (
//           <Button
//             key={day}
//             type="button"
//             onClick={() => toggle(day)}
//             disabled={holidays.includes(day)}
//             variant={selected.includes(day) ? "default" : "outline"}
//             className={cn(
//               "min-w-[60px]",
//               selected.includes(day) && "bg-blue-500 text-white"
//             )}
//           >
//             {day}
//           </Button>
//         ))}
//       </div>
//     </div>
//   )
// }

// Business Hours Tab View
// const BusinessHoursField = ({ name }: { name: string }) => {
//   const { watch, setValue } = useFormContext()
//   const hours = watch(name)
//   const businessDays = watch("businessDays") || []
//   const holidays = watch("holidays") || []
//   const availableDays = businessDays.filter(
//     (d: string) => !holidays.includes(d)
//   )

//   const [activeDay, setActiveDay] = useState(availableDays[0])

//   const update = (
//     day: string,
//     type: "work" | "break",
//     index: number,
//     pos: 0 | 1,
//     value: string
//   ) => {
//     const updated = { ...hours }
//     const slot = [...(updated[day]?.[type]?.[index] || ["", ""])]
//     slot[pos] = value
//     updated[day][type][index] = slot
//     setValue(name, updated)
//   }

//   const addSlot = (day: string, type: "work" | "break") => {
//     const updated = { ...hours }
//     updated[day][type] = [...(updated[day][type] || []), ["", ""]]
//     setValue(name, updated)
//   }

//   const removeSlot = (day: string, type: "work" | "break", index: number) => {
//     const updated = { ...hours }
//     updated[day][type] = updated[day][type].filter(
//       (_: any, i: number) => i !== index
//     )
//     setValue(name, updated)
//   }

//   return (
//     <div className="space-y-3">
//       <Label>Business Hours / Day</Label>

//       {/* Day Tabs */}
//       <div className="flex gap-2 items-center">
//         <CalendarDays className="size-5" />
//         {availableDays.map((day: string) => (
//           <Button
//             key={day}
//             type="button"
//             onClick={() => setActiveDay(day)}
//             variant={activeDay === day ? "default" : "outline"}
//           >
//             {day}
//           </Button>
//         ))}
//       </div>

//       {/* Time Slots */}
//       {activeDay && (
//         <div className="space-y-6">
//           {["work", "break"].map((type) => (
//             <div key={type} className="space-y-1">
//               <div className="flex items-center gap-2">
//                 {type === "work" ? (
//                   <Clock className="size-4" />
//                 ) : (
//                   <Clock className="size-4 opacity-50" />
//                 )}
//                 <span className="text-sm font-medium">
//                   {type === "work" ? "Work Hours" : "Break Hours"}
//                 </span>
//               </div>
//               {(hours?.[activeDay]?.[type] || []).map(
//                 (slot: [string, string], idx: number) => (
//                   <div key={idx} className="flex gap-2 items-center">
//                     {[0, 1].map((pos) => (
//                       <Select
//                         key={pos}
//                         value={slot[pos]}
//                         onValueChange={(val) =>
//                           update(activeDay, type as any, idx, pos as 0 | 1, val)
//                         }
//                       >
//                         <SelectTrigger className="w-40">
//                           <SelectValue
//                             placeholder={pos === 0 ? "Start" : "End"}
//                           />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {timeOptions.map((t) => (
//                             <SelectItem key={t} value={t}>
//                               {t}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     ))}
//                     {idx > 0 && (
//                       <Button
//                         type="button"
//                         size="icon"
//                         variant="ghost"
//                         onClick={() => removeSlot(activeDay, type as any, idx)}
//                       >
//                         <Trash2 className="w-4 h-4 text-red-500" />
//                       </Button>
//                     )}
//                   </div>
//                 )
//               )}
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => addSlot(activeDay, type as any)}
//                 size="sm"
//               >
//                 <Plus className="w-3 h-3 mr-1" /> Add{" "}
//                 {type === "work" ? "Work" : "Break"} Hour
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
