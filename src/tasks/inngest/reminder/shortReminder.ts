import { inngestClient } from "@/tasks/inngest/client"
import { processReminder } from "./function";

export const sendDelayedReminder = inngestClient.createFunction(
    {
      id: "send-delayed-reminder",
      name: "Send Delayed Reminder Notification",
    },
    { event: "reminder/send" },
    async ({ event }) => {
      const {
        now,
        reminder,
        email,
        name,
        appointmentTime,
        appointment,
      } = event.data;
  
      await processReminder(now, reminder, email, name, appointmentTime, appointment, event);
    }
  );

