import { NextRequest, NextResponse } from "next/server";
import { getOnboardingProgress } from "@/utils/onboarding";
import { createClient } from "@/utils/supabase/server";

/**
 * Production-optimized API route for onboarding progress
 * Features:
 * - Proper cache control headers
 * - Error handling with appropriate status codes
 * - Authentication validation
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { 
          status: 401,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    const progress = await getOnboardingProgress(user.id);

    // Set appropriate cache headers for production
    // Short cache for active onboarding, longer for completed
    const cacheMaxAge = progress.isComplete ? 300 : 10; // 5min if complete, 10s if active

    return NextResponse.json(progress, {
      headers: {
        "Cache-Control": `private, max-age=${cacheMaxAge}, must-revalidate`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    console.error("Error fetching onboarding progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch onboarding progress", details: error.message },
      { 
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}

