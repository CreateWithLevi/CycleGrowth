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

    // Get the timeframe from the request
    const { timeframe = "week" } = await req.json();

    // Get growth systems
    const { data: systems, error: systemsError } = await supabaseClient
      .from("growth_systems")
      .select("id, title, domain, progress, current_phase")
      .eq("user_id", user.id);

    if (systemsError) {
      return new Response(JSON.stringify({ error: systemsError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Get tasks
    const { data: tasks, error: tasksError } = await supabaseClient
      .from("growth_tasks")
      .select("id, title, status, created_at, system_id")
      .in("system_id", systems.map((s) => s.id) || []);

    if (tasksError) {
      return new Response(JSON.stringify({ error: tasksError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Get activities
    const { data: activities, error: activitiesError } = await supabaseClient
      .from("growth_activities")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (activitiesError) {
      return new Response(JSON.stringify({ error: activitiesError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Process data based on timeframe
    const now = new Date();
    let startDate;

    if (timeframe === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === "month") {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else if (timeframe === "year") {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    }

    const filteredTasks = tasks.filter(
      (task) => new Date(task.created_at) >= startDate,
    );

    const filteredActivities = activities.filter(
      (activity) => new Date(activity.created_at) >= startDate,
    );

    // Calculate metrics
    const completedTasks = filteredTasks.filter(
      (task) => task.status === "completed",
    ).length;
    const totalTasks = filteredTasks.length;
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Domain progress
    const domainProgress = {};
    systems.forEach((system) => {
      if (!domainProgress[system.domain]) {
        domainProgress[system.domain] = {
          progress: 0,
          count: 0,
          tasks: 0,
        };
      }

      domainProgress[system.domain].progress += system.progress;
      domainProgress[system.domain].count += 1;
      domainProgress[system.domain].tasks += tasks.filter(
        (t) => t.system_id === system.id,
      ).length;
    });

    // Calculate average progress per domain
    Object.keys(domainProgress).forEach((domain) => {
      if (domainProgress[domain].count > 0) {
        domainProgress[domain].progress = Math.round(
          domainProgress[domain].progress / domainProgress[domain].count,
        );
      }
    });

    // Get Cyclo evolution data
    const { data: cycloEvolution, error: cycloError } = await supabaseClient
      .from("user_cyclo_evolution")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (cycloError && cycloError.code !== "PGRST116") {
      console.error("Error fetching Cyclo evolution:", cycloError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          systems,
          tasks: filteredTasks,
          activities: filteredActivities,
          metrics: {
            totalTasks,
            completedTasks,
            completionRate,
            domainProgress,
          },
          cycloEvolution: cycloEvolution || {
            current_stage: 1,
            interactions_count: 0,
            tasks_completed: 0,
            reflections_created: 0,
            knowledge_items_created: 0,
            systems_created: 0,
          },
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
