// import { type NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { userId, businessId, formData, selectedPlan, isProCheckout } =
//       await req.json();

//     const supabase = await createClient();

//     const { error: updateError } = await supabase
//       .from("businesses")
//       .update({
//         name: formData.businessName,
//         industry: formData.industry,
//         timezone: formData.timezone,
//         assistant_name: formData.assistantName,
//         description: formData.description,
//         onboarding_completed: !isProCheckout, // Only mark complete for Starter, Pro completes after payment
//         onboarding_completed_at: !isProCheckout
//           ? new Date().toISOString()
//           : null,
//         billing_plan: selectedPlan,
//       })
//       .eq("id", businessId);

//     if (updateError) {
//       console.error("[v0] Error updating business:", updateError);
//       return NextResponse.json(
//         { error: "Failed to update business data" },
//         { status: 500 }
//       );
//     }

//     const { data: planData } = await supabase
//       .from("plans")
//       .select("id")
//       .eq("slug", selectedPlan)
//       .single();

//     if (!planData) {
//       console.error("[v0] Plan not found for slug:", selectedPlan);
//       return NextResponse.json(
//         { error: "Invalid plan selection" },
//         { status: 400 }
//       );
//     }

//     if (selectedPlan === "starter") {
//       const { error: usageError } = await supabase.from("user_tracking").upsert(
//         {
//           business_id: businessId,
//           plan_id: planData.id,
//           minutes_used: 0,
//           calls_made: 0,
//           active_phone_numbers: 0,
//           team_members_count: 0,
//           period_start: new Date().toISOString(),
//           period_end: new Date(
//             Date.now() + 30 * 24 * 60 * 60 * 1000
//           ).toISOString(),
//         },
//         { onConflict: "business_id" }
//       );

//       if (usageError) {
//         console.error("[v0] Error creating usage tracking:", usageError);
//       }
//     }

//     const steps = [
//       "welcome",
//       "plan_selection",
//       "business_info",
//       "receptionist_config",
//       "payment_setup",
//     ];

//     for (const step of steps) {
//       await supabase.from("onboarding_state").upsert(
//         {
//           user_id: userId,
//           business_id: businessId,
//           step_key: step,
//           completed: !isProCheckout, // Only mark as completed for Starter
//           completed_at: !isProCheckout ? new Date().toISOString() : null,
//         },
//         {
//           onConflict: "user_id,step_key",
//         }
//       );
//     }

//     console.log(
//       "[v0] Business data saved for:",
//       businessId,
//       "Plan:",
//       selectedPlan
//     );
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("[v0] Error completing onboarding:", error);
//     return NextResponse.json(
//       { error: "Failed to complete onboarding" },
//       { status: 500 }
//     );
//   }
// }

// import { type NextRequest, NextResponse } from "next/server";
// import { createClient } from "@/utils/supabase/server";

// export async function POST(req: NextRequest) {
//   try {
//     const { userId, businessId, formData, selectedPlan, isProCheckout } =
//       await req.json();

//     const supabase = await createClient();

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (!businessId) {
//       return NextResponse.json(
//         { error: "Business ID is required" },
//         { status: 400 }
//       );
//     }

//     const { error: progressError } = await supabase
//       .from("onboarding_progress")
//       .update({
//         step_3_test_call_completed: true,
//         step_4_go_live: true,
//         current_step: 4,
//       })
//       .eq("business_id", businessId);

//     if (progressError) {
//       console.error("[v0] Progress update error:", progressError);
//       return NextResponse.json(
//         { error: "Failed to update progress" },
//         { status: 500 }
//       );
//     }

//     const { error: businessError } = await supabase
//       .from("businesses")
//       .update({
//         name: formData.businessName,
//         industry: formData.industry,
//         timezone: formData.timezone,
//         assistant_name: formData.assistantName,
//         description: formData.description,
//         onboarding_completed: true,
//         onboarding_completed_at: new Date().toISOString(),
//         billing_plan: selectedPlan,
//       })
//       .eq("id", businessId);

//     if (businessError) {
//       console.error("[v0] Business update error:", businessError);
//       return NextResponse.json(
//         { error: "Failed to update business" },
//         { status: 500 }
//       );
//     }

//     const { data: planData } = await supabase
//       .from("plans")
//       .select("id")
//       .eq("slug", selectedPlan)
//       .single();

//     if (!planData) {
//       console.error("[v0] Plan not found for slug:", selectedPlan);
//       return NextResponse.json(
//         { error: "Invalid plan selection" },
//         { status: 400 }
//       );
//     }

//     if (selectedPlan === "starter") {
//       const { error: usageError } = await supabase.from("user_tracking").upsert(
//         {
//           business_id: businessId,
//           plan_id: planData.id,
//           minutes_used: 0,
//           calls_made: 0,
//           active_phone_numbers: 0,
//           team_members_count: 0,
//           period_start: new Date().toISOString(),
//           period_end: new Date(
//             Date.now() + 30 * 24 * 60 * 60 * 1000
//           ).toISOString(),
//         },
//         { onConflict: "business_id" }
//       );

//       if (usageError) {
//         console.error("[v0] Error creating usage tracking:", usageError);
//       }
//     }

//     const steps = [
//       "welcome",
//       "plan_selection",
//       "business_info",
//       "receptionist_config",
//       "payment_setup",
//     ];

//     for (const step of steps) {
//       await supabase.from("onboarding_state").upsert(
//         {
//           user_id: userId,
//           business_id: businessId,
//           step_key: step,
//           completed: true, // Only mark as completed for Starter
//           completed_at: new Date().toISOString(),
//         },
//         {
//           onConflict: "user_id,step_key",
//         }
//       );
//     }

//     console.log(
//       "[v0] Business data saved for:",
//       businessId,
//       "Plan:",
//       selectedPlan
//     );
//     return NextResponse.json({
//       success: true,
//       message: "Onboarding completed successfully",
//     });
//   } catch (error) {
//     console.error("[v0] Error completing onboarding:", error);
//     return NextResponse.json(
//       { error: "Failed to complete onboarding" },
//       { status: 500 }
//     );
//   }
// }

import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { saveOnboardingProgress } from "@/utils/onboarding";

export async function POST(req: NextRequest) {
  try {
    const { userId, businessId, formData, selectedPlan, isProCheckout } =
      await req.json();

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!businessId) {
      return NextResponse.json(
        { error: "Business ID is required" },
        { status: 400 },
      );
    }

    // 1. Fetch current business data to ensure we have context
    const { data: currentBusiness } = await supabase
      .from("businesses")
      .select("billing_plan, id")
      .eq("id", businessId)
      .single();

    if (!currentBusiness) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    // 2. Mark progress as complete for go live (step 4)
    const { error: progressError } = await saveOnboardingProgress(businessId, {
      step_4_go_live: true,
      step_3_go_live: true, // legacy flag for backward compatibility
    });

    if (progressError) {
      console.error("[v0] Progress update error:", progressError);
      // Continue anyway to ensure main business record is updated
    }

    // 3. Prepare update object for business table
    // We only update fields if they were provided in the request
    const updateData: any = {
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    };

    if (formData) {
      if (formData.businessName) updateData.name = formData.businessName;
      if (formData.industry) updateData.industry = formData.industry;
      if (formData.timezone) updateData.timezone = formData.timezone;
      if (formData.assistantName)
        updateData.assistant_name = formData.assistantName;
      if (formData.description) updateData.description = formData.description;
    }

    if (selectedPlan) {
      updateData.billing_plan = selectedPlan;
    }

    const { error: businessError } = await supabase
      .from("businesses")
      .update(updateData)
      .eq("id", businessId);

    if (businessError) {
      console.error("[v0] Business update error:", businessError);
      return NextResponse.json(
        { error: "Failed to update business" },
        { status: 500 },
      );
    }

    // 4. Handle Plan & Usage Tracking
    const planSlug = selectedPlan || currentBusiness.billing_plan;

    if (planSlug) {
      const { data: planData } = await supabase
        .from("plans")
        .select("id")
        .eq("slug", planSlug)
        .single();

      if (planData) {
        if (planSlug === "starter") {
          const { error: usageError } = await supabase
            .from("usage_tracking")
            .upsert(
              {
                business_id: businessId,
                plan_id: planData.id,
                minutes_used: 0,
                calls_made: 0,
                active_phone_numbers: 0,
                team_members_count: 0,
                period_start: new Date().toISOString(),
                period_end: new Date(
                  Date.now() + 30 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
              { onConflict: "business_id" },
            );

          if (usageError) {
            console.error("[v0] Error creating usage tracking:", usageError);
          }
        }
      } else {
        console.error("[v0] Plan not found for slug:", planSlug);
      }
    }

    // 5. Update Legacy Steps (Optional, keeps existing logic alive)
    const steps = [
      "welcome",
      "plan_selection",
      "business_info",
      "receptionist_config",
      "payment_setup",
    ];

    for (const step of steps) {
      await supabase.from("onboarding_state").upsert(
        {
          user_id: user.id, // Use authenticated user ID
          business_id: businessId,
          step_key: step,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,step_key",
        },
      );
    }

    console.log("[v0] Onboarding marked complete for:", businessId);
    return NextResponse.json({
      success: true,
      message: "Onboarding completed successfully",
    });
  } catch (error) {
    console.error("[v0] Error completing onboarding:", error);
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 },
    );
  }
}
