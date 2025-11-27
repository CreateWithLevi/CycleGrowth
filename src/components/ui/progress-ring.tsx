'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressRingProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Size of the ring in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Color of the progress arc */
  progressColor?: string;
  /** Color of the background track */
  trackColor?: string;
  /** Optional label to display in the center */
  label?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Show percentage text in center */
  showPercentage?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
}

/**
 * A circular progress indicator component
 *
 * @example
 * ```tsx
 * <ProgressRing progress={75} size={120} label="Planning" />
 * ```
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  progressColor = 'hsl(var(--primary))',
  trackColor = 'hsl(var(--muted))',
  label,
  className,
  showPercentage = false,
  animationDuration = 600,
}) => {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (clampedProgress / 100) * circumference;

  // Center coordinates
  const center = size / 2;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-label={`${clampedProgress}% complete`}
      >
        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: `stroke-dashoffset ${animationDuration}ms ease-in-out`,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showPercentage && !label && (
          <span className="text-2xl font-bold tabular-nums">
            {Math.round(clampedProgress)}%
          </span>
        )}
        {label && (
          <div className="text-center px-2">
            {label}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Multi-segment progress ring for showing multiple phases
 */
export interface MultiSegmentProgressRingProps {
  /** Array of segments with progress and color */
  segments: Array<{
    progress: number;
    color: string;
    label?: string;
  }>;
  /** Size of the ring in pixels */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Gap between segments in degrees */
  gapDegrees?: number;
  /** Center label */
  label?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export const MultiSegmentProgressRing: React.FC<MultiSegmentProgressRingProps> = ({
  segments,
  size = 120,
  strokeWidth = 8,
  gapDegrees = 2,
  label,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const center = size / 2;

  // Calculate total progress
  const totalProgress = segments.reduce((sum, seg) => sum + seg.progress, 0);
  const segmentAngles = segments.map(seg => (seg.progress / totalProgress) * 360);

  let currentAngle = 0;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-label={`${Math.round(totalProgress)}% complete across ${segments.length} phases`}
      >
        {segments.map((segment, index) => {
          const segmentAngle = segmentAngles[index] - gapDegrees;
          const arcLength = (segmentAngle / 360) * circumference;
          const offset = circumference - arcLength;
          const rotation = currentAngle;

          currentAngle += segmentAngles[index];

          return (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arcLength} ${circumference}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center',
                transition: 'stroke-dashoffset 600ms ease-in-out',
              }}
            />
          );
        })}
      </svg>

      {/* Center content */}
      {label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-2">
            {label}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressRing;
