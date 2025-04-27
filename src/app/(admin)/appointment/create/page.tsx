import Heading from "@/components/admin/heading"
import { CalendarDays } from "lucide-react"

import Breadcrumbs from "@/components/shared/bread-crumb"
import { Card } from "@/components/ui/card"
import PageHeader from "@/components/shared/page-header"
import AppointmentForm from "@/features/appointment/components/admin/form/add/appointment-form"

const AppointmentPage = () => {
  return (
    // <main className="h-full flex flex-col">
    //   <PageHeader>
    //     <Heading
    //       title="Create New Appointment"
    //       description="Schedule a new appointment"
    //       icon={<CalendarDays />}
    //     />
    //   </PageHeader>
    //   {/* Scrollable Form Container */}
    <>
      <AppointmentForm />
    </>
    // </main>
  )
}

export default AppointmentPage
