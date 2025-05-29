// Import Inngest client for running background jobs
import { inngestClient } from "@/tasks/inngest/client";
// Import Prisma client for database operations
import { prisma } from "@/lib/prisma";
// Import email sending utility
import { sendReminderEmail } from "../../email/email";

// Define the Inngest function to send appointment reminders
export const appointmentReminder = inngestClient.createFunction(
  {
    id: "appointment-reminder", // Unique ID for the function
    name: "Send Appointment Reminders", // Human-readable name
  },
  {
   cron: "*/15 * * * *", // Run every 15 minutes
  },
  async ({ step }) => {
    // Step 1: Fetch relevant appointments
    const appointments = await step.run("fetch-appointments", async () => {
      const now = new Date(); // Current timestamp
      // Define a one-week window to limit fetched appointments
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days in the future
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days in the past
      // Query appointments with relevant statuses and within time window
      return await prisma.appointment.findMany({
        where: {
          OR: [
            { status: "SCHEDULED" }, // For REMINDER, CUSTOM (before)
            { status: "COMPLETED" }, // For FOLLOW_UP
            { status: "CANCELLED" }, // For CANCELLATION
            { status: "MISSED" }, // For MISSED
          ],
          selectedDate: {
            gte: oneWeekAgo, // Include appointments from up to 7 days ago
            lte: oneWeekFromNow, // Include appointments up to 7 days from now
          },
        },
        include: {
          service: {
            include: {
              reminders: {
                include: {
                  reminderOffset: {
                    include: { appointmentOffsets: true }, // Include appointment-specific offsets
                  },
                  notifications: true, // Include notification methods
                },
              },
            },
          },
          user: true, // Include user data for email
          reminderOffsets: true, // Include appointment-specific reminder offsets
        },
      });
    });

    // Step 2: Process reminders for fetched appointments
    await step.run("process-reminders", async () => {
      const now = new Date(); // Current timestamp for comparison
      // Loop through each appointment
      for (const appointment of appointments) {
        const appointmentTime = new Date(appointment.selectedDate); // Appointment date/time
        // Determine target email (user’s email if booked for self, else appointment email)
        const targetEmail =
          appointment.isForSelf && appointment.user?.email
            ? appointment.user.email
            : appointment.email;
        const targetName = appointment.customerName; // Customer’s name for email

        // Process each reminder associated with the service
        for (const reminder of appointment.service.reminders) {
          // Call helper function to handle reminder logic
          await processReminder(
            now,
            reminder,
            targetEmail,
            targetName,
            appointmentTime,
            appointment
          );
        }
      }
    });
  }
);

// Helper function to process reminders for a single appointment
export async function processReminder(
  now: any, // Current time
  reminder: any, // Reminder object with offsets
  email: any, // Target email address
  name: any, // Target customer name
  appointmentTime: any, // Appointment date/time
  appointment: any, // Appointment object
  event?: any
) {
  // Loop through each offset in the reminder
  for (const offset of reminder.reminderOffset) {
    // Find the appointment-specific offset record
    const appointmentOffset = offset.appointmentOffsets.find(
      (ao: any) => ao.appointmentId === appointment.id
    );
    console.log("appointmentOffset", appointmentOffset);

    // Different logic for cron job vs triggered event
    const isTriggerEvent = event?.name === "reminder/send"; // Check if this is a triggered event
    console.log('isTriggerEvent',isTriggerEvent)

    // For cron job (regular 15-min check)
    if (!isTriggerEvent) {
      if (
        !appointmentOffset ||
        appointmentOffset.status === "SENT" ||
        appointmentOffset.status === "TRIGGERED"
      ) {
        continue;
      }
    }
    // For triggered event (at exact reminder time)
    else {
      if (!appointmentOffset || appointmentOffset.status === "SENT") {
        continue;
      }
    }


    let shouldSend = false; // Flag to determine if email should be sent
    let message = ""; // Email message content
    let diffFromNow

    // Get the scheduled time for this reminder
    const reminderTime = new Date(appointmentOffset.scheduledAt);

    if (!isTriggerEvent) {
    // Calculate time difference from now in minutes
     diffFromNow = (reminderTime.getTime() - now.getTime()) / 1000 / 60;
    console.log("diff from now", diffFromNow);
    }
    else {
    diffFromNow = 0;
    }

  console.log('diff from now after',diffFromNow)

    //  For short gap reminders
     if (!isTriggerEvent) {
    if (
      appointmentOffset.status === 'PENDING' && 
      offset.sendOffset <= 55 &&
      reminderTime.getTime() > now.getTime()
    ) {
      console.log(
        `Scheduling reminder with Inngest for ${email} at ${reminderTime}`
      );

      await inngestClient.send({
        name: "reminder/send",
        data: {
          now,
          reminder,
          email: email,
          name: name,
          appointmentTime,
          appointment,
        },
        ts:  reminderTime.getTime(), 
      });

      // Mark reminder as 'triggered' when the reminder is scheduled to be sent
      await prisma.appointmentReminderOffset.update({
        where: { id: appointmentOffset.id },
        data: { status: "TRIGGERED" }, // Set the status to 'triggered'
      });

      continue;
    }
  }

   if (diffFromNow >= 0 && diffFromNow <= 15) {
      // Determine action based on reminder type
      switch (reminder.type) {
        case "REMINDER":
          // Send before appointment if status is SCHEDULED
          if (offset.sendBefore && appointment.status === "SCHEDULED") {
            shouldSend = true;
            message = `${
              offset.sendOffset / 60
            }-hour reminder before your appointment`;
          }
          break;

        case "FOLLOW_UP":
          // Send after appointment if status is COMPLETED
          if (!offset.sendBefore && appointment.status === "COMPLETED") {
            shouldSend = true;
            message = `${
              offset.sendOffset / 60
            }-hour follow-up after your appointment`;
          }
          break;

        case "CANCELLATION":
        // Send after cancellation if status is CANCELLED and within window
          if (
            !offset.sendBefore &&
            appointment.status === "CANCELLED" &&
            appointment.cancelledAt
          ) { 
        // Calculate time since cancellation
             const timeSinceCancellation =
              (now.getTime() - new Date(appointment.cancelledAt).getTime()) /
              1000 /
              60;
            // Send if within 15 minutes of cancellation
            if (timeSinceCancellation > 0 && timeSinceCancellation <= 15) {
              shouldSend = true;
              message = "Cancellation confirmation";
            }
          }
          break; 

        case "MISSED":
          // Send after appointment if status is MISSED
          if (!offset.sendBefore && appointment.status === "MISSED") {
            shouldSend = true;
            message = `${
              offset.sendOffset / 60
            }-hour notice after missed appointment`;
          }
          break;

        case "CUSTOM":
          // Send before if SCHEDULED, or after for COMPLETED/CANCELLED/MISSED
          if (offset.sendBefore && appointment.status === "SCHEDULED") {
            shouldSend = true;
            message = `${
              offset.sendOffset / 60
            }-hour custom reminder before appointment`;
          } else if (
            !offset.sendBefore &&
            ["COMPLETED", "CANCELLED", "MISSED"].includes(appointment.status)
          ) {
            shouldSend = true;
            message = `${
              offset.sendOffset / 60
            }-hour custom notice after appointment`;
          }
          break;
      }
    }

    // Send email and update sent status if applicable
    if (shouldSend) {
      try {
        for (const notification of reminder.notifications) {
          switch (notification.method) {
            case "EMAIL":
              console.log("Sending Email to:", email);
           /*    await sendReminderEmail(email, name, message, reminder.type); */
              break;
            case "SMS":
              console.log("Would send SMS to:", email); // You can replace 'email' with phone later
              break;
            case "PUSH":
              console.log("Would send PUSH notification to:", email);
              break;
          }
        }
        // Mark this appointment-specific offset as sent
        await prisma.appointmentReminderOffset.update({
          where: { id: appointmentOffset.id },
          data: { status: "SENT" },
        });
      } catch (error) {
        // Log error and throw to trigger Inngest retry
        console.error(
          `Failed to send reminder ${appointmentOffset.id}:`,
          error
        );
        throw error;
      }
    }
  }
}
