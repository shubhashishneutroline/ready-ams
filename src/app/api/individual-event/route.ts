import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  eventSchema,
  meetingSchema,
} from "@/features/individual-event/schemas/schema";
import { ZodError } from "zod";

export async function POST(req: NextRequest) {
  try {
    const individualId = "cmaemjcbp0008vdawnpwllyx1";

    const body = await req.json();

    // Validate the body using the Zod schema
    const parsedData = eventSchema.parse(body);

    const provider = parsedData.location?.toUpperCase();
    const individual = await prisma.individual.findUnique({
      where: { id: individualId },
      select: { zoomAccessToken: true, googleRefreshToken: true , microsoftAccessToken: true },
    });

    let needsAuth = false;
    let oauthUrl = "";

    if (provider === "ZOOM") {
      if (!individual?.zoomAccessToken) {
        needsAuth = true;
        oauthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=kRUuqOz4RemMylxRzVAHPw&redirect_uri=http://localhost:3000/api/zoom/callback&state=cma4ncl5q0001vdhk9uxbputi`;
      }
    } else if (provider === "GOOGLE_MEET") {
      if (!individual?.googleRefreshToken) {
        needsAuth = true;
        /*   oauthUrl =
          `https://accounts.google.com/o/oauth2/v2/auth` +
          `?client_id=${process.env.GOOGLE_MEET_CLIENT_ID}` +
          `&redirect_uri=${encodeURIComponent("http://localhost:3000/api/google/callback")}` +
          `&response_type=code` +
          `&scope=${encodeURIComponent(
            "https://www.googleapis.com/auth/calendar"
          )}` +
          `&access_type=offline` + // Get refresh token
          `&state=${individualId}`; */

        oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=818208535731-17gl8087i36c7ep8lm3h6n7mo9sgsdeq.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/google/callback&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar&access_type=offline&state=cma4ncl5q0001vdhk9uxbputi`;
      }
    }
    else if (provider === "MICROSOFT_TEAMS") {
      if (!individual?.microsoftAccessToken) {
        needsAuth = true;
       /*  const clientId = process.env.MS_CLIENT_ID;
        const redirectUri = encodeURIComponent("http://localhost:3000/api/microsoft/callback");
        const scope = encodeURIComponent("https://graph.microsoft.com/Calendars.ReadWrite https://graph.microsoft.com/OnlineMeetings.ReadWrite");
        oauthUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&response_mode=query&scope=${scope}&state=${individualId}`; */
      
      }
    } else {
      return NextResponse.json(
        { message: "Invalid or missing location/video provider" },
        { status: 400 }
      );
    }

    if (needsAuth) {
      // Redirect to the appropriate OAuth flow if authorization not made
      return NextResponse.redirect(oauthUrl); 
    }

    // Create the event type with nested availability creation
    const event = await prisma.event.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        location: parsedData.location,
        slug: parsedData.slug,
        userId: parsedData.userId,
        individualId: parsedData.individualId,
        availability: {
          create: parsedData.availability?.map((availability) => ({
            dayOfWeek: availability.dayOfWeek,
            startTime: availability.startTime,
            endTime: availability.endTime,
            duration: availability.duration,
          })),
        },
      },
    });

    return NextResponse.json(
      { message: "Event created successfully", event },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
