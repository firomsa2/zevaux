// import type { NextRequest } from "next/server";
// import { updateSession } from "@/utils/supabase/proxy";

// export async function proxy(request: NextRequest) {
//   // update user's auth session
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * Feel free to modify this pattern to include more paths.
//      */
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow these paths without onboarding check
  const allowedPaths = [
    "/auth",
    "/onboarding",
    "/_next",
    "/api",
    ".json",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
  ];

  const isAllowedPath = allowedPaths.some((path) => pathname.startsWith(path));

  // If trying to access protected area, check onboarding status
  if (!isAllowedPath && pathname.startsWith("/dashboard")) {
    try {
      // Check if user has completed onboarding
      const response = await fetch(
        new URL("/api/auth/check-onboarding", request.url),
        {
          method: "GET",
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (!data.onboardingComplete) {
          // If already on dashboard onboarding page, allow access
          if (pathname.startsWith("/dashboard/onboarding")) {
            return await updateSession(request);
          }

          // Redirect to dashboard onboarding
          return NextResponse.redirect(
            new URL("/dashboard/onboarding", request.url)
          );
        }
      }
    } catch (error) {
      console.error("[v0] Onboarding check error:", error);
      // Continue on error, let the page handle auth
    }
  }

  // update user's auth session
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
