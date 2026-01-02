import { DashboardContent } from "@/components/dashboard/content";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: receptionistConfig } = await supabase
    .from("receptionist")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <>
      <DashboardContent
        user={user}
        profile={profile}
        receptionistConfig={receptionistConfig}
      />
      {/* <main className="p-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to Zevaux</h1>
        <p className="text-gray-600">You’re logged in as {user?.email}</p>
        <p className="text-gray-500 mt-4">
          A new organization was automatically created for you.
        </p>
      </main> */}
    </>
  );
}
