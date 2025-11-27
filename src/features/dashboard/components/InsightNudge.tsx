'use client';

import React, { useState } from 'react';
import { Sparkles, X, TrendingUp, Lightbulb, AlertCircle, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export type InsightType = 'tip' | 'encouragement' | 'warning' | 'celebration';

export interface InsightNudgeProps {
  /** Insight content */
  content: string;
  /** Type of insight */
  type?: InsightType;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Whether the nudge can be dismissed */
  dismissible?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

const insightConfig: Record<
  InsightType,
  {
    icon: React.ElementType;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    textColor: string;
  }
> = {
  tip: {
    icon: Lightbulb,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    textColor: 'text-blue-900',
  },
  encouragement: {
    icon: Heart,
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    textColor: 'text-purple-900',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-600',
    textColor: 'text-yellow-900',
  },
  celebration: {
    icon: Sparkles,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    textColor: 'text-green-900',
  },
};

/**
 * InsightNudge displays AI-generated insights and tips from Cyclo
 */
export const InsightNudge: React.FC<InsightNudgeProps> = ({
  content,
  type = 'tip',
  onDismiss,
  dismissible = true,
  className,
  action,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const config = insightConfig[type];
  const Icon = config.icon;

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4 shadow-sm',
        config.bgColor,
        config.borderColor,
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className={cn('text-sm leading-relaxed', config.textColor)}>
                {content}
              </p>

              {/* Action Button */}
              {action && (
                <button
                  onClick={action.onClick}
                  className={cn(
                    'mt-2 text-xs font-medium underline-offset-4 hover:underline',
                    config.iconColor
                  )}
                >
                  {action.label} →
                </button>
              )}
            </div>

            {/* Dismiss Button */}
            {dismissible && (
              <button
                onClick={handleDismiss}
                className={cn(
                  'flex-shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100',
                  config.iconColor
                )}
                aria-label="Dismiss insight"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cyclo Signature */}
      <div className="mt-2 ml-8 flex items-center gap-1 text-xs text-muted-foreground">
        <Sparkles className="h-3 w-3" />
        <span>Suggested by Cyclo</span>
      </div>
    </div>
  );
};

/**
 * List of Insight Nudges
 */
export interface InsightNudgeListProps {
  /** List of insights */
  insights: Array<{
    id: string;
    content: string;
    type?: InsightType;
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
  /** Callback when an insight is dismissed */
  onDismiss?: (id: string) => void;
  /** Whether insights can be dismissed */
  dismissible?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Max number of insights to show */
  maxVisible?: number;
}

export const InsightNudgeList: React.FC<InsightNudgeListProps> = ({
  insights,
  onDismiss,
  dismissible = true,
  className,
  maxVisible,
}) => {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
    onDismiss?.(id);
  };

  const visibleInsights = insights
    .filter((insight) => !dismissedIds.has(insight.id))
    .slice(0, maxVisible);

  if (visibleInsights.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      {visibleInsights.map((insight) => (
        <InsightNudge
          key={insight.id}
          content={insight.content}
          type={insight.type}
          action={insight.action}
          onDismiss={() => handleDismiss(insight.id)}
          dismissible={dismissible}
        />
      ))}
    </div>
  );
};

/**
 * Context-aware insight nudge that adapts based on user's progress
 */
export interface SmartInsightNudgeProps {
  /** User's progress percentage */
  progress: number;
  /** Number of completed tasks */
  completedTasks: number;
  /** Total number of tasks */
  totalTasks: number;
  /** Days since cycle started */
  daysSinceStart: number;
  /** Callback when dismissed */
  onDismiss?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export const SmartInsightNudge: React.FC<SmartInsightNudgeProps> = ({
  progress,
  completedTasks,
  totalTasks,
  daysSinceStart,
  onDismiss,
  className,
}) => {
  // Determine the most relevant insight based on context
  const getContextualInsight = (): {
    content: string;
    type: InsightType;
  } => {
    // Early in cycle, low progress
    if (daysSinceStart <= 3 && progress < 20) {
      return {
        content:
          "Great start! Focus on completing 1-2 tasks today to build momentum. Small wins lead to big progress.",
        type: 'tip',
      };
    }

    // High progress
    if (progress >= 80) {
      return {
        content:
          "You're almost there! You've completed " +
          completedTasks +
          " out of " +
          totalTasks +
          " tasks. Finish strong!",
        type: 'celebration',
      };
    }

    // Midway through, good progress
    if (progress >= 40 && progress < 80) {
      return {
        content:
          "You're making solid progress! Keep up the great work. Consider reviewing your reflections to stay aligned with your goals.",
        type: 'encouragement',
      };
    }

    // Stagnating (many days, low progress)
    if (daysSinceStart > 7 && progress < 30) {
      return {
        content:
          "It's been " +
          daysSinceStart +
          " days. Let's break down your next task into smaller steps to make it more manageable.",
        type: 'warning',
      };
    }

    // Default encouragement
    return {
      content:
        "Remember why you started this cycle. Each task brings you closer to your goal. You've got this!",
      type: 'encouragement',
    };
  };

  const insight = getContextualInsight();

  return (
    <InsightNudge
      content={insight.content}
      type={insight.type}
      onDismiss={onDismiss}
      className={className}
    />
  );
};

export default InsightNudge;
