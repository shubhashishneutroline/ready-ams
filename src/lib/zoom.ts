import { prisma } from "@/lib/prisma";

export async function refreshZoomToken(videoIntegration: any) {
  const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
  const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;

  const response = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: videoIntegration.refreshToken,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    // Update DB with new tokens and expiry
    await prisma.videoIntegration.update({
      where: { id: videoIntegration.id },
      data: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + data.expires_in * 1000),
      },
    });
    return {
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  } else {
    throw new Error('Failed to refresh Zoom token');
  }
}