import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils" // utility for conditionally joining classNames
import { CalendarRange, CircleAlert, Hourglass } from "lucide-react"

// List of days to render as toggleable buttons and checkboxes
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// Custom component that lets user pick multiple days of the week
const ServiceDaySelector = ({ name }: { name: string }) => {
  // Hook to interact with the React Hook Form
  const { watch, setValue } = useFormContext()

  // Watches the current field (the one you passed as "name")
  const selected = watch(name) || [] // fallback to empty array if undefined

  // Logs a day-object with selected state of each day for debugging
  const logSelectedObject = (arr: string[]) => {
    const dayObject = days.reduce((acc, day) => {
      acc[day] = arr.includes(day)
      return acc
    }, {} as Record<string, boolean>)
    console.log(dayObject) // e.g. { Mon: true, Tue: false, ... }
  }

  // Toggles selection state for a day
  const toggle = (day: string) => {
    const updated = selected.includes(day)
      ? selected.filter((d: string) => d !== day) // remove day if already selected
      : [...selected, day] // add day if not selected
    setValue(name, updated) // update form state
    logSelectedObject(updated) // log updated object
  }

  return (
    <div className="space-y-2">
      {/* Label for accessibility */}
      <div className="flex items-center gap-2">
        {<CalendarRange className="size-4 text-gray-500" />}
        <Label>Service Days</Label>
      </div>

      {/* Flex container for checkbox + button pairs */}
      <div className="flex gap-4 flex-wrap">
        {days.map((day) => {
          const isChecked = selected.includes(day) // check if current day is selected

          return (
            <div className="flex items-center gap-2" key={day}>
              {/* Checkbox synced with button toggle */}
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggle(day)}
                className="border-blue-500 hidden lg:block"
              />

              {/* Button styled based on selection */}
              <Button
                type="button"
                variant={isChecked ? "default" : "outline"} // style toggle
                onClick={() => toggle(day)}
                className={cn(
                  "px-6 min-w-[72px] border-blue-500", // fixed width prevents shifting
                  {
                    "shadow-[inset_0px_2px_4px_0px_#001F5280]": isChecked, // add inset shadow when selected
                  }
                )}
              >
                {day}
              </Button>
            </div>
          )
        })}
      </div>
      <div className="flex gap-1 items-center">
        <span>
          <CircleAlert strokeWidth={1.5} className="size-4 " />
        </span>
        <p className="text-xs text-muted-foreground">
          Default Service days are set based on working days. To modify, update
          working days in Business Settings &gt; Availability &gt; Business
          Days.
        </p>
      </div>
    </div>
  )
}

export default ServiceDaySelector
