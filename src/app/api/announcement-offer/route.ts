import { NextRequest, NextResponse } from "next/server";
import { announcementOrOfferSchema } from "@/features/announcement-offer/schemas/schema";
import { AnnouncementOrOffer } from "@/features/announcement-offer/types/types";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getAnnouncementOrOfferById } from "@/db/announcement-offer";
import { inngestClient } from "@/tasks/inngest/client";

// Create a new announcement or offer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData: AnnouncementOrOffer =
      announcementOrOfferSchema.parse(body);

    // create announcement in prisma
    const newAnnouncement = await prisma.announcementOrOffer.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        message: parsedData.message,
        audience: parsedData.audience,
        isImmediate: parsedData.isImmediate,
        scheduledAt: parsedData.scheduledAt,
        showOn: parsedData.showOn,
        expiredAt: parsedData.expiredAt,
      },
    });

    try {
      await inngestClient.send({
        name: "announcement/send",
        data: {
          id: newAnnouncement.id,
          lastUpdate: newAnnouncement.updatedAt.getTime(),
        },
        ts: new Date(newAnnouncement.scheduledAt).getTime(),
      });
      return NextResponse.json(
        {
          data: newAnnouncement,
          success: true,
          message: "Announcement or offer created and scheduled successfully!",
        },
        { status: 201 }
      );
    } catch (scheduleError) {
      // If scheduling fails, still return a 201 but with a warning

      return NextResponse.json(
        {
          data: newAnnouncement,
          success: true,
          message: "Announcement or offer created, but scheduling failed!.",
        },
        { status: 201 }
      );
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed!",
          error: error.errors[0].message,
          success: false,
        },
        { status: 400 }
      );
    }
    console.log("Error", error);
    return NextResponse.json(
      { message: "Failed to create announcement!", success: false, error: error },
      { status: 500 }
    );
  }
}

// Fetch all announcements or offers
export async function GET() {
  try {
    const announcementOrOffers = await prisma.announcementOrOffer.findMany();

    if (announcementOrOffers.length === 0) {
      return NextResponse.json(
        { message: "No announcements found!", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: announcementOrOffers,
        success: true,
        message: "Announcement/offer fetched successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch announcements!", success: false, error: error},
      { status: 500 }
    );
  }
}

