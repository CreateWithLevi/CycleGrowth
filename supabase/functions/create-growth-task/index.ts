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
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized", details: userError }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        },
      );
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
      console.error("System check error:", systemCheckError);
      return new Response(
        JSON.stringify({
          error: "System not found or access denied",
          details: systemCheckError,
        }),
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
      console.error("Task creation error:", taskError);
      return new Response(
        JSON.stringify({ error: taskError.message, details: taskError }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      try {
        const tagInserts = tags.map((tag) => ({
          task_id: task.id,
          tag,
        }));

        await supabaseClient.from("task_tags").insert(tagInserts);
      } catch (tagError) {
        console.error("Tag creation error:", tagError);
        // Don't fail the whole request if tag creation fails
      }
    }

    // Create an activity for the new task
    try {
      await supabaseClient.from("growth_activities").insert({
        user_id: user.id,
        action: "Created task",
        item: title,
        system_id,
      });
    } catch (activityError) {
      console.error("Activity creation error:", activityError);
      // Don't fail the whole request if activity creation fails
    }

    return new Response(JSON.stringify({ success: true, data: task }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return new Response(
      JSON.stringify({ error: error.message, details: error }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
