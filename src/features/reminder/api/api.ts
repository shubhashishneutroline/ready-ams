import { getBaseUrl } from "@/lib/baseUrl";
import axios from "axios";

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

export type ReminderType =
  | "CUSTOM"
  | "REMINDER"
  | "FOLLOW_UP"
  | "CANCELLATION"
  | "MISSED"; // Add more types if needed
export type NotificationMethod = "EMAIL" | "SMS" | "PUSH"; // Add more if you support more methods

export interface Reminder {
  id?: string; // Optional for update purposes
  type: string;
  title: string;
  description: string;
  message: string;
  services: string[]; // IDs of services
  notifications: Notification[];
  reminderOffset: ReminderOffset[];
}

export interface Notification {
  method: string;
  id?: string; // Optional for update purposes
}

export interface ReminderOffset {
  sendOffset: number | string | null;
  sendBefore: boolean;
  scheduledAt?: string | null; // ISO 8601 format; optional if not required in backend
  id?: string; // Optional for update/upsert
}

async function getReminder() {
  try {
    const { data } = await api.get("/api/reminder");
    return data;
  } catch (error) {
    console.error("Error fetching reminder:", error);
    return [];
  }
}

async function getReminderById(id: string) {
  try {
    const { data } = await api.get("/api/reminder", {
      params: { id },
    });
    const reminder = data.find((reminder: Reminder) => reminder.id === id);

    return reminder;
  } catch (error) {
    console.error("Error fetching reminder:", error);
    throw error;
  }
}

async function createReminder(reminderData: Reminder) {
  try {
    const { data } = await api.post("/api/reminder", reminderData);
    return data;
  } catch (error) {
    console.error("Error creating reminder:", error);
    throw error;
  }
}

async function updateReminder(id: string, reminderData: Omit<Reminder, "id">) {
  try {
    const { data } = await api.put(`/api/reminder`, {
      ...reminderData,
      id,
    });
    console.log(data, "inside Update func");
    return data;
  } catch (error) {
    console.error("Error updating reminder:", error);
    throw error;
  }
}

async function deleteReminder(reminder: Omit<Reminder, "id">) {
  try {
    const { data } = await api.delete(`/api/reminder`, {
      data: reminder,
    });
    return data;
  } catch (error) {
    console.error("Error deleting Customer:", error);
    throw error;
  }
}

export {
  getReminder,
  getReminderById,
  createReminder,
  updateReminder,
  deleteReminder,
};
