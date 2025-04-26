import { getServices } from "@/features/service/api/api";

export const serviceOption = await getServices();

type RawReminderData = {
  type: string;
  subject: string;
  description: string;
  message: string;
  service: string;
  sendVia: string[];
  when: string[];
  scheduleDate: string;
  scheduleTime: string;
};

type TransformedReminderData = {
  type: string;
  title: string;
  description: string;
  message: string;
  services: string[];
  notifications: { method: string }[];
  reminderOffset: {
    sendOffset: string | null;
    sendBefore: boolean;
    scheduledAt?: string | null;
  }[];
};

const labelToOffset: Record<string, number> = {
  "48 hours before appointment": 2880,
  "24 hours before appointment": 1440,
  "1 hours before appointment": 60,
  "Same day after appointment": 0,
  "1 days after appointment": 1440,
  "2 days after appointment": 2880,
  "15 minutes after missed": 15,
  "1 hour after missed": 60,
  "24 hours after missed": 1440,
  "48 hours after missed": 2880,
  "15 minutes after cancellation": 15,
  "1 hour after cancellation": 60,
  "24 hours after cancellation": 1440,
  "48 hours after cancellation": 2880,
  // "Schedule" ones will be handled separately
};

export function transformReminderPayloadWithOffset(
  data: RawReminderData
): TransformedReminderData {
  return {
    type: data.type,
    title: data.subject,
    description: data.description,
    message: data.message,

    services: [data.service],

    notifications: data.sendVia.map((method) => ({ method })),

    reminderOffset: data.when.map((label) => {
      if (label.toLowerCase().includes("schedule")) {
        const date = new Date(data.scheduleDate);
        const [hours, minutes] = data.scheduleTime.split(":").map(Number);
        date.setHours(hours);
        date.setMinutes(minutes);
        return {
          sendOffset: null,
          sendBefore: false,
          scheduledAt: date.toISOString(),
        };
      } else {
        return {
          sendOffset: labelToOffset[label]?.toString() ?? label,
          sendBefore: label.toLowerCase().includes("before"),
          scheduledAt: null,
        };
      }
    }),
  };
}
