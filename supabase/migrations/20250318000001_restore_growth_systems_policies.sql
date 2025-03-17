-- This migration restores proper policies for growth_systems table
-- without affecting foreign key constraints

-- First, enable RLS on the growth_systems table if it's not already enabled
ALTER TABLE IF EXISTS growth_systems ENABLE ROW LEVEL SECURITY;

-- Drop existing policies safely (without touching triggers)
DO $$
BEGIN
    -- Drop policies only (not triggers)
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'growth_systems' AND policyname = 'Users can view their own systems') THEN
        DROP POLICY "Users can view their own systems" ON growth_systems;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'growth_systems' AND policyname = 'Users can insert their own systems') THEN
        DROP POLICY "Users can insert their own systems" ON growth_systems;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'growth_systems' AND policyname = 'Users can update their own systems') THEN
        DROP POLICY "Users can update their own systems" ON growth_systems;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'growth_systems' AND policyname = 'Users can delete their own systems') THEN
        DROP POLICY "Users can delete their own systems" ON growth_systems;
    END IF;
END
$$;

-- Recreate the policies correctly
CREATE POLICY "Users can view their own systems" 
ON growth_systems 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own systems" 
ON growth_systems 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own systems" 
ON growth_systems 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own systems" 
ON growth_systems 
FOR DELETE 
USING (auth.uid() = user_id);

-- Make sure realtime is enabled for growth_systems
DO $$
BEGIN
    -- Try to add the table to the realtime publication if it exists
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE growth_systems;
    EXCEPTION WHEN OTHERS THEN
        -- If it fails (e.g., already in publication or publication doesn't exist), just continue
        NULL;
    END;
END
$$;
