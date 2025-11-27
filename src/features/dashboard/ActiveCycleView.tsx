'use client';

import React from 'react';
import { Database } from '@/types/supabase';
import { CycleProgressWidget } from './components/CycleProgressWidget';
import { ActionCardList } from './components/ActionCard';
import { InsightNudgeList, SmartInsightNudge } from './components/InsightNudge';
import { EmptyState } from './components/EmptyState';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type Cycle = Database['public']['Tables']['cycles']['Row'];
type GrowthTask = Database['public']['Tables']['growth_tasks']['Row'];

export interface ActiveCycleData {
  cycle: Cycle;
  tasks: GrowthTask[];
  insights?: Array<{
    id: string;
    content: string;
    type?: 'tip' | 'encouragement' | 'warning' | 'celebration';
  }>;
}

export interface ActiveCycleViewProps {
  /** Active cycle data */
  data: ActiveCycleData | null;
  /** User's display name */
  userName?: string;
  /** Callback when task is completed */
  onCompleteTask?: (taskId: string) => void | Promise<void>;
  /** Callback when task is checked in */
  onCheckInTask?: (taskId: string) => void | Promise<void>;
  /** Callback when insight is dismissed */
  onDismissInsight?: (insightId: string) => void;
  /** Callback to create new cycle */
  onCreateCycle?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ActiveCycleView is the main dashboard component showing the user's current growth cycle
 */
export const ActiveCycleView: React.FC<ActiveCycleViewProps> = ({
  data,
  userName = 'there',
  onCompleteTask,
  onCheckInTask,
  onDismissInsight,
  onCreateCycle,
  isLoading = false,
  className,
}) => {
  // Handle empty state
  if (!data && !isLoading) {
    return <EmptyState onCreateCycle={onCreateCycle} className={className} />;
  }

  // Loading state
  if (isLoading || !data) {
    return (
      <div className={cn('space-y-6 animate-pulse', className)}>
        <div className="h-32 bg-muted rounded-lg" />
        <div className="h-64 bg-muted rounded-lg" />
        <div className="h-48 bg-muted rounded-lg" />
      </div>
    );
  }

  const { cycle, tasks, insights = [] } = data;

  // Calculate days since start
  const daysSinceStart = cycle.started_at
    ? Math.floor(
        (new Date().getTime() - new Date(cycle.started_at).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  // Get today's suggested task (highest priority incomplete task)
  const suggestedTask = tasks
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (
        priorityOrder[a.priority as keyof typeof priorityOrder] -
        priorityOrder[b.priority as keyof typeof priorityOrder]
      );
    })[0];

  // Filter tasks
  const todayTasks = tasks.filter((t) => {
    if (t.status === 'done') return false;
    if (!t.due_date) return false;
    const dueDate = new Date(t.due_date);
    const today = new Date();
    return dueDate.toDateString() === today.toDateString();
  });

  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const upcomingTasks = tasks
    .filter((t) => {
      if (t.status === 'done') return false;
      if (!t.due_date) return true; // Tasks without due date
      const dueDate = new Date(t.due_date);
      const today = new Date();
      return dueDate > today;
    })
    .slice(0, 5); // Show max 5 upcoming

  return (
    <div className={cn('space-y-8', className)}>
      {/* Linear-inspired Dynamic Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">Active Cycle</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Hello {userName}
          {suggestedTask && cycle.status === 'active' && (
            <span className="text-muted-foreground font-normal">
              {', '}Cyclo suggests we focus on{' '}
              <span className="text-foreground">"{suggestedTask.title}"</span>
            </span>
          )}
          {cycle.status === 'planning' && (
            <span className="text-muted-foreground font-normal">
              {', '}let's finish planning your <span className="text-foreground">"{cycle.title}"</span>
            </span>
          )}
          {cycle.status === 'reflecting' && (
            <span className="text-muted-foreground font-normal">
              {', '}time to reflect on your <span className="text-foreground">"{cycle.title}"</span>
            </span>
          )}
        </h1>
        <p className="text-base text-muted-foreground max-w-2xl">
          {cycle.status === 'planning' &&
            'Complete your planning stages to activate your cycle.'}
          {cycle.status === 'active' &&
            `You've completed ${cycle.tasks_completed} of ${cycle.tasks_total} tasks. Keep up the momentum!`}
          {cycle.status === 'reflecting' &&
            'Review your outcomes and identify key learnings to improve your next cycle.'}
          {cycle.status === 'completed' &&
            'Congratulations on completing this cycle! Ready to start a new one?'}
        </p>
      </div>

      {/* Progress Widget */}
      <CycleProgressWidget
        status={cycle.status}
        currentStage={cycle.current_stage}
        progress={cycle.progress}
        tasksCompleted={cycle.tasks_completed}
        tasksTotal={cycle.tasks_total}
        title={cycle.title}
      />

      {/* AI Insights */}
      {insights.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-3">Insights from Cyclo</h2>
          <InsightNudgeList
            insights={insights}
            onDismiss={onDismissInsight}
            maxVisible={2}
          />
        </div>
      ) : (
        <SmartInsightNudge
          progress={cycle.progress}
          completedTasks={cycle.tasks_completed}
          totalTasks={cycle.tasks_total}
          daysSinceStart={daysSinceStart}
          onDismiss={() => {}}
        />
      )}

      {/* Tasks Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        {todayTasks.length > 0 && (
          <ActionCardList
            title="Today's Focus"
            tasks={todayTasks}
            onComplete={onCompleteTask}
            onCheckIn={onCheckInTask}
            emptyMessage="No tasks due today"
          />
        )}

        {/* In Progress Tasks */}
        {inProgressTasks.length > 0 && (
          <ActionCardList
            title="In Progress"
            tasks={inProgressTasks}
            onComplete={onCompleteTask}
            onCheckIn={onCheckInTask}
            emptyMessage="No tasks in progress"
          />
        )}
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <ActionCardList
          title="Upcoming Tasks"
          tasks={upcomingTasks}
          onComplete={onCompleteTask}
          onCheckIn={onCheckInTask}
          emptyMessage="No upcoming tasks"
        />
      )}

      {/* No Tasks State */}
      {tasks.length === 0 && (
        <div className="rounded-lg border-2 border-dashed bg-muted/30 p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No Tasks Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Add tasks to your cycle to start tracking your progress
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveCycleView;
