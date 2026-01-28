import { NextResponse } from "next/server";
import { runBillingCycleReset } from "@/lib/cron/billing-reset";

// This endpoint should be called by a scheduler (e.g. Vercel Cron, GitHub Actions, or Supabase pg_cron)
// Access should be protected by a secret key
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${cronSecret}`) {
    // Allow local dev testing or if no secret configured (warning)
    if (process.env.NODE_ENV === "production" && cronSecret) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  try {
    await runBillingCycleReset();
    return NextResponse.json({
      success: true,
      message: "Billing cycle reset job completed",
    });
  } catch (error: any) {
    console.error("Cron Job Failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
