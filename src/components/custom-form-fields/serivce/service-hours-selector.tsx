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
import { CalendarDays, Hourglass, Plus, Trash2 } from "lucide-react"
import { useState } from "react"

// Days to show as toggleable tabs
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// Available time options for service slots
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

const ServiceHourSelector = ({ name }: { name: string }) => {
  const { watch, setValue } = useFormContext()

  // Get selected days from form state
  const serviceDays = watch("serviceDays") || []

  // Get current time slots for each day
  const serviceHours = watch(name) || {}

  // State to track the currently active day tab
  const [activeDay, setActiveDay] = useState(serviceDays[0] || "")

  // Helper: get only time values after a specific one
  const getAvailableTimes = (afterTime?: string) => {
    if (!afterTime) return timeOptions
    const index = timeOptions.indexOf(afterTime)
    return timeOptions.slice(index + 1)
  }

  // Handle change of start/end time in a specific slot
  const handleChange = (
    day: string,
    index: number,
    position: "start" | "end",
    newVal: string
  ) => {
    const updated = { ...serviceHours }
    const slots = [...(updated[day] || [])]
    const current = slots[index] || ["", ""]

    if (position === "start") current[0] = newVal
    else current[1] = newVal

    slots[index] = current
    updated[day] = slots
    setValue(name, updated)
  }

  // Add a new empty slot based on previous slot's end time
  const addSlot = (day: string) => {
    const updated = { ...serviceHours }
    const previous = updated[day]?.[updated[day].length - 1] || []
    const previousEnd = previous[1] // last slot end time
    const newSlot: [string, string] = [previousEnd || "", ""] // new starts at last end
    updated[day] = [...(updated[day] || []), newSlot]
    setValue(name, updated)
  }

  // Remove a specific time slot
  const removeSlot = (day: string, index: number) => {
    const updated = { ...serviceHours }
    updated[day] = updated[day].filter(
      (_: [string, string], i: number) => i !== index
    )
    setValue(name, updated)
  }

  return (
    <div className="space-y-4">
      {/* Label */}
      <div className="flex items-center gap-2">
        {<Hourglass className="size-4 text-gray-500" />}
        <Label>Service Hour/day</Label>
      </div>

      {/* --- Day Tabs --- */}
      <div className="flex gap-2 items-center justify-center">
        <span>
          <CalendarDays className="size-7" strokeWidth={1.5} />
        </span>
        <div className="flex flex-wrap justify-start md:justify-center gap-3">
          {serviceDays.map((day: string) => {
            const isActive = activeDay === day
            return (
              <Button
                key={day}
                type="button"
                variant={isActive ? "default" : "outline"}
                onClick={() => setActiveDay(day)}
                className={cn(
                  "px-6 min-w-[72px]",
                  isActive && "shadow-[inset_0px_2px_4px_0px_#001F5280]"
                )}
              >
                {day}
              </Button>
            )
          })}
        </div>
      </div>

      {/* --- Time Slots For Selected Day --- */}
      <div className="space-y-4 flex flex-col items-center">
        {(serviceHours[activeDay] || []).map(
          (slot: [string, string], idx: number) => {
            const prevEnd =
              idx > 0 ? serviceHours[activeDay][idx - 1][1] : undefined
            const availableStarts = getAvailableTimes(prevEnd) // filter start times after last end
            const availableEnds = getAvailableTimes(slot[0]) // end time must be after start

            return (
              <div key={idx} className="flex gap-4 items-center justify-center">
                {/* Start Time */}
                <Select
                  value={slot[0]}
                  onValueChange={(val) =>
                    handleChange(activeDay, idx, "start", val)
                  }
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Start Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStarts.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* End Time */}
                <div className="relative flex items-center">
                  <Select
                    value={slot[1]}
                    onValueChange={(val) =>
                      handleChange(activeDay, idx, "end", val)
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="End Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEnds.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Delete Icon for additional slots */}
                  {idx > 0 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => removeSlot(activeDay, idx)}
                      className="absolute -right-10"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            )
          }
        )}

        {/* + Add Time Slot */}
        <Button
          type="button"
          variant="outline"
          onClick={() => addSlot(activeDay)}
          className="text-xs gap-1"
        >
          <Plus className="w-3 h-3" />
          Add Time Slot
        </Button>
      </div>
    </div>
  )
}

export default ServiceHourSelector
