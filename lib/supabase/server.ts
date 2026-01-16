import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function getSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}

export async function getUserBusinessWithRelations(userId: string) {
  const supabase = await getSupabaseServer();

  const { data: user } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", userId)
    .single();

  if (!user?.business_id) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", user.business_id)
    .single();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*, plans(*)")
    .eq("business_id", user.business_id)
    .single();

  const plan = subscription?.plans;

  return { business, subscription, plan };
}
