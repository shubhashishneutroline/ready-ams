import { NextRequest, NextResponse } from "next/server";
import { ReminderSchema } from "@/features/reminder/schemas/schema"; // Adjust the path accordingly
import { ZodError } from "zod";
import {Reminder, ReminderType, Notification,NotificationMethod} from "@/features/reminder/types/types"

// Dummy data for reminders (this would be replaced by a real database in a production scenario)
let reminders: Reminder[] = [
    {
        id: "1",
        type: ReminderType.REMINDER,
        title: "Appointment Reminder",
        description: "Reminder for your upcoming service appointment.",
        message: "Your car wash appointment is scheduled for tomorrow at 10:00 AM.",
        services: ["srv_abc123"],
        notifications: [
          {
            method: NotificationMethod.EMAIL,
          },
          {
            method: NotificationMethod.SMS,
          },
        ],
        reminderOffset: [
          {
            sendOffset: 1440,
            scheduledAt: "2025-04-02T10:00:00Z",
            sendBefore: true,
          },
          {
            sendOffset: 30,
            scheduledAt: "2025-04-03T09:30:00Z",
            sendBefore: true,
          },
        ],
      }, 
];

// Create a new reminder
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = ReminderSchema.parse(body);

    // Generate a unique ID for the reminder (e.g., using timestamp)
    const newReminder = {
      ...parsedData,
      id: String(Date.now()), // Use the current timestamp as a unique ID
    };

    reminders.push(newReminder);

    return NextResponse.json(
      { message: "Reminder created successfully", reminder: newReminder },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Fetch all reminders
export async function GET() {
  try {
    if (reminders.length === 0) {
      return NextResponse.json({ error: "No reminders found" }, { status: 404 });
    }
    return NextResponse.json(reminders, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 });
  }
}

// Update an existing reminder
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = ReminderSchema.parse(body);

    const { id } = body;
    const reminderIndex = reminders.findIndex((reminder) => reminder.id === id);

    if (reminderIndex === -1) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    const updatedReminder = { ...reminders[reminderIndex], ...parsedData };
    reminders[reminderIndex] = updatedReminder;

    return NextResponse.json(
      { message: "Reminder updated successfully", reminder: updatedReminder },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete a reminder
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const reminderIndex = reminders.findIndex((reminder) => reminder.id === id);

    if (reminderIndex === -1) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    reminders.splice(reminderIndex, 1);

    return NextResponse.json({ message: "Reminder deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete reminder" }, { status: 500 });
  }
}
