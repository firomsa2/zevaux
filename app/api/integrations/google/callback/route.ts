import { NextResponse } from "next/server";
import { oauth2Client } from "@/lib/google-auth";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  console.log("=== Google OAuth Callback ===");

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  console.log("Code present:", !!code);
  console.log("Full URL:", request.url);

  if (!code) {
    console.error("No code received");
    return NextResponse.redirect(
      new URL("/dashboard/settings?error=no_code", request.url)
    );
  }

  try {
    console.log("Step 1: Exchanging code for tokens...");

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken({
      code: code,
      redirect_uri: "http://localhost:3000/api/integrations/google/callback",
    });

    console.log("Step 1 Complete - Tokens received:", {
      hasAccessToken: !!tokens.access_token,
      hasRefreshToken: !!tokens.refresh_token,
      expiryDate: tokens.expiry_date,
      tokenType: tokens.token_type,
      scope: tokens.scope,
    });

    console.log("Step 2: Getting authenticated user...");

    // Get Supabase client
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("Auth error:", authError);
      return NextResponse.redirect(
        new URL("/login?error=auth_failed", request.url)
      );
    }

    if (!user) {
      console.error("No user found");
      return NextResponse.redirect(
        new URL("/login?error=no_user", request.url)
      );
    }

    console.log("Step 2 Complete - User:", {
      id: user.id,
      email: user.email,
    });

    console.log("Step 3: Getting user business data...");

    // Get user's business
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("business_id")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("User query error:", userError);
      console.error("User error details:", {
        code: userError.code,
        message: userError.message,
        details: userError.details,
      });
      return NextResponse.redirect(
        new URL("/dashboard/settings?error=user_query_failed", request.url)
      );
    }

    if (!userData) {
      console.error("No user data found");
      return NextResponse.redirect(
        new URL("/dashboard/settings?error=no_user_data", request.url)
      );
    }

    if (!userData.business_id) {
      console.error("No business_id found");
      return NextResponse.redirect(
        new URL("/dashboard/settings?error=no_business", request.url)
      );
    }

    console.log("Step 3 Complete - Business ID:", userData.business_id);

    console.log("Step 4: Saving integration to database...");

    // Prepare integration data
    const integrationData = {
      user_id: user.id,
      business_id: userData.business_id,
      provider: "google_calendar",
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expiry_date,
      token_type: tokens.token_type,
      scope: tokens.scope,
      metadata: {},
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    console.log("Integration data to save:", {
      ...integrationData,
      access_token: integrationData.access_token ? "***REDACTED***" : null,
      refresh_token: integrationData.refresh_token ? "***REDACTED***" : null,
    });

    // Try to insert the integration
    const { data: upsertData, error: upsertError } = await supabase
      .from("user_integrations")
      .upsert(integrationData, {
        onConflict: "business_id, user_id, provider",
      })
      .select(); // Add select to see what's returned

    if (upsertError) {
      console.error("Step 4 FAILED - Upsert error:", upsertError);
      console.error("Upsert error details:", {
        code: upsertError.code,
        message: upsertError.message,
        details: upsertError.details,
        hint: upsertError.hint,
      });

      // Try to see if table exists and check structure
      const { data: tableInfo } = await supabase
        .from("user_integrations")
        .select("*")
        .limit(1);

      console.log("Table sample data:", tableInfo);

      return NextResponse.redirect(
        new URL(
          "/dashboard/settings?error=save_failed&details=" +
            encodeURIComponent(upsertError.message),
          request.url
        )
      );
    }

    console.log("Step 4 Complete - Integration saved:", upsertData);

    // Step 5: Send tokens to webhook
    console.log("Step 5: Sending tokens to webhook...");
    try {
      // "https://n8n-klmi.onrender.com/webhook/e4fd6240-febf-4653-8434-adaf4aaa4a30";
      const webhookUrl =
        "https://ddconsult.app.n8n.cloud/webhook/toolsf2ba59af-130b-4a14-a13c-67219581a7e7";
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          businessId: userData.business_id,
          provider: "google_calendar",
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: tokens.expiry_date,
          scope: tokens.scope,
        }),
      });

      if (!webhookResponse.ok) {
        console.error("Webhook failed:", await webhookResponse.text());
      } else {
        console.log("Webhook sent successfully");
      }
    } catch (webhookError) {
      console.error("Error sending webhook:", webhookError);
      // Don't fail the whole request if webhook fails, just log it
    }

    console.log("✅ SUCCESS: Google Calendar integration completed!");

    return NextResponse.redirect(
      new URL("/dashboard/settings?success=google_connected", request.url)
    );
  } catch (error: any) {
    console.error("Unexpected error in callback:", error);
    console.error("Error stack:", error.stack);

    return NextResponse.redirect(
      new URL(
        "/dashboard/settings?error=unexpected&details=" +
          encodeURIComponent(error.message),
        request.url
      )
    );
  }
}
