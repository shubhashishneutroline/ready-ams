"use client"

import { useFormContext } from "react-hook-form"
import { FormItem, FormLabel } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import InputField from "@/components/custom-form-fields/input-field"
import { ClockIcon, LucideIcon } from "lucide-react"
import DatePickerField from "@/components/custom-form-fields/date-field"

interface RadioScheduleFieldProps {
  name: string
  label: string
  dateFieldName: string
  timeFieldName: string
  options: string[]
  icon?: LucideIcon
}

const AnnouncementRadioScheduleField = ({
  name,
  label,
  dateFieldName,
  timeFieldName,
  options,
  icon: Icon,
}: RadioScheduleFieldProps) => {
  const { watch, setValue } = useFormContext()

  return (
    <FormItem className="space-y-1">
      <div className="flex gap-2 items-center">
        {Icon && <Icon className="size-4 text-gray-500" />}
        <FormLabel>{label}</FormLabel>
      </div>
      <RadioGroup
        value={watch(name)}
        onValueChange={(value) => setValue(name, value)}
        className="flex flex-col gap-2"
      >
        {options.map((option) => (
          <div key={option} className="flex items-center gap-2">
            <RadioGroupItem value={option} id={option} />
            <FormLabel htmlFor={option} className="font-normal">
              {option}
            </FormLabel>
          </div>
        ))}
      </RadioGroup>
      {watch(name) === "Schedule" && (
        <div className="flex flex-wrap gap-4 items-center mt-2">
          <DatePickerField
            name={dateFieldName}
            label="Date"
            placeholder="Select Date"
          />
          <InputField
            name={timeFieldName}
            label="Time"
            type="time"
            className="w-[120px] h-[32px]"
            icon={<ClockIcon className="size-4" />}
            value={watch(timeFieldName)}
            onChange={(e) => setValue(timeFieldName, e.target.value)}
          />
        </div>
      )}
    </FormItem>
  )
}

export default AnnouncementRadioScheduleField
