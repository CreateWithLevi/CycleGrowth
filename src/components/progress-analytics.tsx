"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

export default function ProgressAnalytics() {
  const [timeframe, setTimeframe] = useState("week");

  // Sample data for the charts
  const weeklyData = [
    { day: "Mon", tasks: 3, hours: 2.5 },
    { day: "Tue", tasks: 5, hours: 3.2 },
    { day: "Wed", tasks: 2, hours: 1.8 },
    { day: "Thu", tasks: 4, hours: 2.7 },
    { day: "Fri", tasks: 6, hours: 4.1 },
    { day: "Sat", tasks: 2, hours: 1.5 },
    { day: "Sun", tasks: 1, hours: 0.8 },
  ];

  const monthlyData = [
    { week: "Week 1", tasks: 12, hours: 10.2 },
    { week: "Week 2", tasks: 15, hours: 12.5 },
    { week: "Week 3", tasks: 10, hours: 8.7 },
    { week: "Week 4", tasks: 18, hours: 15.3 },
  ];

  const yearlyData = [
    { month: "Jan", tasks: 45, hours: 38 },
    { month: "Feb", tasks: 52, hours: 42 },
    { month: "Mar", tasks: 48, hours: 40 },
    { month: "Apr", tasks: 60, hours: 50 },
    { month: "May", tasks: 55, hours: 45 },
    { month: "Jun", tasks: 70, hours: 58 },
    { month: "Jul", tasks: 68, hours: 56 },
    { month: "Aug", tasks: 62, hours: 51 },
    { month: "Sep", tasks: 74, hours: 62 },
    { month: "Oct", tasks: 80, hours: 68 },
    { month: "Nov", tasks: 0, hours: 0 },
    { month: "Dec", tasks: 0, hours: 0 },
  ];

  // Get the appropriate data based on the selected timeframe
  const chartData =
    timeframe === "week"
      ? weeklyData
      : timeframe === "month"
        ? monthlyData
        : yearlyData;

  // Calculate the maximum value for scaling the chart
  const maxTasks = Math.max(...chartData.map((item) => item.tasks));

  // Calculate totals and averages
  const totalTasks = chartData.reduce((sum, item) => sum + item.tasks, 0);
  const totalHours = chartData.reduce((sum, item) => sum + item.hours, 0);
  const avgTasksPerDay = totalTasks / chartData.length;
  const avgHoursPerDay = totalHours / chartData.length;

  // Domain-specific metrics
  const domainData = [
    { name: "Professional", progress: 65, tasks: 28 },
    { name: "Learning", progress: 40, tasks: 15 },
    { name: "Health", progress: 80, tasks: 22 },
    { name: "Creative", progress: 25, tasks: 8 },
  ];

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

          <TabsContent value={timeframe} className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Tasks
                </h3>
                <p className="text-3xl font-bold">{totalTasks}</p>
                <div className="mt-2 text-xs text-green-600">
                  +{Math.floor(Math.random() * 10) + 5}% from previous{" "}
                  {timeframe}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">
                  Completion Rate
                </h3>
                <p className="text-3xl font-bold">78%</p>
                <div className="mt-2 text-xs text-green-600">
                  +{Math.floor(Math.random() * 10) + 2}% from previous{" "}
                  {timeframe}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">
                  Hours Invested
                </h3>
                <p className="text-3xl font-bold">{totalHours.toFixed(1)}</p>
                <div className="mt-2 text-xs text-green-600">
                  +{Math.floor(Math.random() * 10) + 8}% from previous{" "}
                  {timeframe}
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">
                  Avg. Daily Tasks
                </h3>
                <p className="text-3xl font-bold">
                  {avgTasksPerDay.toFixed(1)}
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
                {chartData.map((item, index) => {
                  const label =
                    timeframe === "week"
                      ? item.day
                      : timeframe === "month"
                        ? item.week
                        : item.month;
                  const height = (item.tasks / maxTasks) * 100;

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
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Domain Progress */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-lg font-medium mb-4">Domain Progress</h3>
              <div className="space-y-6">
                {domainData.map((domain, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{domain.name}</span>
                      <span className="text-sm text-gray-500">
                        {domain.progress}% ({domain.tasks} tasks)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-purple-600 h-2.5 rounded-full"
                        style={{ width: `${domain.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-medium mb-4">Phase Distribution</h3>
                <div className="flex justify-center">
                  <div className="w-48 h-48 rounded-full border-8 border-gray-100 relative">
                    {/* Planning - 30% */}
                    <div
                      className="absolute inset-0 bg-purple-500"
                      style={{
                        clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)",
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
                        clipPath: "polygon(50% 50%, 50% 100%, 0% 100%, 0% 80%)",
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
