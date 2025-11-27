import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, jest } from '@jest/globals';
import { ActiveCycleView, ActiveCycleData } from '../ActiveCycleView';

// Mock the cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: any[]) => classes.filter(Boolean).join(' '),
}));

describe('ActiveCycleView', () => {
  const mockCycleData: ActiveCycleData = {
    cycle: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      user_id: 'user-123',
      title: 'Master TypeScript',
      description: 'Learn TypeScript fundamentals',
      domain: 'Professional Development',
      status: 'active',
      current_stage: 'active_execute_tasks',
      progress: 60,
      tasks_completed: 6,
      tasks_total: 10,
      started_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      completed_at: null,
      archived_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {},
    },
    tasks: [
      {
        id: 'task-1',
        system_id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Complete TypeScript tutorial',
        description: 'Finish the official TypeScript handbook',
        status: 'in-progress',
        priority: 'high',
        cycle_phase: 'execution',
        due_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'task-2',
        system_id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Build practice project',
        description: 'Create a small TypeScript project',
        status: 'todo',
        priority: 'medium',
        cycle_phase: 'execution',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    insights: [
      {
        id: 'insight-1',
        content: 'Great progress! Keep up the momentum.',
        type: 'encouragement',
      },
    ],
  };

  describe('Rendering with Data', () => {
    it('should render the dynamic header with user name', () => {
      render(<ActiveCycleView data={mockCycleData} userName="Alice" />);

      expect(screen.getByText(/Hello Alice/)).toBeInTheDocument();
    });

    it('should show suggested task in header for active cycle', () => {
      render(<ActiveCycleView data={mockCycleData} />);

      expect(screen.getByText(/Cyclo suggests we focus on/)).toBeInTheDocument();
      expect(screen.getByText(/"Complete TypeScript tutorial"/)).toBeInTheDocument();
    });

    it('should display cycle progress widget', () => {
      render(<ActiveCycleView data={mockCycleData} />);

      expect(screen.getByText('Master TypeScript')).toBeInTheDocument();
      expect(screen.getAllByText(/60%/).length).toBeGreaterThan(0);
      expect(screen.getByText(/6 \/ 10/)).toBeInTheDocument();
    });

    it('should display insights from Cyclo', () => {
      render(<ActiveCycleView data={mockCycleData} />);

      expect(screen.getByText('Insights from Cyclo')).toBeInTheDocument();
      expect(screen.getByText('Great progress! Keep up the momentum.')).toBeInTheDocument();
    });

    it('should display today\'s tasks', () => {
      render(<ActiveCycleView data={mockCycleData} />);

      expect(screen.getByText("Today's Focus")).toBeInTheDocument();
      // Task title appears in both header and task card, so use getAllByText
      expect(screen.getAllByText(/Complete TypeScript tutorial/).length).toBeGreaterThan(0);
    });

    it('should display upcoming tasks', () => {
      render(<ActiveCycleView data={mockCycleData} />);

      expect(screen.getByText('Upcoming Tasks')).toBeInTheDocument();
      expect(screen.getByText('Build practice project')).toBeInTheDocument();
    });
  });

  describe('Different Cycle Statuses', () => {
    it('should show planning message for planning status', () => {
      const planningData = {
        ...mockCycleData,
        cycle: {
          ...mockCycleData.cycle,
          status: 'planning' as const,
        },
      };

      render(<ActiveCycleView data={planningData} />);

      expect(screen.getByText(/finish planning your/)).toBeInTheDocument();
      expect(screen.getByText(/Complete your planning stages/)).toBeInTheDocument();
    });

    it('should show reflecting message for reflecting status', () => {
      const reflectingData = {
        ...mockCycleData,
        cycle: {
          ...mockCycleData.cycle,
          status: 'reflecting' as const,
        },
      };

      render(<ActiveCycleView data={reflectingData} />);

      expect(screen.getByText(/time to reflect on your/)).toBeInTheDocument();
      expect(screen.getByText(/Review your outcomes/)).toBeInTheDocument();
    });

    it('should show completed message for completed status', () => {
      const completedData = {
        ...mockCycleData,
        cycle: {
          ...mockCycleData.cycle,
          status: 'completed' as const,
        },
      };

      render(<ActiveCycleView data={completedData} />);

      expect(screen.getByText(/Congratulations on completing/)).toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no data', () => {
      render(<ActiveCycleView data={null} />);

      expect(screen.getByText('No Active Cycle')).toBeInTheDocument();
      expect(screen.getByText(/Start your growth journey/)).toBeInTheDocument();
    });

    it('should call onCreateCycle when create button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCreateCycle = jest.fn();
      render(<ActiveCycleView data={null} onCreateCycle={mockOnCreateCycle} />);

      const createButton = screen.getByText('Create Your First Cycle');
      await act(async () => {
        await user.click(createButton);
      });

      expect(mockOnCreateCycle).toHaveBeenCalled();
    });

    it('should show no tasks message when cycle has no tasks', () => {
      const noTasksData = {
        ...mockCycleData,
        tasks: [],
      };

      render(<ActiveCycleView data={noTasksData} />);

      expect(screen.getByText('No Tasks Yet')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading skeleton when isLoading is true', () => {
      const { container } = render(<ActiveCycleView data={null} isLoading={true} />);

      const loadingElements = container.querySelectorAll('.animate-pulse');
      expect(loadingElements.length).toBeGreaterThan(0);
    });
  });

  describe('Insights', () => {
    it('should show smart insight when no custom insights provided', () => {
      const noInsightsData = {
        ...mockCycleData,
        insights: [],
      };

      render(<ActiveCycleView data={noInsightsData} />);

      // Should render SmartInsightNudge with contextual message
      expect(screen.getByText(/Suggested by Cyclo/)).toBeInTheDocument();
    });

    it('should limit displayed insights to maxVisible', () => {
      const manyInsightsData = {
        ...mockCycleData,
        insights: [
          { id: '1', content: 'Insight 1', type: 'tip' as const },
          { id: '2', content: 'Insight 2', type: 'tip' as const },
          { id: '3', content: 'Insight 3', type: 'tip' as const },
        ],
      };

      render(<ActiveCycleView data={manyInsightsData} />);

      expect(screen.getByText('Insight 1')).toBeInTheDocument();
      expect(screen.getByText('Insight 2')).toBeInTheDocument();
      expect(screen.queryByText('Insight 3')).not.toBeInTheDocument(); // Max 2
    });
  });

  describe('Task Interactions', () => {
    it('should call onCompleteTask when complete button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnComplete = jest.fn();
      render(<ActiveCycleView data={mockCycleData} onCompleteTask={mockOnComplete} />);

      const completeButtons = screen.getAllByText('Complete');
      await act(async () => {
        await user.click(completeButtons[0]);
      });

      expect(mockOnComplete).toHaveBeenCalledWith('task-1');
    });

    it('should call onCheckInTask when check in button is clicked', async () => {
      const user = userEvent.setup();
      const mockOnCheckIn = jest.fn();
      const dataWithTodoTask = {
        ...mockCycleData,
        tasks: [
          {
            ...mockCycleData.tasks[1],
            status: 'todo' as const,
            due_date: new Date().toISOString(),
          },
        ],
      };

      render(<ActiveCycleView data={dataWithTodoTask} onCheckInTask={mockOnCheckIn} />);

      const checkInButton = screen.getByText('Check In');
      await act(async () => {
        await user.click(checkInButton);
      });

      expect(mockOnCheckIn).toHaveBeenCalledWith(dataWithTodoTask.tasks[0].id);
    });
  });
});
