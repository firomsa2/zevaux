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

// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { updateSession } from "@/utils/supabase/proxy";

// export async function proxy(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   // Allow these paths without onboarding check
//   const allowedPaths = [
//     "/auth",
//     "/onboarding",
//     "/_next",
//     "/api",
//     ".json",
//     ".svg",
//     ".png",
//     ".jpg",
//     ".jpeg",
//     ".gif",
//     ".webp",
//   ];

//   const isAllowedPath = allowedPaths.some((path) => pathname.startsWith(path));

//   // If trying to access protected area, check onboarding status
//   if (!isAllowedPath && pathname.startsWith("/dashboard")) {
//     try {
//       // Check if user has completed onboarding
//       const response = await fetch(
//         new URL("/api/auth/check-onboarding", request.url),
//         {
//           method: "GET",
//           headers: {
//             cookie: request.headers.get("cookie") || "",
//           },
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         if (!data.onboardingComplete) {
//           // If already on dashboard onboarding page, allow access
//           if (pathname.startsWith("/dashboard/onboarding")) {
//             return await updateSession(request);
//           }

//           // Redirect to dashboard onboarding
//           return NextResponse.redirect(
//             new URL("/dashboard/onboarding", request.url)
//           );
//         }
//       }
//     } catch (error) {
//       console.error("[v0] Onboarding check error:", error);
//       // Continue on error, let the page handle auth
//     }
//   }

//   // update user's auth session
//   return await updateSession(request);
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
//   ],
// };

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";
import { createClient } from "@/utils/supabase/server";

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
      // Create Supabase client for middleware
      const supabase = createClient();

      // Get the user from the request
      const {
        data: { user },
        error: authError,
      } = await (await supabase).auth.getUser();

      if (authError || !user) {
        // Not authenticated, allow the auth flow to handle it
        return await updateSession(request);
      }

      // Get user's business
      const { data: userData } = await (await supabase)
        .from("users")
        .select("business_id")
        .eq("id", user.id)
        .single();

      if (!userData?.business_id) {
        // No business yet, redirect to onboarding (unless already there)
        if (pathname.startsWith("/dashboard/onboarding")) {
          return await updateSession(request);
        }
        return NextResponse.redirect(
          new URL("/dashboard/onboarding", request.url),
        );
      }

      // Check onboarding progress directly
      const { data: onboardingProgress } = await (await supabase)
        .from("onboarding_progress")
        .select(
          "step_1_website, step_2_business_info, step_3_phone_setup, step_4_go_live",
        )
        .eq("business_id", userData.business_id)
        .maybeSingle();

      console.log("[Middleware] Onboarding check:", {
        userId: user.id,
        businessId: userData.business_id,
        step_3_phone_setup: onboardingProgress?.step_3_phone_setup,
        pathname,
        isOnboardingPage: pathname.startsWith("/dashboard/onboarding"),
      });

      // NEW LOGIC: Allow access if step 3 is completed (website + business info + phone)
      // This means user has completed at least 3 out of 4 steps
      const hasCompletedStep3 = onboardingProgress?.step_3_phone_setup === true;

      // If already on dashboard onboarding page, always allow access
      if (pathname.startsWith("/dashboard/onboarding")) {
        return await updateSession(request);
      }

      // If step 3 is not completed, redirect to onboarding
      if (!hasCompletedStep3) {
        return NextResponse.redirect(
          new URL("/dashboard/onboarding", request.url),
        );
      }

      // Step 3 is completed, allow access to all dashboard pages
      return await updateSession(request);
    } catch (error) {
      console.error("[Middleware] Onboarding check error:", error);
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
