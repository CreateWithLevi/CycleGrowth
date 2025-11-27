'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { SystemItem } from '../types';
import { useSystemBuilderStore } from '../hooks/useSystemBuilderStore';
import { DraggableItem, DraggableItemOverlay } from './DraggableItem';
import { DropZone, EmptyDropZone } from './DropZone';
import { Plus, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemCanvasProps {
  className?: string;
  onAddItem?: () => void;
  onAddZone?: () => void;
}

export const SystemCanvas: React.FC<SystemCanvasProps> = ({
  className,
  onAddItem,
  onAddZone,
}) => {
  const [activeItem, setActiveItem] = useState<SystemItem | null>(null);

  const {
    dropZones,
    availableItems,
    moveItemToZone,
    moveItemToAvailable,
    reorderItemInZone,
    removeItem,
    duplicateItem,
    removeDropZone,
  } = useSystemBuilderStore();

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = active.data.current?.item as SystemItem;

    if (item) {
      setActiveItem(item);
    }
  };

  // Handle drag over (for visual feedback)
  const handleDragOver = (_event: DragOverEvent) => {
    // Can add additional logic here if needed
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const activeData = active.data.current;
    const overData = over.data.current;

    // Moving to a zone
    if (overData?.type === 'zone') {
      moveItemToZone(activeId, overId);
      return;
    }

    // Moving to available items area
    if (overId === 'available-items') {
      const sourceZoneId = activeData?.zoneId;
      if (sourceZoneId) {
        moveItemToAvailable(activeId, sourceZoneId);
      }
      return;
    }

    // Reordering within the same zone
    if (activeData?.zoneId && overData?.zoneId) {
      const activeZoneId = activeData.zoneId;
      const overZoneId = overData.zoneId;

      if (activeZoneId === overZoneId) {
        const zone = dropZones.find((z) => z.id === activeZoneId);
        if (zone) {
          const oldIndex = zone.items.findIndex((item) => item.id === activeId);
          const newIndex = zone.items.findIndex((item) => item.id === overId);

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            reorderItemInZone(activeZoneId, oldIndex, newIndex);
          }
        }
      } else {
        // Moving between zones
        moveItemToZone(activeId, overZoneId);
      }
    }
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      removeItem(itemId);
    }
  };

  const handleDuplicateItem = (itemId: string) => {
    duplicateItem(itemId);
  };

  const handleRemoveZone = (zoneId: string) => {
    if (confirm('Are you sure you want to remove this zone? Items will be moved to available items.')) {
      removeDropZone(zoneId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={cn('flex flex-col lg:flex-row gap-6', className)}>
        {/* Available Items Panel */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Available Items</h2>
              </div>
              {onAddItem && (
                <button
                  onClick={onAddItem}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              )}
            </div>

            <AvailableItemsZone
              items={availableItems}
              onRemove={handleRemoveItem}
              onDuplicate={handleDuplicateItem}
            />

            {availableItems.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  No items yet
                </p>
                {onAddItem && (
                  <button
                    onClick={onAddItem}
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Create first item
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Drop Zones Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">System Layout</h2>
            {onAddZone && (
              <button
                onClick={onAddZone}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Zone
              </button>
            )}
          </div>

          {dropZones.length === 0 ? (
            <EmptyDropZone
              label="Create Your First Zone"
              description="Add zones to organize your habits, goals, and resources"
              onClick={onAddZone}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {dropZones.map((zone) => (
                <DropZone
                  key={zone.id}
                  zone={zone}
                  onRemoveItem={handleRemoveItem}
                  onDuplicateItem={handleDuplicateItem}
                  onRemoveZone={handleRemoveZone}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeItem && <DraggableItemOverlay item={activeItem} />}
      </DragOverlay>
    </DndContext>
  );
};

interface AvailableItemsZoneProps {
  items: SystemItem[];
  onRemove?: (itemId: string) => void;
  onDuplicate?: (itemId: string) => void;
}

const AvailableItemsZone: React.FC<AvailableItemsZoneProps> = ({
  items,
  onRemove,
  onDuplicate,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'available-items',
    data: {
      type: 'available',
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'space-y-2 p-3 rounded-lg border-2 border-dashed transition-all min-h-[200px]',
        isOver ? 'border-primary bg-primary/5' : 'border-border bg-muted/30'
      )}
    >
      {items.map((item) => (
        <DraggableItem
          key={item.id}
          item={item}
          onRemove={onRemove}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
};
