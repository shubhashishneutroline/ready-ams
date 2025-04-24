import { NextRequest, NextResponse } from "next/server";
import { announcementOrOfferSchema } from "@/features/announcement-offer/schemas/schema";
import { AnnouncementOrOffer, Showon, TargetAudience, ExpirationDuration } from "@/features/announcement-offer/types/types";
import { ZodError } from "zod";

// Dummy data (for now, we will store announcements in this array)
let announcements: AnnouncementOrOffer[] = [
  {
    id: "1",
    title: "Special Offer: 20% Off All Services!", // Required
    description: "Get 20% off on all our services for a limited time.", // Optional
    message: "Use code '20OFF' to claim your discount.", // Optional
    audience: TargetAudience.ALL, // Required (Target audience)
    isImmediate: true, // Required (If the offer is immediate)
    scheduledAt: "2025-04-10T10:00:00Z", // Required (Scheduled date/time in ISO format)
    showOn: Showon.BANNER, // Required (Where the offer will show, e.g., on a banner)
    expiredAt: ExpirationDuration.THIRTY_DAYS, // Required (Expiration duration or "never")
  },
];

// Create a new announcement or offer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = announcementOrOfferSchema.parse(body);

    // Generate a unique ID for the announcement/offer (using timestamp)
    const newAnnouncement: AnnouncementOrOffer = {
      ...parsedData,
      id: String(Date.now()), // Add a unique ID
    };

    announcements.push(newAnnouncement);

    return NextResponse.json(
      { message: "Announcement or offer created successfully", announcement: newAnnouncement },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Fetch all announcements or offers
export async function GET() {
  try {
    if (announcements.length === 0) {
      return NextResponse.json({ error: "No announcements found" }, { status: 404 });
    }
    return NextResponse.json(announcements, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

// Update an existing announcement or offer
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = announcementOrOfferSchema.parse(body);

    const { id } = body;
    const announcementIndex = announcements.findIndex((announcement) => announcement.id === id);

    if (announcementIndex === -1) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    const updatedAnnouncement = { ...announcements[announcementIndex], ...parsedData };
    announcements[announcementIndex] = updatedAnnouncement;

    return NextResponse.json(
      { message: "Announcement updated successfully", announcement: updatedAnnouncement },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Delete an announcement or offer
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    const announcementIndex = announcements.findIndex((announcement) => announcement.id === id);

    if (announcementIndex === -1) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
    }

    announcements.splice(announcementIndex, 1);

    return NextResponse.json({ message: "Announcement deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}
