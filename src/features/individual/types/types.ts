import { User } from "@prisma/client"
import {Event} from "@prisma/client"

// Individual model
export interface Individual {
    id: string
    userId: string
    bio?: string
    position: string // e.g. "Product Designer", "Marketing Coach"
    profileImage?: string
    country: string // Country field
    createdAt: string // ISO Date string
    updatedAt: string // ISO Date string
    
    user?: User // Optional relation to the User model
    events?: Event[] // Optional relation to EventType model
  }