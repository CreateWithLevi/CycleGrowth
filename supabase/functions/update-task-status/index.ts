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
      return new Response(
        JSON.stringify({ error: "Task not found or access denied" }),
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
      return new Response(JSON.stringify({ error: updateError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Create an activity for the task status update
    let action = "Updated task status";
    if (status === "completed") {
      action = "Completed task";
    }

    await supabaseClient.from("growth_activities").insert({
      user_id: user.id,
      action,
      item: task.title,
      system_id: task.system_id,
    });

    // If task is completed, update system progress
    if (status === "completed") {
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
    }

    return new Response(JSON.stringify({ success: true, data: updatedTask }), {
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
