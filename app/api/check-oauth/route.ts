import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    currentConfig: {
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    },
    correctRedirectUri:
      "http://localhost:3000/api/integrations/google/callback",
    commonMistakes: [
      "Extra /app in path",
      "Trailing slashes",
      "http vs https",
      "localhost:3000 vs 127.0.0.1:3000",
    ],
  });
}
