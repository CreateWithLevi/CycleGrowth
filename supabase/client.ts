import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Log authentication state for debugging
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(
      "Supabase auth event:",
      event,
      session ? "User authenticated" : "No user",
    );
  });

  return supabase;
};
