"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

const businessTabs = ["Business Detail", "Business hour & Availability"]
const reminderTabs = ["Reminder", "Announcement || Offer"]

interface PageTabsProps {
  isReminder?: boolean
  activeTab: string
  onTabChange: (tab: string) => void
  customTabs?: string[]
  clasName?: string
}

const PageTabs = ({
  isReminder,
  activeTab,
  onTabChange,
  customTabs,
  clasName,
}: PageTabsProps) => {
  const tabs = customTabs || (isReminder ? reminderTabs : businessTabs)

  return (
    <div className={cn("space-y-2", clasName)}>
      <ToggleGroup
        type="single"
        value={activeTab}
        className="gap-2 flex flex-wrap"
        onValueChange={(value) => {
          if (value) onTabChange(value)
        }}
      >
        {tabs.map((tab) => (
          <ToggleGroupItem
            key={tab}
            value={tab}
            className="data-[state=on]:bg-[#E98651] data-[state=on]:border-none data-[state=on]:text-white rounded-lg border max-w-max px-2"
            style={{
              boxShadow:
                activeTab === tab ? "0px 2px 4px 0px #001F5280 inset" : "",
            }}
          >
            {tab}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

export default PageTabs
