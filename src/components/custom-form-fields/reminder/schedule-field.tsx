"use client"

import { useFormContext } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { ClockIcon, CalendarIcon } from "lucide-react"
import InputField from "@/components/custom-form-fields/input-field"
import DatePickerField from "../date-field"
import SelectField from "./select-field"

interface ScheduleFieldProps {
  name: string
  label: string
  dayFieldName: string
  hourFieldName: string
  minuteFieldName: string
}

export const dayOptions = Array.from({ length: 30 }, (_, i) => ({
  label: `${i + 1} day`,
  value: (i + 1).toString(),
}))
export const hourOptions = Array.from({ length: 24 }, (_, i) => ({
  label: `${i + 1} hrs`,
  value: (i + 1).toString(),
}))
export const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
  label: `${i + 1} min`,
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

  const toggleCheckbox = () => {
    const current = watch(name)
    if (current.includes(label)) {
      setValue(
        name,
        current.filter((v: string) => v !== label)
      )
    } else {
      setValue(name, [...current, label])
    }
  }

  return (
    <FormItem className="mt-3">
      <div className="flex flex-col md:flex-row gap-3 items-start ">
        <div className="flex items-center gap-2 ">
          <FormControl>
            <Checkbox
              id={label}
              checked={watch(name).includes(label)}
              onCheckedChange={toggleCheckbox}
            />
          </FormControl>
          <FormLabel htmlFor={label}>{label}</FormLabel>
        </div>
        {watch(name).includes(label) && (
          <div className="flex flex-wrap  gap-4     items-center">
            <SelectField
              name={dayFieldName}
              label="Day"
              placeholder="Select Day"
              icon={CalendarIcon}
              options={dayOptions}
            />
            <SelectField
              name={hourFieldName}
              label="Hour"
              className="w-[125px] h-[32px]"
              placeholder="Select Hour"
              icon={ClockIcon}
              options={hourOptions}
            />
            <SelectField
              name={minuteFieldName}
              label="Minutes"
              className="w-[139px] h-[32px]"
              placeholder="Select Minute"
              icon={ClockIcon}
              options={minuteOptions}
            />
          </div>
        )}
      </div>
    </FormItem>
  )
}

export default ScheduleField
