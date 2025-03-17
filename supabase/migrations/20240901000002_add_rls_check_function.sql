-- Function to check if RLS is enabled for a table
CREATE OR REPLACE FUNCTION get_table_rls_status(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  rls_enabled boolean;
BEGIN
  SELECT relrowsecurity INTO rls_enabled
  FROM pg_class
  WHERE oid = (table_name::regclass);
  
  RETURN rls_enabled;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;
