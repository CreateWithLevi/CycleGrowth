-- Migration: Event-Driven Growth Cycles
-- Description: Creates tables for state-machine-based growth cycles and AI agent interactions
-- Date: 2025-11-19

-- =============================================================================
-- ENUMS
-- =============================================================================

-- Create cycle status enum
DO $$ BEGIN
    CREATE TYPE cycle_status AS ENUM ('planning', 'active', 'reflecting', 'completed', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create stage type enum for granular cycle progress
DO $$ BEGIN
    CREATE TYPE stage_type AS ENUM (
        'planning_define_goals',
        'planning_break_down_tasks',
        'planning_set_milestones',
        'active_execute_tasks',
        'active_track_progress',
        'active_adjust_approach',
        'reflecting_review_outcomes',
        'reflecting_identify_learnings',
        'reflecting_plan_improvements'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create interaction role enum
DO $$ BEGIN
    CREATE TYPE interaction_role AS ENUM ('user', 'assistant', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- TABLES
-- =============================================================================

-- Cycles table: Main table for tracking growth cycles
CREATE TABLE IF NOT EXISTS cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Core cycle information
    title TEXT NOT NULL,
    description TEXT,
    domain TEXT NOT NULL,

    -- State machine status
    status cycle_status NOT NULL DEFAULT 'planning',
    current_stage stage_type,

    -- Progress tracking
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

    -- Metrics
    tasks_completed INTEGER NOT NULL DEFAULT 0,
    tasks_total INTEGER NOT NULL DEFAULT 0,

    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Constraints
    CONSTRAINT valid_dates CHECK (
        (started_at IS NULL OR started_at >= created_at) AND
        (completed_at IS NULL OR completed_at >= started_at) AND
        (archived_at IS NULL OR archived_at >= created_at)
    )
);

-- Cycle stages: Granular progress tracking within each cycle phase
CREATE TABLE IF NOT EXISTS cycle_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,

    -- Stage information
    stage_type stage_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,

    -- Progress and status
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    order_index INTEGER NOT NULL DEFAULT 0,

    -- AI assistance
    ai_guidance TEXT,
    ai_prompts JSONB DEFAULT '[]'::jsonb,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Metadata for extensibility
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Unique constraint to prevent duplicate stages per cycle
    CONSTRAINT unique_cycle_stage UNIQUE (cycle_id, stage_type)
);

-- Cyclo interactions: Conversation history between user and AI agent
CREATE TABLE IF NOT EXISTS cyclo_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Message information
    role interaction_role NOT NULL,
    content TEXT NOT NULL,

    -- Context and metadata
    stage_type stage_type,
    intent TEXT, -- e.g., 'guidance', 'reflection_prompt', 'task_suggestion'
    metadata JSONB DEFAULT '{}'::jsonb,

    -- For threading/conversation structure
    parent_id UUID REFERENCES cyclo_interactions(id) ON DELETE SET NULL,
    thread_id UUID, -- Groups related interactions

    -- AI model information (for audit/debugging)
    model_name TEXT,
    tokens_used INTEGER,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Indexes for efficient querying
    CONSTRAINT valid_user_message CHECK (
        (role = 'user' AND user_id IS NOT NULL) OR
        (role IN ('assistant', 'system'))
    )
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Cycles indexes
CREATE INDEX IF NOT EXISTS idx_cycles_user_id ON cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_cycles_status ON cycles(status);
CREATE INDEX IF NOT EXISTS idx_cycles_domain ON cycles(domain);
CREATE INDEX IF NOT EXISTS idx_cycles_created_at ON cycles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cycles_user_status ON cycles(user_id, status);

-- Cycle stages indexes
CREATE INDEX IF NOT EXISTS idx_cycle_stages_cycle_id ON cycle_stages(cycle_id);
CREATE INDEX IF NOT EXISTS idx_cycle_stages_stage_type ON cycle_stages(stage_type);
CREATE INDEX IF NOT EXISTS idx_cycle_stages_order ON cycle_stages(cycle_id, order_index);
CREATE INDEX IF NOT EXISTS idx_cycle_stages_completed ON cycle_stages(cycle_id, is_completed);

-- Cyclo interactions indexes
CREATE INDEX IF NOT EXISTS idx_cyclo_interactions_cycle_id ON cyclo_interactions(cycle_id);
CREATE INDEX IF NOT EXISTS idx_cyclo_interactions_user_id ON cyclo_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_cyclo_interactions_created_at ON cyclo_interactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cyclo_interactions_thread_id ON cyclo_interactions(thread_id);
CREATE INDEX IF NOT EXISTS idx_cyclo_interactions_parent_id ON cyclo_interactions(parent_id);
CREATE INDEX IF NOT EXISTS idx_cyclo_interactions_stage ON cyclo_interactions(cycle_id, stage_type);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cyclo_interactions ENABLE ROW LEVEL SECURITY;

-- Cycles policies
DROP POLICY IF EXISTS "Users can view their own cycles" ON cycles;
CREATE POLICY "Users can view their own cycles"
    ON cycles FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own cycles" ON cycles;
CREATE POLICY "Users can insert their own cycles"
    ON cycles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own cycles" ON cycles;
CREATE POLICY "Users can update their own cycles"
    ON cycles FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own cycles" ON cycles;
CREATE POLICY "Users can delete their own cycles"
    ON cycles FOR DELETE
    USING (auth.uid() = user_id);

-- Service role access for AI background jobs
DROP POLICY IF EXISTS "Service role can manage all cycles" ON cycles;
CREATE POLICY "Service role can manage all cycles"
    ON cycles FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Cycle stages policies
DROP POLICY IF EXISTS "Users can view stages for their cycles" ON cycle_stages;
CREATE POLICY "Users can view stages for their cycles"
    ON cycle_stages FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM cycles
        WHERE cycles.id = cycle_stages.cycle_id
        AND cycles.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can insert stages for their cycles" ON cycle_stages;
CREATE POLICY "Users can insert stages for their cycles"
    ON cycle_stages FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM cycles
        WHERE cycles.id = cycle_stages.cycle_id
        AND cycles.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can update stages for their cycles" ON cycle_stages;
CREATE POLICY "Users can update stages for their cycles"
    ON cycle_stages FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM cycles
        WHERE cycles.id = cycle_stages.cycle_id
        AND cycles.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can delete stages for their cycles" ON cycle_stages;
CREATE POLICY "Users can delete stages for their cycles"
    ON cycle_stages FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM cycles
        WHERE cycles.id = cycle_stages.cycle_id
        AND cycles.user_id = auth.uid()
    ));

-- Service role access for AI operations
DROP POLICY IF EXISTS "Service role can manage all cycle stages" ON cycle_stages;
CREATE POLICY "Service role can manage all cycle stages"
    ON cycle_stages FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Cyclo interactions policies
DROP POLICY IF EXISTS "Users can view their own interactions" ON cyclo_interactions;
CREATE POLICY "Users can view their own interactions"
    ON cyclo_interactions FOR SELECT
    USING (auth.uid() = user_id OR EXISTS (
        SELECT 1 FROM cycles
        WHERE cycles.id = cyclo_interactions.cycle_id
        AND cycles.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Users can insert their own interactions" ON cyclo_interactions;
CREATE POLICY "Users can insert their own interactions"
    ON cyclo_interactions FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM cycles
            WHERE cycles.id = cyclo_interactions.cycle_id
            AND cycles.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update their own interactions" ON cyclo_interactions;
CREATE POLICY "Users can update their own interactions"
    ON cyclo_interactions FOR UPDATE
    USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM cycles
            WHERE cycles.id = cyclo_interactions.cycle_id
            AND cycles.user_id = auth.uid()
        )
    );

-- Service role can manage all interactions (for AI responses)
DROP POLICY IF EXISTS "Service role can manage all interactions" ON cyclo_interactions;
CREATE POLICY "Service role can manage all interactions"
    ON cyclo_interactions FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_cycles_updated_at ON cycles;
CREATE TRIGGER update_cycles_updated_at
    BEFORE UPDATE ON cycles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cycle_stages_updated_at ON cycle_stages;
CREATE TRIGGER update_cycle_stages_updated_at
    BEFORE UPDATE ON cycle_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-update cycle progress based on stages
CREATE OR REPLACE FUNCTION update_cycle_progress()
RETURNS TRIGGER AS $$
DECLARE
    total_stages INTEGER;
    completed_stages INTEGER;
    new_progress INTEGER;
BEGIN
    -- Count total and completed stages for this cycle
    SELECT
        COUNT(*),
        COUNT(*) FILTER (WHERE is_completed = true)
    INTO total_stages, completed_stages
    FROM cycle_stages
    WHERE cycle_id = COALESCE(NEW.cycle_id, OLD.cycle_id);

    -- Calculate progress percentage
    IF total_stages > 0 THEN
        new_progress := (completed_stages * 100) / total_stages;
    ELSE
        new_progress := 0;
    END IF;

    -- Update the cycle's progress
    UPDATE cycles
    SET progress = new_progress
    WHERE id = COALESCE(NEW.cycle_id, OLD.cycle_id);

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update cycle progress when stages change
DROP TRIGGER IF EXISTS trigger_update_cycle_progress ON cycle_stages;
CREATE TRIGGER trigger_update_cycle_progress
    AFTER INSERT OR UPDATE OR DELETE ON cycle_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_cycle_progress();

-- =============================================================================
-- MIGRATION DATA
-- =============================================================================

-- Optionally migrate existing growth_systems data to cycles table
-- This is commented out by default to prevent accidental data migration
-- Uncomment and customize if you want to migrate existing data

/*
INSERT INTO cycles (
    id,
    user_id,
    title,
    description,
    domain,
    status,
    progress,
    started_at,
    created_at,
    updated_at
)
SELECT
    id,
    user_id,
    title,
    description,
    domain,
    CASE
        WHEN status = 'active' THEN 'active'::cycle_status
        WHEN status = 'completed' THEN 'completed'::cycle_status
        ELSE 'planning'::cycle_status
    END,
    progress,
    start_date,
    created_at,
    updated_at
FROM growth_systems
ON CONFLICT (id) DO NOTHING;
*/

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE cycles IS 'Main table for tracking growth cycles with state-machine based status';
COMMENT ON TABLE cycle_stages IS 'Granular progress tracking within each cycle phase';
COMMENT ON TABLE cyclo_interactions IS 'Conversation history between user and AI agent (Cyclo)';

COMMENT ON COLUMN cycles.status IS 'Current state of the cycle: planning -> active -> reflecting -> completed';
COMMENT ON COLUMN cycles.current_stage IS 'Specific stage within the current status phase';
COMMENT ON COLUMN cycles.metadata IS 'Flexible JSON field for additional cycle data';

COMMENT ON COLUMN cycle_stages.ai_guidance IS 'AI-generated guidance text for this stage';
COMMENT ON COLUMN cycle_stages.ai_prompts IS 'Array of prompts/questions the AI can ask to guide the user';

COMMENT ON COLUMN cyclo_interactions.intent IS 'Purpose of the interaction (e.g., guidance, reflection_prompt, task_suggestion)';
COMMENT ON COLUMN cyclo_interactions.thread_id IS 'Groups related interactions into a conversation thread';
COMMENT ON COLUMN cyclo_interactions.parent_id IS 'References parent message for threaded conversations';
