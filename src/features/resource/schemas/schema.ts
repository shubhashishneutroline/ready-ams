import { z } from "zod";
import { businessDetailSchema } from "@/features/business-detail/schemas/schema";
import { serviceSchema } from "@/features/service/schemas/schema";
import { appointmentSchema } from "@/features/appointment/schemas/schema";


// Resource Schema
export const ResourceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Resource name is required"),
  role: z.string().min(1, "Role is required"),
  businessId: z.string().uuid(),
  business:businessDetailSchema,
  services: z.array(serviceSchema),
  appointments: z.array(appointmentSchema),
});