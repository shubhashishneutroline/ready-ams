export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  MISSED = "MISSED",
  CANCELLED = "CANCELLED",
  FOLLOW_UP = "FOLLOW_UP",
}

// Interface for Appointment
export interface Appointment {
  id: string;
  customerName: string; // Required field for the person being booked
  email: string; // Required email of the person being booked
  phone: string; // Required phone number of the person being booked
  status: AppointmentStatus; // Required Appointment Status
  userId?: string; // Optional: If the logged-in user is booking for themselves
  bookedById?: string; // Optional: Tracks the user who booked for someone else
  serviceId: string; // Required: Service ID
  selectedDate: string; // Required: ISO string for the appointment date
  selectedTime: string; // Required: ISO string for the appointment time
  message?: string; // Optional: Message from the user
  isForSelf: boolean; // Required: Indicates if the appointment is for the logged-in user or someone else
  createdById: string; // Required: ID of the user who created the appointment
  resourceId?: string; // Optional: Resource ID for the appointment
}
