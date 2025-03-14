"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Target,
  RefreshCcw,
  LineChart,
  Brain,
  ArrowRight,
  Check,
  Clock,
  Plus,
} from "lucide-react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  phase: string;
}

interface GrowthSystem {
  name: string;
  description: string;
  domain: string;
  currentPhase: string;
  progress: number;
  startDate: string;
  goals: string[];
  tasks: Task[];
}

interface GrowthCycleViewProps {
  system?: GrowthSystem;
  defaultPhase?: "planning" | "execution" | "analysis" | "improvement";
}

export default function GrowthCycleView({
  system = {
    name: "Professional Skill Development",
    description:
      "Focus on improving your leadership and communication skills through structured practice and feedback.",
    domain: "professional",
    currentPhase: "planning",
    progress: 10,
    startDate: "June 15, 2023",
    goals: [
      "Improve public speaking confidence",
      "Develop active listening skills",
      "Master non-verbal communication cues",
    ],
    tasks: [
      {
        id: 1,
        title: "Research leadership styles",
        completed: true,
        phase: "planning",
      },
      {
        id: 2,
        title: "Create presentation outline",
        completed: false,
        phase: "planning",
      },
      {
        id: 3,
        title: "Practice presentation delivery",
        completed: false,
        phase: "execution",
      },
      {
        id: 4,
        title: "Record and analyze speech patterns",
        completed: false,
        phase: "analysis",
      },
      {
        id: 5,
        title: "Gather feedback from peers",
        completed: false,
        phase: "analysis",
      },
      {
        id: 6,
        title: "Refine communication approach",
        completed: false,
        phase: "improvement",
      },
    ],
  },
  defaultPhase = "planning",
}: GrowthCycleViewProps) {
  const [activePhase, setActivePhase] = useState<string>(defaultPhase);
  const [tasks, setTasks] = useState<Task[]>(system.tasks);

  const phaseProgress = {
    planning: 25,
    execution: 0,
    analysis: 0,
    improvement: 0,
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map((task: Task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "planning":
        return <Target className="h-5 w-5" />;
      case "execution":
        return <RefreshCcw className="h-5 w-5" />;
      case "analysis":
        return <LineChart className="h-5 w-5" />;
      case "improvement":
        return <Brain className="h-5 w-5" />;
      default:
        return <Target className="h-5 w-5" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "planning":
        return "text-purple-600 bg-purple-100";
      case "execution":
        return "text-blue-600 bg-blue-100";
      case "analysis":
        return "text-yellow-600 bg-yellow-100";
      case "improvement":
        return "text-green-600 bg-green-100";
      default:
        return "text-purple-600 bg-purple-100";
    }
  };

  const phaseTasks = tasks.filter((task) => task.phase === activePhase);

  return (
    <div className="w-full">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">{system.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">{system.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">
                Current Phase
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`p-1.5 rounded-full ${getPhaseColor(system.currentPhase)}`}
                >
                  {getPhaseIcon(system.currentPhase)}
                </div>
                <p className="font-medium capitalize">{system.currentPhase}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Started</h4>
              <p className="font-medium mt-1">{system.startDate}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">
                Phase Completion
              </h4>
              <div className="mt-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">
                    {
                      phaseProgress[
                      system.currentPhase as keyof typeof phaseProgress
                      ]
                    }
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${phaseProgress[system.currentPhase as keyof typeof phaseProgress]}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">
                Overall Progress
              </h4>
              <div className="mt-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{system.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${system.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Goals</h3>
          </div>

          <div className="space-y-2 mb-8">
            {system.goals.map((goal, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 rounded-lg flex items-start gap-3"
              >
                <div className="p-1 rounded-full bg-purple-100 text-purple-600 mt-0.5">
                  <Target className="h-4 w-4" />
                </div>
                <span>{goal}</span>
              </div>
            ))}
          </div>

          <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
            Continue Current Phase <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Phase Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activePhase}
            onValueChange={setActivePhase}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="planning" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Planning</span>
              </TabsTrigger>
              <TabsTrigger
                value="execution"
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Execution</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                <span className="hidden sm:inline">Analysis</span>
              </TabsTrigger>
              <TabsTrigger
                value="improvement"
                className="flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Improvement</span>
              </TabsTrigger>
            </TabsList>

            {["planning", "execution", "analysis", "improvement"].map(
              (phase) => (
                <TabsContent key={phase} value={phase} className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold capitalize">
                      {phase} Phase
                    </h3>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Estimated time: 1-2 weeks</span>
                    </div>
                  </div>

                  {phaseTasks.length > 0 ? (
                    <div className="space-y-3">
                      {phaseTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 border rounded-lg flex items-start gap-3 ${task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"}`}
                          onClick={() => toggleTaskCompletion(task.id)}
                        >
                          <div
                            className={`p-1 rounded-full ${task.completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"} cursor-pointer`}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p
                              className={
                                task.completed
                                  ? "line-through text-gray-500"
                                  : ""
                              }
                            >
                              {task.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed rounded-lg text-center">
                      <p className="text-gray-500">
                        No tasks for this phase yet.
                      </p>
                      <Button variant="outline" className="mt-4">
                        <Plus className="h-4 w-4 mr-2" /> Add Task
                      </Button>
                    </div>
                  )}

                  {phaseTasks.length > 0 && (
                    <Button variant="outline" className="mt-4">
                      <Plus className="h-4 w-4 mr-2" /> Add Task
                    </Button>
                  )}

                  {phase === system.currentPhase && (
                    <div className="mt-8">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Complete {phase} Phase
                      </Button>
                    </div>
                  )}
                </TabsContent>
              ),
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
