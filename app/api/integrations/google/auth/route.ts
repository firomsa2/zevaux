// import { NextResponse } from "next/server";
// import { getGoogleAuthURL } from "@/lib/google-auth";

// export async function GET() {
//   return NextResponse.redirect(getGoogleAuthURL());
// }

import { NextResponse } from "next/server";
import { getGoogleAuthURL } from "@/lib/google-auth";

export async function GET() {
  try {
    const authUrl = getGoogleAuthURL();
    console.log("Redirecting to Google Auth URL:", authUrl);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
