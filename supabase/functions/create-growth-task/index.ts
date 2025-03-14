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

    // Get the task data from the request
    const {
      system_id,
      title,
      description,
      due_date,
      priority,
      cycle_phase,
      tags,
    } = await req.json();

    if (!system_id || !title) {
      return new Response(
        JSON.stringify({ error: "System ID and title are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Verify the system belongs to the user
    const { data: system, error: systemCheckError } = await supabaseClient
      .from("growth_systems")
      .select("*")
      .eq("id", system_id)
      .eq("user_id", user.id)
      .single();

    if (systemCheckError || !system) {
      return new Response(
        JSON.stringify({ error: "System not found or access denied" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    // Create the task
    const { data: task, error: taskError } = await supabaseClient
      .from("growth_tasks")
      .insert({
        system_id,
        title,
        description,
        due_date,
        priority: priority || "medium",
        status: "todo",
        cycle_phase: cycle_phase || system.current_phase,
      })
      .select()
      .single();

    if (taskError) {
      return new Response(JSON.stringify({ error: taskError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagInserts = tags.map((tag) => ({
        task_id: task.id,
        tag,
      }));

      await supabaseClient.from("task_tags").insert(tagInserts);
    }

    // Create an activity for the new task
    await supabaseClient.from("growth_activities").insert({
      user_id: user.id,
      action: "Created task",
      item: title,
      system_id,
    });

    return new Response(JSON.stringify({ success: true, data: task }), {
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
