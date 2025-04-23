import Heading from "@/components/admin/heading"
import { CalendarDays, Hand, HandPlatter } from "lucide-react"
import AppointmentForm from "@/features/appointment/components/admin/form/appointment-form"
import Breadcrumbs from "@/components/shared/bread-crumb"
import ServiceForm from "@/features/service/components/admin/service-form"

const ServicePage = () => {
  return (
    <main className="h-full flex flex-col">
      <Breadcrumbs />
      <div>
        <Heading
          title="Create New Service"
          description="Manage and Customize your offered service"
          icon={<HandPlatter />}
        />
      </div>
      {/* Scrollable Form Container */}
      <div className="flex-1 p-4 lg:p-6 bg-white rounded-lg shadow-xl overflow-y-auto">
        <ServiceForm />
      </div>
    </main>
  )
}

export default ServicePage
