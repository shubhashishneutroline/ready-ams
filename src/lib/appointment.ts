// Create appointment
// src/lib/createAppointment.js
// Import Prisma client for database operations
import { prisma } from "@/lib/prisma"
import { Appointment } from "@/features/appointment/types/types"

// Function to create an appointment and set up its reminders
export async function createAppointment(appointmentData: Appointment) {
  // Create the appointment record
  const appointment = await prisma.appointment.create({ data: appointmentData })

  // Fetch all reminders associated with the appointment’s service
  const reminders = await prisma.reminder.findMany({
    where: { services: { some: { id: appointment.serviceId } } },
    include: { reminderOffset: true }, // Include offset details
  })

  // Create AppointmentReminderOffset for each reminder offset
  for (const reminder of reminders) {
    for (const offset of reminder.reminderOffset) {
      // Calculate when this reminder should fire
      const scheduledAt = new Date(
        appointment.selectedDate.getTime() +
          (offset.sendBefore ? -offset.sendOffset : offset.sendOffset) *
            60 *
            1000
      )
      // Create a record linking this appointment to the offset
      await prisma.appointmentReminderOffset.create({
        data: {
          appointmentId: appointment.id, // Link to this appointment
          reminderOffsetId: offset.id, // Link to the generic offset
          scheduledAt, // Specific time for this reminder
          sent: false, // Initially not sent
        },
      })
    }
  }

  // Return the created appointment
  return appointment
}

