import { User } from "@/app/(admin)/customer/_types/customer"
import { Event, VideoProvider } from "@/features/individual-event/types/types"


// VideoIntegration model
export interface VideoIntegration {
  id: string
  individualId: string
  provider: VideoProvider
  accessToken: string
  refreshToken?: string | null
  expiresAt?: Date | null
  createdAt: Date
  updatedAt: Date
  individual?: Individual // Optional relation back to Individual
}


// Individual model
export interface Individual {
    id: string
    userId: string
    bio?: string | null
    position: string // e.g. "Product Designer", "Marketing Coach"
    profileImage?: string | null
    country: string // Country field
    timezone: string
    createdAt: Date // ISO Date string
    updatedAt: Date  // ISO Date string
    user?: User // Optional relation to the User model
    events?: Event[] // Optional relation to EventType model
    videoIntegrations?: VideoIntegration[]
  }