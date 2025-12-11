import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { CheckoutPage } from "@/components/checkout/checkout-page";

export default async function Page() {
  const supabase = await getSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <CheckoutPage user={user} />;
}
