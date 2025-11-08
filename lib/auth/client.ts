
import { createClient as supabaseClient } from "../supabase/client";

export const checkAuth = async () => {
    const supabase = supabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    return user
  };