import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = async () => {
  // Get cookies from the request
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            // Use the .getAll() method to get all cookies
            return cookieStore.getAll().map(({ name, value }) => ({
              name,
              value,
            }));
          } catch (error) {
            console.error("Error getting cookies:", error);
            return [];
          }
        },
        setAll(cookiesToSet) {
          try {
            // Use the .set() method to set cookies
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.error("Error setting cookies:", error);
            // Silent fail as we can't set cookies in some environments
          }
        },
      },
    },
  );

  return supabase;
};
