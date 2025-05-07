import { Inngest } from "inngest"

export const inngestClient = new Inngest({
  id: "Appointment Management System",
  // eventKey: process.env.INNGEST_EVENT_KEY, // Add this for production
})
