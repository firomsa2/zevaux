import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // console.log("[v0] Test call request received", await request.json());
    // Read the request body once and store it
    const body = await request.json();
    console.log("[v0] Test call request received", body);
    const { phoneNumber, businessName } = body;

    if (!phoneNumber || !businessName) {
      return NextResponse.json(
        { error: "Phone number and business name are required" },
        { status: 400 }
      );
    }

    // CHANGED: Trigger test call via Vapi or simulated call system
    // This would integrate with your actual call system (Vapi, Twilio, etc.)
    const callId = `test_${Date.now()}`;

    // In production, you would:
    // 1. Call your telephony provider's API (Vapi, Twilio, etc.)
    // 2. Initiate a test call to the provided phone number
    // 3. Return the call ID for tracking

    // For now, return success with a simulated response
    return NextResponse.json({
      status: "success",
      callId,
      phoneNumber,
      simulatedResponse: `Thank you for calling ${businessName}. How can I help you today?`,
      message: "Test call initiated successfully",
    });
  } catch (error) {
    console.error("[v0] Test call error:", error);
    return NextResponse.json(
      { error: "Failed to initiate test call" },
      { status: 500 }
    );
  }
}
