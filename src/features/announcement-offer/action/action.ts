import { z } from "zod";
import { TargetAudience } from "../types/types";

const schema = z.object({
  title: z.string().min(1),
  message: z.string().min(1),
  audience: z.string().min(1),
  schedule: z.string().min(1), // e.g. "Immediately" or "Schedule"
  scheduleDate: z.string().optional(), // format: yyyy-mm-dd
  scheduleTime: z.string().optional(), // format: hh:mm
  showOn: z.string().min(1),
  autoDelete: z.string().min(1), // e.g. "ONE_DAY"
});

export const transformFormToPayload = (values: any) => {
  // Transform audience
  const audienceMap: Record<string, string> = {
    "Appointments Users": "APPOINTED_USERS",
    "Cancelled Users": "CANCELLED_USERS",
    All: "ALL",
  };

  // Transform showOn
  const showOnMap: Record<string, string> = {
    "Push Notification": "PUSH",
    "Top Banner": "BANNER",
    Email: "EMAIL",
    All: "ALL",
  };

  // Transform autoDelete
  const autoDeleteMap: Record<string, string> = {
    "1 day": "ONE_DAY",
    "3 days": "THREE_DAYS",
    "7 days": "SEVEN_DAYS",
    "30 days": "THIRTY_DAYS",
    Never: "NEVER",
  };

  // Combine schedule date & time if needed
  let isImmediate = values.schedule === "Immediately";
  let scheduledAt: string;

  if (isImmediate) {
    scheduledAt = new Date().toISOString();
  } else {
    const date = new Date(values.scheduleDate);
    const [hours, minutes] = values.scheduleTime.split(":");
    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));
    date.setSeconds(0);
    scheduledAt = date.toISOString();
  }

  return {
    title: values.title,
    message: values.message,
    audience: audienceMap[values.targetAudience],
    isImmediate,
    scheduledAt,
    showOn: showOnMap[values.showOn[0]],
    expiredAt: autoDeleteMap[values.autoDelete],
  };
};
