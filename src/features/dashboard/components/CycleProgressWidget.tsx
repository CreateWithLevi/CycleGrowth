'use client';

import React from 'react';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Database } from '@/types/supabase';
import { Target, TrendingUp, Lightbulb, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type CycleStatus = Database['public']['Enums']['cycle_status'];
type StageType = Database['public']['Enums']['stage_type'];

export interface CycleProgressWidgetProps {
  /** Current cycle status */
  status: CycleStatus;
  /** Current stage within the status */
  currentStage?: StageType | null;
  /** Overall progress percentage (0-100) */
  progress: number;
  /** Number of tasks completed */
  tasksCompleted: number;
  /** Total number of tasks */
  tasksTotal: number;
  /** Cycle title */
  title: string;
  /** Additional CSS classes */
  className?: string;
}

const statusConfig: Record<
  CycleStatus,
  {
    label: string;
    color: string;
    icon: React.ElementType;
    description: string;
  }
> = {
  planning: {
    label: 'Planning',
    color: 'hsl(var(--chart-1))', // Blue
    icon: Target,
    description: 'Defining goals and breaking down tasks',
  },
  active: {
    label: 'In Progress',
    color: 'hsl(var(--chart-2))', // Green
    icon: TrendingUp,
    description: 'Executing tasks and tracking progress',
  },
  reflecting: {
    label: 'Reflecting',
    color: 'hsl(var(--chart-3))', // Orange
    icon: Lightbulb,
    description: 'Reviewing outcomes and identifying learnings',
  },
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-4))', // Purple
    icon: CheckCircle2,
    description: 'Cycle finished successfully',
  },
  archived: {
    label: 'Archived',
    color: 'hsl(var(--muted-foreground))', // Gray
    icon: CheckCircle2,
    description: 'Archived for future reference',
  },
};

const getStageLabel = (stage: StageType): string => {
  const labels: Record<StageType, string> = {
    planning_define_goals: 'Defining Goals',
    planning_break_down_tasks: 'Breaking Down Tasks',
    planning_set_milestones: 'Setting Milestones',
    active_execute_tasks: 'Executing Tasks',
    active_track_progress: 'Tracking Progress',
    active_adjust_approach: 'Adjusting Approach',
    reflecting_review_outcomes: 'Reviewing Outcomes',
    reflecting_identify_learnings: 'Identifying Learnings',
    reflecting_plan_improvements: 'Planning Improvements',
  };
  return labels[stage] || stage;
};

/**
 * CycleProgressWidget displays the current phase and progress of a growth cycle
 */
export const CycleProgressWidget: React.FC<CycleProgressWidgetProps> = ({
  status,
  currentStage,
  progress,
  tasksCompleted,
  tasksTotal,
  title,
  className,
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('rounded-lg border bg-card p-6 shadow-sm', className)}>
      <div className="flex items-start gap-6">
        {/* Progress Ring */}
        <div className="flex-shrink-0">
          <ProgressRing
            progress={progress}
            size={140}
            strokeWidth={12}
            progressColor={config.color}
            label={
              <div className="flex flex-col items-center">
                <Icon className="h-8 w-8 mb-1" style={{ color: config.color }} />
                <span className="text-2xl font-bold tabular-nums">
                  {Math.round(progress)}%
                </span>
              </div>
            }
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Title and Status */}
          <div className="mb-3">
            <h3 className="text-xl font-semibold mb-1 truncate">{title}</h3>
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${config.color}20`,
                  color: config.color,
                }}
              >
                <Icon className="h-3 w-3" />
                {config.label}
              </span>
              {currentStage && (
                <span className="text-xs text-muted-foreground">
                  • {getStageLabel(currentStage)}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4">
            {config.description}
          </p>

          {/* Progress Details */}
          <div className="space-y-2">
            {/* Task Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Tasks</span>
                <span className="font-medium tabular-nums">
                  {tasksCompleted} / {tasksTotal}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>
            </div>

            {/* Overall Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium tabular-nums">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: config.color,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Compact version for smaller spaces
 */
export const CycleProgressWidgetCompact: React.FC<CycleProgressWidgetProps> = ({
  status,
  progress,
  title,
  className,
}) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <ProgressRing
        progress={progress}
        size={60}
        strokeWidth={6}
        progressColor={config.color}
        label={
          <Icon className="h-5 w-5" style={{ color: config.color }} />
        }
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate text-sm">{title}</h4>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">{config.label}</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-medium tabular-nums">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default CycleProgressWidget;
