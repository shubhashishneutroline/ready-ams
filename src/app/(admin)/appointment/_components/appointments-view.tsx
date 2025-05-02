"use client"
import Heading from "@/components/admin/heading"
import { CalendarDays } from "lucide-react"
import Breadcrumbs from "@/components/shared/bread-crumb"
import { Card } from "@/components/ui/card"
import PageHeader from "@/components/shared/page-header"
import TablePageHeader from "@/components/table/table-header"
import PageTabs from "@/components/shared/page-tabs"
import { useState } from "react"
import { DataTable } from "@/components/table/data-table"
import { Payment } from "@/features/appointment/components/table/appointment-column"
import { get } from "http"
import { columns } from "./column"
import { useAppointmentStore } from "@/state/store"

const pageOptions = ["Today", "Upcoming", "Completed", "All"]
const Appoinements = ({ data }: { data: any }) => {
  const { activeTab, onActiveTab } = useAppointmentStore()
  console.log("Active Tab:", activeTab)
  return (
    <div className="h-full flex flex-col ">
      {/* Headings */}
      <div className="space-y-4">
        <PageTabs
          isReminder
          activeTab={activeTab}
          onTabChange={onActiveTab}
          customTabs={pageOptions}
        />
        <TablePageHeader
          title="Appointment"
          description="Manage and Customize Appointment Here."
          newButton="New Appointment"
          route="/appointment/create/"
        />

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  )
}

export default Appoinements
