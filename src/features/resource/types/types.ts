import { BusinessDetail } from "@/features/business-detail/types/types";
import { Service } from "@/features/service/types/types";
import { Appointment } from "@/features/appointment/types/types";

export interface Resource {
    id: string; // Unique ID for the resource
    name: string; // Name of the staff (e.g., Doctor, Barber, Stylist)
    role: string; // Role of the staff (e.g., Doctor, Barber, Stylist)
    businessId: string; // Reference to the business this staff belongs to
    business: BusinessDetail; // Related BusinessDetail object
  
    services: Service[]; // Relationship to services provided by the staff
    appointments: Appointment[]; // Appointments this staff assigns/handles
  }
  
