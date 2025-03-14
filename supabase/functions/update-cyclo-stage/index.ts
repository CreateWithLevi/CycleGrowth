import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    // Get the stage data from the request
    const { stage } = await req.json();

    if (!stage || stage < 1 || stage > 4) {
      return new Response(
        JSON.stringify({ error: "Valid stage (1-4) is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Check if user already has a record
    const { data: existingData } = await supabaseClient
      .from("user_cyclo_evolution")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let result;
    if (existingData) {
      // Update existing record
      const { data, error } = await supabaseClient
        .from("user_cyclo_evolution")
        .update({
          current_stage: stage,
          interactions_count: existingData.interactions_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingData.id)
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      result = data;
    } else {
      // Create new record
      const { data, error } = await supabaseClient
        .from("user_cyclo_evolution")
        .insert({
          user_id: user.id,
          current_stage: stage,
          interactions_count: 1,
        })
        .select()
        .single();

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }

      result = data;
    }

    // Create an activity for the Cyclo upgrade
    await supabaseClient.from("growth_activities").insert({
      user_id: user.id,
      action: "Upgraded Cyclo to",
      item: `Stage ${stage}`,
      system_id: null,
    });

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
