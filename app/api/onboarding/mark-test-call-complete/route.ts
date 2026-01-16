import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { saveOnboardingProgress } from "@/utils/onboarding";

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

    // Save test call completion
    const result = await saveOnboardingProgress(businessId, {
      step_3_test_call_completed: true,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test call completion saved successfully",
    });
  } catch (error) {
    console.error("[v0] Mark test call complete error:", error);
    return NextResponse.json(
      { error: "Failed to save test call completion" },
      { status: 500 }
    );
  }
}

