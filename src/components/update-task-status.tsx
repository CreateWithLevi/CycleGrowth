"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { Check, Clock } from "lucide-react";

interface UpdateTaskStatusProps {
  taskId: string;
  currentStatus: string;
  onStatusChange?: () => void;
}

export default function UpdateTaskStatus({
  taskId,
  currentStatus,
  onStatusChange,
}: UpdateTaskStatusProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();

  const getNextStatus = (status: string) => {
    switch (status) {
      case "todo":
        return "in-progress";
      case "in-progress":
        return "completed";
      case "completed":
        return "todo";
      default:
        return "todo";
    }
  };

  const handleStatusChange = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const nextStatus = getNextStatus(currentStatus);

      const { error } = await supabase.functions.invoke(
        "supabase-functions-update-task-status",
        {
          body: {
            task_id: taskId,
            status: nextStatus,
          },
        },
      );

      if (error) throw error;

      if (onStatusChange) {
        onStatusChange();
      }
    } catch (err) {
      console.error("Error updating task status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = () => {
    switch (currentStatus) {
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return (
          <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
        );
    }
  };

  return (
    <button
      onClick={handleStatusChange}
      disabled={isUpdating}
      className={`p-1 rounded-full ${isUpdating ? "opacity-50" : "hover:bg-gray-100"} transition-colors`}
      aria-label="Update task status"
    >
      {getStatusIcon()}
    </button>
  );
}
