import { BusinessAvailability } from "@/features/business-detail/types/types";
import { Holiday } from "@/features/business-detail/types/types";

export interface SupportBusinessDetail {
    id: string;
  supportBusinessName: string;
  supportEmail: string;
  supportPhone: string;
  supportAddress: string;
  supportGoogleMap?: string;
  supportAvailability: BusinessAvailability[]; // Separate availability for support
  supportHoliday: Holiday[]; // Separate holidays for support
  businessId: string;
}
