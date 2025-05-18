// src/app/api/google/callback/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_MEET_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_MEET_SECRET;
const GOOGLE_REDIRECT_URI = `${process.env.ORIGIN}/api/google/callback`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const individualId = searchParams.get("state"); // Pass this when starting OAuth

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

   if (!individualId) {
    return NextResponse.json(
      { error: "Missing individualId" },
      { status: 400 }
    );
  }


  try {
    // Exchange code for tokens
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error("Google client ID or secret is missing");
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();
    console.log('data',data);

      if (!data.access_token || !data.refresh_token) {
      return NextResponse.json(
        { error: "Failed to get tokens from Google", details: data },
        { status: 400 }
      );
    }

  // Store tokens and expiry in VideoIntegration table (upsert)
    await prisma.videoIntegration.upsert({
      where: {
        individualId_provider: {
          individualId: individualId,
          provider: "GOOGLE_MEET",
        }
      },
      create: {
        individualId: individualId,
        provider: "GOOGLE_MEET",
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + (data.expires_in * 1000)),
      },
      update: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + (data.expires_in * 1000)),
      }
    });


    return NextResponse.json({
      message: "Google OAuth successful",
      accessToken: data.access_token,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to exchange code for token", details: error },
      { status: 500 }
    );
  }
}
