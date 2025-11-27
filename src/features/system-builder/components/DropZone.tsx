'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Plus, X, Calendar, Focus } from 'lucide-react';
import { DropZone as DropZoneType, SystemItem } from '../types';
import { DraggableItem } from './DraggableItem';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  zone: DropZoneType;
  onRemoveItem?: (itemId: string, zoneId: string) => void;
  onDuplicateItem?: (itemId: string) => void;
  onEditItem?: (itemId: string) => void;
  onRemoveZone?: (zoneId: string) => void;
  showZoneActions?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  zone,
  onRemoveItem,
  onDuplicateItem,
  onEditItem,
  onRemoveZone,
  showZoneActions = true,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: zone.id,
    data: {
      type: 'zone',
      zone,
      acceptedTypes: zone.acceptedTypes,
    },
  });

  // Get zone icon based on type
  const getZoneIcon = () => {
    switch (zone.type) {
      case 'day':
        return <Calendar className="h-4 w-4" />;
      case 'focus-area':
        return <Focus className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // Check if zone is at capacity
  const isAtCapacity = zone.maxItems && zone.items.length >= zone.maxItems;

  return (
    <div
      className={cn(
        'rounded-lg border-2 border-dashed transition-all',
        isOver && !isAtCapacity && 'border-primary bg-primary/5 scale-[1.02]',
        isOver && isAtCapacity && 'border-destructive bg-destructive/5',
        !isOver && 'border-border bg-muted/30'
      )}
    >
      {/* Zone Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-primary/10 text-primary">
            {getZoneIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{zone.label}</h3>
            <p className="text-xs text-muted-foreground">
              {zone.items.length} {zone.items.length === 1 ? 'item' : 'items'}
              {zone.maxItems && ` / ${zone.maxItems} max`}
            </p>
          </div>
        </div>

        {/* Zone Actions */}
        {showZoneActions && onRemoveZone && (
          <button
            onClick={() => onRemoveZone(zone.id)}
            className="p-1 hover:bg-destructive/10 rounded transition-colors"
            title="Remove zone"
          >
            <X className="h-4 w-4 text-destructive" />
          </button>
        )}
      </div>

      {/* Drop Area */}
      <div
        ref={setNodeRef}
        className={cn(
          'min-h-[120px] p-3 space-y-2',
          isOver && 'bg-accent/50'
        )}
      >
        {zone.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 text-center">
            <Plus className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">
              Drag items here
            </p>
            {zone.acceptedTypes && zone.acceptedTypes.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Accepts: {zone.acceptedTypes.join(', ')}
              </p>
            )}
          </div>
        ) : (
          <SortableContext
            items={zone.items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {zone.items.map((item) => (
              <SortableItem
                key={item.id}
                item={item}
                zoneId={zone.id}
                onRemove={onRemoveItem}
                onDuplicate={onDuplicateItem}
                onEdit={onEditItem}
              />
            ))}
          </SortableContext>
        )}

        {/* Capacity Warning */}
        {isAtCapacity && (
          <div className="flex items-center gap-2 p-2 rounded bg-destructive/10 border border-destructive/20">
            <div className="text-xs text-destructive font-medium">
              Maximum capacity reached
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Sortable Item Wrapper
 * Allows items within a zone to be reordered
 */
interface SortableItemProps {
  item: SystemItem;
  zoneId: string;
  onRemove?: (itemId: string, zoneId: string) => void;
  onDuplicate?: (itemId: string) => void;
  onEdit?: (itemId: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  item,
  zoneId,
  onRemove,
  onDuplicate,
  onEdit,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'item',
      item,
      zoneId,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DraggableItem
        item={item}
        onRemove={onRemove ? (id) => onRemove(id, zoneId) : undefined}
        onDuplicate={onDuplicate}
        onEdit={onEdit}
        isDragging={isDragging}
      />
    </div>
  );
};

/**
 * Empty Drop Zone Template
 * Used for creating new drop zones
 */
interface EmptyDropZoneProps {
  label: string;
  description?: string;
  onClick?: () => void;
}

export const EmptyDropZone: React.FC<EmptyDropZoneProps> = ({
  label,
  description,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-8 transition-all hover:border-primary hover:bg-primary/5 hover:scale-[1.02]"
    >
      <div className="flex flex-col items-center justify-center text-center">
        <Plus className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <h3 className="font-semibold text-sm mb-1">{label}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </button>
  );
};
