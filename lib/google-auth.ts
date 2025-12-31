// lib/google-auth.ts
import { google } from "googleapis";

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getGoogleAuthURL() {
  const scopes = ["https://www.googleapis.com/auth/calendar"];

  // Add random state parameter to bypass cache
  const state =
    Math.random().toString(36).substring(2) + Date.now().toString(36);

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    // Add these to force fresh auth and bypass cache
    include_granted_scopes: true,
    state: state,
    // Explicitly set redirect_uri (important!)
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  });
}
