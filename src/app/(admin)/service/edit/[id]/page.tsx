import { BusinessAvailability } from "@/features/service/components/admin/form/add/service-form";
import { getBusinesses } from "@/features/business-detail/api/api";
import { BusinessDetail } from "@/features/business-detail/types/types";
import {
  transformBusinessAvailabilityData,
  convertServiceAvailabilityToShortHours,
} from "@/features/service/action/action";

import EditServiceForm from "@/features/service/components/admin/form/edit/edit-service-form";
import { getServiceById } from "@/db/service";

const ServicePage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  let businessAvailability: BusinessAvailability;
  let businessId: string;
  let serviceData: any = null;
  let defaultServiceHours: Record<string, [string, string][]> = {};

  try {
    // 1. Get business info
    const businesses: BusinessDetail[] = await getBusinesses();
    const business = businesses[0];
    businessId = business.id;
    businessAvailability = transformBusinessAvailabilityData(business);

    // 2. Get serviceId from URL (App Router way)

    if (id) {
      // 3. Fetch service data
      serviceData = await getServiceById(id);
      defaultServiceHours = convertServiceAvailabilityToShortHours(
        serviceData.serviceAvailability
      );
    }
  } catch (err) {
    console.error("Error loading data:", err);
    businessAvailability = {
      breaks: {
        Mon: [],
        Tue: [],
        Wed: [],
        Thu: [],
        Fri: [],
        Sat: [],
        Sun: [],
      },
      holidays: [],
    };
    businessId = "";
  }

  return (
    <EditServiceForm
      businessAvailability={businessAvailability}
      defaultServiceHours={defaultServiceHours}
      serviceData={serviceData} // optional if editing
    />
  );
};

export default ServicePage;
