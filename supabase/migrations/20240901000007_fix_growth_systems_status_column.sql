-- Remove status column from growth_systems if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'growth_systems' AND column_name = 'status') THEN
        ALTER TABLE growth_systems DROP COLUMN status;
    END IF;
END$$;
