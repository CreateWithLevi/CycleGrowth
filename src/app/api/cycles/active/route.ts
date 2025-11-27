import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { ActiveCycleData } from '@/features/dashboard';

export async function GET() {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch active cycle
    const { data: cycle, error: cycleError } = await supabase
      .from('cycles')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['planning', 'active', 'reflecting'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (cycleError || !cycle) {
      return NextResponse.json(null);
    }

    // Fetch tasks for this cycle
    const { data: tasks, error: tasksError } = await supabase
      .from('growth_tasks')
      .select('*')
      .eq('system_id', cycle.id)
      .order('due_date', { ascending: true, nullsFirst: false });

    if (tasksError) {
      console.error('Error fetching tasks:', tasksError);
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      );
    }

    const data: ActiveCycleData = {
      cycle,
      tasks: tasks || [],
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/cycles/active:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
