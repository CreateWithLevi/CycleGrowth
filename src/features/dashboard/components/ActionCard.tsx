'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, Flag, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Database } from '@/types/supabase';

type TaskStatus = Database['public']['Tables']['growth_tasks']['Row']['status'];
type TaskPriority = Database['public']['Tables']['growth_tasks']['Row']['priority'];

export interface ActionCardProps {
  /** Task ID */
  id: string;
  /** Task title */
  title: string;
  /** Task description */
  description?: string | null;
  /** Task status */
  status: TaskStatus;
  /** Task priority */
  priority: TaskPriority;
  /** Due date */
  dueDate?: string | null;
  /** Callback when task is marked complete */
  onComplete?: (id: string) => void | Promise<void>;
  /** Callback when task is checked in */
  onCheckIn?: (id: string) => void | Promise<void>;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

const priorityConfig: Record<
  TaskPriority,
  {
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  low: {
    label: 'Low',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200',
  },
  high: {
    label: 'High',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
  },
};

/**
 * ActionCard allows users to quickly interact with tasks
 */
export const ActionCard: React.FC<ActionCardProps> = ({
  id,
  title,
  description,
  status,
  priority,
  dueDate,
  onComplete,
  onCheckIn,
  isLoading = false,
  className,
}) => {
  const [localLoading, setLocalLoading] = useState(false);
  const isCompleted = status === 'done';
  const isInProgress = status === 'in-progress';
  const priorityStyle = priorityConfig[priority];

  const handleComplete = async () => {
    if (isCompleted || !onComplete) return;

    setLocalLoading(true);
    try {
      await onComplete(id);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!onCheckIn) return;

    setLocalLoading(true);
    try {
      await onCheckIn(id);
    } finally {
      setLocalLoading(false);
    }
  };

  const loading = isLoading || localLoading;

  // Format due date
  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  // Check if overdue
  const isOverdue = dueDate && new Date(dueDate) < new Date() && !isCompleted;

  return (
    <div
      className={cn(
        'group rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md',
        isCompleted && 'opacity-60',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {/* Completion Checkbox */}
        <button
          onClick={handleComplete}
          disabled={isCompleted || loading}
          className={cn(
            'flex-shrink-0 mt-0.5 rounded-full transition-colors',
            isCompleted && 'text-green-600',
            !isCompleted && 'text-muted-foreground hover:text-primary',
            loading && 'cursor-not-allowed opacity-50'
          )}
          aria-label={isCompleted ? 'Completed' : 'Mark as complete'}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-6 w-6" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Priority */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              className={cn(
                'font-medium text-sm leading-snug',
                isCompleted && 'line-through'
              )}
            >
              {title}
            </h4>

            {/* Priority Badge */}
            <span
              className={cn(
                'flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border',
                priorityStyle.bgColor,
                priorityStyle.color
              )}
            >
              <Flag className="h-3 w-3" />
              {priorityStyle.label}
            </span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            {/* Status */}
            <div className="flex items-center gap-1">
              {isInProgress ? (
                <>
                  <Clock className="h-3 w-3" />
                  <span>In Progress</span>
                </>
              ) : isCompleted ? (
                <>
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Circle className="h-3 w-3" />
                  <span>Todo</span>
                </>
              )}
            </div>

            {/* Due Date */}
            {formattedDueDate && (
              <>
                <span>•</span>
                <div
                  className={cn(
                    'flex items-center gap-1',
                    isOverdue && 'text-red-600 font-medium'
                  )}
                >
                  <Calendar className="h-3 w-3" />
                  <span>{formattedDueDate}</span>
                  {isOverdue && <span className="text-xs">(Overdue)</span>}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!isCompleted && onComplete && (
              <button
                onClick={handleComplete}
                disabled={loading}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                  'bg-primary text-primary-foreground hover:bg-primary/90',
                  loading && 'cursor-not-allowed opacity-50'
                )}
              >
                {loading ? 'Completing...' : 'Complete'}
              </button>
            )}

            {!isCompleted && !isInProgress && onCheckIn && (
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md border transition-colors',
                  'border-input bg-background hover:bg-accent hover:text-accent-foreground',
                  loading && 'cursor-not-allowed opacity-50'
                )}
              >
                {loading ? 'Starting...' : 'Check In'}
              </button>
            )}

            {isCompleted && (
              <span className="text-xs text-green-600 font-medium">
                ✓ Completed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * List of Action Cards with header
 */
export interface ActionCardListProps {
  /** List title */
  title: string;
  /** List of tasks */
  tasks: Array<Omit<ActionCardProps, 'onComplete' | 'onCheckIn'>>;
  /** Callback when task is completed */
  onComplete?: (id: string) => void | Promise<void>;
  /** Callback when task is checked in */
  onCheckIn?: (id: string) => void | Promise<void>;
  /** Loading state */
  isLoading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional CSS classes */
  className?: string;
}

export const ActionCardList: React.FC<ActionCardListProps> = ({
  title,
  tasks,
  onComplete,
  onCheckIn,
  isLoading = false,
  emptyMessage = 'No tasks to display',
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-sm text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {/* List */}
      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 p-8 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <ActionCard
              key={task.id}
              {...task}
              onComplete={onComplete}
              onCheckIn={onCheckIn}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionCard;
