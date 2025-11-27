# System Builder Feature

An interactive drag-and-drop interface for creating and organizing Growth Systems in CycleGrowth.

## Overview

The System Builder allows users to visually design their growth systems by dragging habits, goals, and resources onto a canvas organized by days of the week or focus areas.

## Features

### 🎯 Core Functionality
- **Drag-and-Drop Interface**: Built with `@dnd-kit` for smooth, accessible interactions
- **Three Item Types**:
  - **Habits**: Recurring actions with frequency, time of day, and duration
  - **Goals**: Targets with measurability metrics and progress tracking
  - **Resources**: Supporting materials (books, articles, videos, courses, tools)
- **Flexible Organization**: Organize by day of week or focus area (health, career, relationships, etc.)
- **Real-time Validation**: Immediate feedback on system completeness and quality

### ✅ Validation Rules

**Required:**
- At least 1 Goal
- At least 1 Actionable Habit
- System title and domain

**Constraints:**
- Drop zones can have max item limits
- Drop zones can restrict accepted item types
- Title max 100 characters
- Description max 500 characters (items) / 1000 characters (system)

**Warnings:**
- Unmeasurable goals
- High-priority items not scheduled
- Items not placed in zones

## Architecture

### State Management

The feature uses Zustand for global state management:

```typescript
import { useSystemBuilder } from '@/features/system-builder';

function MyComponent() {
  const {
    // State
    systemTitle,
    availableItems,
    dropZones,

    // Actions
    addHabit,
    addGoal,
    addResource,
    moveItemToZone,

    // Validation
    validation,
    canSave,
    stats,
  } = useSystemBuilder();
}
```

### Component Hierarchy

```
SystemCanvas (Main orchestrator)
├── AvailableItemsZone
│   └── DraggableItem[]
└── DropZone[]
    └── SortableItem (wraps DraggableItem)
```

### Type Safety

Fully typed with TypeScript and Zod schemas:

```typescript
import { HabitItem, GoalItem, ResourceItem } from '@/features/system-builder';

// Type guards available
import { isHabitItem, isGoalItem, isResourceItem } from '@/features/system-builder';

if (isHabitItem(item)) {
  console.log(item.frequency); // TypeScript knows this is HabitItem
}
```

## Usage

### Basic Setup

```tsx
import { SystemCanvas } from '@/features/system-builder';

export default function SystemBuilderPage() {
  return (
    <div className="container mx-auto p-6">
      <SystemCanvas
        onAddItem={() => {
          // Open modal to create new item
        }}
        onAddZone={() => {
          // Open modal to create new zone
        }}
      />
    </div>
  );
}
```

### Adding Items Programmatically

```typescript
import { useSystemBuilder } from '@/features/system-builder';

function AddHabitButton() {
  const { addHabit } = useSystemBuilder();

  const handleClick = () => {
    addHabit({
      title: 'Morning Exercise',
      description: 'Exercise for 30 minutes',
      priority: 'high',
      frequency: 'daily',
      timeOfDay: 'morning',
      estimatedDuration: 30,
    });
  };

  return <button onClick={handleClick}>Add Habit</button>;
}
```

### Creating Zone Templates

```typescript
import { useSystemBuilder } from '@/features/system-builder';

function TemplateButtons() {
  const { createWeeklySchedule, createFocusAreaZones } = useSystemBuilder();

  return (
    <div>
      <button onClick={createWeeklySchedule}>
        Create Weekly Schedule
      </button>
      <button onClick={createFocusAreaZones}>
        Create Focus Areas
      </button>
    </div>
  );
}
```

### Validation

```typescript
import { useSystemBuilderValidation } from '@/features/system-builder';

function SaveButton() {
  const { validation, canSave } = useSystemBuilderValidation();

  return (
    <div>
      <button disabled={!canSave}>
        Save System
      </button>

      {validation.errors.length > 0 && (
        <ul className="text-red-600">
          {validation.errors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      )}

      {validation.warnings.length > 0 && (
        <ul className="text-yellow-600">
          {validation.warnings.map((warning, i) => (
            <li key={i}>{warning}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Persistence with Supabase

```typescript
import { useSystemBuilder } from '@/features/system-builder';
import { createClient } from '@/lib/supabase/client';

async function saveSystem() {
  const { toCycle, markClean } = useSystemBuilder();
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Convert to Cycle format
  const cycle = toCycle(user.id);

  // Save to Supabase
  const { error } = await supabase
    .from('cycles')
    .insert(cycle);

  if (!error) {
    markClean(); // Mark state as saved
  }
}

async function loadSystem(cycleId: string) {
  const { fromCycle } = useSystemBuilder();
  const supabase = createClient();

  const { data: cycle } = await supabase
    .from('cycles')
    .select('*')
    .eq('id', cycleId)
    .single();

  if (cycle) {
    fromCycle(cycle); // Load into builder
  }
}
```

### Getting Statistics

```typescript
import { useSystemBuilderStats } from '@/features/system-builder';

function StatsPanel() {
  const stats = useSystemBuilderStats();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <div className="text-2xl font-bold">{stats.totalItems}</div>
        <div className="text-sm text-muted-foreground">Total Items</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{stats.habitCount}</div>
        <div className="text-sm text-muted-foreground">Habits</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{stats.goalCount}</div>
        <div className="text-sm text-muted-foreground">Goals</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{stats.assignedItems}</div>
        <div className="text-sm text-muted-foreground">Assigned</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{stats.unassignedItems}</div>
        <div className="text-sm text-muted-foreground">Unassigned</div>
      </div>
      <div>
        <div className="text-2xl font-bold">{stats.highPriorityItems}</div>
        <div className="text-sm text-muted-foreground">High Priority</div>
      </div>
    </div>
  );
}
```

## Testing

Run tests with:

```bash
# Unit tests (validation)
npm test -- src/features/system-builder/__tests__/validation.test.ts

# Integration tests (DnD interactions)
npm test -- src/features/system-builder/__tests__/SystemCanvas.integration.test.tsx

# All system-builder tests
npm test -- src/features/system-builder
```

## File Structure

```
src/features/system-builder/
├── components/
│   ├── DraggableItem.tsx       # Individual draggable items
│   ├── DropZone.tsx            # Drop zones with sorting
│   └── SystemCanvas.tsx        # Main canvas orchestrator
├── hooks/
│   ├── useSystemBuilder.ts     # High-level business logic
│   └── useSystemBuilderStore.ts # Zustand store
├── types/
│   └── index.ts                # Types and Zod schemas
├── __tests__/
│   ├── validation.test.ts      # Unit tests
│   └── SystemCanvas.integration.test.tsx # Integration tests
├── index.ts                    # Public API exports
└── README.md                   # This file
```

## API Reference

### Hooks

#### `useSystemBuilder()`
Main hook providing all functionality. Returns:
- **State**: `systemTitle`, `systemDescription`, `domain`, `dropZones`, `availableItems`, `isDirty`
- **Actions**: `setSystemTitle`, `addItem`, `updateItem`, `removeItem`, `duplicateItem`, `addDropZone`, etc.
- **Type-specific creators**: `addHabit`, `addGoal`, `addResource`
- **Templates**: `createWeeklySchedule`, `createFocusAreaZones`
- **Validation**: `validation`, `canSave`, `stats`
- **Persistence**: `toCycle`, `fromCycle`, `clearAll`

#### `useSystemBuilderValidation()`
Returns: `{ validation, canSave }`

#### `useSystemBuilderStats()`
Returns statistics object with counts and metrics

### Types

- `HabitItem`: Habit with frequency, timeOfDay, estimatedDuration
- `GoalItem`: Goal with measurable, metric, targetValue, currentValue
- `ResourceItem`: Resource with url, resourceType
- `DropZone`: Zone configuration with items, constraints
- `ValidationResult`: Validation errors and warnings

## Dependencies

- `@dnd-kit/core` - Core drag-and-drop functionality
- `@dnd-kit/sortable` - Sortable lists within zones
- `@dnd-kit/utilities` - Utility functions for transforms
- `zod` - Schema validation
- `zustand` - State management
- `uuid` - Unique ID generation

## Next Steps

Consider adding:
1. **Item Templates**: Pre-built habit/goal templates users can add
2. **Bulk Operations**: Select multiple items and move/delete together
3. **Undo/Redo**: History management for actions
4. **Export/Import**: Share system designs
5. **AI Suggestions**: Recommend items based on goals
6. **Analytics**: Track which items lead to best outcomes
7. **Collaboration**: Share and collaborate on system designs

## Contributing

When adding new features:
1. Update type definitions in `types/index.ts`
2. Add Zod validation schemas
3. Update store actions in `useSystemBuilderStore.ts`
4. Add business logic to `useSystemBuilder.ts`
5. Write unit tests for validation
6. Write integration tests for user interactions
7. Update this README

## License

Part of the CycleGrowth project.
