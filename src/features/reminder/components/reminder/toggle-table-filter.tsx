"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { LucideIcon } from "lucide-react"
import { useFormContext } from "react-hook-form"

export default function ToggleTableTabs({
  name,
  icon: Icon,
}: {
  name: string
  icon?: LucideIcon
}) {
  const { watch, setValue } = useFormContext()
  const value = watch(name)

  return (
    <div className="space-y-2">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v: any) => v && setValue(name, v)}
        className="gap-3 md:gap-6  flex flex-wrap "
        // className of toggle Group and ToggleGroupItem
      >
        <ToggleGroupItem
          value="reminder"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border  px-3 md:px-4 flex-1 w-full md:w-auto text-center"
          style={{
            boxShadow:
              value === "reminder" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Reminder
        </ToggleGroupItem>
        <ToggleGroupItem
          value="follow_up"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border  px-6 flex-1 w-full md:w-auto text-center"
          style={{
            boxShadow:
              value === "follow_up" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Follow-Up
        </ToggleGroupItem>
        <ToggleGroupItem
          value="cancellation"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-6 md:px-4 flex-1 w-full md:w-auto text-center"
          style={{
            boxShadow:
              value === "cancellation" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Cancellation
        </ToggleGroupItem>
        <ToggleGroupItem
          value="missed"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-1 md:px-4 flex-1 w-full md:w-auto text-center"
          style={{
            boxShadow:
              value === "missed" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Missed
        </ToggleGroupItem>
        <ToggleGroupItem
          value="custom"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-1 md:px-4 flex-1 w-full md:w-auto text-center"
          style={{
            boxShadow:
              value === "custom" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Custom
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
