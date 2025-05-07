import { z } from "zod";
import libphonenumber from "google-libphonenumber";
import dayjs, { Dayjs } from "dayjs";
export const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// All valid weekdays
const WeekDays = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

// Time slot schema
const timeSlotSchema = z
  .object({
    startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid start time",
    }),
    endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid end time",
    }),
  })
  .refine((data) => new Date(data.startTime) < new Date(data.endTime), {
    message: "Start time must be before end time",
    path: ["endTime"], // This will show the error under `endTime`
  });

// Each day's availability schema
const serviceAvailabilitySchema = z.object({
  weekDay: z.enum(WeekDays),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, { message: "At least one time slot is required" }),
});

const dateSchema = z
  .custom<dayjs.Dayjs>((val) => dayjs.isDayjs(val) && val.isValid(), {
    message: "Invalid date",
  })
  .refine((val) => val !== null, {
    message: "Date is required",
  });

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

// Define your validation rules

export const adminUserSchema = z.object({
  name: z.string().min(1, { message: "First Name is required" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),

  phone: z
    .string()
    .optional()
    .refine(
      (number: any) => {
        try {
          const phoneNumber = phoneUtil.parse(number);
          return phoneUtil.isValidNumber(phoneNumber);
        } catch (error) {
          return false;
        }
      },
      { message: "Invalid mobile number" }
    ),
  street: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.number().optional(),
  country: z.string().optional(),

  role: z.string().min(1, { message: "Role is required" }),

  isActive: z.boolean().optional(),

  password: z
    .string()
    .min(8, { message: "Password must be 8 character long." }),
});

export type AdminUserFormValues = z.infer<typeof adminUserSchema>;
export const adminEditUserSchema = z.object({
  name: z.string().min(1, { message: "First Name is required" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),

  phone: z
    .string()
    .optional()
    .refine(
      (number: any) => {
        try {
          const phoneNumber = phoneUtil.parse(number);
          return phoneUtil.isValidNumber(phoneNumber);
        } catch (error) {
          return false;
        }
      },
      { message: "Invalid mobile number" }
    ),
  street: z.string().min(1, { message: "Street is required" }),
  city: z.string().min(1, { message: "City is required" }),

  country: z.string().min(1, { message: "Country is required" }),

  role: z.string().min(1, { message: "Role is required" }),

  isActive: z.boolean().optional(),

  password: z
    .string()
    .min(8, { message: "Password must be 8 character long." }),
});

export type AdminEditUserFormValues = z.infer<typeof adminEditUserSchema>;

export const adminAppointmentSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  lastName: z.string().min(1, { message: "Last Name is required" }),

  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),

  phone: z
    .string()
    .min(1, { message: "Phone Number is required" })
    .refine(
      (number: any) => {
        try {
          const phoneNumber = phoneUtil.parse(number);
          return phoneUtil.isValidNumber(phoneNumber);
        } catch (error) {
          return false;
        }
      },
      { message: "Invalid mobile number" }
    ),

  serviceId: z.string().min(1, { message: "Service is required" }),
  selectedDate: z.string().datetime(),
  status: z.string().optional(),
  selectedTime: z.string().datetime(),
  // .union([z.string(), z.object({ hours: z.number(), minutes: z.number() })]) // Accepts either string or object
  // .transform((val) => {
  //   if (typeof val === "string") {
  //     return val; // If it's already a string, use it directly
  //   } else if (val && typeof val === "object" && val.hours && val.minutes) {
  //     // If it's an object, format it to HH:mm
  //     const hours = val.hours.toString().padStart(2, "0");
  //     const minutes = val.minutes.toString().padStart(2, "0");
  //     return `${hours}:${minutes}`; // Format as HH:mm
  //   }
  //   return ""; // Return an empty string if no valid format is found
  // })
  // .refine((val) => /^([0-9]{2}):([0-9]{2})$/.test(val), {
  //   message: "Time must be in the format HH:mm (e.g., 14:30)",
  // }),

  message: z.string().min(8, { message: "Message is Required" }),
});

export type AdminAppointmentFormValues = z.infer<typeof adminAppointmentSchema>;

const TimeSlotSchema = z.object({
  id: z.string(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
});

// Define serviceHourDay array schema
const ServiceHourDaySchema = z.array(
  z.object({
    weekDay: z.string().min(1, "Week day is required"),
    timeSlots: z
      .array(TimeSlotSchema)
      .min(1, "At least one time slot is required"),
  })
);

// Main form schema
export const adminServiceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  estimatedDuration: z.string().min(1, "Estimated duration is required"),
  availabilities: z.boolean(),

  coverPhoto: z.any().refine((file: FileList) => file && file.length > 0, {
    message: "Cover photo is required",
  }),

  serviceAvailability: z
    .array(z.string())
    .min(1, "Select at least one available day"),

  serviceHourDay: ServiceHourDaySchema,
});

export type AdminServiceFormValues = z.infer<typeof adminServiceSchema>;
