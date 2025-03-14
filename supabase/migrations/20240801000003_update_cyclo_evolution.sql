-- Update user_cyclo_evolution table to track more metrics
ALTER TABLE user_cyclo_evolution ADD COLUMN IF NOT EXISTS tasks_completed INTEGER DEFAULT 0;
ALTER TABLE user_cyclo_evolution ADD COLUMN IF NOT EXISTS reflections_created INTEGER DEFAULT 0;
ALTER TABLE user_cyclo_evolution ADD COLUMN IF NOT EXISTS knowledge_items_created INTEGER DEFAULT 0;
ALTER TABLE user_cyclo_evolution ADD COLUMN IF NOT EXISTS systems_created INTEGER DEFAULT 0;
ALTER TABLE user_cyclo_evolution ADD COLUMN IF NOT EXISTS last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create function to automatically update Cyclo stage based on user activity
CREATE OR REPLACE FUNCTION update_cyclo_stage()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate new stage based on activity metrics
  IF NEW.interactions_count >= 100 AND NEW.tasks_completed >= 50 AND NEW.reflections_created >= 20 AND NEW.knowledge_items_created >= 10 AND NEW.systems_created >= 3 THEN
    -- Stage 4: Wisdom Cyclo
    NEW.current_stage := 4;
  ELSIF NEW.interactions_count >= 50 AND NEW.tasks_completed >= 25 AND NEW.reflections_created >= 10 AND NEW.knowledge_items_created >= 5 AND NEW.systems_created >= 2 THEN
    -- Stage 3: Bloom Cyclo
    NEW.current_stage := 3;
  ELSIF NEW.interactions_count >= 20 AND NEW.tasks_completed >= 10 AND NEW.reflections_created >= 5 AND NEW.knowledge_items_created >= 2 AND NEW.systems_created >= 1 THEN
    -- Stage 2: Growth Cyclo
    NEW.current_stage := 2;
  ELSE
    -- Stage 1: Seed Cyclo (default)
    NEW.current_stage := 1;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update Cyclo stage
DROP TRIGGER IF EXISTS trigger_update_cyclo_stage ON user_cyclo_evolution;
CREATE TRIGGER trigger_update_cyclo_stage
BEFORE UPDATE ON user_cyclo_evolution
FOR EACH ROW
WHEN (OLD.interactions_count IS DISTINCT FROM NEW.interactions_count OR 
      OLD.tasks_completed IS DISTINCT FROM NEW.tasks_completed OR 
      OLD.reflections_created IS DISTINCT FROM NEW.reflections_created OR 
      OLD.knowledge_items_created IS DISTINCT FROM NEW.knowledge_items_created OR 
      OLD.systems_created IS DISTINCT FROM NEW.systems_created)
EXECUTE FUNCTION update_cyclo_stage();

-- Create function to increment activity counters
CREATE OR REPLACE FUNCTION increment_cyclo_activity()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the appropriate counter based on the activity type
  IF TG_TABLE_NAME = 'growth_tasks' AND NEW.status = 'completed' THEN
    UPDATE user_cyclo_evolution
    SET tasks_completed = tasks_completed + 1,
        interactions_count = interactions_count + 1,
        last_interaction = NOW()
    WHERE user_id = (SELECT user_id FROM growth_systems WHERE id = NEW.system_id);
  ELSIF TG_TABLE_NAME = 'reflections' THEN
    UPDATE user_cyclo_evolution
    SET reflections_created = reflections_created + 1,
        interactions_count = interactions_count + 1,
        last_interaction = NOW()
    WHERE user_id = NEW.user_id;
  ELSIF TG_TABLE_NAME = 'knowledge_items' THEN
    UPDATE user_cyclo_evolution
    SET knowledge_items_created = knowledge_items_created + 1,
        interactions_count = interactions_count + 1,
        last_interaction = NOW()
    WHERE user_id = NEW.user_id;
  ELSIF TG_TABLE_NAME = 'growth_systems' THEN
    UPDATE user_cyclo_evolution
    SET systems_created = systems_created + 1,
        interactions_count = interactions_count + 1,
        last_interaction = NOW()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for activity tracking
DROP TRIGGER IF EXISTS trigger_task_completed ON growth_tasks;
CREATE TRIGGER trigger_task_completed
AFTER UPDATE OF status ON growth_tasks
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'completed')
EXECUTE FUNCTION increment_cyclo_activity();

DROP TRIGGER IF EXISTS trigger_reflection_created ON reflections;
CREATE TRIGGER trigger_reflection_created
AFTER INSERT ON reflections
FOR EACH ROW
EXECUTE FUNCTION increment_cyclo_activity();

DROP TRIGGER IF EXISTS trigger_knowledge_created ON knowledge_items;
CREATE TRIGGER trigger_knowledge_created
AFTER INSERT ON knowledge_items
FOR EACH ROW
EXECUTE FUNCTION increment_cyclo_activity();

DROP TRIGGER IF EXISTS trigger_system_created ON growth_systems;
CREATE TRIGGER trigger_system_created
AFTER INSERT ON growth_systems
FOR EACH ROW
EXECUTE FUNCTION increment_cyclo_activity();
