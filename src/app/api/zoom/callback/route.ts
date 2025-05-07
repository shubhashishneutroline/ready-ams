// src/app/api/zoom/callback/route.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

/* const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET; */

const  ZOOM_CLIENT_ID='1UpscrfeTkSEm0S8loY5cw'
const  ZOOM_CLIENT_SECRET='NvhWNBcLo8ykKLYMTJJHGNLumu0MdLqS'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code'); // Get the authorization code from query parameters
  const individualId = searchParams.get('state'); 
  console.log('code',code);
  console.log('individualId',individualId);

  if (!code) {
    return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
  }

  // Exchange the authorization code for an access token
  try {
    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        /* 'Authorization': `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64')}`, */
        'Authorization': `Basic ${Buffer.from(`kRUuqOz4RemMylxRzVAHPw:I2cOV9zSpB5H2dJW5ez2adXy1ZqSEikr`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:3000/api/zoom/callback', // Ensure this matches the redirect URI in Zoom app settings
      }),
    });

    const data = await response.json();

    // Get the access token and store it securely (e.g., in your session or database)
    const accessToken = data.access_token;
    console.log('Zoom Access Token:', accessToken);


    // Here, you would ideally store the access token in your session or database
    await prisma.individual.update({
      where: { id: individualId! },
      data: { zoomAccessToken: data.access_token },
    });

    return NextResponse.json({ message: 'OAuth successful', accessToken });
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 500 });
  }
}
