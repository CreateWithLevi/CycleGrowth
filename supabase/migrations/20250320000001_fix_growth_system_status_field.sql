-- Fix the issue with growth_systems table not having a status field
-- This is causing the create-growth-system function to fail

-- First, check if the trigger exists and drop it if it does
DROP TRIGGER IF EXISTS update_growth_systems_status ON growth_systems;

-- Check if there are any RLS policies referencing the status field
DROP POLICY IF EXISTS "Users can only access their own systems" ON growth_systems;

-- Create a proper policy without referencing the status field
CREATE POLICY "Users can only access their own systems"
ON growth_systems
FOR ALL
USING (auth.uid() = user_id);

-- Make sure the table has the correct structure
ALTER TABLE growth_systems
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Don't add to realtime publication as it's already a member
