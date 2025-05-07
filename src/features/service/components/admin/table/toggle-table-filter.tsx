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
  console.log(value, "inside tabs")

  return (
    <div className="space-y-2">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v: any) => v && setValue(name, v)}
        className="gap-3 md:gap-6  flex flex-wrap "
      >
        <ToggleGroupItem
          value="active"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border  px-3 md:px-4 flex-1 w-full md:w-auto text-center"
          style={{
            boxShadow:
              value === "active" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Active
        </ToggleGroupItem>
        <ToggleGroupItem
          value="inactive"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-6 flex-1 w-full md:w-auto text-center"
          style={{
            boxShadow:
              value === "inactive" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          In-active
        </ToggleGroupItem>
        <ToggleGroupItem
          value="all"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-6 md:px-4 flex-1 w-full md:w-auto text-center"
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
