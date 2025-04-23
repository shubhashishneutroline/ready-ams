import { inngestClient } from "@/tasks/inngest/client";
import { prisma } from "@/lib/prisma";


export const sendAnnouncement = inngestClient.createFunction(
  { id: "send-announcement-or-offer" },
  { event: "announcement/send" },
  async ({ event, step }) => {
    console.log("📨 Running Inngest function for:", event.data.id);
    const { id, lastUpdate} = event.data;

    // Fetch the latest record from DB inside a step
    const announcement = await step.run("fetch-announcement", async () => {
      return await prisma.announcementOrOffer.findUnique({
        where: { id },
      });
    });

    // If the announcement is missing, don't continue
    if (!announcement) {
      return { success: false, message: "Announcement not found" };
    }

    //later we will also compare sent status and wont proceed if status is already sent

    // Skip if version is outdated (announcement was updated after the event was scheduled)
    if (new Date(announcement.updatedAt).getTime() !== lastUpdate) {
      console.log('not matched');
      return {
        success: false,
        message: "Stale event – announcement was updated",
      };
    }

    let targetUsers: { id: string; name: string; email: string }[] = [];
    if (announcement.audience === "ALL") {
      targetUsers = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    }else if (announcement.audience === "APPOINTED_USERS") {
      targetUsers = await prisma.user.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } else if (announcement.audience === "CANCELLED_USERS") {
      targetUsers = await prisma.user.findMany({
        where: { isActive: false },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    }


    // TODO: Send email, push notification, or SMS here
    await step.run("send-email", async () => {
      // Call your email service or notification handler
      console.log(`Sending announcement to audience: ${announcement.message}`);
      // Add actual email/push logic here and we will also update  sent status to true later
    });

    return { success: true };
  }
);
