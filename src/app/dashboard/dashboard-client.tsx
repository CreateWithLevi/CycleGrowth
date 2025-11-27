'use client';

import { useRouter } from 'next/navigation';
import { ActiveCycleView, type ActiveCycleData } from '@/features/dashboard/ActiveCycleView';
import { completeTask, checkInTask } from './actions';

interface DashboardClientProps {
  data: ActiveCycleData | null;
  userName: string;
}

export default function DashboardClient({ data, userName }: DashboardClientProps) {
  const router = useRouter();

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error('Failed to complete task:', error);
      // TODO: Show error toast/notification
    }
  };

  const handleCheckInTask = async (taskId: string) => {
    try {
      await checkInTask(taskId);
      router.refresh(); // Refresh the page to show updated data
    } catch (error) {
      console.error('Failed to check in task:', error);
      // TODO: Show error toast/notification
    }
  };

  const handleCreateCycle = () => {
    router.push('/dashboard/system-builder');
  };

  return (
    <ActiveCycleView
      data={data}
      userName={userName}
      onCompleteTask={handleCompleteTask}
      onCheckInTask={handleCheckInTask}
      onCreateCycle={handleCreateCycle}
    />
  );
}
