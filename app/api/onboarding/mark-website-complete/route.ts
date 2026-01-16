import { NextRequest, NextResponse } from "next/server";
import { markWebsiteTrainingComplete } from "@/utils/onboarding";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { businessId } = await request.json();

    if (!businessId) {
      return NextResponse.json(
        { error: "Missing businessId" },
        { status: 400 }
      );
    }

    // Verify user owns this business
    const { data: userData } = await supabase
      .from("users")
      .select("business_id")
      .eq("id", user.id)
      .single();

    if (userData?.business_id !== businessId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const result = await markWebsiteTrainingComplete(businessId);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error marking website training complete:", error);
    return NextResponse.json(
      { error: "Failed to mark website training complete", details: error.message },
      { status: 500 }
    );
  }
}

