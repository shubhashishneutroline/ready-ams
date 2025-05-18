import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const individualId = searchParams.get("state"); // Used to identify the individual

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  if (!individualId) {
    return NextResponse.json(
      { error: "Missing  individualId" },
      { status: 400 }
    );
  }

  // Log for debugging (avoid logging sensitive data in production)
  const client_id = "b2e703a1-4646-4e67-94cd-c86e086f5a7b";
  const client_secret = "hUCqdxIFvz4QxMlE9Zh84s88";

  const credentials = Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64"
  );

  const response = await fetch(
    "https://authentication.logmeininc.com/oauth/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        Authorization: `Basic ${credentials}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://localhost:3000/api/go-to-meeting/callback",
      }),
    }
  );
  // Before making the token request
  console.log("Authorization code received:", code.substring(0, 10) + "...");

  // After receiving the response
  console.log("Full response status:", response.status);
  console.log(
    "Full response headers:",
    Object.fromEntries([...response.headers])
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: "Failed to get GoTo Meeting token", details: data },
      { status: 400 }
    );
  }

  // Store tokens and expiry in VideoIntegration table
  await prisma.videoIntegration.upsert({
    where: {
      individualId_provider: {
        individualId: individualId,
        provider: "GOTO_MEETING",
      },
    },
    create: {
      individualId: individualId,
      provider: "GOTO_MEETING",
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    },
    update: {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    },
  });

  // Redirect or return success
  return NextResponse.json({ message: "Success" }, { status: 200 });
}
