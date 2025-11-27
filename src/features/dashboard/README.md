# Active Cycle Dashboard Feature

An intelligent, agentic dashboard that displays the user's active growth cycle with AI-powered insights and quick actions.

## Overview

The Active Cycle Dashboard replaces static dashboards with a dynamic, user-centric view that:
- Focuses on **User Agency** - quick actions and immediate task interaction
- Provides **Current Context** - personalized greetings and relevant task suggestions
- Delivers **AI Insights** - contextual tips from Cyclo based on progress and behavior

## Components

### ActiveCycleView

The main dashboard component that orchestrates the entire cycle view.

```tsx
import { ActiveCycleView } from '@/features/dashboard';

export default function DashboardPage({ data }: { data: ActiveCycleData }) {
  return (
    <ActiveCycleView
      data={data}
      userName="Alice"
      onCompleteTask={async (taskId) => {
        // Handle task completion
      }}
      onCheckInTask={async (taskId) => {
        // Handle task check-in
      }}
      onCreateCycle={() => {
        // Navigate to System Builder
      }}
    />
  );
}
```

**Features:**
- Dynamic header with personalized suggestions
- Different messaging for each cycle phase (planning/active/reflecting/completed)
- Automatic task organization (Today's Focus, In Progress, Upcoming)
- AI-generated insights
- Empty state with guidance

### CycleProgressWidget

Visual progress indicator showing current phase and completion status.

```tsx
import { CycleProgressWidget } from '@/features/dashboard';

<CycleProgressWidget
  status="active"
  currentStage="active_execute_tasks"
  progress={60}
  tasksCompleted={6}
  tasksTotal={10}
  title="Master TypeScript"
/>
```

**Features:**
- Circular progress ring with phase-specific colors
- Phase icons (Target, TrendingUp, Lightbulb, CheckCircle2)
- Task completion tracking
- Current stage display

**Compact Version:**
```tsx
import { CycleProgressWidgetCompact } from '@/features/dashboard';

<CycleProgressWidgetCompact
  status="active"
  progress={60}
  title="Master TypeScript"
/>
```

### ActionCard

Interactive task card with quick action buttons.

```tsx
import { ActionCard } from '@/features/dashboard';

<ActionCard
  id="task-1"
  title="Complete TypeScript tutorial"
  description="Finish the official handbook"
  status="in-progress"
  priority="high"
  dueDate={new Date().toISOString()}
  onComplete={async (id) => {
    await completeTask(id);
  }}
  onCheckIn={async (id) => {
    await startTask(id);
  }}
/>
```

**Features:**
- One-click completion
- Check-in for starting tasks
- Priority badges (high/medium/low)
- Due date with overdue warnings
- Status indicators (todo/in-progress/done)
- Loading states

**List Version:**
```tsx
import { ActionCardList } from '@/features/dashboard';

<ActionCardList
  title="Today's Focus"
  tasks={todayTasks}
  onComplete={handleComplete}
  onCheckIn={handleCheckIn}
  emptyMessage="No tasks due today"
/>
```

### InsightNudge

AI-generated tips and encouragement from Cyclo.

```tsx
import { InsightNudge } from '@/features/dashboard';

<InsightNudge
  content="Great progress! Keep up the momentum."
  type="encouragement"
  onDismiss={() => {
    // Handle dismissal
  }}
  action={{
    label: 'View Reflections',
    onClick: () => {
      // Navigate to reflections
    },
  }}
/>
```

**Insight Types:**
- `tip` - Blue, Lightbulb icon
- `encouragement` - Purple, Heart icon
- `warning` - Yellow, AlertCircle icon
- `celebration` - Green, Sparkles icon

**Smart Insight (Context-Aware):**
```tsx
import { SmartInsightNudge } from '@/features/dashboard';

<SmartInsightNudge
  progress={60}
  completedTasks={6}
  totalTasks={10}
  daysSinceStart={7}
  onDismiss={() => {}}
/>
```

Automatically generates contextual insights based on:
- Progress percentage
- Days since cycle started
- Task completion rate
- Current momentum

**List Version:**
```tsx
import { InsightNudgeList } from '@/features/dashboard';

<InsightNudgeList
  insights={[
    { id: '1', content: 'Tip 1', type: 'tip' },
    { id: '2', content: 'Tip 2', type: 'encouragement' },
  ]}
  onDismiss={(id) => {
    // Handle dismissal
  }}
  maxVisible={2}
/>
```

### EmptyState

Shown when user has no active cycle.

```tsx
import { EmptyState } from '@/features/dashboard';

<EmptyState
  onCreateCycle={() => {
    router.push('/system-builder');
  }}
/>
```

**Features:**
- Prominent call-to-action
- Feature highlights
- Welcoming design

**Compact Version:**
```tsx
import { EmptyStateCompact } from '@/features/dashboard';

<EmptyStateCompact onCreateCycle={handleCreate} />
```

## Reusable UI Components

### ProgressRing

SVG-based circular progress indicator (located in `src/components/ui/`).

```tsx
import { ProgressRing } from '@/components/ui/progress-ring';

// Basic usage
<ProgressRing
  progress={75}
  size={120}
  strokeWidth={12}
  progressColor="hsl(var(--primary))"
  showPercentage
/>

// With custom label
<ProgressRing
  progress={60}
  label={
    <div>
      <Icon className="h-6 w-6" />
      <span>Active</span>
    </div>
  }
/>
```

**Multi-Segment Progress Ring:**
```tsx
import { MultiSegmentProgressRing } from '@/components/ui/progress-ring';

<MultiSegmentProgressRing
  segments={[
    { progress: 30, color: 'hsl(var(--chart-1))', label: 'Planning' },
    { progress: 50, color: 'hsl(var(--chart-2))', label: 'Executing' },
    { progress: 20, color: 'hsl(var(--chart-3))', label: 'Reflecting' },
  ]}
  size={140}
  label={<span>100%</span>}
/>
```

## Data Fetching

### Server-Side (Server Components)

```tsx
import { fetchActiveCycle } from '@/features/dashboard';

export default async function DashboardPage() {
  const data = await fetchActiveCycle();

  return <ActiveCycleView data={data} />;
}
```

### Client-Side (Client Components)

```tsx
'use client';

import { useEffect, useState } from 'react';
import { fetchActiveCycleClient, type ActiveCycleData } from '@/features/dashboard';

export default function DashboardClient() {
  const [data, setData] = useState<ActiveCycleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveCycleClient().then((result) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return <ActiveCycleView data={data} isLoading={loading} />;
}
```

## AI Insight Generation

The dashboard includes built-in insight generation based on cycle metrics:

**Automatic Insights:**
1. **Overdue Tasks Warning** - When tasks are past due
2. **High Priority Focus** - Suggests focusing on high-priority items
3. **Milestone Celebrations** - At 25%, 50%, 75% completion
4. **Weekly Reflection Reminder** - Every 7 days
5. **Planning Guidance** - During planning phase

**Custom Insights:**
Pass your own insights to override auto-generation:

```tsx
const data = {
  cycle,
  tasks,
  insights: [
    {
      id: 'custom-1',
      content: 'Based on your reflections, consider adjusting your approach',
      type: 'tip',
    },
  ],
};

<ActiveCycleView data={data} />
```

## Dynamic Header Messages

The header adapts based on cycle status and context:

**Planning Phase:**
> "Hello Alice, let's finish planning your "Master TypeScript" cycle."

**Active Phase (with suggested task):**
> "Hello Bob, Cyclo suggests we focus on "Complete Tutorial" today based on your goals."

**Reflecting Phase:**
> "Hello Carol, time to reflect on your "Fitness Journey" cycle."

**Completed Phase:**
> "Congratulations on completing this cycle! Ready to start a new one?"

## Task Organization

Tasks are automatically organized into sections:

1. **Today's Focus** - Tasks due today
2. **In Progress** - Tasks currently being worked on
3. **Upcoming Tasks** - Future tasks (max 5 displayed)

Tasks without due dates are included in "Upcoming Tasks".

## Testing

Run tests with:

```bash
# Dashboard tests
npm test -- src/features/dashboard/__tests__

# Specific test file
npm test -- src/features/dashboard/__tests__/ActiveCycleView.test.tsx
```

**Test Coverage:**
- ✅ Empty state rendering
- ✅ Different cycle statuses (planning, active, reflecting, completed)
- ✅ Task interactions (complete, check-in)
- ✅ Insight rendering and dismissal
- ✅ Loading states
- ✅ Dynamic header messages
- ✅ Callback execution

## Styling

All components use Tailwind CSS with support for:
- Dark mode (via CSS variables)
- Custom color schemes
- Responsive layouts
- Smooth animations

**CSS Variables Used:**
- `--primary` - Primary brand color
- `--muted` - Muted background color
- `--muted-foreground` - Muted text color
- `--destructive` - Destructive action color
- `--chart-1` through `--chart-4` - Chart colors for phases

## File Structure

```
src/features/dashboard/
├── components/
│   ├── ActionCard.tsx          # Task interaction cards
│   ├── CycleProgressWidget.tsx # Progress visualization
│   ├── EmptyState.tsx          # No active cycle state
│   └── InsightNudge.tsx        # AI insights
├── utils/
│   └── fetchActiveCycle.ts     # Data fetching utilities
├── __tests__/
│   └── ActiveCycleView.test.tsx # Component tests
├── ActiveCycleView.tsx         # Main dashboard component
├── index.ts                    # Public API
└── README.md                   # This file

src/components/ui/
└── progress-ring.tsx           # Reusable progress indicator

src/lib/supabase/
└── server.ts                   # Server-side Supabase client
```

## API Reference

### Types

```typescript
// Main data structure
interface ActiveCycleData {
  cycle: Cycle;
  tasks: GrowthTask[];
  insights?: Array<{
    id: string;
    content: string;
    type?: InsightType;
  }>;
}

// Insight types
type InsightType = 'tip' | 'encouragement' | 'warning' | 'celebration';

// Cycle status
type CycleStatus = 'planning' | 'active' | 'reflecting' | 'completed' | 'archived';

// Task status
type TaskStatus = 'todo' | 'in-progress' | 'done';

// Task priority
type TaskPriority = 'low' | 'medium' | 'high';
```

### Functions

```typescript
// Fetch active cycle (server-side)
function fetchActiveCycle(): Promise<ActiveCycleData | null>

// Fetch active cycle (client-side)
function fetchActiveCycleClient(): Promise<ActiveCycleData | null>

// Fetch most recent completed cycle
function fetchRecentCompletedCycle(): Promise<Cycle | null>
```

## Integration Example

Complete example integrating with Next.js App Router:

```tsx
// app/dashboard/page.tsx
import { fetchActiveCycle, ActiveCycleView } from '@/features/dashboard';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const data = await fetchActiveCycle();

  async function handleComplete(taskId: string) {
    'use server';
    // Update task status in database
  }

  async function handleCheckIn(taskId: string) {
    'use server';
    // Update task status to in-progress
  }

  function handleCreateCycle() {
    redirect('/system-builder');
  }

  return (
    <div className="container mx-auto py-8">
      <ActiveCycleView
        data={data}
        userName={data?.cycle?.metadata?.userName || 'there'}
        onCompleteTask={handleComplete}
        onCheckInTask={handleCheckIn}
        onCreateCycle={handleCreateCycle}
      />
    </div>
  );
}
```

## Roadmap

Potential enhancements:
1. **Real-time Updates** - WebSocket integration for live progress updates
2. **Streak Tracking** - Display consecutive days of task completion
3. **Analytics Dashboard** - Detailed insights and charts
4. **Task Filtering** - Filter by priority, status, or tags
5. **Bulk Actions** - Select and complete multiple tasks at once
6. **Voice Commands** - "Complete task" voice integration
7. **Mobile App** - Native mobile experience
8. **Gamification** - Points, badges, and achievements

## Contributing

When extending the dashboard:
1. Add new components to `components/` directory
2. Update `index.ts` with new exports
3. Write tests for new functionality
4. Update this README with usage examples
5. Follow existing patterns for consistency

## License

Part of the CycleGrowth project.
