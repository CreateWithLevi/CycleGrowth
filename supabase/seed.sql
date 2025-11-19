-- =============================================================================
-- SEED SCRIPT: Demo Cycle Data
-- =============================================================================
-- Description: Populates demo data for testing the event-driven growth cycles
-- Usage: Run this script after applying migrations to create test data
-- Note: This assumes at least one user exists in auth.users
-- =============================================================================

-- Create a demo user for testing (if needed)
-- You can replace this with an actual user ID from your auth.users table
DO $$
DECLARE
    demo_user_id UUID;
    demo_cycle_id UUID;
    demo_thread_id UUID;
    planning_stage_id UUID;
    execution_stage_id UUID;
BEGIN
    -- Check if we have at least one user, otherwise we can't create demo data
    SELECT id INTO demo_user_id FROM auth.users LIMIT 1;

    IF demo_user_id IS NULL THEN
        RAISE NOTICE 'No users found in auth.users. Skipping seed data creation.';
        RAISE NOTICE 'Please create a user first, then run this seed script again.';
        RETURN;
    END IF;

    RAISE NOTICE 'Creating demo data for user: %', demo_user_id;

    -- =============================================================================
    -- DEMO CYCLE 1: "Build a Healthy Morning Routine" (Planning Phase)
    -- =============================================================================

    INSERT INTO cycles (
        id,
        user_id,
        title,
        description,
        domain,
        status,
        current_stage,
        progress,
        tasks_completed,
        tasks_total,
        started_at,
        metadata
    ) VALUES (
        gen_random_uuid(),
        demo_user_id,
        'Build a Healthy Morning Routine',
        'Establish a consistent morning routine that sets me up for productive days',
        'Health & Wellness',
        'planning'::cycle_status,
        'planning_define_goals'::stage_type,
        20,
        0,
        5,
        NOW(),
        jsonb_build_object(
            'tags', ARRAY['health', 'habits', 'productivity'],
            'motivation', 'I want to feel more energized and focused throughout the day'
        )
    )
    RETURNING id INTO demo_cycle_id;

    RAISE NOTICE 'Created demo cycle 1: %', demo_cycle_id;

    -- Create stages for the planning cycle
    INSERT INTO cycle_stages (cycle_id, stage_type, title, description, is_completed, order_index, ai_guidance, ai_prompts) VALUES
    (
        demo_cycle_id,
        'planning_define_goals'::stage_type,
        'Define Your Goals',
        'Clearly articulate what you want to achieve with your morning routine',
        true,
        1,
        'Start by identifying 2-3 specific outcomes you want from your morning routine. Be concrete and measurable.',
        jsonb_build_array(
            'What does a successful morning look like to you?',
            'What activities make you feel most energized?',
            'What time do you want to wake up consistently?'
        )
    ),
    (
        demo_cycle_id,
        'planning_break_down_tasks'::stage_type,
        'Break Down into Tasks',
        'List out the specific activities that will make up your routine',
        false,
        2,
        'Think about the sequence of activities. What needs to happen first? How long will each activity take?',
        jsonb_build_array(
            'What activities should be part of your morning?',
            'How long should each activity take?',
            'Are there any dependencies between activities?'
        )
    ),
    (
        demo_cycle_id,
        'planning_set_milestones'::stage_type,
        'Set Milestones',
        'Define checkpoints to measure your progress',
        false,
        3,
        'Create milestones for 1 week, 2 weeks, and 1 month. This helps you stay accountable.',
        jsonb_build_array(
            'What will success look like after 1 week?',
            'How will you know if the routine is working?',
            'What metrics will you track?'
        )
    );

    -- =============================================================================
    -- DEMO CYCLE 2: "Learn TypeScript Fundamentals" (Active Phase)
    -- =============================================================================

    INSERT INTO cycles (
        id,
        user_id,
        title,
        description,
        domain,
        status,
        current_stage,
        progress,
        tasks_completed,
        tasks_total,
        started_at,
        metadata
    ) VALUES (
        gen_random_uuid(),
        demo_user_id,
        'Learn TypeScript Fundamentals',
        'Master core TypeScript concepts through practice and projects',
        'Professional Development',
        'active'::cycle_status,
        'active_execute_tasks'::stage_type,
        65,
        13,
        20,
        NOW() - INTERVAL '2 weeks',
        jsonb_build_object(
            'tags', ARRAY['programming', 'typescript', 'learning'],
            'resources', ARRAY['TypeScript Handbook', 'Online courses', 'Practice projects']
        )
    )
    RETURNING id INTO demo_cycle_id;

    RAISE NOTICE 'Created demo cycle 2: %', demo_cycle_id;

    -- Create stages for the active cycle
    INSERT INTO cycle_stages (cycle_id, stage_type, title, description, is_completed, completed_at, order_index, ai_guidance) VALUES
    (
        demo_cycle_id,
        'planning_define_goals'::stage_type,
        'Define Learning Goals',
        'Understand what TypeScript skills you need',
        true,
        NOW() - INTERVAL '2 weeks',
        1,
        'Great! You''ve completed your planning. Now let''s focus on execution.'
    ),
    (
        demo_cycle_id,
        'active_execute_tasks'::stage_type,
        'Complete Learning Modules',
        'Work through TypeScript tutorials and exercises',
        false,
        null,
        2,
        'You''re making great progress! Keep up the momentum by practicing daily.'
    ),
    (
        demo_cycle_id,
        'active_track_progress'::stage_type,
        'Track Your Learning',
        'Document what you''ve learned and areas that need more practice',
        false,
        null,
        3,
        'Regular reflection helps solidify your learning. Try documenting one concept daily.'
    );

    -- =============================================================================
    -- DEMO CYCLO INTERACTIONS
    -- =============================================================================

    demo_thread_id := gen_random_uuid();

    -- User initiates conversation
    INSERT INTO cyclo_interactions (
        cycle_id,
        user_id,
        role,
        content,
        stage_type,
        intent,
        thread_id,
        metadata
    ) VALUES
    (
        demo_cycle_id,
        demo_user_id,
        'user'::interaction_role,
        'I''m feeling a bit overwhelmed with all the TypeScript concepts. Where should I focus?',
        'active_execute_tasks'::stage_type,
        'guidance',
        demo_thread_id,
        jsonb_build_object('emotion', 'overwhelmed', 'needs_support', true)
    );

    -- AI responds with guidance
    INSERT INTO cyclo_interactions (
        cycle_id,
        user_id,
        role,
        content,
        stage_type,
        intent,
        thread_id,
        model_name,
        tokens_used,
        metadata
    ) VALUES
    (
        demo_cycle_id,
        demo_user_id,
        'assistant'::interaction_role,
        'I understand learning TypeScript can feel overwhelming at first! Let''s break it down. Based on your progress, I''d suggest focusing on these three areas this week:\n\n1. **Type Annotations**: Master basic types (string, number, boolean) - this is foundational\n2. **Interfaces**: Practice defining object shapes - you''ll use this constantly\n3. **Type Inference**: Understand when TypeScript can figure out types automatically\n\nWould you like me to suggest some specific exercises for any of these topics?',
        'active_execute_tasks'::stage_type,
        'guidance',
        demo_thread_id,
        'gpt-4',
        156,
        jsonb_build_object(
            'suggestions', ARRAY['type_annotations', 'interfaces', 'type_inference'],
            'tone', 'supportive'
        )
    );

    -- Follow-up interaction
    INSERT INTO cyclo_interactions (
        cycle_id,
        user_id,
        role,
        content,
        stage_type,
        intent,
        thread_id,
        metadata
    ) VALUES
    (
        demo_cycle_id,
        demo_user_id,
        'user'::interaction_role,
        'Yes! I''d love some exercises on interfaces. That''s where I''m struggling most.',
        'active_execute_tasks'::stage_type,
        'task_request',
        demo_thread_id,
        jsonb_build_object('topic_interest', 'interfaces')
    );

    -- AI provides specific exercises
    INSERT INTO cyclo_interactions (
        cycle_id,
        user_id,
        role,
        content,
        stage_type,
        intent,
        thread_id,
        model_name,
        tokens_used,
        metadata
    ) VALUES
    (
        demo_cycle_id,
        demo_user_id,
        'assistant'::interaction_role,
        'Perfect! Here are three progressive exercises for interfaces:\n\n**Exercise 1 - Basic Shape:**\nCreate an interface for a User with properties: name, email, and age.\n\n**Exercise 2 - Optional Properties:**\nExtend your User interface to include optional properties: avatar and bio.\n\n**Exercise 3 - Nested Interfaces:**\nCreate an interface for a BlogPost that includes a nested author object (using your User interface).\n\nTry completing these in order. Once you''re comfortable, we can move to more advanced topics like interface extension and intersection types.',
        'active_execute_tasks'::stage_type,
        'task_suggestion',
        demo_thread_id,
        'gpt-4',
        203,
        jsonb_build_object(
            'exercise_count', 3,
            'difficulty', 'beginner',
            'next_topics', ARRAY['interface_extension', 'intersection_types']
        )
    );

    -- =============================================================================
    -- DEMO CYCLE 3: "Improve Public Speaking Skills" (Reflecting Phase)
    -- =============================================================================

    INSERT INTO cycles (
        id,
        user_id,
        title,
        description,
        domain,
        status,
        current_stage,
        progress,
        tasks_completed,
        tasks_total,
        started_at,
        completed_at,
        metadata
    ) VALUES (
        gen_random_uuid(),
        demo_user_id,
        'Improve Public Speaking Skills',
        'Build confidence in public speaking through practice and feedback',
        'Personal Development',
        'reflecting'::cycle_status,
        'reflecting_review_outcomes'::stage_type,
        90,
        9,
        10,
        NOW() - INTERVAL '4 weeks',
        null,
        jsonb_build_object(
            'tags', ARRAY['communication', 'confidence', 'leadership'],
            'achievements', ARRAY[
                'Gave 3 presentations at work',
                'Joined local Toastmasters club',
                'Reduced filler words by 60%'
            ]
        )
    )
    RETURNING id INTO demo_cycle_id;

    RAISE NOTICE 'Created demo cycle 3: %', demo_cycle_id;

    -- Create stages for the reflecting cycle
    INSERT INTO cycle_stages (cycle_id, stage_type, title, description, is_completed, completed_at, order_index, ai_guidance) VALUES
    (
        demo_cycle_id,
        'reflecting_review_outcomes'::stage_type,
        'Review Your Progress',
        'Look back at what you accomplished',
        true,
        NOW() - INTERVAL '2 days',
        1,
        'You''ve made significant progress! Let''s capture the key outcomes before they fade from memory.'
    ),
    (
        demo_cycle_id,
        'reflecting_identify_learnings'::stage_type,
        'Identify Key Learnings',
        'What worked well? What didn''t?',
        false,
        null,
        2,
        'Think about both successes and challenges. Both teach us valuable lessons.'
    ),
    (
        demo_cycle_id,
        'reflecting_plan_improvements'::stage_type,
        'Plan Next Steps',
        'How will you apply these learnings to your next cycle?',
        false,
        null,
        3,
        'Use your insights to design an even better growth cycle next time.'
    );

    RAISE NOTICE 'Demo data creation completed successfully!';
    RAISE NOTICE '-------------------------------------------';
    RAISE NOTICE 'Created 3 demo cycles for user: %', demo_user_id;
    RAISE NOTICE '1. "Build a Healthy Morning Routine" (Planning)';
    RAISE NOTICE '2. "Learn TypeScript Fundamentals" (Active)';
    RAISE NOTICE '3. "Improve Public Speaking Skills" (Reflecting)';
    RAISE NOTICE '-------------------------------------------';

END $$;
