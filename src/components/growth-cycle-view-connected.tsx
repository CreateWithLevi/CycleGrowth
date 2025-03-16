"use client";

import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useToast } from "./ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";

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

interface GrowthCycleViewConnectedProps {
  systemId?: string;
  defaultPhase?: "planning" | "execution" | "analysis" | "improvement";
}

export default function GrowthCycleViewConnected({
  defaultPhase = "planning",
}: GrowthCycleViewConnectedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [system, setSystem] = useState<GrowthSystem | null>(null);
  const [activePhase, setActivePhase] = useState<string>(defaultPhase);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const systemId = searchParams.get("system") || undefined;

  useEffect(() => {
    fetchSystem();
  }, [systemId]);

  useEffect(() => {
    if (system) {
      setTasks(system.tasks);
      setActivePhase(system.currentPhase);
    }
  }, [system]);

  const fetchSystem = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // If systemId is provided, fetch that specific system
      let query = supabase.from("growth_systems").select("*");

      if (systemId) {
        query = query.eq("id", systemId);
      } else {
        // Otherwise fetch the most recently updated system
        query = query.order("updated_at", { ascending: false }).limit(1);
      }

      const { data, error: systemError } = await query.single();

      if (systemError) {
        if (systemError.code === "PGRST116") {
          // No rows returned
          setSystem(null);
          setIsLoading(false);
          return;
        }
        throw systemError;
      }

      if (!data) {
        setSystem(null);
        setIsLoading(false);
        return;
      }

      // Fetch tasks for this system
      const { data: taskData, error: taskError } = await supabase
        .from("growth_tasks")
        .select("*")
        .eq("system_id", data.id);

      if (taskError) throw taskError;

      // Transform the data to match our component's expected format
      const transformedSystem: GrowthSystem = {
        name: data.title,
        description: data.description || "",
        domain: data.domain,
        currentPhase: data.current_phase,
        progress: data.progress,
        startDate: new Date(data.start_date).toLocaleDateString(),
        goals: data.goals || [
          "Improve in this domain",
          "Develop structured approach",
          "Track progress systematically",
        ],
        tasks: (taskData || []).map((task: any) => ({
          id: task.id,
          title: task.title,
          completed: task.status === "completed",
          phase: task.cycle_phase,
        })),
      };

      setSystem(transformedSystem);
    } catch (err: any) {
      console.error("Error fetching growth system:", err);
      setError("Failed to load growth system");
      toast({
        title: "Error",
        description: "Failed to load growth system",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId: number) => {
    // Find the task
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Optimistic update
    setTasks(
      tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t,
      ),
    );

    try {
      // Update in the database
      const newStatus = task.completed ? "todo" : "completed";

      const { error } = await supabase.functions.invoke(
        "supabase-functions-update-task-status",
        {
          body: { taskId, status: newStatus },
        },
      );

      if (error) throw error;

      // Refresh data
      fetchSystem();
    } catch (err: any) {
      console.error("Error updating task status:", err);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });

      // Revert optimistic update on error
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, completed: task.completed } : t,
        ),
      );
    }
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

  const phaseProgress = {
    planning: 25,
    execution: 0,
    analysis: 0,
    improvement: 0,
  };

  const phaseTasks = tasks.filter((task) => task.phase === activePhase);

  const updatePhase = async (newPhase: string) => {
    if (!system || !systemId) return;

    try {
      setIsLoading(true);

      const { error } = await supabase.functions.invoke(
        "supabase-functions-update-growth-system",
        {
          body: {
            systemId,
            updates: { current_phase: newPhase },
          },
        },
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: `Phase updated to ${newPhase}`,
      });

      // Refresh data
      fetchSystem();
    } catch (err: any) {
      console.error("Error updating phase:", err);
      toast({
        title: "Error",
        description: "Failed to update phase",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchSystem} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  if (!system) {
    return (
      <div className="w-full p-8 text-center border border-dashed rounded-lg">
        <p className="text-gray-500">
          No growth system found. Create your first growth system to get
          started.
        </p>
        <Button
          onClick={() => router.push("/dashboard/system-builder")}
          className="mt-4 bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Growth System
        </Button>
      </div>
    );
  }

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

          <Button
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
            onClick={() => setActivePhase(system.currentPhase)}
          >
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
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push("/dashboard/tasks")}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Task
                      </Button>
                    </div>
                  )}

                  {phaseTasks.length > 0 && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => router.push("/dashboard/tasks")}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Task
                    </Button>
                  )}

                  {phase === system.currentPhase && (
                    <div className="mt-8">
                      <Button
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                          const phases = [
                            "planning",
                            "execution",
                            "analysis",
                            "improvement",
                          ];
                          const currentIndex = phases.indexOf(phase);
                          const nextPhase =
                            phases[(currentIndex + 1) % phases.length];
                          updatePhase(nextPhase);
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>Complete {phase} Phase</>
                        )}
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
