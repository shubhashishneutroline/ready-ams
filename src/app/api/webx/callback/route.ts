// For Pages Router: /pages/api/auth/callback/webex.js
import { withIronSessionApiRoute } from 'iron-session/next';
import axios from 'axios';

const sessionOptions = {
  password: process.env.SESSION_PASSWORD,
  cookieName: 'webex-auth-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

async function webexCallback(req, res) {
  // Extract code and state from query parameters
  const { code, state } = req.query;
  
  // Validate state parameter (should match what you stored previously)
  if (state !== req.session.oauthState) {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }
  
  try {
    // Exchange authorization code for tokens
    const tokenResponse = await axios.post('https://webexapis.com/v1/access_token', 
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.WEBEX_CLIENT_ID,
        client_secret: process.env.WEBEX_CLIENT_SECRET,
        code: code,
        redirect_uri: process.env.WEBEX_REDIRECT_URI
      }), 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      }
    );
    
    // Store tokens in session
    req.session.accessToken = tokenResponse.data.access_token;
    req.session.refreshToken = tokenResponse.data.refresh_token;
    await req.session.save();
    
    // Redirect to a success page
    res.redirect('/auth/success');
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    res.redirect('/auth/error');
  }
}

export default withIronSessionApiRoute(webexCallback, sessionOptions);
