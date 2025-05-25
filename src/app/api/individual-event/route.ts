import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  eventSchema,
  meetingSchema,
} from "@/features/individual-event/schemas/schema";
import { ZodError } from "zod";
import { VideoProvider } from "@/features/individual-event/types/types";
import { Event } from "@/features/individual-event/types/types";
import { refreshZoomToken } from "@/lib/zoom";
import { refreshGoogleToken } from "@/lib/google-meet";
import { refreshWebexToken } from "@/lib/webex";


export async function POST(req: NextRequest) {
  try {
    const userId = "cmaemhw500006vdawrh8umbqp"; // Get from your auth system (Clerk)
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized!", success: false },
        { status: 401 }
      );
    }

    // Find the individual associated with this user
    const individual = await prisma.individual.findUnique({
      where: { userId: userId },
      include: {
        videoIntegrations: true, // Include the video integrations
      },
    });

    if (!individual) {
      return NextResponse.json(
        {
          message:
            "Individual profile not found. Please create a profile first.!",
          success: false,
        },
        { status: 404 }
      );
    }

    const individualId = individual.id;

    const body = await req.json();

    // Validate the body using the Zod schema
    const parsedData = eventSchema.parse(body);

    // Convert location to VideoProvider enum value
    const provider = parsedData.location?.toUpperCase() as VideoProvider;

    // Validate that the provider is a valid VideoProvider enum value
    if (!Object.values(VideoProvider).includes(provider)) {
      return NextResponse.json(
        { message: "Invalid video provider", success: false },
        { status: 400 }
      );
    }

    // Check if the individual has the required video integration
    const videoIntegration = individual.videoIntegrations.find(
      (integration) => integration.provider === provider
    );

    let needsAuth = false;
    let oauthUrl = "";

    if (provider === "ZOOM" && videoIntegration) {
      console.log("hello")
      // Check if token is expired
      if (
        videoIntegration.expiresAt &&
        videoIntegration.expiresAt < new Date()
      ) {
        if (videoIntegration.refreshToken) {
          try {
            // Attempt to refresh the token
            const newAccessToken = await refreshZoomToken(videoIntegration);
              return NextResponse.json({  accessToken: newAccessToken.accessToken
            ,  expiresAt: newAccessToken.expiresAt} );
           
          } catch (err) {
            // If Zoom rejects the refresh (token expired/invalid), handle it here:
            needsAuth = true;
            oauthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=http://localhost:3000/api/zoom/callback&state=${individualId}`;
          }
        } else {
          // No refresh token, require re-authentication
          needsAuth = true;
          oauthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=http://localhost:3000/api/zoom/callback&state=${individualId}`;
        }
      }
    }

     // ---- GOOGLE MEET ----
  if (provider === "GOOGLE_MEET" && videoIntegration) {
    console.log("helloss")
    if (
      videoIntegration.expiresAt &&
      videoIntegration.expiresAt < new Date()
    ) {
      if (videoIntegration.refreshToken) {
        try {
          const newAccessToken = await refreshGoogleToken(videoIntegration);
          videoIntegration.accessToken = newAccessToken.accessToken;
          videoIntegration.expiresAt = newAccessToken.expiresAt;
        } catch (err) {
          console.log('test')
          needsAuth = true;
          oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_MEET_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.ORIGIN}/api/google/callback`)}&response_type=code&scope=${encodeURIComponent("https://www.googleapis.com/auth/calendar")}&access_type=offline&prompt=consent&state=${individualId}`;
        }
      } else {
        needsAuth = true;
        oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_MEET_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.ORIGIN}/api/google/callback`)}&response_type=code&scope=${encodeURIComponent("https://www.googleapis.com/auth/calendar")}&access_type=offline&prompt=consent&state=${individualId}`;
      }
    }
  }
  
  //--WEBEX--
if (provider === "WEBEX" && videoIntegration) {
  if (
    videoIntegration.expiresAt &&
    videoIntegration.expiresAt < new Date()
  ) {
    if (videoIntegration.refreshToken) {
      try {
        const newAccessToken = await refreshWebexToken(videoIntegration);
        videoIntegration.accessToken = newAccessToken.accessToken;
        videoIntegration.expiresAt = newAccessToken.expiresAt;
      } catch (err) {
        needsAuth = true;
        oauthUrl = `https://webexapis.com/v1/authorize?client_id=${process.env.WEBEX_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(`${process.env.ORIGIN}/api/webex/callback`)}&scope=${encodeURIComponent("spark:kms meeting:schedules_read meeting:participants_read meeting:participants_write meeting:schedules_write")}&state=${individualId}`;
      }
    } else {
      needsAuth = true;
      oauthUrl = `https://webexapis.com/v1/authorize?client_id=${process.env.WEBEX_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(`${process.env.ORIGIN}/api/webex/callback`)}&scope=${encodeURIComponent("spark:kms meeting:schedules_read meeting:participants_read meeting:participants_write meeting:schedules_write")}&state=${individualId}`;
    }
  }
}


    if (needsAuth) {
      return NextResponse.json(
        {
          message: "Authentication required!",
          authUrl: oauthUrl,
          needsAuth: true,
          success: false,
        },
        { status: 200 }
      );
    }

    // Create the event type with nested availability creation
    const event/* : Event  */= await prisma.event.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        location: parsedData.location,
        timezone: parsedData.timezone,
        slug: parsedData.slug,
        userId: parsedData.userId,
        individualId: individualId,
        availability: {
          create: parsedData.availability?.map((availability) => ({
            dayOfWeek: availability.dayOfWeek,
            startTime: availability.startTime,
            endTime: availability.endTime,
            duration: availability.duration,
          })),
        },
      },
      include: {
        availability: true, 
      },
    });

    return NextResponse.json(
      { message: "Event created successfully!", data: event, success: true },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed!", error: error.errors, success: false },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: "Failed to create event!", error: error, success: false },
      { status: 500 }
    );
  }
}


//get request
export async function GET(req: NextRequest) {
  // Replace with your auth system
  const userId = "cmaemhw500006vdawrh8umbqp";
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }

  try {
    const events = await prisma.event.findMany({
      where: { userId },
      include: { availability: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: events, success: true });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch events", error, success: false }, { status: 500 });
  }
}