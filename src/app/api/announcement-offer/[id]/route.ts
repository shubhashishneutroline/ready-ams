import { NextRequest, NextResponse } from "next/server";
import { getAnnouncementOrOfferById } from "@/db/announcement-offer";
import { prisma } from "@/lib/prisma";
import { announcementOrOfferSchema } from "@/features/announcement-offer/schemas/schema";
import { ZodError } from "zod";
import { AnnouncementOrOffer } from "@/features/announcement-offer/types/types";
import { inngestClient } from "@/tasks/inngest/client";

interface ParamsProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;
    const announcement = await getAnnouncementOrOfferById(id);

    if (!announcement) {
      return NextResponse.json(
        { message: "Announcement or offer not found!", success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        data: announcement,
        success: true,
        message: "Announcement/offer fetched successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch announcement!", success: false, error: error },
      { status: 500 }
    );
  }
}

// Update an existing announcement or offer
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        {message: "Announcement/Offer Id required!", success: false },
        { status: 400 }
      );
    }

    const existingAnnouncement = await getAnnouncementOrOfferById(id);

    if (!existingAnnouncement) {
      return NextResponse.json(
        { message: "Announcement not found!", success: false },
        { status: 404 }
      );
    }

    const body = await req.json();
    const parsedData: AnnouncementOrOffer =
      announcementOrOfferSchema.parse(body);

    // update announcement in prisma
    const updatedAnnouncement = await prisma.announcementOrOffer.update({
      where: { id },
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

    if (!updatedAnnouncement) {
      return NextResponse.json(
        { message: "Announcement/Offer couldn't be updated!", success: false },
        { status: 404 }
      );
    }

    try {
      await inngestClient.send({
        name: "announcement/send",
        data: {
          id: updatedAnnouncement.id,
          lastUpdate: updatedAnnouncement.updatedAt.getTime(),
        },
        ts: new Date(updatedAnnouncement.scheduledAt).getTime(),
      });

      return NextResponse.json(
        {
          data: updatedAnnouncement,
          success: true,
          message: "Announcement updated successfully!",
        },
        { status: 200 }
      );
    } catch (scheduleError) {
      // If scheduling fails, still return a 201 but with a warning

      return NextResponse.json(
        {
          data: updatedAnnouncement,
          success: true,
          message: "Announcement or offer updated, but scheduling failed!.",
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
    return NextResponse.json(
      { message: "Failed to update announcement!", success: false, error: error },
      { status: 500 }
    );
  }
}

// Delete an announcement or offer
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { message: "Announcement/Offer Id required!", success: false },
        { status: 400 }
      );
    }

    const existingAnnouncement = await getAnnouncementOrOfferById(id);
    if (!existingAnnouncement) {
      return NextResponse.json(
        { message: "Announcement/Offer not found!", success: false },
        { status: 404 }
      );
    }

    const deletedAnnouncement = await prisma.announcementOrOffer.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        data: deletedAnnouncement,
        success: true,
        message: "Announcement deleted successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete announcement!", success: false, error: error },
      { status: 500 }
    );
  }
}
