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
          value="sent"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border  px-3 md:px-4 flex-1 w-full md:w-auto text-center"
          style={{
            boxShadow:
              value === "sent" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Sent
        </ToggleGroupItem>
        <ToggleGroupItem
          value="scheduled"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border  px-6 flex-1 w-full md:w-auto text-center"
          style={{
            boxShadow:
              value === "scheduled" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Scheduled
        </ToggleGroupItem>
        <ToggleGroupItem
          value="expired"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-6 md:px-4 flex-1 w-full md:w-auto text-center"
          style={{
            boxShadow:
              value === "expired" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Expired
        </ToggleGroupItem>
        <ToggleGroupItem
          value="all"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-1 md:px-4 flex-1 w-full md:w-auto text-center"
          style={{
            boxShadow: value === "all" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          All
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
