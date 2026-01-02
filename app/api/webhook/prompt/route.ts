import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { business_id } = body;

    if (!business_id) {
      return NextResponse.json(
        { error: "Missing business_id" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.PROMPT_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("PROMPT_WEBHOOK_URL is not defined");
      return NextResponse.json(
        { error: "Webhook URL not configured" },
        { status: 500 }
      );
    }

    // Fire and forget - don't wait for response
    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ business_id }),
    }).catch((err) => console.error("Error calling prompt webhook:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in prompt webhook route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
