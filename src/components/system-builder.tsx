"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Target, RefreshCcw, LineChart, Brain, Plus, X } from "lucide-react";

interface SystemBuilderProps {
  onSave?: (system: any) => void;
}

export default function SystemBuilder({
  onSave = () => {},
}: SystemBuilderProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [systemName, setSystemName] = useState("");
  const [systemDescription, setSystemDescription] = useState("");
  const [domain, setDomain] = useState("personal");
  const [goals, setGoals] = useState<string[]>([""]);
  const [tasks, setTasks] = useState<string[]>([""]);

  const handleAddGoal = () => {
    setGoals([...goals, ""]);
  };

  const handleRemoveGoal = (index: number) => {
    const newGoals = [...goals];
    newGoals.splice(index, 1);
    setGoals(newGoals);
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  };

  const handleAddTask = () => {
    setTasks([...tasks, ""]);
  };

  const handleRemoveTask = (index: number) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const handleTaskChange = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handleSave = () => {
    const systemData = {
      name: systemName,
      description: systemDescription,
      domain,
      goals: goals.filter((goal) => goal.trim() !== ""),
      tasks: tasks.filter((task) => task.trim() !== ""),
      createdAt: new Date().toISOString(),
      currentPhase: "planning",
      progress: 0,
    };

    onSave(systemData);
  };

  const domains = [
    { value: "personal", label: "Personal Development" },
    { value: "professional", label: "Professional Skills" },
    { value: "health", label: "Health & Fitness" },
    { value: "learning", label: "Learning & Education" },
    { value: "creative", label: "Creative Projects" },
    { value: "business", label: "Business Growth" },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Growth System</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="details" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Details</span>
            </TabsTrigger>
            <TabsTrigger value="planning" className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4" />
              <span>Planning</span>
            </TabsTrigger>
            <TabsTrigger value="execution" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>Execution</span>
            </TabsTrigger>
            <TabsTrigger value="reflection" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>Reflection</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input
                  id="system-name"
                  placeholder="e.g., Professional Skill Development"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-description">Description</Label>
                <Textarea
                  id="system-description"
                  placeholder="Describe what you want to achieve with this growth system..."
                  rows={4}
                  value={systemDescription}
                  onChange={(e) => setSystemDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <select
                  id="domain"
                  className="w-full p-2 border rounded-md"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                >
                  {domains.map((domain) => (
                    <option key={domain.value} value={domain.value}>
                      {domain.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-medium">Goals</Label>
                <p className="text-sm text-gray-500 mb-4">
                  Define what you want to achieve with this growth system
                </p>

                {goals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <Input
                      placeholder={`Goal ${index + 1}`}
                      value={goal}
                      onChange={(e) => handleGoalChange(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveGoal(index)}
                      disabled={goals.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddGoal}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Goal
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="execution" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="text-lg font-medium">Tasks</Label>
                <p className="text-sm text-gray-500 mb-4">
                  Break down your goals into actionable tasks
                </p>

                {tasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-2 mb-3">
                    <Input
                      placeholder={`Task ${index + 1}`}
                      value={task}
                      onChange={(e) => handleTaskChange(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTask(index)}
                      disabled={tasks.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddTask}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Task
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reflection" className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">
                    Reflection Tools
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    Reflection tools will be available after you start your
                    growth cycle.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() =>
              setActiveTab(
                activeTab === "details"
                  ? "details"
                  : activeTab === "planning"
                    ? "details"
                    : activeTab === "execution"
                      ? "planning"
                      : "execution",
              )
            }
          >
            Back
          </Button>

          {activeTab !== "reflection" ? (
            <Button
              onClick={() =>
                setActiveTab(
                  activeTab === "details"
                    ? "planning"
                    : activeTab === "planning"
                      ? "execution"
                      : "reflection",
                )
              }
            >
              Next
            </Button>
          ) : (
            <Button onClick={handleSave}>Create System</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
