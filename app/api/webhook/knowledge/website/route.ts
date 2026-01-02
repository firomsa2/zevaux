import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { business_id, source_url } = body;

    if (!business_id || !source_url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.KNOWLEDGE_WEBHOOK_WEBSITE_URL;

    if (!webhookUrl) {
      console.error("KNOWLEDGE_WEBHOOK_WEBSITE_URL is not defined");
      return NextResponse.json(
        { error: "Webhook URL not configured" },
        { status: 500 }
      );
    }

    // Fire and forget
    fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ business_id, source_url }),
    }).catch((err) => console.error("Error calling website webhook:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in website webhook route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
