import { NextRequest, NextResponse } from "next/server";
import { handleKnowledgeWebhook } from "@/actions/knowledge/webhook";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const signature = request.headers.get("x-webhook-signature");

    const result = await handleKnowledgeWebhook({
      ...payload,
      signature: signature || undefined,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
