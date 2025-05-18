import { videoProviderEnum } from '@/features/individual-event/schemas/schema';
import { z } from 'zod'

// VideoIntegration schema
export const videoIntegrationSchema = z.object({
  provider: videoProviderEnum,
  accessToken: z.string().min(1, "Access token is required"),
  refreshToken: z.string().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(), // ISO string for DateTime
});

export const individualSchema = z.object({
  bio: z.string().optional(),
  position: z.string().min(1, "Position is required"),
  profileImage: z.string().url("Invalid image URL").optional(),
  country: z.string().min(1, "Country is required"),
   timezone: z.string().min(1, "Timezone is required"),
     videoIntegrations: z.array(videoIntegrationSchema).optional(),
})

