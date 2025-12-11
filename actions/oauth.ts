"use server";

import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Google OAuth error:", error);
    return { status: error.message, url: null };
  }

  redirect(data.url);
}

export async function handleGoogleSignUp() {
  const supabase = await createClient();

  // This will trigger the same handle_new_auth_user function
  // since it runs on auth.users insert
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${(await headers()).get("origin")}/auth/callback`,
    },
  });

  if (error) {
    return { status: error.message, url: null };
  }

  redirect(data.url);
}
