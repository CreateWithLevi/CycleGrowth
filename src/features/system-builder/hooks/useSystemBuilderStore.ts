import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  SystemBuilderState,
  SystemItem,
  DropZone,
  HabitItem,
  GoalItem,
  ResourceItem,
  ValidationResult,
  validateSystemBuilder,
  DayOfWeek,
  FocusArea,
} from '../types';

/**
 * Actions for the System Builder Store
 */
interface SystemBuilderActions {
  // System metadata
  setSystemTitle: (title: string) => void;
  setSystemDescription: (description: string) => void;
  setDomain: (domain: string) => void;

  // Item management
  addItem: (item: Omit<SystemItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<SystemItem>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (id: string) => void;

  // Drop zone management
  addDropZone: (zone: Omit<DropZone, 'id' | 'items'>) => void;
  removeDropZone: (zoneId: string) => void;
  updateDropZone: (zoneId: string, updates: Partial<DropZone>) => void;

  // Drag and drop operations
  moveItemToZone: (itemId: string, targetZoneId: string) => void;
  moveItemToAvailable: (itemId: string, sourceZoneId: string) => void;
  reorderItemInZone: (zoneId: string, oldIndex: number, newIndex: number) => void;

  // Validation
  validate: () => ValidationResult;

  // Persistence
  markClean: () => void;
  reset: () => void;
  loadState: (state: Partial<SystemBuilderState>) => void;

  // Helpers
  getItemById: (itemId: string) => SystemItem | undefined;
  getZoneById: (zoneId: string) => DropZone | undefined;
}

/**
 * Complete store type
 */
type SystemBuilderStore = SystemBuilderState & SystemBuilderActions;

/**
 * Initial state
 */
const initialState: SystemBuilderState = {
  systemTitle: '',
  systemDescription: '',
  domain: '',
  dropZones: [],
  availableItems: [],
  isDirty: false,
};

/**
 * System Builder Store using Zustand
 */
export const useSystemBuilderStore = create<SystemBuilderStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // System metadata actions
      setSystemTitle: (title) =>
        set({ systemTitle: title, isDirty: true }, false, 'setSystemTitle'),

      setSystemDescription: (description) =>
        set({ systemDescription: description, isDirty: true }, false, 'setSystemDescription'),

      setDomain: (domain) =>
        set({ domain, isDirty: true }, false, 'setDomain'),

      // Item management actions
      addItem: (item) => {
        const newItem: SystemItem = {
          ...item,
          id: uuidv4(),
        } as SystemItem;

        set(
          (state) => ({
            availableItems: [...state.availableItems, newItem],
            isDirty: true,
          }),
          false,
          'addItem'
        );
      },

      updateItem: (id, updates) =>
        set(
          (state) => ({
            availableItems: state.availableItems.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
            dropZones: state.dropZones.map((zone) => ({
              ...zone,
              items: zone.items.map((item) =>
                item.id === id ? { ...item, ...updates } : item
              ),
            })),
            isDirty: true,
          }),
          false,
          'updateItem'
        ),

      removeItem: (id) =>
        set(
          (state) => ({
            availableItems: state.availableItems.filter((item) => item.id !== id),
            dropZones: state.dropZones.map((zone) => ({
              ...zone,
              items: zone.items.filter((item) => item.id !== id),
            })),
            isDirty: true,
          }),
          false,
          'removeItem'
        ),

      duplicateItem: (id) => {
        const item = get().getItemById(id);
        if (!item) return;

        const duplicatedItem: SystemItem = {
          ...item,
          id: uuidv4(),
          title: `${item.title} (Copy)`,
        };

        set(
          (state) => ({
            availableItems: [...state.availableItems, duplicatedItem],
            isDirty: true,
          }),
          false,
          'duplicateItem'
        );
      },

      // Drop zone management actions
      addDropZone: (zone) => {
        const newZone: DropZone = {
          ...zone,
          id: uuidv4(),
          items: [],
        };

        set(
          (state) => ({
            dropZones: [...state.dropZones, newZone],
            isDirty: true,
          }),
          false,
          'addDropZone'
        );
      },

      removeDropZone: (zoneId) =>
        set(
          (state) => {
            const zone = state.dropZones.find((z) => z.id === zoneId);
            if (!zone) return state;

            return {
              dropZones: state.dropZones.filter((z) => z.id !== zoneId),
              availableItems: [...state.availableItems, ...zone.items],
              isDirty: true,
            };
          },
          false,
          'removeDropZone'
        ),

      updateDropZone: (zoneId, updates) =>
        set(
          (state) => ({
            dropZones: state.dropZones.map((zone) =>
              zone.id === zoneId ? { ...zone, ...updates } : zone
            ),
            isDirty: true,
          }),
          false,
          'updateDropZone'
        ),

      // Drag and drop operations
      moveItemToZone: (itemId, targetZoneId) =>
        set(
          (state) => {
            const targetZone = state.dropZones.find((z) => z.id === targetZoneId);
            if (!targetZone) return state;

            // Check if item is in available items
            let item = state.availableItems.find((i) => i.id === itemId);
            let newAvailableItems = state.availableItems;

            if (item) {
              // Moving from available items
              newAvailableItems = state.availableItems.filter((i) => i.id !== itemId);
            } else {
              // Moving from another zone
              const sourceZone = state.dropZones.find((z) =>
                z.items.some((i) => i.id === itemId)
              );
              if (!sourceZone) return state;

              item = sourceZone.items.find((i) => i.id === itemId);
              if (!item) return state;
            }

            // Validate drop zone constraints
            if (targetZone.maxItems && targetZone.items.length >= targetZone.maxItems) {
              console.warn(`Drop zone "${targetZone.label}" is at maximum capacity`);
              return state;
            }

            if (
              targetZone.acceptedTypes &&
              !targetZone.acceptedTypes.includes(item.type)
            ) {
              console.warn(
                `Item type "${item.type}" is not accepted in zone "${targetZone.label}"`
              );
              return state;
            }

            return {
              availableItems: newAvailableItems,
              dropZones: state.dropZones.map((zone) => {
                // Remove from source zone if it was in a zone
                if (zone.items.some((i) => i.id === itemId)) {
                  return {
                    ...zone,
                    items: zone.items.filter((i) => i.id !== itemId),
                  };
                }
                // Add to target zone
                if (zone.id === targetZoneId) {
                  return {
                    ...zone,
                    items: [...zone.items, item!],
                  };
                }
                return zone;
              }),
              isDirty: true,
            };
          },
          false,
          'moveItemToZone'
        ),

      moveItemToAvailable: (itemId, sourceZoneId) =>
        set(
          (state) => {
            const sourceZone = state.dropZones.find((z) => z.id === sourceZoneId);
            if (!sourceZone) return state;

            const item = sourceZone.items.find((i) => i.id === itemId);
            if (!item) return state;

            return {
              availableItems: [...state.availableItems, item],
              dropZones: state.dropZones.map((zone) =>
                zone.id === sourceZoneId
                  ? {
                      ...zone,
                      items: zone.items.filter((i) => i.id !== itemId),
                    }
                  : zone
              ),
              isDirty: true,
            };
          },
          false,
          'moveItemToAvailable'
        ),

      reorderItemInZone: (zoneId, oldIndex, newIndex) =>
        set(
          (state) => ({
            dropZones: state.dropZones.map((zone) => {
              if (zone.id !== zoneId) return zone;

              const items = [...zone.items];
              const [removed] = items.splice(oldIndex, 1);
              items.splice(newIndex, 0, removed);

              return { ...zone, items };
            }),
            isDirty: true,
          }),
          false,
          'reorderItemInZone'
        ),

      // Validation
      validate: () => {
        const state = get();
        return validateSystemBuilder(state);
      },

      // Persistence actions
      markClean: () => set({ isDirty: false }, false, 'markClean'),

      reset: () => set(initialState, false, 'reset'),

      loadState: (state) =>
        set(
          (current) => ({
            ...current,
            ...state,
            isDirty: false,
          }),
          false,
          'loadState'
        ),

      // Helper methods
      getItemById: (itemId) => {
        const state = get();

        // Check available items
        const availableItem = state.availableItems.find((i) => i.id === itemId);
        if (availableItem) return availableItem;

        // Check all drop zones
        for (const zone of state.dropZones) {
          const item = zone.items.find((i) => i.id === itemId);
          if (item) return item;
        }

        return undefined;
      },

      getZoneById: (zoneId) => {
        return get().dropZones.find((z) => z.id === zoneId);
      },
    }),
    { name: 'SystemBuilderStore' }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useSystemTitle = () =>
  useSystemBuilderStore((state) => state.systemTitle);

export const useSystemDescription = () =>
  useSystemBuilderStore((state) => state.systemDescription);

export const useDomain = () =>
  useSystemBuilderStore((state) => state.domain);

export const useDropZones = () =>
  useSystemBuilderStore((state) => state.dropZones);

export const useAvailableItems = () =>
  useSystemBuilderStore((state) => state.availableItems);

export const useIsDirty = () =>
  useSystemBuilderStore((state) => state.isDirty);

export const useValidation = () => {
  const validate = useSystemBuilderStore((state) => state.validate);
  return validate();
};
