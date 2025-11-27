'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Server action to complete a task
 */
export async function completeTask(taskId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Update task status to 'done'
  const { error } = await supabase
    .from('growth_tasks')
    .update({
      status: 'done',
      updated_at: new Date().toISOString(),
    })
    .eq('id', taskId);

  if (error) {
    console.error('Error completing task:', error);
    throw new Error('Failed to complete task');
  }

  // Revalidate the dashboard page to reflect changes
  revalidatePath('/dashboard');

  return { success: true };
}

/**
 * Server action to check in (start) a task
 */
export async function checkInTask(taskId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Update task status to 'in-progress'
  const { error } = await supabase
    .from('growth_tasks')
    .update({
      status: 'in-progress',
      updated_at: new Date().toISOString(),
    })
    .eq('id', taskId);

  if (error) {
    console.error('Error checking in task:', error);
    throw new Error('Failed to check in task');
  }

  // Revalidate the dashboard page to reflect changes
  revalidatePath('/dashboard');

  return { success: true };
}

/**
 * Server action to update cycle progress
 * This is automatically triggered when tasks are completed
 */
export async function updateCycleProgress(cycleId: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  // Get all tasks for this cycle
  const { data: tasks, error: tasksError } = await supabase
    .from('growth_tasks')
    .select('status')
    .eq('system_id', cycleId);

  if (tasksError) {
    console.error('Error fetching tasks:', tasksError);
    throw new Error('Failed to fetch tasks');
  }

  if (!tasks || tasks.length === 0) {
    return { success: true };
  }

  // Calculate progress
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const totalTasks = tasks.length;
  const progress = Math.round((completedTasks / totalTasks) * 100);

  // Update cycle progress
  const { error: updateError } = await supabase
    .from('cycles')
    .update({
      progress,
      tasks_completed: completedTasks,
      tasks_total: totalTasks,
      updated_at: new Date().toISOString(),
    })
    .eq('id', cycleId);

  if (updateError) {
    console.error('Error updating cycle progress:', updateError);
    throw new Error('Failed to update cycle progress');
  }

  // Revalidate the dashboard page
  revalidatePath('/dashboard');

  return { success: true, progress };
}
