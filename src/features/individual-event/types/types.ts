import { Individual } from "@/features/individual/types/types";
import { User } from "@/features/user/types/types";

// Video provider types
export enum VideoProvider {
  ZOOM = "ZOOM",
  GOOGLE_MEET = "GOOGLE_MEET",
  MICROSOFT_TEAMS = "MICROSOFT_TEAMS",
  WEBEX = "WEBEX",
  GOTO_MEETING = "GOTO_MEETING",
}

export enum EventType {
  ONE_TO_ONE = "ONE_TO_ONE",
  GENERAL = "GENERAL",
}

// Days of the week
export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

// Meeting model
export interface Meeting {
  id: string;
  eventId: string;
  timeSlot: string; // ISO Date string
  bookedByName: string;
  bookedByEmail: string;
  customAnswers?: any;
  videoUrl?: string;
  videoProvider?: VideoProvider;
  slug?: string;
  // Optional nested object, only if you fetch it
  event?: Event;
}

// Availability model
export interface Availability {
  id?: string;
  eventId: string;
  dayOfWeek: number; // 0-6 (Sunday - Saturday)
  startTime: string; // format: "HH:mm"
  endTime: string; // format: "HH:mm"
  startDate?: string | null;
  endDate?: string | null;
  duration: number;
  event?: Event;
}

// EventType model
export interface Event {
  id: string;
  title: string;
  description?: string | null;
  location?: string;
  timezone?: string | null; 
  slug: string;
  userId: string;
  individual: Individual;
  individualId: string;
  user: User;
  createdAt: Date; // ISO Date string
  availability: Availability[];
  meeting?: Meeting[];
   type: EventType;
}
