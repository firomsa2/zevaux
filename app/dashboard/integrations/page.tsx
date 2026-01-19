import { redirect } from "next/navigation";
import { IntegrationSettings } from "@/components/settings/integration-settings";
import { createClient } from "@/utils/supabase/server";

export default async function IntegrationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // First, get the user's business_id
  const { data: userData } = await supabase
    .from("users")
    .select("business_id")
    .eq("id", user.id)
    .single();

  if (!userData?.business_id) {
    console.error("No business_id found for user");
    redirect("/dashboard");
  }

  // Now query integrations with business_id
  const { data: integrations } = await supabase
    .from("user_integrations")
    .select("*")
    .eq("user_id", user.id)
    .eq("business_id", userData.business_id);

  const receptionistConfig = null;

  return (
    <main className="flex-1 p-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect your favorite tools and services to enhance your AI
            receptionist
          </p>
        </div>

        <IntegrationSettings
          receptionistConfig={receptionistConfig}
          integrations={integrations || []}
        />
      </div>
    </main>
  );
}
