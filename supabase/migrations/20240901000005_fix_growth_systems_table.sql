-- Fix the growth_systems table structure
ALTER TABLE growth_systems DROP COLUMN IF EXISTS status;

-- Enable realtime for the table
alter publication supabase_realtime add table growth_systems;
