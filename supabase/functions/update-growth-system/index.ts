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

    // Get the system data from the request
    const { id, title, description, domain, current_phase, progress } =
      await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "System ID is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Verify the system belongs to the user
    const { data: existingSystem, error: systemCheckError } =
      await supabaseClient
        .from("growth_systems")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (systemCheckError || !existingSystem) {
      return new Response(
        JSON.stringify({ error: "System not found or access denied" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    // Prepare updates
    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (domain !== undefined) updates.domain = domain;
    if (progress !== undefined) updates.progress = progress;

    // Track if phase changed for activity logging
    const phaseChanged =
      current_phase !== undefined &&
      current_phase !== existingSystem.current_phase;
    if (phaseChanged) updates.current_phase = current_phase;

    updates.updated_at = new Date().toISOString();

    // Update the system
    const { data: updatedSystem, error: updateError } = await supabaseClient
      .from("growth_systems")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Log activity if phase changed
    if (phaseChanged) {
      await supabaseClient.from("growth_activities").insert({
        user_id: user.id,
        action: "Updated phase to",
        item: current_phase,
        system_id: id,
      });
    }

    return new Response(
      JSON.stringify({ success: true, data: updatedSystem }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
