import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getBillingStateForUser, getTrialDaysRemaining } from "@/lib/billing";

export async function GET(_req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const billingState = await getBillingStateForUser(user.id);

    if (!billingState) {
      return NextResponse.json(
        { error: "No billing state for user" },
        { status: 404 },
      );
    }

    const trialDaysLeft = getTrialDaysRemaining(billingState);

    return NextResponse.json({
      billingState,
      trialDaysLeft,
    });
  } catch (error) {
    console.error("[Billing State] Error:", error);
    return NextResponse.json(
      { error: "Failed to resolve billing state" },
      { status: 500 },
    );
  }
}

