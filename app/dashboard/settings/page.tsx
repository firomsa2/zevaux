// import { redirect } from "next/navigation";
// import { SettingsTabs } from "@/components/settings/settings-tabs";
// import { createClient } from "@/utils/supabase/server";

// export default async function SettingsPage() {
//   const supabase = await createClient();

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   if (!user) {
//     redirect("/login");
//   }

//   // const { data: profile } = await supabase
//   //   .from("profiles")
//   //   .select("*")
//   //   .eq("id", user.id)
//   //   .single();

//   // const { data: receptionistConfig } = await supabase
//   //   .from("receptionist_config")
//   //   .select("*")
//   //   .eq("user_id", user.id)
//   //   .single();

//   const profile = null;
//   const receptionistConfig = null;

//   const { data: integrations } = await supabase
//     .from("user_integrations")
//     .select("*")
//     .eq("user_id", user.id);

//   return (
//     <main className="flex-1 p-8">
//       <div className="space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold">Settings</h1>
//           <p className="text-text-secondary mt-2">
//             Manage your account and receptionist configuration
//           </p>
//         </div>

//         <SettingsTabs
//           user={user}
//           profile={profile}
//           receptionistConfig={receptionistConfig}
//           integrations={integrations || []}
//         />
//       </div>
//     </main>
//   );
// }

// app/settings/page.tsx
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
          integrations={integrations || []}
        />
      </div>
    </main>
  );
}
