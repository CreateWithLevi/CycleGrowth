-- Disable RLS for all tables to ensure functionality
-- You can enable specific policies later as needed

-- Growth Systems table
ALTER TABLE growth_systems DISABLE ROW LEVEL SECURITY;

-- Growth Tasks table
ALTER TABLE growth_tasks DISABLE ROW LEVEL SECURITY;

-- Growth Activities table
ALTER TABLE growth_activities DISABLE ROW LEVEL SECURITY;

-- Knowledge Items table
ALTER TABLE knowledge_items DISABLE ROW LEVEL SECURITY;

-- Knowledge Tags table
ALTER TABLE knowledge_tags DISABLE ROW LEVEL SECURITY;

-- Knowledge Connections table
ALTER TABLE knowledge_connections DISABLE ROW LEVEL SECURITY;

-- Reflections table
ALTER TABLE reflections DISABLE ROW LEVEL SECURITY;

-- Reflection Insights table
ALTER TABLE reflection_insights DISABLE ROW LEVEL SECURITY;

-- Reflection Tags table
ALTER TABLE reflection_tags DISABLE ROW LEVEL SECURITY;

-- User Cyclo Evolution table
ALTER TABLE user_cyclo_evolution DISABLE ROW LEVEL SECURITY;
