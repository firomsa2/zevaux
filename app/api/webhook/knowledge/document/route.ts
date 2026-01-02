import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { business_id, document_id, file_path } = body;

    if (!business_id || !document_id || !file_path) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.KNOWLEDGE_WEBHOOK_DOCUMENT_URL;

    if (!webhookUrl) {
      console.error("KNOWLEDGE_WEBHOOK_DOCUMENT_URL is not defined");
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
      body: JSON.stringify({ business_id, document_id, file_path }),
    }).catch((err) => console.error("Error calling document webhook:", err));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in document webhook route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
