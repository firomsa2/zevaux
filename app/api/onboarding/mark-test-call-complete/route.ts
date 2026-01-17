import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { saveOnboardingProgress } from "@/utils/onboarding";

/**
 * @deprecated This route is deprecated. The test call step has been removed from the onboarding flow.
 * Phone verification now leads directly to plan selection.
 * This route is kept for backward compatibility but should not be used for new implementations.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { businessId } = await request.json();

    if (!businessId) {
      return NextResponse.json(
        { error: "Missing businessId" },
        { status: 400 }
      );
    }

    // This step has been deprecated - just return success for backward compatibility
    // The step_3_test_call_completed field is no longer used
    console.warn(
      "[DEPRECATED] mark-test-call-complete API called. This step has been removed from onboarding flow."
    );

    return NextResponse.json({
      success: true,
      message:
        "Test call step has been deprecated - this action is no longer required",
      deprecated: true,
    });
  } catch (error) {
    console.error("[v0] Mark test call complete error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
