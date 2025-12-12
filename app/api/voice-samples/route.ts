import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get all voice samples with audio
    const { data: samples, error } = await supabase
      .from("voice_samples")
      .select("*")
      .eq("is_active", true)
      .order("voice");

    if (error) {
      throw error;
    }

    // Increment play count for analytics (optional)
    // You could add this if you want to track popularity

    return NextResponse.json({
      success: true,
      samples,
      count: samples?.length || 0,
    });
  } catch (error: any) {
    console.error("Error fetching voice samples:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch voice samples",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { voice, incrementPlay = false } = await request.json();
    const supabase = await createClient();

    if (incrementPlay && voice) {
      // Increment play count
      await supabase
        .from("voice_samples")
        .update({ play_count: supabase.raw("play_count + 1") })
        .eq("voice", voice);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating play count:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
