
// ----- Reminder
// Enum for Reminder Types
export enum ReminderType {
    REMINDER = "REMINDER",
    FOLLOW_UP = "FOLLOW_UP",
    CANCELLATION = "CANCELLATION",
    MISSED = "MISSED",
    CUSTOM = "CUSTOM",
  }
  
  // Enum for Notification Methods
  export enum NotificationMethod {
    SMS = "SMS",
    EMAIL = "EMAIL",
    PUSH = "PUSH",
  }
  
  // Interface for Reminder Offset
  export interface ReminderOffset {
    sendOffset: number; // Time offset in minutes
    scheduledAt: string; // ISO 8601 DateTime string (e.g., "2025-04-02T10:00:00Z")
    sendBefore: boolean; // True if sending before appointment, false if after
  }
  
  // Interface for Notification
  export interface Notification {
    method: NotificationMethod; // SMS, EMAIL, or PUSH
  }
  
  // Interface for Reminder
  export interface Reminder {
    id: string; // Unique ID for the reminder
    type: ReminderType; // Type of the reminder (e.g., REMINDER, FOLLOW_UP)
    title: string; // Title of the reminder
    description?: string; // Optional description of the reminder
    message?: string; // Optional custom message for the reminder
    services: string[]; // List of service IDs associated with the reminder
    notifications: Notification[]; // List of notifications for the reminder
    reminderOffset: ReminderOffset[]; // List of offsets to define when reminders are sent
  }
  
 
  