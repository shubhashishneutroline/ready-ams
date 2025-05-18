import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
   const individualId = searchParams.get('state'); 

  if (!code ) {
    return NextResponse.json({ error: "Missing code " }, { status: 400 });
  }

   if (!individualId) {
  return NextResponse.json({ error: "Missing  individualId" }, { status: 400 });
}

  // Exchange code for access token
  const response = await fetch("https://webexapis.com/v1/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.WEBEX_CLIENT_ID!,
      client_secret: process.env.WEBEX_CLIENT_SECRET!,
      code,
      redirect_uri: "http://localhost:3000/api/webx/callback",
    }),
  });

  const data = await response.json();
 
  if (!response.ok) {
    return NextResponse.json({ error: "Failed to get Webex token", details: data }, { status: 400 });
  }

  // Store tokens and expiry in VideoIntegration table
    await prisma.videoIntegration.upsert({
      where: {
        individualId_provider: {
          individualId: individualId,
          provider: "WEBEX",
        }
      },
      create: {
        individualId: individualId,
        provider: "WEBEX",
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
      message: " OAuth successful",
      accessToken: data.access_token,
    });
}