import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // use to identify the individual

  if (!code || !state) {
    return NextResponse.json({ error: "Missing code or state" }, { status: 400 });
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
      redirect_uri: "http://localhost:3000/api/webex/callback",
    }),
  });

  const tokenData = await response.json();
  if (!response.ok) {
    return NextResponse.json({ error: "Failed to get Webex token", details: tokenData }, { status: 400 });
  }

  // Save access token for the individual
  await prisma.individual.update({
    where: { id: state },
    data: { webexAccessToken: tokenData.access_token },
  });

  // Redirect or return success
  return NextResponse.redirect("/success"); // or your desired page
}