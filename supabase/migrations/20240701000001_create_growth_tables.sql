-- Create growth_systems table
CREATE TABLE IF NOT EXISTS growth_systems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL,
  current_phase TEXT NOT NULL DEFAULT 'planning',
  progress INTEGER NOT NULL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create growth_tasks table
CREATE TABLE IF NOT EXISTS growth_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  system_id UUID NOT NULL REFERENCES growth_systems(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'todo',
  cycle_phase TEXT NOT NULL DEFAULT 'planning',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create task_tags table
CREATE TABLE IF NOT EXISTS task_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES growth_tasks(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create growth_activities table
CREATE TABLE IF NOT EXISTS growth_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  item TEXT NOT NULL,
  system_id UUID REFERENCES growth_systems(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_cyclo_evolution table
CREATE TABLE IF NOT EXISTS user_cyclo_evolution (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_stage INTEGER NOT NULL DEFAULT 1,
  interactions_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE growth_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cyclo_evolution ENABLE ROW LEVEL SECURITY;

-- Create policies for growth_systems
DROP POLICY IF EXISTS "Users can view their own growth systems" ON growth_systems;
CREATE POLICY "Users can view their own growth systems"
  ON growth_systems FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own growth systems" ON growth_systems;
CREATE POLICY "Users can insert their own growth systems"
  ON growth_systems FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own growth systems" ON growth_systems;
CREATE POLICY "Users can update their own growth systems"
  ON growth_systems FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own growth systems" ON growth_systems;
CREATE POLICY "Users can delete their own growth systems"
  ON growth_systems FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for growth_tasks
DROP POLICY IF EXISTS "Users can view tasks for their systems" ON growth_tasks;
CREATE POLICY "Users can view tasks for their systems"
  ON growth_tasks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM growth_systems
    WHERE growth_systems.id = growth_tasks.system_id
    AND growth_systems.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert tasks for their systems" ON growth_tasks;
CREATE POLICY "Users can insert tasks for their systems"
  ON growth_tasks FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM growth_systems
    WHERE growth_systems.id = growth_tasks.system_id
    AND growth_systems.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update tasks for their systems" ON growth_tasks;
CREATE POLICY "Users can update tasks for their systems"
  ON growth_tasks FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM growth_systems
    WHERE growth_systems.id = growth_tasks.system_id
    AND growth_systems.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete tasks for their systems" ON growth_tasks;
CREATE POLICY "Users can delete tasks for their systems"
  ON growth_tasks FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM growth_systems
    WHERE growth_systems.id = growth_tasks.system_id
    AND growth_systems.user_id = auth.uid()
  ));

-- Create policies for task_tags
DROP POLICY IF EXISTS "Users can view tags for their tasks" ON task_tags;
CREATE POLICY "Users can view tags for their tasks"
  ON task_tags FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM growth_tasks
    JOIN growth_systems ON growth_tasks.system_id = growth_systems.id
    WHERE growth_tasks.id = task_tags.task_id
    AND growth_systems.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert tags for their tasks" ON task_tags;
CREATE POLICY "Users can insert tags for their tasks"
  ON task_tags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM growth_tasks
    JOIN growth_systems ON growth_tasks.system_id = growth_systems.id
    WHERE growth_tasks.id = task_tags.task_id
    AND growth_systems.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete tags for their tasks" ON task_tags;
CREATE POLICY "Users can delete tags for their tasks"
  ON task_tags FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM growth_tasks
    JOIN growth_systems ON growth_tasks.system_id = growth_systems.id
    WHERE growth_tasks.id = task_tags.task_id
    AND growth_systems.user_id = auth.uid()
  ));

-- Create policies for growth_activities
DROP POLICY IF EXISTS "Users can view their own activities" ON growth_activities;
CREATE POLICY "Users can view their own activities"
  ON growth_activities FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own activities" ON growth_activities;
CREATE POLICY "Users can insert their own activities"
  ON growth_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policies for user_cyclo_evolution
DROP POLICY IF EXISTS "Users can view their own cyclo evolution" ON user_cyclo_evolution;
CREATE POLICY "Users can view their own cyclo evolution"
  ON user_cyclo_evolution FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cyclo evolution" ON user_cyclo_evolution;
CREATE POLICY "Users can update their own cyclo evolution"
  ON user_cyclo_evolution FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own cyclo evolution" ON user_cyclo_evolution;
CREATE POLICY "Users can insert their own cyclo evolution"
  ON user_cyclo_evolution FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table growth_systems;
alter publication supabase_realtime add table growth_tasks;
alter publication supabase_realtime add table task_tags;
alter publication supabase_realtime add table growth_activities;
alter publication supabase_realtime add table user_cyclo_evolution;
