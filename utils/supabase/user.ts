import { createClient } from "./client";

export async function getUserWithBusiness() {
  const supabase = createClient();

  console.log("Supabase client created in getUserWithBusiness");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.log("Auth error or no user:", authError);
    return { user: null, businessId: null, error: authError };
  }

  console.log("User fetched in getUserWithBusiness:", user);

  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("business_id")
      .eq("id", user.id)
      .single();

    console.log("Query result:", { userData, userError });

    if (userError) {
      console.error("Error fetching user data:", userError);
      return { user: null, businessId: null, error: userError };
    }

    if (!userData) {
      console.error("No user data found");
      return {
        user: null,
        businessId: null,
        error: new Error("No user data found"),
      };
    }

    console.log("User data found:", userData);

    return {
      user,
      businessId: userData.business_id,
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error in getUserWithBusiness:", error);
    return { user: null, businessId: null, error: error as Error };
  }
}
