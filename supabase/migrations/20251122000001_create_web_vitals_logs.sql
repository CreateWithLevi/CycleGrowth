-- Migration: Create web_vitals_logs table for Core Web Vitals monitoring
-- Description: Stores LCP, FID, CLS, and other performance metrics from client-side monitoring

-- Create web_vitals_logs table
CREATE TABLE IF NOT EXISTS public.web_vitals_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,

  -- Core Web Vitals metrics
  metric_name TEXT NOT NULL CHECK (metric_name IN ('LCP', 'FID', 'CLS', 'FCP', 'TTFB', 'INP')),
  metric_value NUMERIC NOT NULL,
  metric_rating TEXT NOT NULL CHECK (metric_rating IN ('good', 'needs-improvement', 'poor')),

  -- Additional context
  page_url TEXT NOT NULL,
  user_agent TEXT,
  connection_type TEXT,
  device_type TEXT,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Indexes for efficient querying
  INDEX idx_web_vitals_user_id ON public.web_vitals_logs(user_id),
  INDEX idx_web_vitals_metric_name ON public.web_vitals_logs(metric_name),
  INDEX idx_web_vitals_created_at ON public.web_vitals_logs(created_at DESC),
  INDEX idx_web_vitals_session_id ON public.web_vitals_logs(session_id)
);

-- Enable Row Level Security
ALTER TABLE public.web_vitals_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Allow users to insert their own metrics (authenticated or anonymous)
CREATE POLICY "Users can insert their own web vitals"
  ON public.web_vitals_logs
  FOR INSERT
  WITH CHECK (
    -- Allow if user is authenticated and matches user_id
    (auth.uid() = user_id)
    OR
    -- Allow anonymous inserts (user_id will be NULL)
    (auth.uid() IS NULL AND user_id IS NULL)
  );

-- Allow users to read their own metrics
CREATE POLICY "Users can read their own web vitals"
  ON public.web_vitals_logs
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR
    -- Allow admins to read all metrics (you can customize this)
    auth.jwt() ->> 'role' = 'admin'
  );

-- Only admins can update or delete (optional, for data cleanup)
CREATE POLICY "Only admins can update web vitals"
  ON public.web_vitals_logs
  FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can delete web vitals"
  ON public.web_vitals_logs
  FOR DELETE
  USING (auth.jwt() ->> 'role' = 'admin');

-- Add comment for documentation
COMMENT ON TABLE public.web_vitals_logs IS 'Stores Core Web Vitals metrics (LCP, FID, CLS, etc.) from client-side performance monitoring';
COMMENT ON COLUMN public.web_vitals_logs.metric_name IS 'Type of metric: LCP (Largest Contentful Paint), FID (First Input Delay), CLS (Cumulative Layout Shift), FCP (First Contentful Paint), TTFB (Time to First Byte), INP (Interaction to Next Paint)';
COMMENT ON COLUMN public.web_vitals_logs.metric_value IS 'The numeric value of the metric in milliseconds (for LCP, FID, FCP, TTFB, INP) or as a decimal score (for CLS)';
COMMENT ON COLUMN public.web_vitals_logs.metric_rating IS 'Performance rating: good (<2.5s for LCP), needs-improvement (2.5-4s), poor (>4s)';
