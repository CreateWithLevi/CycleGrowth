import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type GrowthSystem = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  domain: string;
  current_phase: string;
  progress: number;
  start_date: string;
  created_at: string;
  updated_at: string;
};

export type GrowthTask = {
  id: string;
  system_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: string;
  status: string;
  cycle_phase: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
};

export type GrowthActivity = {
  id: string;
  user_id: string;
  action: string;
  item: string;
  system_id: string | null;
  created_at: string;
};

export type UserCycloEvolution = {
  id: string;
  user_id: string;
  current_stage: number;
  interactions_count: number;
  created_at: string;
  updated_at: string;
};

export async function fetchCurrentCycle(
  userId: string,
): Promise<GrowthSystem | null> {
  const { data, error } = await supabase
    .from("growth_systems")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }

  return data as GrowthSystem;
}

export async function fetchGrowthSystems(
  userId: string,
): Promise<GrowthSystem[]> {
  const { data, error } = await supabase
    .from("growth_systems")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as GrowthSystem[];
}

export async function fetchRecentActivities(
  userId: string,
  limit = 5,
): Promise<GrowthActivity[]> {
  const { data, error } = await supabase
    .from("growth_activities")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data as GrowthActivity[];
}

export async function fetchUserCycloEvolution(
  userId: string,
): Promise<UserCycloEvolution | null> {
  const { data, error } = await supabase
    .from("user_cyclo_evolution")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as UserCycloEvolution;
}

export async function createGrowthSystem(
  system: Omit<GrowthSystem, "id" | "created_at" | "updated_at">,
): Promise<GrowthSystem | null> {
  const { data, error } = await supabase
    .from("growth_systems")
    .insert(system)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  // Create activity for the new system
  await supabase.from("growth_activities").insert({
    user_id: system.user_id,
    action: "Created new system",
    item: system.title,
    system_id: data.id,
  });

  return data as GrowthSystem;
}

export async function updateGrowthSystem(
  id: string,
  updates: Partial<GrowthSystem>,
): Promise<GrowthSystem | null> {
  const { data, error } = await supabase
    .from("growth_systems")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  // Create activity for the update if phase changed
  if (updates.current_phase) {
    await supabase.from("growth_activities").insert({
      user_id: data.user_id,
      action: "Updated phase to",
      item: updates.current_phase,
      system_id: data.id,
    });
  }

  return data as GrowthSystem;
}

export async function createOrUpdateUserCycloEvolution(
  userId: string,
  stage?: number,
): Promise<UserCycloEvolution | null> {
  // Check if user already has a record
  const { data: existingData } = await supabase
    .from("user_cyclo_evolution")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (existingData) {
    // Update existing record
    const updates: Partial<UserCycloEvolution> = {
      interactions_count: existingData.interactions_count + 1,
      updated_at: new Date().toISOString(),
    };

    if (stage) {
      updates.current_stage = stage;
    }

    const { data, error } = await supabase
      .from("user_cyclo_evolution")
      .update(updates)
      .eq("id", existingData.id)
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return data as UserCycloEvolution;
  } else {
    // Create new record
    const { data, error } = await supabase
      .from("user_cyclo_evolution")
      .insert({
        user_id: userId,
        current_stage: stage || 1,
        interactions_count: 1,
      })
      .select()
      .single();

    if (error || !data) {
      return null;
    }

    return data as UserCycloEvolution;
  }
}

export async function createGrowthActivity(
  activity: Omit<GrowthActivity, "id" | "created_at">,
): Promise<GrowthActivity | null> {
  const { data, error } = await supabase
    .from("growth_activities")
    .insert(activity)
    .select()
    .single();

  if (error || !data) {
    return null;
  }

  return data as GrowthActivity;
}
