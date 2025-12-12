import { createClient } from "@supabase/supabase-js";

const supabase1 = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // safer for scripts
);

export default supabase1;
