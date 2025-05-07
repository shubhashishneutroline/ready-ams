// src/app/api/google/callback/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_MEET_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_MEET_SECRET;
const GOOGLE_REDIRECT_URI = "http://localhost:3000/api/google/callback";

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

    if (!data.access_token) {
      return NextResponse.json(
        { error: "Failed to get access token", details: data },
        { status: 500 }
      );
    }

    // Store tokens in your DB (adjust field names as needed)
    await prisma.individual.update({
      where: { id: individualId! },
      data: {
        googleAccessToken: data.access_token,
        googleRefreshToken: data.refresh_token,
      },
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
