'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Target, Repeat, BookOpen, Trash2, Copy, Edit } from 'lucide-react';
import { SystemItem, isHabitItem, isGoalItem, isResourceItem } from '../types';
import { cn } from '@/lib/utils';

interface DraggableItemProps {
  item: SystemItem;
  onRemove?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onEdit?: (id: string) => void;
  showActions?: boolean;
  isDragging?: boolean;
}

export const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  onRemove,
  onDuplicate,
  onEdit,
  showActions = true,
  isDragging = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging: isDraggingLocal } = useDraggable({
    id: item.id,
    data: {
      type: 'item',
      item,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const isBeingDragged = isDragging || isDraggingLocal;

  // Get icon and color based on item type
  const getItemTypeInfo = () => {
    if (isHabitItem(item)) {
      return {
        icon: <Repeat className="h-4 w-4" />,
        color: 'bg-blue-500',
        label: 'Habit',
      };
    }
    if (isGoalItem(item)) {
      return {
        icon: <Target className="h-4 w-4" />,
        color: 'bg-green-500',
        label: 'Goal',
      };
    }
    if (isResourceItem(item)) {
      return {
        icon: <BookOpen className="h-4 w-4" />,
        color: 'bg-purple-500',
        label: 'Resource',
      };
    }
    return {
      icon: null,
      color: 'bg-gray-500',
      label: 'Unknown',
    };
  };

  const { icon, color, label } = getItemTypeInfo();

  // Get priority badge color
  const getPriorityColor = () => {
    switch (item.priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md',
        isBeingDragged && 'opacity-50 cursor-grabbing',
        !isBeingDragged && 'cursor-grab'
      )}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        {...attributes}
        className="absolute left-2 top-3 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="ml-6 space-y-2">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={cn('flex items-center justify-center w-6 h-6 rounded text-white', color)}>
                {icon}
              </div>
              <h4 className="font-medium text-sm truncate">{item.title}</h4>
            </div>

            {item.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={() => onEdit(item.id)}
                  className="p-1 hover:bg-accent rounded transition-colors"
                  title="Edit item"
                >
                  <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
              {onDuplicate && (
                <button
                  onClick={() => onDuplicate(item.id)}
                  className="p-1 hover:bg-accent rounded transition-colors"
                  title="Duplicate item"
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
              {onRemove && (
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1 hover:bg-destructive/10 rounded transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-secondary">
            {label}
          </span>

          {/* Priority badge */}
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border',
              getPriorityColor()
            )}
          >
            {item.priority}
          </span>

          {/* Type-specific metadata */}
          {isHabitItem(item) && (
            <>
              <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700">
                {item.frequency}
              </span>
              {item.timeOfDay && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700">
                  {item.timeOfDay}
                </span>
              )}
              {item.estimatedDuration && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-blue-50 text-blue-700">
                  {item.estimatedDuration}min
                </span>
              )}
            </>
          )}

          {isGoalItem(item) && (
            <>
              {item.measurable && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-700">
                  Measurable
                </span>
              )}
              {item.metric && (
                <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-700">
                  {item.metric}
                </span>
              )}
            </>
          )}

          {isResourceItem(item) && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-purple-50 text-purple-700">
              {item.resourceType}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Draggable Item Overlay for when the item is being dragged
 */
export const DraggableItemOverlay: React.FC<{ item: SystemItem }> = ({ item }) => {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg opacity-90 cursor-grabbing rotate-3 scale-105">
      <DraggableItem item={item} showActions={false} isDragging={true} />
    </div>
  );
};
