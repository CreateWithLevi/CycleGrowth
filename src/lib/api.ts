import { createClient } from "../../supabase/client";

// Knowledge Hub API
export async function createKnowledgeItem(data: {
  title: string;
  content: string;
  tags?: string[];
  connections?: string[];
  source?: string;
}) {
  const supabase = createClient();

  try {
    const { data: result, error } = await supabase.functions.invoke(
      "supabase-functions-create-knowledge-item",
      {
        body: data,
      },
    );

    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating knowledge item:", error);
    return { success: false, error };
  }
}

export async function getKnowledgeItems() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("knowledge_items")
      .select(
        `
        *,
        knowledge_tags(tag),
        knowledge_connections(target_id)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching knowledge items:", error);
    return { success: false, error };
  }
}

// Reflection API
export async function createReflection(data: {
  title: string;
  content: string;
  cycle_phase: string;
  domain: string;
  system_id?: string;
  insights?: string[];
  tags?: string[];
}) {
  const supabase = createClient();

  try {
    const { data: result, error } = await supabase.functions.invoke(
      "supabase-functions-create-reflection",
      {
        body: data,
      },
    );

    if (error) throw error;
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating reflection:", error);
    return { success: false, error };
  }
}

export async function getReflections() {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("reflections")
      .select(
        `
        *,
        reflection_insights(content),
        reflection_tags(tag)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching reflections:", error);
    return { success: false, error };
  }
}

// Cyclo Evolution API
export async function getCycloEvolutionMetrics(userId: string) {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("user_cyclo_evolution")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") throw error;

    return {
      success: true,
      data: data || {
        current_stage: 1,
        interactions_count: 0,
        tasks_completed: 0,
        reflections_created: 0,
        knowledge_items_created: 0,
        systems_created: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching Cyclo evolution metrics:", error);
    return { success: false, error };
  }
}

// Analytics API
export async function getAnalyticsData(
  userId: string,
  timeframe: string = "week",
) {
  const supabase = createClient();

  try {
    // Get growth systems
    const { data: systems, error: systemsError } = await supabase
      .from("growth_systems")
      .select("id, title, domain, progress, current_phase")
      .eq("user_id", userId);

    if (systemsError) throw systemsError;

    // Get tasks
    const { data: tasks, error: tasksError } = await supabase
      .from("growth_tasks")
      .select("id, title, status, created_at, system_id")
      .in("system_id", systems.map((s) => s.id) || []);

    if (tasksError) throw tasksError;

    // Get activities
    const { data: activities, error: activitiesError } = await supabase
      .from("growth_activities")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (activitiesError) throw activitiesError;

    // Process data based on timeframe
    const now = new Date();
    let startDate: Date;

    if (timeframe === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === "month") {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else if (timeframe === "year") {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      startDate = new Date(0); // Default to epoch if invalid timeframe
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

    interface DomainProgress {
      [key: string]: {
        progress: number;
        count: number;
        tasks: number;
      };
    }

    // Domain progress
    const domainProgress: DomainProgress = systems.reduce((acc: DomainProgress, system) => {
      if (!acc[system.domain]) {
        acc[system.domain] = {
          progress: 0,
          count: 0,
          tasks: 0,
        };
      }

      acc[system.domain].progress += system.progress;
      acc[system.domain].count += 1;
      acc[system.domain].tasks += tasks.filter(
        (t) => t.system_id === system.id,
      ).length;

      return acc;
    }, {});

    // Calculate average progress per domain
    Object.keys(domainProgress).forEach((domain) => {
      if (domainProgress[domain].count > 0) {
        domainProgress[domain].progress = Math.round(
          domainProgress[domain].progress / domainProgress[domain].count,
        );
      }
    });

    return {
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
      },
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return { success: false, error };
  }
}
