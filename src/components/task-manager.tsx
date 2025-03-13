"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Check, Clock, Plus, X, Calendar, Tag, ArrowRight } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
  tags: string[];
  cyclePhase: "planning" | "execution" | "analysis" | "improvement";
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Define leadership skills to develop",
      description:
        "Research and list the specific leadership skills I want to focus on",
      dueDate: "2023-10-15",
      priority: "high",
      status: "completed",
      tags: ["research", "planning"],
      cyclePhase: "planning",
    },
    {
      id: "2",
      title: "Create presentation outline",
      description: "Develop a structure for my first practice presentation",
      dueDate: "2023-10-18",
      priority: "medium",
      status: "in-progress",
      tags: ["communication", "planning"],
      cyclePhase: "planning",
    },
    {
      id: "3",
      title: "Schedule feedback sessions",
      description:
        "Arrange meetings with mentors for feedback on communication style",
      dueDate: "2023-10-20",
      priority: "medium",
      status: "todo",
      tags: ["feedback", "planning"],
      cyclePhase: "planning",
    },
    {
      id: "4",
      title: "Practice presentation delivery",
      description:
        "Rehearse presentation with focus on body language and voice modulation",
      dueDate: "2023-10-25",
      priority: "high",
      status: "todo",
      tags: ["practice", "communication"],
      cyclePhase: "execution",
    },
    {
      id: "5",
      title: "Record and analyze speech patterns",
      description: "Record practice sessions and analyze speaking patterns",
      dueDate: "2023-10-28",
      priority: "medium",
      status: "todo",
      tags: ["analysis", "communication"],
      cyclePhase: "analysis",
    },
  ]);

  const [activeTab, setActiveTab] = useState<string>("all");
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    tags: [],
    cyclePhase: "planning",
  });
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTag, setNewTag] = useState("");

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (activeTab === "today") {
      const today = new Date().toISOString().split("T")[0];
      return task.dueDate === today;
    }
    if (activeTab === "upcoming") {
      const today = new Date().toISOString().split("T")[0];
      return task.dueDate && task.dueDate > today;
    }
    if (activeTab === "completed") return task.status === "completed";
    return task.cyclePhase === activeTab;
  });

  const handleStatusChange = (taskId: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const newStatus =
            task.status === "todo"
              ? "in-progress"
              : task.status === "in-progress"
                ? "completed"
                : "todo";
          return { ...task, status: newStatus };
        }
        return task;
      }),
    );
  };

  const handleAddTag = () => {
    if (newTag.trim() && !newTask.tags?.includes(newTag.trim())) {
      setNewTask({
        ...newTask,
        tags: [...(newTask.tags || []), newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleCreateTask = () => {
    if (!newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority || "medium",
      status: newTask.status || "todo",
      tags: newTask.tags || [],
      cyclePhase: newTask.cyclePhase || "planning",
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      tags: [],
      cyclePhase: "planning",
    });
    setShowNewTaskForm(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "planning":
        return "text-purple-600";
      case "execution":
        return "text-blue-600";
      case "analysis":
        return "text-yellow-600";
      case "improvement":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Task Manager</CardTitle>
        <Button
          onClick={() => setShowNewTaskForm(!showNewTaskForm)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </CardHeader>
      <CardContent>
        {showNewTaskForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Create New Task</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input
                  id="task-title"
                  placeholder="Enter task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <textarea
                  id="task-description"
                  className="w-full min-h-[80px] p-2 border rounded-md"
                  placeholder="Task description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due-date">Due Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      id="due-date"
                      type="date"
                      className="pl-10"
                      value={newTask.dueDate}
                      onChange={(e) =>
                        setNewTask({ ...newTask, dueDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    className="w-full p-2 border rounded-md"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cycle-phase">Cycle Phase</Label>
                <select
                  id="cycle-phase"
                  className="w-full p-2 border rounded-md"
                  value={newTask.cyclePhase}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      cyclePhase: e.target.value as
                        | "planning"
                        | "execution"
                        | "analysis"
                        | "improvement",
                    })
                  }
                >
                  <option value="planning">Planning</option>
                  <option value="execution">Execution</option>
                  <option value="analysis">Analysis</option>
                  <option value="improvement">Improvement</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {newTask.tags?.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNewTaskForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateTask}
                  disabled={!newTask.title}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Create Task
                </Button>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="planning">Planning Phase</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleStatusChange(task.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <h3
                          className={`font-medium ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
                        >
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {task.dueDate && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                          <span
                            className={`text-xs flex items-center gap-1 ${getPhaseColor(task.cyclePhase)}`}
                          >
                            <ArrowRight className="h-3 w-3" />
                            {task.cyclePhase}
                          </span>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {task.description}
                        </p>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-gray-100 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center border border-dashed rounded-lg">
                <p className="text-gray-500">No tasks found.</p>
                <Button
                  onClick={() => setShowNewTaskForm(true)}
                  variant="outline"
                  className="mt-4"
                >
                  <Plus className="mr-2 h-4 w-4" /> Create a task
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
