'use client';

import { useEffect, useState } from 'react';
import { onLCP, onFID, onCLS, type Metric } from 'web-vitals';

interface MetricData {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  unit: string;
}

/**
 * Gets the metric rating based on thresholds
 */
function getMetricRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  const { name, value } = metric;

  const thresholds: Record<string, { good: number; poor: number }> = {
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
  };

  const threshold = thresholds[name];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Gets the background color based on rating
 */
function getRatingColor(rating: 'good' | 'needs-improvement' | 'poor'): string {
  const colors = {
    good: 'bg-green-500',
    'needs-improvement': 'bg-orange-500',
    poor: 'bg-red-500',
  };
  return colors[rating];
}

/**
 * Gets the text description of the rating
 */
function getRatingLabel(rating: 'good' | 'needs-improvement' | 'poor'): string {
  const labels = {
    good: 'Good',
    'needs-improvement': 'Needs Improvement',
    poor: 'Poor',
  };
  return labels[rating];
}

/**
 * PerformanceHud Component
 *
 * A development-only heads-up display showing Core Web Vitals metrics in real-time.
 * Displays LCP, FID, and CLS with color-coded ratings (green/orange/red).
 *
 * Only renders in development mode (NODE_ENV === 'development').
 *
 * @example
 * ```tsx
 * // In root layout.tsx
 * <PerformanceHud />
 * ```
 */
export function PerformanceHud() {
  const [metrics, setMetrics] = useState<Map<string, MetricData>>(new Map());
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // Only render in development
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (!isDev) return;

    const handleMetric = (metric: Metric) => {
      const rating = getMetricRating(metric);
      const unit = metric.name === 'CLS' ? '' : 'ms';

      setMetrics((prev) => {
        const updated = new Map(prev);
        updated.set(metric.name, {
          name: metric.name,
          value: metric.value,
          rating,
          unit,
        });
        return updated;
      });
    };

    // Register observers for Core Web Vitals
    onLCP(handleMetric);
    onFID(handleMetric);
    onCLS(handleMetric);
  }, [isDev]);

  // Don't render in production
  if (!isDev || !isVisible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] font-mono text-xs"
      style={{
        pointerEvents: 'auto',
      }}
    >
      <div className="bg-black/80 backdrop-blur-sm text-white rounded-lg shadow-2xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-900 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-semibold">Web Vitals</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="px-2 py-1 hover:bg-gray-800 rounded transition-colors"
              title={isMinimized ? 'Expand' : 'Minimize'}
            >
              {isMinimized ? '□' : '_'}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="px-2 py-1 hover:bg-gray-800 rounded transition-colors"
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Metrics */}
        {!isMinimized && (
          <div className="p-3 space-y-2 min-w-[280px]">
            {metrics.size === 0 ? (
              <div className="text-gray-400 text-center py-4">
                Waiting for metrics...
              </div>
            ) : (
              <>
                {['LCP', 'FID', 'CLS'].map((metricName) => {
                  const metric = metrics.get(metricName);
                  if (!metric) {
                    return (
                      <div key={metricName} className="flex items-center justify-between py-2 px-3 bg-gray-800/50 rounded">
                        <span className="text-gray-400">{metricName}</span>
                        <span className="text-gray-500">-</span>
                      </div>
                    );
                  }

                  const value = metric.name === 'CLS'
                    ? metric.value.toFixed(3)
                    : Math.round(metric.value).toString();

                  return (
                    <div key={metricName} className="flex items-center justify-between py-2 px-3 bg-gray-800/50 rounded">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getRatingColor(metric.rating)}`} />
                        <span className="font-semibold">{metric.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{value}{metric.unit}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${getRatingColor(metric.rating)} text-white`}>
                          {getRatingLabel(metric.rating)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* Legend */}
            <div className="pt-2 border-t border-gray-700 text-gray-400 text-[10px]">
              <div className="flex items-center justify-between gap-2">
                <span>Thresholds:</span>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Good
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    Needs Work
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    Poor
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Restore button when closed */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg hover:bg-black/90 transition-colors border border-gray-700"
          title="Show Web Vitals HUD"
        >
          📊 Web Vitals
        </button>
      )}
    </div>
  );
}
