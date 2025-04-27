import Heading from "@/components/admin/heading"
import { CalendarDays, Users } from "lucide-react"
import AppointmentForm from "@/features/appointment/components/admin/form/add/appointment-form"
import Breadcrumbs from "@/components/shared/bread-crumb"
import { Card } from "@/components/ui/card"
import PageHeader from "@/components/shared/page-header"
import { Children } from "react"

const CustomerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full flex flex-col">
      <PageHeader>
        <Heading
          title="Customer"
          description="Manage and View your customers"
          icon={<Users />}
        />
      </PageHeader>
      {/* Scrollable Form Container */}
      <Card className="overflow-y-auto p-4 md:p-6 h-full">{children}</Card>
    </main>
  )
}

export default CustomerLayout
