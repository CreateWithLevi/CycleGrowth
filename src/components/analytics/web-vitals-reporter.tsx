'use client';

import { useEffect, useRef } from 'react';
import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP, type Metric } from 'web-vitals';
import { createClient } from '../../../supabase/client';

/**
 * Generates a unique session ID for grouping metrics
 */
function getSessionId(): string {
  // Check if session ID exists in sessionStorage
  if (typeof window !== 'undefined') {
    let sessionId = sessionStorage.getItem('web-vitals-session-id');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('web-vitals-session-id', sessionId);
    }
    return sessionId;
  }
  return 'server-side';
}

/**
 * Gets the metric rating based on thresholds
 * https://web.dev/vitals/
 */
function getMetricRating(metric: Metric): 'good' | 'needs-improvement' | 'poor' {
  const { name, value } = metric;

  // Thresholds from web.dev
  const thresholds: Record<string, { good: number; poor: number }> = {
    LCP: { good: 2500, poor: 4000 }, // milliseconds
    FID: { good: 100, poor: 300 },   // milliseconds
    CLS: { good: 0.1, poor: 0.25 },   // score
    FCP: { good: 1800, poor: 3000 },  // milliseconds
    TTFB: { good: 800, poor: 1800 },  // milliseconds
    INP: { good: 200, poor: 500 },    // milliseconds
  };

  const threshold = thresholds[name];
  if (!threshold) return 'good';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Logs web vitals metric to analytics backend
 */
async function logMetric(metric: Metric, userId: string | null): Promise<void> {
  const isDev = process.env.NODE_ENV === 'development';
  const sessionId = getSessionId();
  const rating = getMetricRating(metric);

  // Development: Log to console with color coding
  if (isDev) {
    const colors = {
      good: 'color: #0cce6b; font-weight: bold',
      'needs-improvement': 'color: #ffa400; font-weight: bold',
      poor: 'color: #ff4e42; font-weight: bold',
    };

    console.log(
      `%c[Web Vitals] ${metric.name}: ${Math.round(metric.value)}${metric.name === 'CLS' ? '' : 'ms'} (${rating})`,
      colors[rating],
      {
        id: metric.id,
        navigationType: metric.navigationType,
        rating,
        sessionId,
      }
    );
    return;
  }

  // Production: Send to Supabase
  try {
    const supabase = createClient();

    // Get user agent and connection info
    const userAgent = navigator.userAgent;
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const connectionType = connection?.effectiveType || 'unknown';

    // Simple device type detection
    const deviceType = /mobile/i.test(userAgent) ? 'mobile' : /tablet/i.test(userAgent) ? 'tablet' : 'desktop';

    const { error } = await supabase
      .from('web_vitals_logs')
      .insert({
        user_id: userId,
        session_id: sessionId,
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: rating,
        page_url: window.location.href,
        user_agent: userAgent,
        connection_type: connectionType,
        device_type: deviceType,
      });

    if (error) {
      console.error('[Web Vitals] Failed to log metric:', error);
    }
  } catch (error) {
    console.error('[Web Vitals] Exception while logging metric:', error);
  }
}

/**
 * WebVitalsReporter Component
 *
 * Captures Core Web Vitals (LCP, FID, CLS) and other performance metrics.
 * - Development: Logs metrics to console with color-coded ratings
 * - Production: Sends metrics to Supabase analytics table
 *
 * @example
 * ```tsx
 * // In root layout.tsx
 * <WebVitalsReporter />
 * ```
 */
export function WebVitalsReporter() {
  const reportedMetrics = useRef<Set<string>>(new Set());

  useEffect(() => {
    let userId: string | null = null;

    // Get current user ID
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      userId = data.user?.id || null;
    });

    // Create a handler that prevents duplicate reporting
    const handleMetric = (metric: Metric) => {
      const key = `${metric.name}-${metric.id}`;

      // Prevent duplicate reports for the same metric
      if (reportedMetrics.current.has(key)) {
        return;
      }

      reportedMetrics.current.add(key);
      logMetric(metric, userId);
    };

    // Register observers for all Core Web Vitals
    onLCP(handleMetric);
    onFID(handleMetric);
    onCLS(handleMetric);
    onFCP(handleMetric);
    onTTFB(handleMetric);
    onINP(handleMetric);

    // Cleanup is handled by web-vitals library
  }, []);

  // This component doesn't render anything
  return null;
}
