import Heading from "@/components/admin/heading"
import { CalendarDays } from "lucide-react"
import Breadcrumbs from "@/components/shared/bread-crumb"
import { Card } from "@/components/ui/card"
import PageHeader from "@/components/shared/page-header"
import { Children } from "react"

const AppointmentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full flex flex-col">
      <PageHeader>
        <Heading
          title="Create New Appointment"
          description="Schedule a new appointment"
          icon={<CalendarDays />}
        />
      </PageHeader>
      {/* Scrollable Form Container */}
      <Card className="overflow-y-auto p-4 md:p-6 h-full">{children}</Card>
    </main>
  )
}

export default AppointmentLayout
