// import ServiceForm from "@/features/service/components/admin/form/add/service-form";

// const ServicePage = () => {
//   //  Fetch from the api
//   // Business for break time and holiday

//   // If id is present in URL
//   // Fetch service data from API

//   return (
//     <>
//       <ServiceForm />
//     </>
//   );
// };

// export default ServicePage;

"use client"
import ServiceForm, {
  BusinessAvailability,
} from "@/features/service/components/admin/form/add/service-form"
import { getBusinesses } from "@/features/business-detail/api/api"
import { BusinessDetail } from "@/features/business-detail/types/types"
import { transformBusinessAvailabilityData } from "@/features/service/action/action"
import { useBusinessStore } from "@/state/store"
import ServiceFormSkeleton from "@/features/service/components/skeleton-form"

const ServicePage = () => {
  const { businessAvailability, businessId } = useBusinessStore()

  if (!businessId) return <ServiceFormSkeleton />

  return (
    <ServiceForm
      businessAvailability={businessAvailability}
      businessId={businessId}
    />
  )
}

export default ServicePage
