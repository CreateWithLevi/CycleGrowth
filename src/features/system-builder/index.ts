// Components
export { DraggableItem, DraggableItemOverlay } from './components/DraggableItem';
export { DropZone, EmptyDropZone } from './components/DropZone';
export { SystemCanvas } from './components/SystemCanvas';

// Hooks
export { useSystemBuilder, useSystemBuilderValidation, useSystemBuilderStats } from './hooks/useSystemBuilder';
export {
  useSystemBuilderStore,
  useSystemTitle,
  useSystemDescription,
  useDomain,
  useDropZones,
  useAvailableItems,
  useIsDirty,
  useValidation,
} from './hooks/useSystemBuilderStore';

// Types
export type {
  ItemType,
  DayOfWeek,
  FocusArea,
  Priority,
  DraggableItem as DraggableItemType,
  HabitItem,
  GoalItem,
  ResourceItem,
  SystemItem,
  DropZone as DropZoneType,
  SystemBuilderState,
  ValidationResult,
} from './types';

export {
  habitSchema,
  goalSchema,
  resourceSchema,
  systemItemSchema,
  dropZoneSchema,
  systemBuilderStateSchema,
  validateSystemBuilder,
  isHabitItem,
  isGoalItem,
  isResourceItem,
} from './types';
