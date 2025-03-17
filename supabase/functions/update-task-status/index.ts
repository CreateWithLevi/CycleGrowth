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
    const { task_id, status } = await req.json();

    if (!task_id || !status) {
      return new Response(
        JSON.stringify({ error: "Task ID and status are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Verify the task belongs to the user's system
    const { data: task, error: taskCheckError } = await supabaseClient
      .from("growth_tasks")
      .select("*, growth_systems!inner(user_id)")
      .eq("id", task_id)
      .single();

    if (taskCheckError || !task || task.growth_systems.user_id !== user.id) {
      console.error("Task check error:", taskCheckError);
      return new Response(
        JSON.stringify({
          error: "Task not found or access denied",
          details: taskCheckError,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        },
      );
    }

    // Update the task status
    const { data: updatedTask, error: updateError } = await supabaseClient
      .from("growth_tasks")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", task_id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: updateError.message, details: updateError }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Create an activity for the task status update
    let action = "Updated task status";
    if (status === "completed") {
      action = "Completed task";
    }

    try {
      await supabaseClient.from("growth_activities").insert({
        user_id: user.id,
        action,
        item: task.title,
        system_id: task.system_id,
      });
    } catch (activityError) {
      console.error("Activity creation error:", activityError);
      // Don't fail the whole request if activity creation fails
    }

    // If task is completed, update system progress
    if (status === "completed") {
      try {
        // Get all tasks for this system
        const { data: systemTasks, error: tasksError } = await supabaseClient
          .from("growth_tasks")
          .select("status")
          .eq("system_id", task.system_id);

        if (!tasksError && systemTasks) {
          // Calculate progress percentage
          const totalTasks = systemTasks.length;
          const completedTasks = systemTasks.filter(
            (t) => t.status === "completed",
          ).length;
          const progressPercentage = Math.round(
            (completedTasks / totalTasks) * 100,
          );

          // Update system progress
          await supabaseClient
            .from("growth_systems")
            .update({
              progress: progressPercentage,
              updated_at: new Date().toISOString(),
            })
            .eq("id", task.system_id);
        }
      } catch (progressError) {
        console.error("Progress update error:", progressError);
        // Don't fail the whole request if progress update fails
      }
    }

    return new Response(JSON.stringify({ success: true, data: updatedTask }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    return new Response(
      JSON.stringify({ error: error.message, details: error }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
