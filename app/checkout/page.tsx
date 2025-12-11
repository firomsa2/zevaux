import { redirect } from "next/navigation";
import { CheckoutPage } from "@/components/checkout/checkout-page";
import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <CheckoutPage user={user} />;
}
