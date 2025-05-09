// "use client"

// import { useFormContext } from "react-hook-form"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { cn } from "@/lib/utils"
// import { CalendarDays, LucideIcon, Plus, Trash2 } from "lucide-react"
// import { useEffect, useState } from "react"

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

// const defaultBreak = ["12:00 PM", "01:00 PM"]

// const BusinessHourSelector = ({
//   name,
//   icon: Icon = CalendarDays,
// }: {
//   name: string
//   icon?: LucideIcon
// }) => {
//   const { watch, setValue } = useFormContext()

//   const businessDays = watch("businessDays") || []
//   const holidays = watch("holidays") || []
//   const businessHours = watch(name) || {}

//   const [activeDay, setActiveDay] = useState(businessDays[0] || "")

//   // Initialize default break for each day
//   useEffect(() => {
//     const updated = { ...businessHours }
//     let hasChanges = false

//     businessDays.forEach((day: string) => {
//       if (!updated[day]) {
//         updated[day] = { work: [], break: [defaultBreak] }
//         hasChanges = true
//       } else if (!updated[day].break || updated[day].break.length === 0) {
//         updated[day].break = [defaultBreak]
//         hasChanges = true
//       }
//     })

//     if (hasChanges) {
//       setValue(name, updated, { shouldValidate: true })
//     }
//   }, [businessDays, businessHours, setValue, name])

//   // Filter time options to exclude break times
//   const getWorkTimeOptions = (breakSlots: [string, string][]) => {
//     return timeOptions.filter((time) => {
//       return !breakSlots.some(([start, end]) => time >= start && time <= end)
//     })
//   }

//   // Get available times for a slot, respecting previous slot's end time
//   const getAvailableTimes = (
//     afterTime: string | undefined,
//     options: string[],
//     isEnd: boolean = false
//   ) => {
//     if (!afterTime || !options.includes(afterTime)) return options
//     const index = options.indexOf(afterTime)
//     return isEnd ? options.slice(index + 1) : options.slice(index)
//   }

//   const handleChange = (
//     day: string,
//     index: number,
//     type: "work" | "break",
//     position: "start" | "end",
//     value: string
//   ) => {
//     const updated = { ...businessHours }
//     const slots = [...(updated[day]?.[type] || [])]
//     const current = slots[index] || ["", ""]

//     if (position === "start") current[0] = value
//     else current[1] = value

//     slots[index] = current
//     updated[day] = { ...updated[day], [type]: slots }
//     setValue(name, updated, { shouldValidate: true })
//   }

//   const addSlot = (day: string, type: "work" | "break") => {
//     const updated = { ...businessHours }
//     const prevSlots = updated[day]?.[type] || []
//     const prevEnd = prevSlots[prevSlots.length - 1]?.[1] || ""
//     updated[day] = {
//       ...updated[day],
//       [type]: [...prevSlots, [prevEnd, ""]],
//     }
//     setValue(name, updated, { shouldValidate: true })
//   }

//   const removeSlot = (day: string, type: "work" | "break", index: number) => {
//     const updated = { ...businessHours }
//     updated[day][type] = updated[day][type].filter(
//       (_: any, i: number) => i !== index
//     )
//     setValue(name, updated, { shouldValidate: true })
//   }

//   // Get break slots for the active day, default to defaultBreak
//   const breakSlots = businessHours[activeDay]?.["break"] || [defaultBreak]

//   // Get work time options, excluding all break times
//   const workTimeOptions = getWorkTimeOptions(breakSlots)

//   const convertToMinutes = (time: string): number => {
//     const [hourMin, period] = time.split(" ")
//     let [hour, minute] = hourMin.split(":").map(Number)
//     if (period === "PM" && hour !== 12) hour += 12
//     if (period === "AM" && hour === 12) hour = 0
//     return hour * 60 + minute
//   }

//   const isInRange = (time: string, start: string, end: string): boolean => {
//     const t = convertToMinutes(time)
//     return t >= convertToMinutes(start) && t < convertToMinutes(end)
//   }
//   return (
//     <div className="space-y-2">
//       <div className="flex gap-1">
//         {Icon && <Icon className="size-4 text-gray-500" />}
//         <Label>Business Hours/Day</Label>
//       </div>

//       {/* Tabs */}
//       <div className="flex items-center gap-2">
//         <CalendarDays className="size-5 text-gray-500" />
//         <div className="flex gap-2 flex-wrap">
//           {businessDays
//             .filter((day: string) => !holidays.includes(day))
//             .map((day: string) => (
//               <Button
//                 key={day}
//                 type="button"
//                 variant={activeDay === day ? "default" : "outline"}
//                 onClick={() => setActiveDay(day)}
//                 className={cn(
//                   "px-4 min-w-[72px]",
//                   activeDay === day &&
//                     "shadow-[inset_0px_2px_4px_0px_#001F5280]"
//                 )}
//               >
//                 {day}
//               </Button>
//             ))}
//         </div>
//       </div>

//       {/* Work & Break side by side */}
//       <div className="flex flex-col md:flex-row lg:gap-6  w-full">
//         {["work", "break"].map((type) => {
//           const isWork = type === "work"
//           const label = isWork ? "Work Hours 🛠️" : "Break Hours ☕"
//           const slots =
//             businessHours[activeDay]?.[type] || (isWork ? [] : [defaultBreak])

//           return (
//             <div key={type} className="space-y-4">
//               <div className="flex flex-col lg:flex-row gap-2 items-start  p-4">
//                 <Label className="pt-2">{label}</Label>
//                 <div className="flex flex-col gap-2">
//                   {slots.map((slot: [string, string], idx: number) => {
//                     // ✅ For working slots only, filter out break overlaps
//                     const breakSlots = businessHours[activeDay]?.["break"] || []
//                     const fullOptions = timeOptions

//                     const options = isWork
//                       ? fullOptions.filter((time) => {
//                           return !breakSlots.some(([start, end]) =>
//                             isInRange(time, start, end)
//                           )
//                         })
//                       : fullOptions

//                     const availableStart = getAvailableTimes(
//                       idx > 0 ? slots[idx - 1][1] : undefined,
//                       options
//                     )
//                     const availableEnd = getAvailableTimes(
//                       slot[0],
//                       options,
//                       true
//                     )

//                     return (
//                       <div
//                         key={idx}
//                         className="flex items-center gap-4 justify-center"
//                       >
//                         {/* Start Time */}
//                         <Select
//                           value={slot[0]}
//                           onValueChange={(val) =>
//                             handleChange(activeDay, idx, type, "start", val)
//                           }
//                         >
//                           <SelectTrigger className="w-36">
//                             <SelectValue placeholder="Start" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {availableStart.map((t) => (
//                               <SelectItem key={t} value={t}>
//                                 {t}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>

//                         {/* End Time */}
//                         <div className="relative">
//                           <Select
//                             value={slot[1]}
//                             onValueChange={(val) =>
//                               handleChange(activeDay, idx, type, "end", val)
//                             }
//                           >
//                             <SelectTrigger className="w-36">
//                               <SelectValue placeholder="End" />
//                             </SelectTrigger>
//                             <SelectContent>
//                               {availableEnd.map((t) => (
//                                 <SelectItem key={t} value={t}>
//                                   {t}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>

//                           {/* Trash icon for extra slots */}
//                           {idx > 0 && (
//                             <Button
//                               type="button"
//                               size="icon"
//                               variant="ghost"
//                               onClick={() => removeSlot(activeDay, type, idx)}
//                               className="absolute -right-10 top-0"
//                             >
//                               <Trash2 className="w-4 h-4 text-destructive" />
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     )
//                   })}

//                   {/* Add slot button */}
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => addSlot(activeDay, type)}
//                     className="text-xs gap-1"
//                   >
//                     <Plus className="w-3 h-3" />
//                     Add Slot
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// export default BusinessHourSelector
"use client"

import { useFormContext } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CalendarDays, LucideIcon, Plus, Trash2 } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { toast } from "sonner"

// Available time options for work and break slots
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
] as const

// Default break slot (12:00 PM - 01:00 PM)
const defaultBreak: [string, string] = ["12:00 PM", "01:00 PM"]

// Type definitions for better type safety
type TimeSlot = [string, string]
type BusinessHours = Record<string, { work: TimeSlot[]; break: TimeSlot[] }>
type SlotType = "work" | "break"

// BusinessHourSelector component
interface BusinessHourSelectorProps {
  name: string
  icon?: LucideIcon
}

const BusinessHourSelector = ({
  name,
  icon: Icon = CalendarDays,
}: BusinessHourSelectorProps) => {
  const { watch, setValue } = useFormContext()
  const businessDays: string[] = watch("businessDays") || []
  const holidays: string[] = watch("holidays") || []
  const businessHours: BusinessHours = watch(name) || {}
  const [activeDay, setActiveDay] = useState(businessDays[0] || "")

  // Memoized time-to-minutes conversion cache
  const timeToMinutesCache = useMemo(() => new Map<string, number>(), [])

  /**
   * Converts a time string (e.g., "08:00 AM") to minutes since midnight
   * @param time Time string in format "HH:MM AM/PM"
   * @returns Minutes since midnight
   */
  const convertToMinutes = (time: string): number => {
    if (timeToMinutesCache.has(time)) {
      return timeToMinutesCache.get(time)!
    }
    const [hourMin, period] = time.split(" ")
    let [hour, minute] = hourMin.split(":").map(Number)
    if (period === "PM" && hour !== 12) hour += 12
    if (period === "AM" && hour === 12) hour = 0
    const minutes = hour * 60 + minute
    timeToMinutesCache.set(time, minutes)
    return minutes
  }

  /**
   * Checks if a time is invalid as a start time (matches opposite type's start or within its window)
   * @param time Time to check
   * @param oppositeSlots Slots of the opposite type (work for break, break for work)
   * @param type Slot type ("work" or "break")
   * @returns True if the time is invalid
   */
  const isInvalidStart = (
    time: string,
    oppositeSlots: TimeSlot[],
    type: SlotType
  ): boolean => {
    if (!time) return false
    const timeMin = convertToMinutes(time)
    return oppositeSlots.some(([start, end]) => {
      const startMin = convertToMinutes(start)
      const endMin = convertToMinutes(end)
      return timeMin === startMin || (timeMin > startMin && timeMin <= endMin)
    })
  }

  /**
   * Checks if a time is invalid as an end time (within opposite type's window)
   * @param time Time to check
   * @param oppositeSlots Slots of the opposite type
   * @returns True if the time is invalid
   */
  const isInvalidEnd = (time: string, oppositeSlots: TimeSlot[]): boolean => {
    if (!time) return false
    const timeMin = convertToMinutes(time)
    return oppositeSlots.some(([start, end]) => {
      const startMin = convertToMinutes(start)
      const endMin = convertToMinutes(end)
      return timeMin > startMin && timeMin <= endMin
    })
  }

  /**
   * Gets available times for a slot, respecting the previous slot's end time
   * @param afterTime Previous slot's end time
   * @param options Available time options
   * @param isEnd Whether selecting end time
   * @returns Array of available times
   */
  const getAvailableTimes = (
    afterTime: string | undefined,
    options: readonly string[],
    isEnd: boolean = false
  ): string[] => {
    if (!afterTime || !options.includes(afterTime)) return [...options]
    const index = options.indexOf(afterTime)
    return isEnd ? options.slice(index + 1) : options.slice(index)
  }

  /**
   * Handles changes to a slot's start or end time
   * @param day Day of the week
   * @param index Slot index
   * @param type Slot type ("work" or "break")
   * @param position "start" or "end"
   * @param value Selected time
   */
  const handleChange = (
    day: string,
    index: number,
    type: SlotType,
    position: "start" | "end",
    value: string
  ) => {
    const updated: BusinessHours = { ...businessHours }
    const slots = [...(updated[day]?.[type] || [])]
    const current = slots[index] || ["", ""]
    const oppositeType = type === "work" ? "break" : "work"
    const oppositeSlots = updated[day]?.[oppositeType] || []

    // Update the slot
    if (position === "start") current[0] = value
    else current[1] = value

    // Validate start and end times
    if (position === "start" && isInvalidStart(value, oppositeSlots, type)) {
      toast.error(`Cannot select ${oppositeType} hours for ${type} start time`)
      return
    }
    if (position === "end" && isInvalidEnd(value, oppositeSlots)) {
      toast.error(`Cannot select ${oppositeType} hours for ${type} end time`)
      return
    }

    slots[index] = current
    updated[day] = { ...updated[day], [type]: slots }
    setValue(name, updated, { shouldValidate: true })
  }

  /**
   * Adds a new slot for the specified type
   * @param day Day of the week
   * @param type Slot type ("work" or "break")
   */
  const addSlot = (day: string, type: SlotType) => {
    const updated: BusinessHours = { ...businessHours }
    const prevSlots = updated[day]?.[type] || []
    const oppositeType = type === "work" ? "break" : "work"
    const oppositeSlots = updated[day]?.[oppositeType] || []
    const prevEnd = prevSlots[prevSlots.length - 1]?.[1] || timeOptions[0]

    // Get available start times after the last slot's end time
    const availableStart = getAvailableTimes(prevEnd, timeOptions)

    // Find a valid start time
    const newStart = availableStart.find(
      (time) => !isInvalidStart(time, oppositeSlots, type)
    )

    // If no valid start time is found, add an empty slot
    if (!newStart) {
      toast.error(`New ${type} slot cannot start during ${oppositeType} hours`)
      updated[day] = {
        ...updated[day],
        [type]: [...prevSlots, ["", ""]],
      }
      setValue(name, updated, { shouldValidate: true })
      return
    }

    // Add a slot with the valid start time and empty end time
    updated[day] = {
      ...updated[day],
      [type]: [...prevSlots, [newStart, ""]],
    }
    setValue(name, updated, { shouldValidate: true })
  }

  /**
   * Removes a slot
   * @param day Day of the week
   * @param type Slot type ("work" or "break")
   * @param index Slot index
   */
  const removeSlot = (day: string, type: SlotType, index: number) => {
    const updated: BusinessHours = { ...businessHours }
    updated[day][type] = updated[day][type].filter(
      (_: any, i: number) => i !== index
    )
    setValue(name, updated, { shouldValidate: true })
  }

  // Initialize default break slots for new business days
  useEffect(() => {
    const updated: BusinessHours = { ...businessHours }
    let hasChanges = false

    businessDays.forEach((day: string) => {
      if (!updated[day]) {
        updated[day] = { work: [], break: [defaultBreak] }
        hasChanges = true
      } else if (!updated[day].break || updated[day].break.length === 0) {
        updated[day].break = [defaultBreak]
        hasChanges = true
      }
    })

    if (hasChanges) {
      setValue(name, updated, { shouldValidate: true })
    }
  }, [businessDays, businessHours, setValue, name])

  // Get break slots for the active day
  const breakSlots = businessHours[activeDay]?.["break"] || []

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {Icon && <Icon className="size-4 text-gray-500" />}
        <Label>Business Hours/Day</Label>
      </div>

      {/* Tabs for selecting active day */}
      <div className="flex items-center gap-2">
        <CalendarDays className="size-5 text-gray-500" />
        <div className="flex gap-2 flex-wrap">
          {businessDays
            .filter((day: string) => !holidays.includes(day))
            .map((day: string) => (
              <Button
                key={day}
                type="button"
                variant={activeDay === day ? "default" : "outline"}
                onClick={() => setActiveDay(day)}
                className={cn(
                  "px-4 min-w-[72px]",
                  activeDay === day &&
                    "shadow-[inset_0px_2px_4px_0px_#001F5280]"
                )}
              >
                {day}
              </Button>
            ))}
        </div>
      </div>

      {/* Work and Break slots side by side */}
      <div className="flex flex-col md:flex-row lg:gap-6 w-full">
        {(["work", "break"] as const).map((type) => {
          const isWork = type === "work"
          const label = isWork ? "Work Hours 🛠️" : "Break Hours ☕"
          const slots = businessHours[activeDay]?.[type] || []

          return (
            <div key={type} className="space-y-4 flex-1">
              <div className="flex flex-col lg:flex-row gap-2 items-start p-4">
                <Label className="pt-2">{label}</Label>
                <div className="flex flex-col gap-2">
                  {slots.map((slot: TimeSlot, idx: number) => {
                    const availableStart = getAvailableTimes(
                      idx > 0 ? slots[idx - 1][1] : undefined,
                      timeOptions
                    )
                    const availableEnd = getAvailableTimes(
                      slot[0],
                      timeOptions,
                      true
                    )

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 justify-center"
                      >
                        {/* Start Time */}
                        <Select
                          value={slot[0]}
                          onValueChange={(val) =>
                            handleChange(activeDay, idx, type, "start", val)
                          }
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue placeholder="Start" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableStart.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* End Time */}
                        <div className="relative">
                          <Select
                            value={slot[1]}
                            onValueChange={(val) =>
                              handleChange(activeDay, idx, type, "end", val)
                            }
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="End" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableEnd.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {/* Trash icon for extra slots */}
                          {(idx > 0 || (type === "break" && idx >= 0)) && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => removeSlot(activeDay, type, idx)}
                              className="absolute -right-10 top-0"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Add slot button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addSlot(activeDay, type)}
                    className="text-xs gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Slot
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BusinessHourSelector
