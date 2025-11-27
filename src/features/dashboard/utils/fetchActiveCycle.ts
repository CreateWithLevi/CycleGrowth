import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';
import { ActiveCycleData } from '../ActiveCycleView';

type Cycle = Database['public']['Tables']['cycles']['Row'];
type GrowthTask = Database['public']['Tables']['growth_tasks']['Row'];

/**
 * Fetches the active cycle for the current user
 * This is a server-side function meant to be used in Server Components or Server Actions
 */
export async function fetchActiveCycle(): Promise<ActiveCycleData | null> {
  const supabase = createClient();

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch active cycle (status = 'active' or 'planning' or 'reflecting')
  const { data: cycle, error: cycleError } = await supabase
    .from('cycles')
    .select('*')
    .eq('user_id', user.id)
    .in('status', ['planning', 'active', 'reflecting'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (cycleError || !cycle) {
    return null;
  }

  // Fetch tasks for this cycle
  // Note: Since growth_tasks references growth_systems, we need to map from cycle metadata
  // or create a relationship. For now, we'll use a placeholder query.
  // TODO: Update this when you have the proper relationship between cycles and tasks

  const { data: tasks, error: tasksError } = await supabase
    .from('growth_tasks')
    .select('*')
    .eq('system_id', cycle.id) // Assuming you'll create this relationship
    .order('due_date', { ascending: true, nullsFirst: false });

  if (tasksError) {
    console.error('Error fetching tasks:', tasksError);
  }

  // Generate AI insights based on cycle data
  const insights = generateInsights(cycle, tasks || []);

  return {
    cycle,
    tasks: tasks || [],
    insights,
  };
}

/**
 * Fetches the most recent completed cycle for displaying achievements
 */
export async function fetchRecentCompletedCycle(): Promise<Cycle | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: cycle, error } = await supabase
    .from('cycles')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return null;
  }

  return cycle;
}

/**
 * Generates contextual insights based on cycle progress
 */
function generateInsights(
  cycle: Cycle,
  tasks: GrowthTask[]
): Array<{
  id: string;
  content: string;
  type: 'tip' | 'encouragement' | 'warning' | 'celebration';
}> {
  const insights: Array<{
    id: string;
    content: string;
    type: 'tip' | 'encouragement' | 'warning' | 'celebration';
  }> = [];

  // Get overdue tasks
  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'done' || !t.due_date) return false;
    return new Date(t.due_date) < new Date();
  });

  // Get high priority tasks
  const highPriorityTasks = tasks.filter(
    (t) => t.priority === 'high' && t.status !== 'done'
  );

  // Insight 1: Overdue tasks warning
  if (overdueTasks.length > 0) {
    insights.push({
      id: 'overdue-tasks',
      content: `You have ${overdueTasks.length} overdue task${
        overdueTasks.length > 1 ? 's' : ''
      }. Consider breaking them into smaller, more manageable steps or adjusting your timeline.`,
      type: 'warning',
    });
  }

  // Insight 2: High priority focus
  if (highPriorityTasks.length > 0 && overdueTasks.length === 0) {
    insights.push({
      id: 'high-priority-focus',
      content: `Focus on your ${highPriorityTasks.length} high-priority task${
        highPriorityTasks.length > 1 ? 's' : ''
      } first. High-impact actions create momentum for the rest of your cycle.`,
      type: 'tip',
    });
  }

  // Insight 3: Celebrate milestones
  if (cycle.progress >= 25 && cycle.progress < 30) {
    insights.push({
      id: 'milestone-25',
      content: `You've reached 25% progress! Great work so far. Keep this momentum going.`,
      type: 'celebration',
    });
  }

  if (cycle.progress >= 50 && cycle.progress < 55) {
    insights.push({
      id: 'milestone-50',
      content: `Halfway there! You've completed ${cycle.tasks_completed} tasks. The finish line is in sight.`,
      type: 'celebration',
    });
  }

  if (cycle.progress >= 75 && cycle.progress < 80) {
    insights.push({
      id: 'milestone-75',
      content: `You're at 75%! Just a few more tasks to complete this cycle. You've got this!`,
      type: 'celebration',
    });
  }

  // Insight 4: Reflection reminder (for active cycles with good progress)
  if (
    cycle.status === 'active' &&
    cycle.progress >= 30 &&
    cycle.tasks_completed >= 3
  ) {
    const daysSinceStart = cycle.started_at
      ? Math.floor(
          (new Date().getTime() - new Date(cycle.started_at).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    if (daysSinceStart >= 7 && daysSinceStart % 7 === 0) {
      insights.push({
        id: 'weekly-reflection',
        content: `It's been ${daysSinceStart} days. Take a moment to reflect on what's working well and what you might adjust.`,
        type: 'tip',
      });
    }
  }

  // Insight 5: Planning phase guidance
  if (cycle.status === 'planning') {
    insights.push({
      id: 'planning-guidance',
      content: `Break down your goals into specific, actionable tasks. The clearer your plan, the easier it is to execute.`,
      type: 'tip',
    });
  }

  // Return max 3 insights
  return insights.slice(0, 3);
}

/**
 * Client-side hook for fetching active cycle
 * Use this in Client Components that need to fetch data on mount
 */
export async function fetchActiveCycleClient(): Promise<ActiveCycleData | null> {
  try {
    const response = await fetch('/api/cycles/active');
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching active cycle:', error);
    return null;
  }
}
