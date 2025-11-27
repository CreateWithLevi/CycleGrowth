import { describe, it, expect } from '@jest/globals';
import {
  validateSystemBuilder,
  habitSchema,
  goalSchema,
  resourceSchema,
  systemItemSchema,
  SystemBuilderState,
  HabitItem,
  GoalItem,
  ResourceItem,
} from '../types';

describe('System Builder Validation', () => {
  describe('Item Schema Validation', () => {
    describe('Habit Schema', () => {
      it('should validate a valid habit item', () => {
        const habit = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          type: 'habit' as const,
          title: 'Morning Exercise',
          description: 'Exercise for 30 minutes',
          priority: 'high' as const,
          frequency: 'daily' as const,
          timeOfDay: 'morning' as const,
          estimatedDuration: 30,
        };

        const result = habitSchema.safeParse(habit);
        expect(result.success).toBe(true);
      });

      it('should reject habit with invalid frequency', () => {
        const habit = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          type: 'habit' as const,
          title: 'Morning Exercise',
          priority: 'high' as const,
          frequency: 'yearly', // Invalid
        };

        const result = habitSchema.safeParse(habit);
        expect(result.success).toBe(false);
      });

      it('should reject habit with duration over limit', () => {
        const habit = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          type: 'habit' as const,
          title: 'Long Activity',
          priority: 'medium' as const,
          frequency: 'daily' as const,
          estimatedDuration: 500, // Over 480 limit
        };

        const result = habitSchema.safeParse(habit);
        expect(result.success).toBe(false);
      });

      it('should accept habit without optional fields', () => {
        const habit = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          type: 'habit' as const,
          title: 'Simple Habit',
          priority: 'low' as const,
          frequency: 'weekly' as const,
        };

        const result = habitSchema.safeParse(habit);
        expect(result.success).toBe(true);
      });
    });

    describe('Goal Schema', () => {
      it('should validate a valid goal item', () => {
        const goal = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          type: 'goal' as const,
          title: 'Learn TypeScript',
          description: 'Master TypeScript fundamentals',
          priority: 'high' as const,
          measurable: true,
          metric: 'Completed modules',
          targetValue: 10,
          currentValue: 3,
        };

        const result = goalSchema.safeParse(goal);
        expect(result.success).toBe(true);
      });

      it('should accept unmeasurable goal', () => {
        const goal = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          type: 'goal' as const,
          title: 'Be Happier',
          priority: 'medium' as const,
          measurable: false,
        };

        const result = goalSchema.safeParse(goal);
        expect(result.success).toBe(true);
      });
    });

    describe('Resource Schema', () => {
      it('should validate a valid resource item', () => {
        const resource = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          type: 'resource' as const,
          title: 'TypeScript Handbook',
          description: 'Official TypeScript documentation',
          priority: 'medium' as const,
          url: 'https://www.typescriptlang.org/docs/',
          resourceType: 'book' as const,
        };

        const result = resourceSchema.safeParse(resource);
        expect(result.success).toBe(true);
      });

      it('should reject resource with invalid URL', () => {
        const resource = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          type: 'resource' as const,
          title: 'Invalid Resource',
          priority: 'low' as const,
          url: 'not-a-url',
          resourceType: 'article' as const,
        };

        const result = resourceSchema.safeParse(resource);
        expect(result.success).toBe(false);
      });
    });

    describe('System Item Union Schema', () => {
      it('should validate different item types', () => {
        const items = [
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            type: 'habit' as const,
            title: 'Habit',
            priority: 'high' as const,
            frequency: 'daily' as const,
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            type: 'goal' as const,
            title: 'Goal',
            priority: 'medium' as const,
            measurable: true,
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174003',
            type: 'resource' as const,
            title: 'Resource',
            priority: 'low' as const,
            resourceType: 'video' as const,
          },
        ];

        items.forEach(item => {
          const result = systemItemSchema.safeParse(item);
          expect(result.success).toBe(true);
        });
      });
    });
  });

  describe('System Builder State Validation', () => {
    const createValidState = (): SystemBuilderState => ({
      systemTitle: 'Test System',
      systemDescription: 'A test growth system',
      domain: 'Health',
      dropZones: [],
      availableItems: [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          type: 'goal',
          title: 'Test Goal',
          priority: 'high',
          measurable: true,
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          type: 'habit',
          title: 'Test Habit',
          priority: 'medium',
          frequency: 'daily',
        },
      ],
      isDirty: false,
    });

    it('should validate a complete valid system', () => {
      const state = createValidState();
      const result = validateSystemBuilder(state);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should require at least 1 goal', () => {
      const state = createValidState();
      state.availableItems = state.availableItems.filter(item => item.type !== 'goal');

      const result = validateSystemBuilder(state);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('System must have at least 1 Goal');
    });

    it('should require at least 1 habit', () => {
      const state = createValidState();
      state.availableItems = state.availableItems.filter(item => item.type !== 'habit');

      const result = validateSystemBuilder(state);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('System must have at least 1 Actionable Habit');
    });

    it('should warn about unmeasurable goals', () => {
      const state = createValidState();
      const goalItem = state.availableItems.find(item => item.type === 'goal') as GoalItem;
      if (goalItem) {
        goalItem.measurable = false;
      }

      const result = validateSystemBuilder(state);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('not measurable'))).toBe(true);
    });

    it('should warn about unscheduled high priority items', () => {
      const state = createValidState();
      state.availableItems.push({
        id: '123e4567-e89b-12d3-a456-426614174003',
        type: 'habit',
        title: 'Urgent Habit',
        priority: 'high',
        frequency: 'daily',
      });

      const result = validateSystemBuilder(state);

      expect(result.warnings.some(w => w.includes('high priority'))).toBe(true);
    });

    it('should validate drop zone max items constraint', () => {
      const state = createValidState();
      state.dropZones = [
        {
          id: '123e4567-e89b-12d3-a456-426614174010',
          label: 'Monday',
          type: 'day',
          day: 'monday',
          items: [
            {
              id: '123e4567-e89b-12d3-a456-426614174001',
              type: 'habit',
              title: 'Habit 1',
              priority: 'low',
              frequency: 'daily',
            },
            {
              id: '123e4567-e89b-12d3-a456-426614174002',
              type: 'habit',
              title: 'Habit 2',
              priority: 'low',
              frequency: 'daily',
            },
          ],
          maxItems: 1, // Violated
        },
      ];

      const result = validateSystemBuilder(state);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('exceeds maximum items'))).toBe(true);
    });

    it('should validate drop zone accepted types', () => {
      const state = createValidState();
      state.dropZones = [
        {
          id: '123e4567-e89b-12d3-a456-426614174010',
          label: 'Habits Only',
          type: 'focus-area',
          focusArea: 'health',
          items: [
            {
              id: '123e4567-e89b-12d3-a456-426614174001',
              type: 'goal', // Not accepted
              title: 'Goal',
              priority: 'high',
              measurable: true,
            },
          ],
          acceptedTypes: ['habit'],
        },
      ];

      const result = validateSystemBuilder(state);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('invalid type'))).toBe(true);
    });

    it('should require system title', () => {
      const state = createValidState();
      state.systemTitle = '';

      const result = validateSystemBuilder(state);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('title is required'))).toBe(true);
    });

    it('should require domain', () => {
      const state = createValidState();
      state.domain = '';

      const result = validateSystemBuilder(state);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Domain is required'))).toBe(true);
    });
  });
});
