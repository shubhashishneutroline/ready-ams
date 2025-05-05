import { getBusinessById } from "@/features/business-detail/api/api"
import { getServiceById } from "@/features/service/api/api"
import ServiceForm from "@/features/service/components/admin/form/edit/edit-service-form"
import ServiceFormSkeleton from "@/features/service/components/skeleton-form"
import { useBusinessStore } from "@/state/store"

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const serviceDetail = await getServiceById(id)
  console.log(serviceDetail)
  const { businessAvailability } = useBusinessStore()

  if (!businessAvailability) return <ServiceFormSkeleton />

  return <ServiceForm serviceDetail={serviceDetail} />
}
