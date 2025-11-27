import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from '@jest/globals';
import { SystemCanvas } from '../components/SystemCanvas';
import { useSystemBuilderStore } from '../hooks/useSystemBuilderStore';

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('SystemCanvas Integration Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    useSystemBuilderStore.getState().reset();
  });

  describe('Basic Rendering', () => {
    it('should render empty state with no items', () => {
      render(<SystemCanvas />);

      expect(screen.getByText('Available Items')).toBeInTheDocument();
      expect(screen.getByText('System Layout')).toBeInTheDocument();
      expect(screen.getByText('No items yet')).toBeInTheDocument();
    });

    it('should render available items', () => {
      const { addItem } = useSystemBuilderStore.getState();

      addItem({
        type: 'habit',
        title: 'Morning Exercise',
        priority: 'high',
        frequency: 'daily',
      });

      addItem({
        type: 'goal',
        title: 'Learn TypeScript',
        priority: 'medium',
        measurable: true,
      });

      render(<SystemCanvas />);

      expect(screen.getByText('Morning Exercise')).toBeInTheDocument();
      expect(screen.getByText('Learn TypeScript')).toBeInTheDocument();
    });

    it('should render drop zones', () => {
      const { addDropZone } = useSystemBuilderStore.getState();

      addDropZone({
        label: 'Monday',
        type: 'day',
        day: 'monday',
      });

      addDropZone({
        label: 'Health & Wellness',
        type: 'focus-area',
        focusArea: 'health',
      });

      render(<SystemCanvas />);

      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('Health & Wellness')).toBeInTheDocument();
    });
  });

  describe('Item Management', () => {
    it('should display item details correctly', () => {
      const { addItem } = useSystemBuilderStore.getState();

      addItem({
        type: 'habit',
        title: 'Morning Exercise',
        description: 'Exercise for 30 minutes',
        priority: 'high',
        frequency: 'daily',
        timeOfDay: 'morning',
        estimatedDuration: 30,
      });

      render(<SystemCanvas />);

      expect(screen.getByText('Morning Exercise')).toBeInTheDocument();
      expect(screen.getByText('Exercise for 30 minutes')).toBeInTheDocument();
      expect(screen.getByText('high')).toBeInTheDocument();
      expect(screen.getByText('daily')).toBeInTheDocument();
      expect(screen.getByText('morning')).toBeInTheDocument();
      expect(screen.getByText('30min')).toBeInTheDocument();
    });

    it('should remove item when remove button is clicked', async () => {
      const user = userEvent.setup();
      const { addItem } = useSystemBuilderStore.getState();

      addItem({
        type: 'habit',
        title: 'Morning Exercise',
        priority: 'high',
        frequency: 'daily',
      });

      // Mock window.confirm
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(<SystemCanvas />);

      const item = screen.getByText('Morning Exercise');
      expect(item).toBeInTheDocument();

      // Find and click the remove button (trash icon)
      const itemContainer = item.closest('.group');
      const removeButton = itemContainer?.querySelector('button[title="Remove item"]');

      if (removeButton) {
        await user.click(removeButton);
      }

      await waitFor(() => {
        expect(screen.queryByText('Morning Exercise')).not.toBeInTheDocument();
      });

      confirmSpy.mockRestore();
    });

    it('should duplicate item when duplicate button is clicked', async () => {
      const user = userEvent.setup();
      const { addItem } = useSystemBuilderStore.getState();

      addItem({
        type: 'habit',
        title: 'Morning Exercise',
        priority: 'high',
        frequency: 'daily',
      });

      render(<SystemCanvas />);

      // Find and click the duplicate button (copy icon)
      const itemContainer = screen.getByText('Morning Exercise').closest('.group');
      const duplicateButton = itemContainer?.querySelector('button[title="Duplicate item"]');

      if (duplicateButton) {
        await user.click(duplicateButton);
      }

      await waitFor(() => {
        const items = screen.getAllByText(/Morning Exercise/);
        expect(items.length).toBe(2);
        expect(screen.getByText('Morning Exercise (Copy)')).toBeInTheDocument();
      });
    });
  });

  describe('Drop Zone Management', () => {
    it('should show empty state for empty drop zone', () => {
      const { addDropZone } = useSystemBuilderStore.getState();

      addDropZone({
        label: 'Monday',
        type: 'day',
        day: 'monday',
      });

      render(<SystemCanvas />);

      expect(screen.getByText('Drag items here')).toBeInTheDocument();
      expect(screen.getByText('0 items')).toBeInTheDocument();
    });

    it('should show item count in drop zone header', () => {
      const { addDropZone, addItem, moveItemToZone } = useSystemBuilderStore.getState();

      // Create a zone
      addDropZone({
        label: 'Monday',
        type: 'day',
        day: 'monday',
      });

      const zoneId = useSystemBuilderStore.getState().dropZones[0].id;

      // Add items
      addItem({
        type: 'habit',
        title: 'Exercise',
        priority: 'high',
        frequency: 'daily',
      });

      addItem({
        type: 'habit',
        title: 'Meditate',
        priority: 'medium',
        frequency: 'daily',
      });

      const items = useSystemBuilderStore.getState().availableItems;

      // Move items to zone
      moveItemToZone(items[0].id, zoneId);
      moveItemToZone(items[1].id, zoneId);

      render(<SystemCanvas />);

      expect(screen.getByText('2 items')).toBeInTheDocument();
    });

    it('should remove drop zone when remove button is clicked', async () => {
      const user = userEvent.setup();
      const { addDropZone } = useSystemBuilderStore.getState();

      addDropZone({
        label: 'Monday',
        type: 'day',
        day: 'monday',
      });

      // Mock window.confirm
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(<SystemCanvas />);

      expect(screen.getByText('Monday')).toBeInTheDocument();

      // Find and click the remove zone button
      const zoneHeader = screen.getByText('Monday').closest('div');
      const removeButton = zoneHeader?.querySelector('button[title="Remove zone"]');

      if (removeButton) {
        await user.click(removeButton);
      }

      await waitFor(() => {
        expect(screen.queryByText('Monday')).not.toBeInTheDocument();
      });

      confirmSpy.mockRestore();
    });

    it('should move items back to available when zone is removed', async () => {
      const user = userEvent.setup();
      const { addDropZone, addItem, moveItemToZone } = useSystemBuilderStore.getState();

      // Create zone
      addDropZone({
        label: 'Monday',
        type: 'day',
        day: 'monday',
      });

      const zoneId = useSystemBuilderStore.getState().dropZones[0].id;

      // Add item
      addItem({
        type: 'habit',
        title: 'Exercise',
        priority: 'high',
        frequency: 'daily',
      });

      const itemId = useSystemBuilderStore.getState().availableItems[0].id;

      // Move to zone
      moveItemToZone(itemId, zoneId);

      // Mock window.confirm
      const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);

      render(<SystemCanvas />);

      // Verify item is in zone
      const state = useSystemBuilderStore.getState();
      expect(state.dropZones[0].items).toHaveLength(1);
      expect(state.availableItems).toHaveLength(0);

      // Remove zone
      const zoneHeader = screen.getByText('Monday').closest('div');
      const removeButton = zoneHeader?.querySelector('button[title="Remove zone"]');

      if (removeButton) {
        await user.click(removeButton);
      }

      await waitFor(() => {
        const newState = useSystemBuilderStore.getState();
        expect(newState.dropZones).toHaveLength(0);
        expect(newState.availableItems).toHaveLength(1);
        expect(newState.availableItems[0].title).toBe('Exercise');
      });

      confirmSpy.mockRestore();
    });
  });

  describe('Drag and Drop Simulation', () => {
    it('should move item from available to drop zone', () => {
      const { addDropZone, addItem, moveItemToZone } = useSystemBuilderStore.getState();

      // Create zone
      addDropZone({
        label: 'Monday',
        type: 'day',
        day: 'monday',
      });

      const zoneId = useSystemBuilderStore.getState().dropZones[0].id;

      // Add item
      addItem({
        type: 'habit',
        title: 'Exercise',
        priority: 'high',
        frequency: 'daily',
      });

      const itemId = useSystemBuilderStore.getState().availableItems[0].id;

      // Simulate drag and drop
      moveItemToZone(itemId, zoneId);

      render(<SystemCanvas />);

      const state = useSystemBuilderStore.getState();

      expect(state.availableItems).toHaveLength(0);
      expect(state.dropZones[0].items).toHaveLength(1);
      expect(state.dropZones[0].items[0].title).toBe('Exercise');
    });

    it('should move item back from zone to available', () => {
      const { addDropZone, addItem, moveItemToZone, moveItemToAvailable } = useSystemBuilderStore.getState();

      // Setup
      addDropZone({
        label: 'Monday',
        type: 'day',
        day: 'monday',
      });

      const zoneId = useSystemBuilderStore.getState().dropZones[0].id;

      addItem({
        type: 'habit',
        title: 'Exercise',
        priority: 'high',
        frequency: 'daily',
      });

      const itemId = useSystemBuilderStore.getState().availableItems[0].id;

      // Move to zone
      moveItemToZone(itemId, zoneId);

      // Move back
      moveItemToAvailable(itemId, zoneId);

      render(<SystemCanvas />);

      const state = useSystemBuilderStore.getState();

      expect(state.availableItems).toHaveLength(1);
      expect(state.availableItems[0].title).toBe('Exercise');
      expect(state.dropZones[0].items).toHaveLength(0);
    });

    it('should respect max items constraint', () => {
      const { addDropZone, addItem, moveItemToZone } = useSystemBuilderStore.getState();

      // Create zone with max 1 item
      addDropZone({
        label: 'Limited Zone',
        type: 'day',
        day: 'monday',
        maxItems: 1,
      });

      const zoneId = useSystemBuilderStore.getState().dropZones[0].id;

      // Add two items
      addItem({
        type: 'habit',
        title: 'Exercise',
        priority: 'high',
        frequency: 'daily',
      });

      addItem({
        type: 'habit',
        title: 'Meditate',
        priority: 'medium',
        frequency: 'daily',
      });

      const items = useSystemBuilderStore.getState().availableItems;

      // Move first item (should succeed)
      moveItemToZone(items[0].id, zoneId);

      let state = useSystemBuilderStore.getState();
      expect(state.dropZones[0].items).toHaveLength(1);

      // Try to move second item (should fail due to max constraint)
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      moveItemToZone(items[1].id, zoneId);

      state = useSystemBuilderStore.getState();
      expect(state.dropZones[0].items).toHaveLength(1); // Still only 1 item
      expect(state.availableItems).toHaveLength(1); // Second item still available

      consoleSpy.mockRestore();
    });

    it('should respect accepted types constraint', () => {
      const { addDropZone, addItem, moveItemToZone } = useSystemBuilderStore.getState();

      // Create zone that only accepts habits
      addDropZone({
        label: 'Habits Only',
        type: 'focus-area',
        focusArea: 'health',
        acceptedTypes: ['habit'],
      });

      const zoneId = useSystemBuilderStore.getState().dropZones[0].id;

      // Add a goal
      addItem({
        type: 'goal',
        title: 'Learn TypeScript',
        priority: 'high',
        measurable: true,
      });

      const itemId = useSystemBuilderStore.getState().availableItems[0].id;

      // Try to move goal to habits-only zone (should fail)
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      moveItemToZone(itemId, zoneId);

      const state = useSystemBuilderStore.getState();
      expect(state.dropZones[0].items).toHaveLength(0); // Item not added
      expect(state.availableItems).toHaveLength(1); // Item still available

      consoleSpy.mockRestore();
    });
  });

  describe('Callbacks', () => {
    it('should call onAddItem when add item button is clicked', async () => {
      const user = userEvent.setup();
      const mockAddItem = jest.fn();

      render(<SystemCanvas onAddItem={mockAddItem} />);

      const addButton = screen.getAllByText(/Add/)[0];
      await user.click(addButton);

      expect(mockAddItem).toHaveBeenCalled();
    });

    it('should call onAddZone when add zone button is clicked', async () => {
      const user = userEvent.setup();
      const mockAddZone = jest.fn();

      render(<SystemCanvas onAddZone={mockAddZone} />);

      const addButton = screen.getByText('Add Zone');
      await user.click(addButton);

      expect(mockAddZone).toHaveBeenCalled();
    });
  });
});
