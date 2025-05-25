import { meetingSchema } from "@/features/individual-event/schemas/schema";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { google } from "googleapis";
import { refreshZoomToken } from "@/lib/zoom";
import { refreshGoogleToken } from "@/lib/google-meet";
import { refreshWebexToken } from "@/lib/webex";

async function createGoogleMeetEvent(
  googleRefreshToken: string,
  meetingDetails: any
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_MEET_CLIENT_ID,
    process.env.GOOGLE_MEET_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  // Set credentials with the refresh token only
    oauth2Client.setCredentials({ refresh_token: googleRefreshToken });

  // Optionally listen for new tokens (for storing updated tokens)
  /*  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.refresh_token || tokens.access_token) {
      await prisma.individual.update({
        where: { id: individualId },
        data: {
          ...(tokens.refresh_token && {
            googleRefreshToken: tokens.refresh_token,
          }),
          ...(tokens.access_token && {
            googleAccessToken: tokens.access_token,
          }),
        },
      });
    }
  }); */

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const startTime = new Date(meetingDetails.timeSlot);
  const durationMinutes = meetingDetails.duration || 60; // fallback to 60 if not provided
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

  const event = {
    summary: meetingDetails.title,
    description: meetingDetails.description,
    start: { dateTime: startTime.toISOString() },
    end: { dateTime: endTime.toISOString() },
    attendees: [{ email: meetingDetails.bookedByEmail }],
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(2),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
    conferenceDataVersion: 1,
  });

  return response.data.hangoutLink;
}

// Function to create Zoom meeting and return the link
async function createZoomMeeting(userAccessToken: string): Promise<string> {
  try {
    const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${userAccessToken}`, // Use user-specific access token here
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: "New Event Meeting",
        type: 2, // Scheduled meeting
        start_time: new Date().toISOString(),
        duration: 60,
        settings: {
          host_video: true,
          participant_video: true,
          audio: "voip",
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Zoom API Error:", errorData);
      throw new Error("Failed to create Zoom meeting");
    }

    const data = await response.json();
    console.log("data", data);
    return data.join_url; // Zoom meeting link
  } catch (error) {
    console.log("Error creating Zoom meeting:", error);
    throw new Error("Failed to create Zoom meeting");
  }
}

// New function to create Microsoft Teams meeting
async function createTeamsMeeting(
  microsoftAccessToken: string,
  meetingDetails: any
): Promise<string> {
  try {
    const startTime = new Date(meetingDetails.timeSlot);
    const durationMinutes = meetingDetails.duration || 60;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    const response = await fetch("https://graph.microsoft.com/v1.0/me/events", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${microsoftAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject: meetingDetails.title,
        body: {
          contentType: "HTML",
          content: meetingDetails.description || "Teams meeting",
        },
        start: {
          dateTime: startTime.toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: "UTC",
        },
        attendees: [
          {
            emailAddress: {
              address: meetingDetails.bookedByEmail,
            },
            type: "required",
          },
        ],
        isOnlineMeeting: true,
        onlineMeetingProvider: "teamsForBusiness",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Microsoft Graph API Error:", errorData);
      /*     throw new Error("Failed to create Teams meeting"); */
    }

    const data = await response.json();
    console.log("data is", data);
    return data.onlineMeeting.joinUrl; // Teams meeting join URL
  } catch (error) {
    console.log("Error creating Teams meeting:", error);
    throw new Error("Failed to create Teams meeting");
  }
}

//for webex
async function createWebexMeeting(
  webexAccessToken: string,
  meetingDetails: any
): Promise<string> {
  const startTime = new Date(meetingDetails.timeSlot);
  const durationMinutes = meetingDetails.duration || 60;
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

  const response = await fetch("https://webexapis.com/v1/meetings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${webexAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: meetingDetails.title,
      agenda: meetingDetails.description,
      start: startTime.toISOString(),
      end: endTime.toISOString(),
      invitees: [{ email: meetingDetails.bookedByEmail }],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("Webex API Error:", data);
    throw new Error("Failed to create Webex meeting");
  }

  // The join link for attendees
  return data.webLink; // or data.joinMeetingLink
}

//GoTo Meeting function
async function createGotoMeeting(
  gotoAccessToken: string,
  meetingDetails: any
): Promise<string> {
  const startTime = new Date(meetingDetails.timeSlot);
  const durationMinutes = meetingDetails.duration || 60;
  const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

  const response = await fetch("https://api.getgo.com/G2M/rest/meetings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${gotoAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      subject: meetingDetails.title,
      starttime: startTime.toISOString(),
      endtime: endTime.toISOString(),
      passwordrequired: false,
      conferencecallinfo: "Hybrid",
      timezonekey: "UTC",
      meetingtype: "immediate", // or "scheduled" based on your needs
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("GoTo Meeting API Error:", data);
    throw new Error("Failed to create GoTo Meeting");
  }

  // Return the join URL for attendees
  return data.joinURL;
}

// Function to format the Date to "HH:mm" format
function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Endpoint for booking a meeting for an event
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate the meeting data using Zod (you may want to define a separate schema for meeting)
    const parsedData = meetingSchema.parse(body);

    //Fetch the event to get the individualId
    const event = await prisma.event.findUnique({
      where: { id: parsedData.eventId },
      select: {
        individualId: true,
        location: true,
        title: true,
        description: true,
      },
    });

    if (!event?.individualId) {
      return NextResponse.json(
        { error: "Event or individual not found" },
        { status: 404 }
      );
    }

    // Now fetch the individual
    const individual = await prisma.individual.findUnique({
      where: { id: event.individualId },
      include: { videoIntegrations: true }, // Assuming this relation exists
    });

    if (!individual) {
      return NextResponse.json(
        { error: "Individual not found" },
        { status: 404 }
      );
    }

     // Decide provider (from  event)
    const provider = (event.location || "").toUpperCase();
    // Check if the individual has the required video integration
    const videoIntegration = individual.videoIntegrations.find(
      (integration) => integration.provider === provider
    );

    if (!videoIntegration || !videoIntegration.refreshToken) {
      return NextResponse.json(
        { error: ` integration not found for individual` },
        { status: 400 }
      );
    }

    const individualId = individual.id;

    let needsAuth = false;
    let oauthUrl = "";

    if (event.location === "ZOOM" && videoIntegration) {
      console.log("hello");
      // Check if token is expired
      if (
        videoIntegration.expiresAt &&
        videoIntegration.expiresAt < new Date()
      ) {
        if (videoIntegration.refreshToken) {
          try {
            // Attempt to refresh the token
            const newAccessToken = await refreshZoomToken(videoIntegration);
            return NextResponse.json({
              accessToken: newAccessToken.accessToken,
              expiresAt: newAccessToken.expiresAt,
            });
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
    if (event.location === "GOOGLE_MEET" && videoIntegration) {
      console.log("helloss");
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
            console.log("test");
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
    if (event.location === "WEBEX" && videoIntegration) {
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

    // Check availability (Ensure the time slot is available)
    const availability = await prisma.availability.findFirst({
      where: {
        eventId: parsedData.eventId,
        dayOfWeek: new Date(parsedData.timeSlot).getDay(),
        startTime: formatTime(new Date(parsedData.timeSlot)),
      },
    });

    if (!availability) {
      return NextResponse.json(
        { error: "The selected time slot is unavailable" },
        { status: 400 }
      );
    }

   

    let videoUrl;
    let videoProvider:
      | "ZOOM"
      | "GOOGLE_MEET"
      | "MICROSOFT_TEAMS"
      | "WEBEX"
      | "GOTO_MEETING"
      | null = null;

    if (provider === "ZOOM") {
      // Create Zoom meeting and get the link
      videoUrl = await createZoomMeeting(videoIntegration.accessToken);
      videoProvider = "ZOOM";
    } else if (provider === "GOOGLE_MEET") {
      if (!videoIntegration.accessToken) {
        return NextResponse.json(
          { error: "Google token not found for individual" },
          { status: 400 }
        );
      }
      videoUrl = await createGoogleMeetEvent(videoIntegration.refreshToken, {
        title: event.title,
        description: event.description,
        timeSlot: parsedData.timeSlot,
        bookedByEmail: parsedData.bookedByEmail,
      });
      videoProvider = "GOOGLE_MEET";
    } else if (provider === "MICROSOFT_TEAMS") {
      if (!videoIntegration.accessToken) {
        return NextResponse.json(
          { error: "Microsoft access token not found for individual" },
          { status: 400 }
        );
      }
      videoUrl = await createTeamsMeeting(videoIntegration.accessToken, {
        title: event.title,
        description: event.description,
        timeSlot: parsedData.timeSlot,
        bookedByEmail: parsedData.bookedByEmail,
      });
      videoProvider = "MICROSOFT_TEAMS";
    } else if (provider === "WEBEX") {
      if (!videoIntegration.accessToken) {
        return NextResponse.json(
          { error: "Webex access token not found for individual" },
          { status: 400 }
        );
      }
      videoUrl = await createWebexMeeting(videoIntegration.accessToken, {
        title: event.title,
        description: event.description,
        timeSlot: parsedData.timeSlot,
        bookedByEmail: parsedData.bookedByEmail,
      });
      videoProvider = "WEBEX";
    } else if (provider === "GOTO_MEETING") {
      if (!videoIntegration.accessToken) {
        return NextResponse.json(
          { error: "GoTo Meeting access token not found for individual" },
          { status: 400 }
        );
      }
      videoUrl = await createGotoMeeting(videoIntegration.accessToken, {
        title: event.title,
        description: event.description,
        timeSlot: parsedData.timeSlot,
        bookedByEmail: parsedData.bookedByEmail,
      });
      videoProvider = "GOTO_MEETING";
    } else {
      return NextResponse.json(
        { error: "Invalid or missing video provider" },
        { status: 400 }
      );
    }
    const startTime = new Date(parsedData.timeSlot); // Make sure this is a valid date
    const durationMinutes = availability.duration || 60; // Use the slot's duration, fallback to 60 if not present
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    // Create a meeting record
    const meeting = await prisma.meeting.create({
      data: {
        eventId: parsedData.eventId,
        startTime, 
        endTime,
        bookedByName: parsedData.bookedByName ?? "",
        bookedByEmail: parsedData.bookedByEmail,
        videoUrl,
        videoProvider,
      },
    });

    return NextResponse.json(
      { message: "Meeting booked successfully", meeting },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
  }
}
