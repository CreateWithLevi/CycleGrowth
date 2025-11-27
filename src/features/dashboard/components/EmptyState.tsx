'use client';

import React from 'react';
import { Target, Plus, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  /** Callback when create cycle button is clicked */
  onCreateCycle?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * EmptyState shown when user has no active cycle
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  onCreateCycle,
  className,
}) => {
  return (
    <div className={cn('flex items-center justify-center min-h-[600px]', className)}>
      <div className="max-w-md text-center space-y-6 p-8">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
            <div className="relative bg-primary/10 p-6 rounded-full">
              <Target className="h-16 w-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">No Active Cycle</h2>
          <p className="text-muted-foreground">
            Start your growth journey by creating your first cycle. Define your goals, plan
            your actions, and track your progress.
          </p>
        </div>

        {/* CTA */}
        <div className="space-y-3">
          {onCreateCycle && (
            <button
              onClick={onCreateCycle}
              className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Plus className="h-5 w-5" />
              Create Your First Cycle
            </button>
          )}

          {/* Features */}
          <div className="pt-4 space-y-3 text-left">
            <p className="text-sm font-medium text-muted-foreground">
              What you'll get:
            </p>
            <ul className="space-y-2">
              {[
                'Drag-and-drop system builder',
                'AI-powered insights from Cyclo',
                'Progress tracking and analytics',
                'Reflection prompts for continuous improvement',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Compact empty state for smaller spaces
 */
export const EmptyStateCompact: React.FC<EmptyStateProps> = ({
  onCreateCycle,
  className,
}) => {
  return (
    <div className={cn('rounded-lg border-2 border-dashed bg-muted/30 p-12 text-center', className)}>
      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Active Cycle</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Create a cycle to start tracking your growth journey
      </p>
      {onCreateCycle && (
        <button
          onClick={onCreateCycle}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Cycle
        </button>
      )}
    </div>
  );
};

export default EmptyState;
