import Heading from "@/components/admin/heading"
import { HandPlatter } from "lucide-react"
import Breadcrumbs from "@/components/shared/bread-crumb"
import CustomerForm from "@/features/customer/components/customer-form"

const ServicePage = () => {
  return (
    <main className="h-full flex flex-col">
      <Breadcrumbs />
      <div>
        <Heading
          title="Create New Customer"
          description="Manage and View your customers"
          icon={<HandPlatter />}
        />
      </div>
      {/* Scrollable Form Container */}
      <div className="flex-1 p-4 lg:p-6 bg-white rounded-lg shadow-xl overflow-y-auto">
        <CustomerForm />
      </div>
    </main>
  )
}

export default ServicePage
