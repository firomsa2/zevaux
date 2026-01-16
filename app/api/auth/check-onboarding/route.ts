import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ onboardingComplete: false }, { status: 401 });
    }

    // Get user's business
    const { data: userData } = await supabase
      .from("users")
      .select("business_id")
      .eq("id", user.id)
      .single();

    if (!userData?.business_id) {
      return NextResponse.json({ onboardingComplete: false });
    }

    // Check business onboarding status
    const { data: business } = await supabase
      .from("businesses")
      .select("onboarding_completed")
      .eq("id", userData.business_id)
      .single();

    return NextResponse.json({
      onboardingComplete: business?.onboarding_completed || false,
    });
  } catch (error) {
    console.error("[v0] Check onboarding error:", error);
    return NextResponse.json({ onboardingComplete: false }, { status: 500 });
  }
}
