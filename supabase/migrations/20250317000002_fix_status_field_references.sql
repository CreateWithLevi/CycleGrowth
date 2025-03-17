-- Check for any triggers or policies that might reference the status field
DO $$
DECLARE
  trigger_record RECORD;
  policy_record RECORD;
BEGIN
  -- Drop any triggers that might reference the status field
  FOR trigger_record IN 
    SELECT tgname FROM pg_trigger 
    WHERE tgrelid = 'growth_systems'::regclass
  LOOP
    EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(trigger_record.tgname) || ' ON growth_systems';
  END LOOP;
  
  -- Drop any policies that might reference the status field
  FOR policy_record IN 
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'growth_systems'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(policy_record.policyname) || ' ON growth_systems';
  END LOOP;
  
  -- Recreate basic policies if needed
  DROP POLICY IF EXISTS "Users can view their own systems" ON growth_systems;
  CREATE POLICY "Users can view their own systems"
    ON growth_systems FOR SELECT
    USING (auth.uid() = user_id);
    
  DROP POLICY IF EXISTS "Users can insert their own systems" ON growth_systems;
  CREATE POLICY "Users can insert their own systems"
    ON growth_systems FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
  DROP POLICY IF EXISTS "Users can update their own systems" ON growth_systems;
  CREATE POLICY "Users can update their own systems"
    ON growth_systems FOR UPDATE
    USING (auth.uid() = user_id);
    
  DROP POLICY IF EXISTS "Users can delete their own systems" ON growth_systems;
  CREATE POLICY "Users can delete their own systems"
    ON growth_systems FOR DELETE
    USING (auth.uid() = user_id);
    
  -- Enable RLS on the table
  ALTER TABLE growth_systems ENABLE ROW LEVEL SECURITY;
  
  -- Add to realtime publication
  ALTER PUBLICATION supabase_realtime ADD TABLE growth_systems;
END;
$$;