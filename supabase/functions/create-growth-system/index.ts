import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Get the system data from the request
    const { title, description, domain } = await req.json();

    console.log("Received request data:", { title, description, domain });

    if (!title || !domain) {
      console.log("Validation failed: missing title or domain");
      return new Response(
        JSON.stringify({ error: "Title and domain are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Check if growth_systems table exists
    try {
      const { error: tableCheckError } = await supabaseClient
        .from("growth_systems")
        .select("id")
        .limit(1);

      if (tableCheckError) {
        console.error("Table check error:", tableCheckError);
        return new Response(
          JSON.stringify({
            error:
              "Database table not ready. Please check your database setup.",
            details: tableCheckError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }
    } catch (checkError) {
      console.error("Exception during table check:", checkError);
      return new Response(
        JSON.stringify({
          error: "Error checking database tables",
          details: checkError.message,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Create the growth system
    try {
      const { data: system, error: systemError } = await supabaseClient
        .from("growth_systems")
        .insert({
          user_id: user.id,
          title,
          description,
          domain,
          current_phase: "planning",
          progress: 0,
          start_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (systemError) {
        console.error("System creation error:", systemError);
        return new Response(
          JSON.stringify({
            error: systemError.message,
            details: systemError,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      if (!system) {
        return new Response(
          JSON.stringify({
            error: "No system data returned after creation",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          },
        );
      }

      // Create an activity for the new system
      try {
        const { error: activityError } = await supabaseClient
          .from("growth_activities")
          .insert({
            user_id: user.id,
            action: "Created new system",
            item: title,
            system_id: system.id,
          });

        if (activityError) {
          console.error("Activity creation error:", activityError);
          // Don't fail the whole request if activity creation fails
        }
      } catch (activityErr) {
        console.error("Activity creation exception:", activityErr);
        // Don't fail the whole request if activity creation fails
      }

      return new Response(JSON.stringify({ success: true, data: system }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Error creating growth system:", error);
      return new Response(
        JSON.stringify({
          error: error.message || "Unknown error occurred",
          stack: error.stack,
          details: JSON.stringify(error),
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }
  } catch (error) {
    console.error("Error creating growth system:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Unknown error occurred",
        stack: error.stack,
        details: JSON.stringify(error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
