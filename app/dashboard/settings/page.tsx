import { redirect } from "next/navigation";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { createClient } from "@/utils/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // const { data: profile } = await supabase
  //   .from("profiles")
  //   .select("*")
  //   .eq("id", user.id)
  //   .single();

  // const { data: receptionistConfig } = await supabase
  //   .from("receptionist_config")
  //   .select("*")
  //   .eq("user_id", user.id)
  //   .single();

  const profile = null;
  const receptionistConfig = null;

  return (
    <main className="flex-1 p-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-text-secondary mt-2">
            Manage your account and receptionist configuration
          </p>
        </div>

        <SettingsTabs
          user={user}
          profile={profile}
          receptionistConfig={receptionistConfig}
        />
      </div>
    </main>
  );
}
