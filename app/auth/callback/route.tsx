// import { NextResponse } from "next/server";
// // The client you created from the Server-Side Auth instructions
// import { createClient } from "@/utils/supabase/server";

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get("code");
//   // if "next" is in param, use it as the redirect URL
//   let next = searchParams.get("next") ?? "/dashboard";
//   if (!next.startsWith("/")) {
//     // if "next" is not a relative URL, use the default
//     next = "/dashboard";
//   }

//   if (code) {
//     const supabase = await createClient();
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     if (!error) {
//       const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
//       const isLocalEnv = process.env.NODE_ENV === "development";
//       if (isLocalEnv) {
//         // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
//         return NextResponse.redirect(`${origin}${next}`);
//       } else if (forwardedHost) {
//         return NextResponse.redirect(`https://${forwardedHost}${next}`);
//       } else {
//         return NextResponse.redirect(`${origin}${next}`);
//       }
//     }
//   }

//   // return the user to an error page with instructions
//   return NextResponse.redirect(`${origin}/auth/auth-code-error`);
// }

import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/dashboard";
  if (!next.startsWith("/")) {
    next = "/dashboard";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("business_id")
          .eq("id", user.id)
          .single();

        // If no business yet, always start at website training
        if (!userData?.business_id) {
          const forwardedHost = request.headers.get("x-forwarded-host");
          const isLocalEnv = process.env.NODE_ENV === "development";
          const redirectUrl = isLocalEnv
            ? `${origin}/onboarding/website`
            : forwardedHost
            ? `https://${forwardedHost}/onboarding/website`
            : `${origin}/onboarding/website`;
          return NextResponse.redirect(redirectUrl);
        }

        // Check onboarding progress to determine where to redirect
        try {
          const { getOnboardingProgress } = await import("@/utils/onboarding");
          const progress = await getOnboardingProgress(user.id);

          if (progress.isComplete) {
            // Fully onboarded
            next = "/dashboard";
          } else {
            // Check current step to redirect appropriately
            const currentStep = progress.currentStep;

            if (currentStep?.id === "website_training") {
              next = "/onboarding/website";
            } else if (
              currentStep?.id === "business_info" ||
              currentStep?.id === "phone_verification" ||
              currentStep?.id === "go_live"
            ) {
              next = "/dashboard/onboarding";
            } else {
              // Default to website training if no step is set
              next = "/onboarding/website";
            }
          }
        } catch (error) {
          console.error("Error getting onboarding progress:", error);
          // Fallback: redirect to website training
          next = "/onboarding/website";
        }
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
