-- Create reflections table
CREATE TABLE IF NOT EXISTS reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  system_id UUID REFERENCES growth_systems(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  cycle_phase TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reflection_insights table
CREATE TABLE IF NOT EXISTS reflection_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reflection_id UUID NOT NULL REFERENCES reflections(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reflection_tags table
CREATE TABLE IF NOT EXISTS reflection_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reflection_id UUID NOT NULL REFERENCES reflections(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on reflection tables
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflection_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for reflections
CREATE POLICY "Users can view their own reflections" 
  ON reflections FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own reflections" 
  ON reflections FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reflections" 
  ON reflections FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own reflections" 
  ON reflections FOR DELETE 
  USING (user_id = auth.uid());

-- Create policies for reflection_insights
CREATE POLICY "Users can view insights for their reflections" 
  ON reflection_insights FOR SELECT 
  USING ((SELECT user_id FROM reflections WHERE id = reflection_insights.reflection_id) = auth.uid());

CREATE POLICY "Users can insert insights for their reflections" 
  ON reflection_insights FOR INSERT 
  WITH CHECK ((SELECT user_id FROM reflections WHERE id = reflection_insights.reflection_id) = auth.uid());

CREATE POLICY "Users can delete insights for their reflections" 
  ON reflection_insights FOR DELETE 
  USING ((SELECT user_id FROM reflections WHERE id = reflection_insights.reflection_id) = auth.uid());

-- Create policies for reflection_tags
CREATE POLICY "Users can view tags for their reflections" 
  ON reflection_tags FOR SELECT 
  USING ((SELECT user_id FROM reflections WHERE id = reflection_tags.reflection_id) = auth.uid());

CREATE POLICY "Users can insert tags for their reflections" 
  ON reflection_tags FOR INSERT 
  WITH CHECK ((SELECT user_id FROM reflections WHERE id = reflection_tags.reflection_id) = auth.uid());

CREATE POLICY "Users can delete tags for their reflections" 
  ON reflection_tags FOR DELETE 
  USING ((SELECT user_id FROM reflections WHERE id = reflection_tags.reflection_id) = auth.uid());

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE reflections;
ALTER PUBLICATION supabase_realtime ADD TABLE reflection_insights;
ALTER PUBLICATION supabase_realtime ADD TABLE reflection_tags;
