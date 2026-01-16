import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { checkFeatureAccess } from "@/lib/features";

export async function GET(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ hasAccess: false }, { status: 401 });
  }

  const feature = request.nextUrl.searchParams.get("feature");

  if (!feature) {
    return NextResponse.json(
      { hasAccess: false, error: "Feature parameter required" },
      { status: 400 }
    );
  }

  const { data: userData } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (!userData?.business_id) {
    return NextResponse.json({ hasAccess: false }, { status: 401 });
  }

  const hasAccess = await checkFeatureAccess(
    userData.business_id,
    feature as any
  );

  return NextResponse.json({ hasAccess });
}
