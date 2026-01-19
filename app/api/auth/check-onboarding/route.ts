// import { type NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";

// export async function GET(request: NextRequest) {
//   try {
//     const supabase = await createClient();
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json({ onboardingComplete: false }, { status: 401 });
//     }

//     // Get user's business
//     const { data: userData } = await supabase
//       .from("users")
//       .select("business_id")
//       .eq("id", user.id)
//       .single();

//     if (!userData?.business_id) {
//       return NextResponse.json({ onboardingComplete: false });
//     }

//     // Check business onboarding status
//     const { data: business } = await supabase
//       .from("businesses")
//       .select("onboarding_completed")
//       .eq("id", userData.business_id)
//       .single();

//     console.log(
//       "[v0] Check onboarding for business:",
//       userData.business_id,
//       business,
//     );

//     return NextResponse.json({
//       onboardingComplete: business?.onboarding_completed || false,
//     });
//   } catch (error) {
//     console.error("[v0] Check onboarding error:", error);
//     return NextResponse.json({ onboardingComplete: false }, { status: 500 });
//   }
// }

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getOnboardingProgress } from "@/utils/onboarding";

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

    // Get the onboarding progress using your existing function
    const onboardingProgress = await getOnboardingProgress(user.id);

    console.log(
      "[v0] Check onboarding for user:",
      user.id,
      "business:",
      userData.business_id,
      "completedSteps:",
      onboardingProgress.completedSteps,
      "totalSteps:",
      onboardingProgress.totalSteps,
      "isComplete:",
      onboardingProgress.isComplete,
    );

    // Allow access if at least 3 out of 4 steps are completed
    const shouldAllowAccess =
      onboardingProgress.completedSteps >= 3 || onboardingProgress.isComplete;

    return NextResponse.json({
      onboardingComplete: shouldAllowAccess,
      completedSteps: onboardingProgress.completedSteps,
      totalSteps: onboardingProgress.totalSteps,
      isComplete: onboardingProgress.isComplete,
    });
  } catch (error) {
    console.error("[v0] Check onboarding error:", error);
    return NextResponse.json({ onboardingComplete: false }, { status: 500 });
  }
}
