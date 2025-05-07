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

import ServiceForm, {
  BusinessAvailability,
} from "@/features/service/components/admin/form/add/service-form";
import { getBusinesses } from "@/features/business-detail/api/api";
import { BusinessDetail } from "@/features/business-detail/types/types";
import { transformBusinessAvailabilityData } from "@/features/service/action/action";

const ServicePage = async () => {
  let businessAvailability: BusinessAvailability;
  let businessId: string;

  try {
    const businesses: BusinessDetail[] = await getBusinesses();
    const business = businesses[0];
    businessId = /* business.id */ "cmacgqszn0001msf6gqkxp5as";
    businessAvailability = transformBusinessAvailabilityData(business);
    console.log(businessAvailability, "businessAvailability");
  } catch (err) {
    console.error("Error fetching businesses:", err);
    // Fallback if fetching fails
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
    <ServiceForm
      businessAvailability={businessAvailability}
      businessId={businessId}
    />
  );
};

export default ServicePage;
