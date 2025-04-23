import { prisma } from "@/lib/prisma"
// Pre populate default reminder data
// src/lib/prepopulateReminders.js

// Function to create a reminder for a service with default offsets
export async function createReminderForService(serviceId: string, type: any) {
    // Create the reminder record
    const reminder = await prisma.reminder.create({
      data: {
        type, // REMINDER, FOLLOW_UP, etc.
        title: `${type} Reminder`, // E.g., "REMINDER Reminder"
        description: `Default ${type.toLowerCase()} notification`, // Description
        services: { connect: { id: serviceId } }, // Link to service
      },
    })
  
    // Define default offsets (48h, 24h, 1h)
    const offsets = [
      { sendOffset: 48 * 60, sendBefore: type === "REMINDER" }, // 48 hours
      { sendOffset: 24 * 60, sendBefore: type === "REMINDER" }, // 24 hours
      { sendOffset: 1 * 60, sendBefore: type === "REMINDER" }, // 1 hour
    ]
  
    // Create each offset record
    for (const offset of offsets) {
      await prisma.reminderOffset.create({
        data: {
          reminderId: reminder.id, // Link to reminder
          sendOffset: offset.sendOffset, // Offset in minutes
          sendBefore: offset.sendBefore, // Before or after appointment
        },
      })
    }
  
    // Return the created reminder
    return reminder
  }
  