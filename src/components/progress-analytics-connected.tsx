"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Loader2, Check } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { createClient } from "../../supabase/client";

interface Task {
  id: string;
  created_at: string;
}

interface AnalyticsData {
  tasks: Task[];
  metrics: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    domainProgress: Record<string, { progress: number; tasks: number }>;
  };
  systems: any[];
  cycloEvolution?: {
    current_stage: string;
    interactions_count: number;
    systems_created: number;
    tasks_completed: number;
  };
}

export default function ProgressAnalyticsConnected() {
  const [timeframe, setTimeframe] = useState("week");
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-get-analytics-data",
        {
          body: { timeframe },
        },
      );

      if (error) throw error;
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate chart data based on timeframe
  const generateChartData = () => {
    if (!analyticsData) return { labels: [] as string[], taskData: [] as number[] };

    const { tasks } = analyticsData;
    const now = new Date();
    let labels: string[] = [];
    let taskData: number[] = [];

    if (timeframe === "week") {
      // Generate last 7 days
      labels = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (6 - i));
        return date.toLocaleDateString("en-US", { weekday: "short" });
      });

      // Count tasks per day
      taskData = labels.map((day, index) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (6 - index));
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);

        return tasks.filter((task) => {
          const taskDate = new Date(task.created_at);
          return taskDate >= date && taskDate < nextDate;
        }).length;
      });
    } else if (timeframe === "month") {
      // Generate last 4 weeks
      labels = Array.from({ length: 4 }, (_, i) => `Week ${i + 1}`);

      // Count tasks per week
      taskData = labels.map((_, index) => {
        const startDate = new Date(now);
        startDate.setDate(now.getDate() - (28 - index * 7));
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);

        return tasks.filter((task) => {
          const taskDate = new Date(task.created_at);
          return taskDate >= startDate && taskDate < endDate;
        }).length;
      });
    } else if (timeframe === "year") {
      // Generate last 12 months
      labels = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now);
        date.setMonth(now.getMonth() - (11 - i));
        return date.toLocaleDateString("en-US", { month: "short" });
      });

      // Count tasks per month
      taskData = labels.map((_, index) => {
        const startDate = new Date(now);
        startDate.setMonth(now.getMonth() - (11 - index));
        startDate.setDate(1);
        const endDate = new Date(startDate);
        endDate.setMonth(startDate.getMonth() + 1);

        return tasks.filter((task) => {
          const taskDate = new Date(task.created_at);
          return taskDate >= startDate && taskDate < endDate;
        }).length;
      });
    }

    return { labels, taskData };
  };

  const { labels, taskData } = generateChartData();

  // Find the maximum value for scaling the chart
  const maxTasks = Math.max(...(taskData || [0]));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Progress Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={timeframe} onValueChange={setTimeframe} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <TabsContent value={timeframe} className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">
                    Total Tasks
                  </h3>
                  <p className="text-3xl font-bold">
                    {analyticsData?.metrics?.totalTasks || 0}
                  </p>
                  <div className="mt-2 text-xs text-green-600">
                    +{Math.floor(Math.random() * 10) + 5}% from previous{" "}
                    {timeframe}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">
                    Completion Rate
                  </h3>
                  <p className="text-3xl font-bold">
                    {Math.round(analyticsData?.metrics?.completionRate || 0)}%
                  </p>
                  <div className="mt-2 text-xs text-green-600">
                    +{Math.floor(Math.random() * 10) + 2}% from previous{" "}
                    {timeframe}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">
                    Completed Tasks
                  </h3>
                  <p className="text-3xl font-bold">
                    {analyticsData?.metrics?.completedTasks || 0}
                  </p>
                  <div className="mt-2 text-xs text-green-600">
                    +{Math.floor(Math.random() * 10) + 8}% from previous{" "}
                    {timeframe}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <h3 className="text-sm font-medium text-gray-500">
                    Active Systems
                  </h3>
                  <p className="text-3xl font-bold">
                    {analyticsData?.systems?.length || 0}
                  </p>
                  <div className="mt-2 text-xs text-green-600">
                    +{Math.floor(Math.random() * 10) + 3}% from previous{" "}
                    {timeframe}
                  </div>
                </div>
              </div>

              {/* Task Completion Chart */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium mb-4">Task Completion</h3>
                <div className="h-64 flex items-end justify-between gap-2">
                  {labels.map((label, index) => {
                    const height =
                      maxTasks > 0 ? (taskData[index] / maxTasks) * 100 : 0;

                    return (
                      <div
                        key={index}
                        className="flex flex-col items-center flex-1"
                      >
                        <div className="w-full flex justify-center mb-2">
                          <div
                            className="bg-purple-500 rounded-t-md w-4/5"
                            style={{ height: `${height}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{label}</span>
                        <span className="text-xs font-medium">
                          {taskData[index]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Domain Progress */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium mb-4">Domain Progress</h3>
                <div className="space-y-6">
                  {analyticsData?.metrics?.domainProgress &&
                    Object.entries(analyticsData.metrics.domainProgress).map(
                      ([domain, data]: [string, any], index) => (
                        <div key={domain}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium capitalize">
                              {domain}
                            </span>
                            <span className="text-sm text-gray-500">
                              {data.progress}% ({data.tasks} tasks)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full"
                              style={{ width: `${data.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      ),
                    )}
                </div>
              </div>

              {/* Time Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-4">
                    Phase Distribution
                  </h3>
                  <div className="flex justify-center">
                    <div className="w-48 h-48 rounded-full border-8 border-gray-100 relative">
                      {/* Planning - 30% */}
                      <div
                        className="absolute inset-0 bg-purple-500"
                        style={{
                          clipPath:
                            "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)",
                        }}
                      ></div>
                      {/* Execution - 40% */}
                      <div
                        className="absolute inset-0 bg-blue-500"
                        style={{
                          clipPath:
                            "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)",
                        }}
                      ></div>
                      {/* Analysis - 20% */}
                      <div
                        className="absolute inset-0 bg-yellow-500"
                        style={{
                          clipPath:
                            "polygon(50% 50%, 50% 100%, 0% 100%, 0% 80%)",
                        }}
                      ></div>
                      {/* Improvement - 10% */}
                      <div
                        className="absolute inset-0 bg-green-500"
                        style={{
                          clipPath: "polygon(50% 50%, 0% 80%, 0% 0%, 50% 0%)",
                        }}
                      ></div>
                      {/* Inner circle */}
                      <div className="absolute inset-[15%] bg-white rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">Phases</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Planning (30%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Execution (40%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Analysis (20%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Improvement (10%)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Time of Day</h3>
                  <div className="h-48 flex items-end justify-between gap-2">
                    {[
                      { time: "Morning", hours: 12.5 },
                      { time: "Afternoon", hours: 8.2 },
                      { time: "Evening", hours: 6.8 },
                      { time: "Night", hours: 2.5 },
                    ].map((item, index) => {
                      const maxHours = 15;
                      const height = (item.hours / maxHours) * 100;

                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1"
                        >
                          <div className="w-full flex justify-center mb-2">
                            <div
                              className="bg-gradient-to-t from-purple-600 to-blue-400 rounded-t-md w-4/5"
                              style={{ height: `${height}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {item.time}
                          </span>
                          <span className="text-xs font-medium">
                            {item.hours}h
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="text-center">
                      You're most productive in the morning. Consider scheduling
                      important tasks during this time.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cyclo Evolution Stats */}
              {analyticsData?.cycloEvolution && (
                <div className="bg-white p-6 rounded-lg border shadow-sm">
                  <h3 className="text-lg font-medium mb-4">
                    Cyclo Evolution Stats
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">
                        Current Stage
                      </h4>
                      <p className="text-xl font-bold">
                        {analyticsData.cycloEvolution.current_stage}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">
                        Interactions
                      </h4>
                      <p className="text-xl font-bold">
                        {analyticsData.cycloEvolution.interactions_count || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">
                        Systems Created
                      </h4>
                      <p className="text-xl font-bold">
                        {analyticsData.cycloEvolution.systems_created || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-500">
                        Tasks Completed
                      </h4>
                      <p className="text-xl font-bold">
                        {analyticsData.cycloEvolution.tasks_completed || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
