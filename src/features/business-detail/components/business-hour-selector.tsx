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
import { useEffect, useState } from "react"

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

const defaultBreak = ["12:00 PM", "01:00 PM"]

const BusinessHourSelector = ({
  name,
  icon: Icon = CalendarDays,
}: {
  name: string
  icon?: LucideIcon
}) => {
  const { watch, setValue } = useFormContext()

  const businessDays = watch("businessDays") || []
  const holidays = watch("holidays") || []
  const businessHours = watch(name) || {}

  const [activeDay, setActiveDay] = useState(businessDays[0] || "")

  // Initialize default break for each day
  useEffect(() => {
    const updated = { ...businessHours }
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

  // Filter time options to exclude break times
  const getWorkTimeOptions = (breakSlots: [string, string][]) => {
    return timeOptions.filter((time) => {
      return !breakSlots.some(([start, end]) => time >= start && time <= end)
    })
  }

  // Get available times for a slot, respecting previous slot's end time
  const getAvailableTimes = (
    afterTime: string | undefined,
    options: string[],
    isEnd: boolean = false
  ) => {
    if (!afterTime || !options.includes(afterTime)) return options
    const index = options.indexOf(afterTime)
    return isEnd ? options.slice(index + 1) : options.slice(index)
  }

  const handleChange = (
    day: string,
    index: number,
    type: "work" | "break",
    position: "start" | "end",
    value: string
  ) => {
    const updated = { ...businessHours }
    const slots = [...(updated[day]?.[type] || [])]
    const current = slots[index] || ["", ""]

    if (position === "start") current[0] = value
    else current[1] = value

    slots[index] = current
    updated[day] = { ...updated[day], [type]: slots }
    setValue(name, updated, { shouldValidate: true })
  }

  const addSlot = (day: string, type: "work" | "break") => {
    const updated = { ...businessHours }
    const prevSlots = updated[day]?.[type] || []
    const prevEnd = prevSlots[prevSlots.length - 1]?.[1] || ""
    updated[day] = {
      ...updated[day],
      [type]: [...prevSlots, [prevEnd, ""]],
    }
    setValue(name, updated, { shouldValidate: true })
  }

  const removeSlot = (day: string, type: "work" | "break", index: number) => {
    const updated = { ...businessHours }
    updated[day][type] = updated[day][type].filter(
      (_: any, i: number) => i !== index
    )
    setValue(name, updated, { shouldValidate: true })
  }

  // Get break slots for the active day, default to defaultBreak
  const breakSlots = businessHours[activeDay]?.["break"] || [defaultBreak]

  // Get work time options, excluding all break times
  const workTimeOptions = getWorkTimeOptions(breakSlots)

  const convertToMinutes = (time: string): number => {
    const [hourMin, period] = time.split(" ")
    let [hour, minute] = hourMin.split(":").map(Number)
    if (period === "PM" && hour !== 12) hour += 12
    if (period === "AM" && hour === 12) hour = 0
    return hour * 60 + minute
  }

  const isInRange = (time: string, start: string, end: string): boolean => {
    const t = convertToMinutes(time)
    return t >= convertToMinutes(start) && t < convertToMinutes(end)
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {Icon && <Icon className="size-4 text-gray-500" />}
        <Label>Business Hours/Day</Label>
      </div>

      {/* Tabs */}
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

      {/* Work & Break side by side */}
      <div className="flex flex-col md:flex-row lg:gap-6  w-full">
        {["work", "break"].map((type) => {
          const isWork = type === "work"
          const label = isWork ? "Work Hours 🛠️" : "Break Hours ☕"
          const slots =
            businessHours[activeDay]?.[type] || (isWork ? [] : [defaultBreak])

          return (
            <div key={type} className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-2 items-start  p-4">
                <Label className="pt-2">{label}</Label>
                <div className="flex flex-col gap-2">
                  {slots.map((slot: [string, string], idx: number) => {
                    // ✅ For working slots only, filter out break overlaps
                    const breakSlots = businessHours[activeDay]?.["break"] || []
                    const fullOptions = timeOptions

                    const options = isWork
                      ? fullOptions.filter((time) => {
                          return !breakSlots.some(([start, end]) =>
                            isInRange(time, start, end)
                          )
                        })
                      : fullOptions

                    const availableStart = getAvailableTimes(
                      idx > 0 ? slots[idx - 1][1] : undefined,
                      options
                    )
                    const availableEnd = getAvailableTimes(
                      slot[0],
                      options,
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
                          {idx > 0 && (
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
