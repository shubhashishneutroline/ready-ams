import { z } from "zod";

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const expenseSchema = z.object({
  id: z.string(),
  label: z.string(),
  note: z.string(),
  category: z.string(),
  type: z.string(),
  amount: z.number(),
  date: z.string(),
});

export type Expense = z.infer<typeof expenseSchema>;

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  MISSED = "MISSED",
  CANCELLED = "CANCELLED",
  FOLLOW_UP = "FOLLOW_UP",
}

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  role: string;
  isActive: boolean;
};

export type Appointment = {
  id: string;
  message: string;
  customerName: string;
  email: string;
  phone: string;
  status: AppointmentStatus;
  serviceId: string;
  selectedDate: string;
  selectedTime: string;
  isForSelf: boolean;
  createdById: string;
  service: Service;
  user: User;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt?: string;
  status: "ACTIVE" | "INACTIVE" | string;
  businessDetailId?: string;
};

export const UserSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  dateOfBirth: z.string(),
  totalAppointments: z.number(),
  lastAppointment: z.string(),
});
export type User1 = z.infer<typeof UserSchema>;

export const ServiceSchema = z.object({
  id: z.string(),
  serviceName: z.string(),
  description: z.string(),
  duration: z.string(),
  status: z.string(),
  visibility: z.boolean(),
  createdBy: z.string(),
  createdAt: z.date(),
});
// export type Service = z.infer<typeof ServiceSchema>;
