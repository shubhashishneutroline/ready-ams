import { z } from 'zod'

export const individualSchema = z.object({
  bio: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  profileImage: z.string().url("Invalid image URL").optional(),
  country: z.string().min(1, "Country is required"),
})