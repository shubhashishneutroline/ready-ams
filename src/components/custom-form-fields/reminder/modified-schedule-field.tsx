"use client"

import { useFormContext } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { ClockIcon, CalendarIcon } from "lucide-react"
import SelectField from "./select-field"

interface ScheduleFieldProps {
  name: string
  label: string
  dayFieldName?: string
  hourFieldName?: string
  minuteFieldName?: string
}

export const dayOptions = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1} day${i + 1 > 1 ? "s" : ""}`,
  value: (i + 1).toString(),
}))
export const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  label: `${i + 1} hour${i + 1 > 1 ? "s" : ""}`,
  value: (i + 1).toString(),
}))
export const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
  label: `${i + 1} minute${i + 1 > 1 ? "s" : ""}`,
  value: (i + 1).toString(),
}))

const ScheduleField = ({
  name,
  label,
  dayFieldName,
  hourFieldName,
  minuteFieldName,
}: ScheduleFieldProps) => {
  const { watch, setValue } = useFormContext()
  const reminderType = watch("type") || "Upcoming"
  const scheduleDays = watch(dayFieldName || "") || ""
  const scheduleHours = watch(hourFieldName || "") || ""
  const scheduleMinutes = watch(minuteFieldName || "") || ""
  const isScheduled = watch(name) ?? false

  // Log for debugging
  console.log("ScheduleField: name =", name, "isScheduled =", isScheduled)

  // Determine "before" or "after" based on reminderType
  const timing =
    reminderType === "Upcoming" || reminderType === "Custom"
      ? "before"
      : "after"

  const toggleCheckbox = () => {
    const newValue = !isScheduled
    setValue(name, newValue)
    if (!newValue) {
      // Clear fields when unchecking
      setValue(dayFieldName || "", "")
      setValue(hourFieldName || "", "")
      setValue(minuteFieldName || "", "")
    }
  }

  // Format the schedule text
  const scheduleText = () => {
    const parts: string[] = []
    if (scheduleDays)
      parts.push(`${scheduleDays} day${Number(scheduleDays) > 1 ? "s" : ""}`)
    if (scheduleHours)
      parts.push(`${scheduleHours} hour${Number(scheduleHours) > 1 ? "s" : ""}`)
    if (scheduleMinutes)
      parts.push(
        `${scheduleMinutes} minute${Number(scheduleMinutes) > 1 ? "s" : ""}`
      )
    return parts.length > 0 ? `${parts.join(", ")} ${timing} appointment` : ""
  }

  return (
    <FormItem className="mt-3">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <FormControl>
            <Checkbox
              id={label}
              checked={isScheduled}
              onCheckedChange={toggleCheckbox}
            />
          </FormControl>
          <FormLabel htmlFor={label}>{label}</FormLabel>
        </div>
        {isScheduled && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 items-center">
              <SelectField
                name={dayFieldName}
                label="Days"
                placeholder="Select Days"
                icon={CalendarIcon}
                options={dayOptions}
              />
              <SelectField
                name={hourFieldName}
                label="Hours"
                className="w-[125px] h-[32px]"
                placeholder="Select Hours"
                icon={ClockIcon}
                options={hourOptions}
              />
              <SelectField
                name={minuteFieldName}
                label="Minutes"
                className="w-[139px] h-[32px]"
                placeholder="Select Minutes"
                icon={ClockIcon}
                options={minuteOptions}
              />
            </div>
            {(scheduleDays || scheduleHours || scheduleMinutes) && (
              <p className="text-sm text-muted-foreground">
                Schedule: {scheduleText()}
              </p>
            )}
          </div>
        )}
      </div>
    </FormItem>
  )
}

export default ScheduleField
