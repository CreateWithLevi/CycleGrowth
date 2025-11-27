import { useCallback, useMemo } from 'react';
import { useSystemBuilderStore } from './useSystemBuilderStore';
import { ValidationResult, SystemItem, HabitItem, GoalItem, ResourceItem } from '../types';
import { Database } from '@/types/supabase';

type Cycle = Database['public']['Tables']['cycles']['Insert'];

/**
 * Custom hook that provides high-level operations for the System Builder
 * This hook wraps the Zustand store and adds business logic
 */
export const useSystemBuilder = () => {
  const store = useSystemBuilderStore();

  /**
   * Validation with memoization
   */
  const validation = useMemo<ValidationResult>(() => {
    return store.validate();
  }, [
    store.systemTitle,
    store.systemDescription,
    store.domain,
    store.dropZones,
    store.availableItems,
  ]);

  /**
   * Check if the system can be saved
   */
  const canSave = useMemo(() => {
    return validation.isValid && store.isDirty;
  }, [validation.isValid, store.isDirty]);

  /**
   * Get statistics about the system
   */
  const stats = useMemo(() => {
    const allItems = [
      ...store.availableItems,
      ...store.dropZones.flatMap(zone => zone.items),
    ];

    const habitCount = allItems.filter(item => item.type === 'habit').length;
    const goalCount = allItems.filter(item => item.type === 'goal').length;
    const resourceCount = allItems.filter(item => item.type === 'resource').length;

    const assignedItems = store.dropZones.reduce((sum, zone) => sum + zone.items.length, 0);
    const unassignedItems = store.availableItems.length;

    const highPriorityItems = allItems.filter(item => item.priority === 'high').length;
    const mediumPriorityItems = allItems.filter(item => item.priority === 'medium').length;
    const lowPriorityItems = allItems.filter(item => item.priority === 'low').length;

    return {
      totalItems: allItems.length,
      habitCount,
      goalCount,
      resourceCount,
      assignedItems,
      unassignedItems,
      highPriorityItems,
      mediumPriorityItems,
      lowPriorityItems,
      zoneCount: store.dropZones.length,
    };
  }, [store.availableItems, store.dropZones]);

  /**
   * Add a habit item
   */
  const addHabit = useCallback((habit: Omit<HabitItem, 'id' | 'type'>) => {
    store.addItem({
      ...habit,
      type: 'habit',
    });
  }, [store]);

  /**
   * Add a goal item
   */
  const addGoal = useCallback((goal: Omit<GoalItem, 'id' | 'type'>) => {
    store.addItem({
      ...goal,
      type: 'goal',
    });
  }, [store]);

  /**
   * Add a resource item
   */
  const addResource = useCallback((resource: Omit<ResourceItem, 'id' | 'type'>) => {
    store.addItem({
      ...resource,
      type: 'resource',
    });
  }, [store]);

  /**
   * Create a weekly schedule (7 day zones)
   */
  const createWeeklySchedule = useCallback(() => {
    const days: Array<{ day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', label: string }> = [
      { day: 'monday', label: 'Monday' },
      { day: 'tuesday', label: 'Tuesday' },
      { day: 'wednesday', label: 'Wednesday' },
      { day: 'thursday', label: 'Thursday' },
      { day: 'friday', label: 'Friday' },
      { day: 'saturday', label: 'Saturday' },
      { day: 'sunday', label: 'Sunday' },
    ];

    days.forEach(({ day, label }) => {
      store.addDropZone({
        label,
        type: 'day',
        day,
      });
    });
  }, [store]);

  /**
   * Create focus area zones
   */
  const createFocusAreaZones = useCallback(() => {
    const focusAreas: Array<{ area: 'health' | 'career' | 'relationships' | 'finance' | 'learning' | 'creativity', label: string }> = [
      { area: 'health', label: 'Health & Wellness' },
      { area: 'career', label: 'Career & Work' },
      { area: 'relationships', label: 'Relationships' },
      { area: 'finance', label: 'Finance' },
      { area: 'learning', label: 'Learning' },
      { area: 'creativity', label: 'Creativity' },
    ];

    focusAreas.forEach(({ area, label }) => {
      store.addDropZone({
        label,
        type: 'focus-area',
        focusArea: area,
      });
    });
  }, [store]);

  /**
   * Convert the system builder state to a Cycle for saving to Supabase
   */
  const toCycle = useCallback((userId: string): Cycle => {
    // Gather all items
    const allItems = [
      ...store.availableItems,
      ...store.dropZones.flatMap(zone => zone.items),
    ];

    // Calculate initial tasks_total based on habits and goals
    const tasks_total = allItems.filter(
      item => item.type === 'habit' || item.type === 'goal'
    ).length;

    return {
      user_id: userId,
      title: store.systemTitle,
      description: store.systemDescription || null,
      domain: store.domain,
      status: 'planning',
      current_stage: 'planning_define_goals',
      progress: 0,
      tasks_completed: 0,
      tasks_total,
      started_at: new Date().toISOString(),
      metadata: {
        dropZones: store.dropZones.map(zone => ({
          id: zone.id,
          label: zone.label,
          type: zone.type,
          day: zone.day,
          focusArea: zone.focusArea,
          itemIds: zone.items.map(item => item.id),
        })),
        items: allItems,
      },
    };
  }, [store]);

  /**
   * Load a cycle into the system builder
   */
  const fromCycle = useCallback((cycle: Database['public']['Tables']['cycles']['Row']) => {
    const metadata = cycle.metadata as any;

    store.loadState({
      systemTitle: cycle.title,
      systemDescription: cycle.description || '',
      domain: cycle.domain,
      dropZones: metadata?.dropZones?.map((zone: any) => ({
        id: zone.id,
        label: zone.label,
        type: zone.type,
        day: zone.day,
        focusArea: zone.focusArea,
        items: zone.itemIds
          ?.map((itemId: string) => metadata.items?.find((item: SystemItem) => item.id === itemId))
          .filter(Boolean) || [],
      })) || [],
      availableItems: metadata?.items?.filter((item: SystemItem) => {
        // Only include items not in any zone
        return !metadata?.dropZones?.some((zone: any) =>
          zone.itemIds?.includes(item.id)
        );
      }) || [],
      isDirty: false,
    });
  }, [store]);

  /**
   * Clear all data and start fresh
   */
  const clearAll = useCallback(() => {
    if (store.isDirty) {
      if (!confirm('You have unsaved changes. Are you sure you want to clear everything?')) {
        return false;
      }
    }
    store.reset();
    return true;
  }, [store]);

  return {
    // State
    systemTitle: store.systemTitle,
    systemDescription: store.systemDescription,
    domain: store.domain,
    dropZones: store.dropZones,
    availableItems: store.availableItems,
    isDirty: store.isDirty,

    // Actions
    setSystemTitle: store.setSystemTitle,
    setSystemDescription: store.setSystemDescription,
    setDomain: store.setDomain,
    addItem: store.addItem,
    updateItem: store.updateItem,
    removeItem: store.removeItem,
    duplicateItem: store.duplicateItem,
    addDropZone: store.addDropZone,
    removeDropZone: store.removeDropZone,
    updateDropZone: store.updateDropZone,
    moveItemToZone: store.moveItemToZone,
    moveItemToAvailable: store.moveItemToAvailable,
    reorderItemInZone: store.reorderItemInZone,
    markClean: store.markClean,
    reset: store.reset,
    loadState: store.loadState,
    getItemById: store.getItemById,
    getZoneById: store.getZoneById,

    // Type-specific item creation
    addHabit,
    addGoal,
    addResource,

    // Template actions
    createWeeklySchedule,
    createFocusAreaZones,

    // Validation
    validation,
    canSave,
    stats,

    // Persistence helpers
    toCycle,
    fromCycle,
    clearAll,
  };
};

/**
 * Hook to get just the validation state
 */
export const useSystemBuilderValidation = () => {
  const { validation, canSave } = useSystemBuilder();
  return { validation, canSave };
};

/**
 * Hook to get just the stats
 */
export const useSystemBuilderStats = () => {
  const { stats } = useSystemBuilder();
  return stats;
};
