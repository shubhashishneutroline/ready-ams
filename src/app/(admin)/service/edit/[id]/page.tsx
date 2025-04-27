import EditServiceForm from "@/features/service/components/admin/form/edit/edit-service-form"
import { getServiceById } from "@/db/service"

const ServicePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  let serviceData: any = null

  try {
    // 2. Get serviceId from URL (App Router way)

    if (id) {
      // 3. Fetch service data
      serviceData = await getServiceById(id)
      console.log(serviceData, "serviceData")
    }
  } catch (err) {
    console.error("Error loading data:", err)
  }

  return <EditServiceForm serviceDetail={serviceData} />
}

export default ServicePage
