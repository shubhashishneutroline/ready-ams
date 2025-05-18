// src/app/api/zoom/callback/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID!;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET!;


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code'); // Get the authorization code from query parameters
  const individualId = searchParams.get('state'); 

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  if (!individualId) {
  return NextResponse.json({ error: "Missing  individualId" }, { status: 400 });
}


  // Exchange the authorization code for an access token
  try {
    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri:`${process.env.ORIGIN}/api/zoom/callback`, // Ensure this matches the redirect URI in Zoom app settings
      }),
    });

    const data = await response.json();

    
    if (!data.access_token || !data.refresh_token) {
      return NextResponse.json({message: 'Failed to get tokens from Zoom!',success: false }, { status: 400 });
    }



    // Store tokens and expiry in VideoIntegration table
    await prisma.videoIntegration.upsert({
      where: {
        individualId_provider: {
          individualId: individualId,
          provider: "ZOOM",
        }
      },
      create: {
        individualId: individualId,
        provider: "ZOOM",
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

    return NextResponse.json({ message: 'OAuth successful', accessToken: data.access_token });

  } catch (error) {
    console.error('Error during OAuth callback:', error);
    return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 500 });
  }
}
