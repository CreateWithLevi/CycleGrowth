import { z } from 'zod';

/**
 * Item Types
 */
export type ItemType = 'habit' | 'goal' | 'resource';

/**
 * Day of Week for scheduling
 */
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

/**
 * Focus Area for categorization
 */
export type FocusArea = 'health' | 'career' | 'relationships' | 'finance' | 'learning' | 'creativity' | 'other';

/**
 * Priority levels
 */
export type Priority = 'low' | 'medium' | 'high';

/**
 * Base Draggable Item
 */
export interface DraggableItem {
  id: string;
  type: ItemType;
  title: string;
  description?: string;
  priority: Priority;
  metadata?: Record<string, unknown>;
}

/**
 * Habit Item
 */
export interface HabitItem extends DraggableItem {
  type: 'habit';
  frequency: 'daily' | 'weekly' | 'monthly';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  estimatedDuration?: number; // in minutes
}

/**
 * Goal Item
 */
export interface GoalItem extends DraggableItem {
  type: 'goal';
  targetDate?: string;
  measurable: boolean;
  metric?: string;
  targetValue?: number;
  currentValue?: number;
}

/**
 * Resource Item
 */
export interface ResourceItem extends DraggableItem {
  type: 'resource';
  url?: string;
  resourceType: 'book' | 'article' | 'video' | 'course' | 'tool' | 'other';
}

/**
 * Union type for all item types
 */
export type SystemItem = HabitItem | GoalItem | ResourceItem;

/**
 * Drop Zone Configuration
 */
export interface DropZone {
  id: string;
  label: string;
  type: 'day' | 'focus-area';
  day?: DayOfWeek;
  focusArea?: FocusArea;
  items: SystemItem[];
  maxItems?: number;
  acceptedTypes?: ItemType[];
}

/**
 * System Builder State
 */
export interface SystemBuilderState {
  systemTitle: string;
  systemDescription: string;
  domain: string;
  dropZones: DropZone[];
  availableItems: SystemItem[];
  isDirty: boolean;
}

/**
 * Validation Result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Zod Schemas for Validation
 */

// Base item schema
const baseItemSchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID format' }),
  type: z.enum(['habit', 'goal', 'resource']),
  title: z.string().min(1, { message: 'Title is required' }).max(100, { message: 'Title must be less than 100 characters' }),
  description: z.string().max(500, { message: 'Description must be less than 500 characters' }).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// Habit schema
export const habitSchema = baseItemSchema.extend({
  type: z.literal('habit'),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'anytime']).optional(),
  estimatedDuration: z.number().min(1).max(480).optional(), // 1 min to 8 hours
});

// Goal schema
export const goalSchema = baseItemSchema.extend({
  type: z.literal('goal'),
  targetDate: z.string().datetime({ message: 'Invalid datetime format' }).optional(),
  measurable: z.boolean(),
  metric: z.string().optional(),
  targetValue: z.number().optional(),
  currentValue: z.number().optional(),
});

// Resource schema
export const resourceSchema = baseItemSchema.extend({
  type: z.literal('resource'),
  url: z.string().url({ message: 'Invalid URL format' }).optional(),
  resourceType: z.enum(['book', 'article', 'video', 'course', 'tool', 'other']),
});

// Union schema for all items
export const systemItemSchema = z.discriminatedUnion('type', [
  habitSchema,
  goalSchema,
  resourceSchema,
]);

// Drop zone schema
export const dropZoneSchema = z.object({
  id: z.string().uuid({ message: 'Invalid UUID format' }),
  label: z.string().min(1, { message: 'Label is required' }),
  type: z.enum(['day', 'focus-area']),
  day: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).optional(),
  focusArea: z.enum(['health', 'career', 'relationships', 'finance', 'learning', 'creativity', 'other']).optional(),
  items: z.array(systemItemSchema),
  maxItems: z.number().positive().optional(),
  acceptedTypes: z.array(z.enum(['habit', 'goal', 'resource'])).optional(),
});

// System builder state schema
export const systemBuilderStateSchema = z.object({
  systemTitle: z.string().min(1, { message: 'System title is required' }).max(100),
  systemDescription: z.string().max(1000).optional(),
  domain: z.string().min(1, { message: 'Domain is required' }),
  dropZones: z.array(dropZoneSchema),
  availableItems: z.array(systemItemSchema),
  isDirty: z.boolean(),
});

/**
 * Custom validation rules
 */
export const validateSystemBuilder = (state: SystemBuilderState): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate using Zod schema first
  const result = systemBuilderStateSchema.safeParse(state);
  if (!result.success) {
    errors.push(...result.error.issues.map((err) => {
      const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
      return `${path}${err.message}`;
    }));
  }

  // Custom business logic validation
  // Rule 1: Must have at least 1 goal
  const allGoals = [
    ...state.availableItems.filter(item => item.type === 'goal'),
    ...state.dropZones.flatMap(zone => zone.items.filter(item => item.type === 'goal')),
  ];

  if (allGoals.length === 0) {
    errors.push('System must have at least 1 Goal');
  }

  // Rule 2: Must have at least 1 actionable habit
  const allHabits = [
    ...state.availableItems.filter(item => item.type === 'habit'),
    ...state.dropZones.flatMap(zone => zone.items.filter(item => item.type === 'habit')),
  ];

  if (allHabits.length === 0) {
    errors.push('System must have at least 1 Actionable Habit');
  }

  // Rule 3: Goals should be measurable (warning)
  const unmeasurableGoals = allGoals.filter(goal => !goal.measurable);
  if (unmeasurableGoals.length > 0) {
    warnings.push(`${unmeasurableGoals.length} goal(s) are not measurable. Consider adding metrics for better tracking.`);
  }

  // Rule 4: Check if items are distributed across drop zones (warning)
  const itemsInZones = state.dropZones.reduce((sum, zone) => sum + zone.items.length, 0);
  if (itemsInZones === 0 && (allGoals.length > 0 || allHabits.length > 0)) {
    warnings.push('No items have been placed in drop zones yet. Organize your items by day or focus area.');
  }

  // Rule 5: Check for high priority items without specific scheduling
  const highPriorityItems = state.availableItems.filter(item => item.priority === 'high');
  if (highPriorityItems.length > 0) {
    warnings.push(`${highPriorityItems.length} high priority item(s) are not scheduled. Consider assigning them to specific days or focus areas.`);
  }

  // Rule 6: Validate drop zone constraints
  state.dropZones.forEach(zone => {
    if (zone.maxItems && zone.items.length > zone.maxItems) {
      errors.push(`Drop zone "${zone.label}" exceeds maximum items limit (${zone.maxItems})`);
    }

    if (zone.acceptedTypes) {
      const invalidItems = zone.items.filter(item => !zone.acceptedTypes!.includes(item.type));
      if (invalidItems.length > 0) {
        errors.push(`Drop zone "${zone.label}" contains ${invalidItems.length} item(s) of invalid type`);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Type guards
 */
export const isHabitItem = (item: SystemItem): item is HabitItem => {
  return item.type === 'habit';
};

export const isGoalItem = (item: SystemItem): item is GoalItem => {
  return item.type === 'goal';
};

export const isResourceItem = (item: SystemItem): item is ResourceItem => {
  return item.type === 'resource';
};
