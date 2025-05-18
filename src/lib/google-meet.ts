import { prisma } from "./prisma";

export async function refreshGoogleToken(videoIntegration: any) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_MEET_CLIENT_ID!;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_MEET_CLIENT_SECRET!;

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: videoIntegration.refreshToken,
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const data = await response.json();

  if (data.access_token) {
    // Update DB with new tokens and expiry
    await prisma.videoIntegration.update({
      where: { id: videoIntegration.id },
      data: {
        accessToken: data.access_token,
        // Google may not always return a new refresh token; keep the old one if not present
        refreshToken: data.refresh_token || videoIntegration.refreshToken,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
    });
    return {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  } else {
    throw new Error('Failed to refresh Google token');
  }
}