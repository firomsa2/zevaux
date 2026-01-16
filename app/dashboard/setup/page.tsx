import { redirect } from "next/navigation";
import { SetupWizard } from "@/components/setup/wizard";
import { createClient } from "@/utils/supabase/server";

export default async function SetupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: receptionistConfig } = await supabase
    .from("receptionist_config")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      <SetupWizard user={user} initialConfig={receptionistConfig} />
    </div>
  );
}
