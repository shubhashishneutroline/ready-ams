export interface Service {
  id: string;
  title: string;
  description: string;
  estimatedDuration: number; // in minutes
  status?: Status; // ACTIVE or INACTIVE
  serviceAvailability?: ServiceAvailability[];
  resourceId?: string;
  imageUrl: string; // URL of the uploaded image
  imageFileId: string; // ImageKit file ID for deletion
}

export interface ServiceAvailability {
  weekDay: WeekDays; // SUNDAY, MONDAY, etc.
  timeSlots?: ServiceTime[];
}

export interface ServiceTime {
  startTime: string; // ISO 8601 Date string
  endTime: string; // ISO 8601 Date string
}

export enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum WeekDays {
  SUNDAY = "SUNDAY",
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
}
