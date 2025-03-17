"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "../../../../supabase/client";
import { Loader2, CheckCircle, XCircle, Database } from "lucide-react";
import {
  fetchCurrentCycle,
  fetchGrowthSystems,
  fetchRecentActivities,
} from "@/lib/db";

interface EdgeFunctionTest {
  name: string;
  description: string;
  testParams: any;
  result: {
    status: "idle" | "loading" | "success" | "error";
    data?: any;
    error?: any;
  };
}

interface DiagnosticsResults {
  success?: boolean;
  connection?: string;
  environment?: Record<string, boolean>;
  rlsStatus?: Record<string, { hasRLS: boolean; error?: string }>;
  directAccess?: {
    success: boolean;
    data?: any;
    error?: any;
  };
}

export default function DiagnosticsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DiagnosticsResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("database");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardDataLoading, setDashboardDataLoading] = useState(false);
  const [dashboardDataError, setDashboardDataError] = useState<string | null>(
    null,
  );
  const [edgeFunctions, setEdgeFunctions] = useState<EdgeFunctionTest[]>([
    {
      name: "create-growth-system",
      description: "Creates a new growth system",
      testParams: {
        title: "Test System",
        description: "Created for diagnostic testing",
        domain: "professional",
      },
      result: { status: "idle" },
    },
    {
      name: "create-growth-task",
      description: "Creates a new task for a growth system",
      testParams: {
        title: "Test Task",
        description: "Created for diagnostic testing",
        priority: "medium",
        cycle_phase: "planning",
        system_id: "", // Will be populated dynamically if possible
      },
      result: { status: "idle" },
    },
    {
      name: "create-knowledge-item",
      description: "Creates a new knowledge item",
      testParams: {
        title: "Test Knowledge Item",
        content: "This is a test knowledge item created for diagnostics",
        tags: ["test", "diagnostics"],
      },
      result: { status: "idle" },
    },
    {
      name: "create-reflection",
      description: "Creates a new reflection entry",
      testParams: {
        title: "Test Reflection",
        content: "This is a test reflection created for diagnostics",
        cycle_phase: "planning",
        domain: "professional",
        insights: ["Test insight for diagnostics"],
        tags: ["test", "diagnostics"],
      },
      result: { status: "idle" },
    },
    {
      name: "update-cyclo-stage",
      description: "Updates the Cyclo assistant stage",
      testParams: {
        stage: 1,
      },
      result: { status: "idle" },
    },
    {
      name: "update-growth-system",
      description: "Updates a growth system",
      testParams: {
        systemId: "", // Will be populated dynamically if possible
        updates: {
          title: "Updated Test System",
          description: "Updated for diagnostic testing",
        },
      },
      result: { status: "idle" },
    },
    {
      name: "update-task-status",
      description: "Updates a task's status",
      testParams: {
        taskId: "", // Will be populated dynamically if possible
        status: "completed",
      },
      result: { status: "idle" },
    },
  ]);

  const supabase = createClient();

  const runDiagnostics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check auth status
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      setAuthStatus({ user, error: authError });

      // Run database diagnostics
      const response = await fetch("/api/db-test");
      const data = await response.json();
      setResults(data);

      // Test direct database access
      try {
        const { data: directTest, error: directError } = await supabase
          .from("growth_systems")
          .select("id", { count: "exact" });

        setResults((prev: DiagnosticsResults | null) => ({
          ...prev,
          directAccess: {
            success: !directError,
            data: directTest,
            error: directError,
          },
        }));

        // If we have systems, use the first one for testing
        if (directTest && directTest.length > 0) {
          // Update edge functions that need a system ID
          setEdgeFunctions((prev) =>
            prev.map((func) => {
              if (func.name === "update-growth-system") {
                return {
                  ...func,
                  testParams: {
                    ...func.testParams,
                    systemId: directTest[0].id,
                  },
                };
              }
              if (func.name === "create-growth-task") {
                return {
                  ...func,
                  testParams: {
                    ...func.testParams,
                    system_id: directTest[0].id,
                  },
                };
              }
              return func;
            }),
          );

          // Try to get a task for testing update-task-status
          const { data: taskData } = await supabase
            .from("growth_tasks")
            .select("id")
            .eq("system_id", directTest[0].id)
            .limit(1);

          if (taskData && taskData.length > 0) {
            setEdgeFunctions((prev) =>
              prev.map((func) => {
                if (func.name === "update-task-status") {
                  return {
                    ...func,
                    testParams: {
                      ...func.testParams,
                      taskId: taskData[0].id,
                    },
                  };
                }
                return func;
              }),
            );
          }
        }
      } catch (directErr) {
        setResults((prev: DiagnosticsResults | null) => ({
          ...prev,
          directAccess: {
            success: false,
            error: directErr instanceof Error ? directErr.message : String(directErr),
          },
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const testEdgeFunction = async (index: number) => {
    const func = edgeFunctions[index];

    // Update status to loading
    setEdgeFunctions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        result: { status: "loading" },
      };
      return updated;
    });

    try {
      // Function name should not include supabase-functions- prefix as it's added automatically
      const functionName = func.name;
      console.log(`Invoking function: ${functionName} with params:`, func.testParams);

      // Invoke the edge function
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: func.testParams,
      });

      // Update the result
      setEdgeFunctions((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          result: {
            status: error ? "error" : "success",
            data,
            error,
          },
        };
        return updated;
      });
    } catch (err) {
      // Handle any exceptions
      setEdgeFunctions((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          result: {
            status: "error",
            error: err,
          },
        };
        return updated;
      });
    }
  };

  const resetEdgeFunctionTest = (index: number) => {
    setEdgeFunctions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        result: { status: "idle" },
      };
      return updated;
    });
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">System Diagnostics</h1>
            <p className="text-gray-600">
              Use this page to diagnose database and edge function issues.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="database">Database Diagnostics</TabsTrigger>
              <TabsTrigger value="edge-functions">Edge Functions</TabsTrigger>
              <TabsTrigger value="dashboard-data">Dashboard Data</TabsTrigger>
            </TabsList>

            <TabsContent value="database" className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {authStatus ? (
                    <div className="space-y-2">
                      <div className="p-4 bg-gray-100 rounded-md">
                        <p>
                          <strong>User Authenticated:</strong>{" "}
                          {authStatus.user ? "Yes" : "No"}
                        </p>
                        {authStatus.user && (
                          <>
                            <p>
                              <strong>User ID:</strong> {authStatus.user.id}
                            </p>
                            <p>
                              <strong>Email:</strong> {authStatus.user.email}
                            </p>
                          </>
                        )}
                        {authStatus.error && (
                          <p className="text-red-500">
                            <strong>Error:</strong> {authStatus.error.message}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>Checking authentication status...</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Connection Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={runDiagnostics}
                    disabled={isLoading}
                    className="mb-4 bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? "Running Tests..." : "Run Diagnostics"}
                  </Button>

                  {error && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
                      {error}
                    </div>
                  )}

                  {results && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-100 rounded-md">
                        <h3 className="font-semibold mb-2">
                          Connection Status
                        </h3>
                        <p
                          className={
                            results.success ? "text-green-600" : "text-red-600"
                          }
                        >
                          {results.connection || "Connection failed"}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-100 rounded-md">
                        <h3 className="font-semibold mb-2">
                          Direct Database Access
                        </h3>
                        {results.directAccess ? (
                          <p
                            className={
                              results.directAccess.success
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {results.directAccess.success
                              ? "Success"
                              : "Failed: " +
                                results.directAccess.error?.message}
                          </p>
                        ) : (
                          <p>Not tested</p>
                        )}
                      </div>

                      <div className="p-4 bg-gray-100 rounded-md">
                        <h3 className="font-semibold mb-2">
                          Environment Variables
                        </h3>
                        <ul className="space-y-1">
                          {results.environment &&
                            Object.entries(results.environment).map(
                              ([key, value]) => (
                                <li key={key}>
                                  <strong>{key}:</strong>{" "}
                                  {value ? "✅ Set" : "❌ Missing"}
                                </li>
                              ),
                            )}
                        </ul>
                      </div>

                      <div className="p-4 bg-gray-100 rounded-md">
                        <h3 className="font-semibold mb-2">
                          Row Level Security Status
                        </h3>
                        {results.rlsStatus &&
                          Object.entries(results.rlsStatus).map(
                            ([table, status]) => (
                              <div key={table} className="mb-2">
                                <p>
                                  <strong>{table}:</strong>
                                  {status.error ? (
                                    <span className="text-red-600">
                                      Error checking: {status.error}
                                    </span>
                                  ) : (
                                    <span
                                      className={
                                        status.hasRLS
                                          ? "text-yellow-600"
                                          : "text-green-600"
                                      }
                                    >
                                      {status.hasRLS
                                        ? "RLS Enabled"
                                        : "RLS Disabled"}
                                    </span>
                                  )}
                                </p>
                              </div>
                            ),
                          )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edge-functions" className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edge Functions Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    Test your Supabase Edge Functions to see which ones are
                    working properly. Each test will invoke the function with
                    test parameters and display the result.
                  </p>

                  <div className="space-y-6">
                    {edgeFunctions.map((func, index) => (
                      <div key={func.name} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {func.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {func.description}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {func.result.status === "idle" && (
                              <Button
                                onClick={() => testEdgeFunction(index)}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                Test Function
                              </Button>
                            )}
                            {func.result.status === "loading" && (
                              <Button disabled className="bg-purple-600">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Testing...
                              </Button>
                            )}
                            {(func.result.status === "success" ||
                              func.result.status === "error") && (
                              <Button
                                variant="outline"
                                onClick={() => resetEdgeFunctionTest(index)}
                              >
                                Test Again
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-1">
                            Test Parameters:
                          </h4>
                          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-24">
                            {JSON.stringify(func.testParams, null, 2)}
                          </pre>
                        </div>

                        {func.result.status === "success" && (
                          <div className="mt-2">
                            <div className="flex items-center text-green-600 mb-2">
                              <CheckCircle className="h-5 w-5 mr-2" />
                              <span className="font-medium">
                                Function working correctly
                              </span>
                            </div>
                            <h4 className="text-sm font-medium mb-1">
                              Response:
                            </h4>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-48">
                              {JSON.stringify(func.result.data, null, 2)}
                            </pre>
                          </div>
                        )}

                        {func.result.status === "error" && (
                          <div className="mt-2">
                            <div className="flex items-center text-red-600 mb-2">
                              <XCircle className="h-5 w-5 mr-2" />
                              <span className="font-medium">
                                Function error
                              </span>
                            </div>
                            <h4 className="text-sm font-medium mb-1">Error:</h4>
                            <pre className="bg-red-50 p-2 rounded text-xs overflow-auto max-h-48 text-red-800">
                              {JSON.stringify(func.result.error, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dashboard-data" className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" /> Dashboard Data Diagnostics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-gray-600">
                    This section tests the data fetching functions used by the
                    dashboard to help diagnose why growth cycles might not be
                    showing up.
                  </p>

                  <Button
                    onClick={async () => {
                      setDashboardDataLoading(true);
                      setDashboardDataError(null);
                      try {
                        // Get the current user ID
                        const {
                          data: { user },
                        } = await supabase.auth.getUser();

                        if (!user) {
                          throw new Error("User not authenticated");
                        }

                        console.log(
                          "Testing dashboard data fetching for user ID:",
                          user.id,
                        );

                        // Test each function used by the dashboard
                        const currentCycle = await fetchCurrentCycle(user.id);
                        console.log("Current cycle result:", currentCycle);

                        const growthSystems = await fetchGrowthSystems(user.id);
                        console.log("Growth systems result:", growthSystems);

                        const recentActivities = await fetchRecentActivities(
                          user.id,
                        );
                        console.log(
                          "Recent activities result:",
                          recentActivities,
                        );

                        // Also test direct database query
                        const { data: directSystems, error: directError } =
                          await supabase
                            .from("growth_systems")
                            .select("*")
                            .eq("user_id", user.id);

                        console.log(
                          "Direct systems query result:",
                          directSystems,
                        );
                        if (directError)
                          console.error("Direct query error:", directError);

                        // Set all the data for display
                        setDashboardData({
                          userId: user.id,
                          currentCycle,
                          growthSystems,
                          recentActivities,
                          directSystems,
                          directError,
                        });
                      } catch (err) {
                        console.error("Error testing dashboard data:", err);
                        setDashboardDataError(err instanceof Error ? err.message : String(err));
                      } finally {
                        setDashboardDataLoading(false);
                      }
                    }}
                    disabled={dashboardDataLoading}
                    className="mb-6 bg-purple-600 hover:bg-purple-700"
                  >
                    {dashboardDataLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing Dashboard Data...
                      </>
                    ) : (
                      "Test Dashboard Data Fetching"
                    )}
                  </Button>

                  {dashboardDataError && (
                    <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
                      <h3 className="font-semibold mb-1">Error:</h3>
                      <p>{dashboardDataError}</p>
                    </div>
                  )}

                  {dashboardData && (
                    <div className="space-y-6">
                      <div className="p-4 bg-gray-100 rounded-md">
                        <h3 className="font-semibold mb-2">User ID</h3>
                        <p className="font-mono text-sm">
                          {dashboardData.userId}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-100 rounded-md">
                        <h3 className="font-semibold mb-2">
                          Current Cycle (fetchCurrentCycle)
                        </h3>
                        {dashboardData.currentCycle ? (
                          <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-60">
                            {JSON.stringify(
                              dashboardData.currentCycle,
                              null,
                              2,
                            )}
                          </pre>
                        ) : (
                          <p className="text-amber-600">
                            No current cycle found
                          </p>
                        )}
                      </div>

                      <div className="p-4 bg-gray-100 rounded-md">
                        <h3 className="font-semibold mb-2">
                          Growth Systems (fetchGrowthSystems)
                        </h3>
                        {dashboardData.growthSystems &&
                        dashboardData.growthSystems.length > 0 ? (
                          <>
                            <p className="mb-2">
                              Found {dashboardData.growthSystems.length} growth
                              systems
                            </p>
                            <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-60">
                              {JSON.stringify(
                                dashboardData.growthSystems,
                                null,
                                2,
                              )}
                            </pre>
                          </>
                        ) : (
                          <p className="text-amber-600">
                            No growth systems found
                          </p>
                        )}
                      </div>

                      <div className="p-4 bg-gray-100 rounded-md">
                        <h3 className="font-semibold mb-2">
                          Direct Database Query (growth_systems)
                        </h3>
                        {dashboardData.directError ? (
                          <p className="text-red-600">
                            Error: {dashboardData.directError.message}
                          </p>
                        ) : dashboardData.directSystems &&
                          dashboardData.directSystems.length > 0 ? (
                          <>
                            <p className="mb-2">
                              Found {dashboardData.directSystems.length} growth
                              systems directly
                            </p>
                            <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-60">
                              {JSON.stringify(
                                dashboardData.directSystems,
                                null,
                                2,
                              )}
                            </pre>
                          </>
                        ) : (
                          <p className="text-amber-600">
                            No growth systems found in direct query
                          </p>
                        )}
                      </div>

                      <div className="p-4 bg-gray-100 rounded-md">
                        <h3 className="font-semibold mb-2">
                          Recent Activities (fetchRecentActivities)
                        </h3>
                        {dashboardData.recentActivities &&
                        dashboardData.recentActivities.length > 0 ? (
                          <>
                            <p className="mb-2">
                              Found {dashboardData.recentActivities.length}{" "}
                              recent activities
                            </p>
                            <pre className="bg-white p-3 rounded border text-xs overflow-auto max-h-60">
                              {JSON.stringify(
                                dashboardData.recentActivities,
                                null,
                                2,
                              )}
                            </pre>
                          </>
                        ) : (
                          <p className="text-amber-600">
                            No recent activities found
                          </p>
                        )}
                      </div>

                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                        <h3 className="font-semibold mb-2 text-purple-800">
                          Diagnostic Summary
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li>
                            <strong>Current Cycle Status:</strong>{" "}
                            {dashboardData.currentCycle ? "Found" : "Not Found"}
                          </li>
                          <li>
                            <strong>Growth Systems Status:</strong>{" "}
                            {dashboardData.growthSystems &&
                            dashboardData.growthSystems.length > 0
                              ? `Found ${dashboardData.growthSystems.length} systems`
                              : "Not Found"}
                          </li>
                          <li>
                            <strong>Direct Query Status:</strong>{" "}
                            {dashboardData.directSystems &&
                            dashboardData.directSystems.length > 0
                              ? `Found ${dashboardData.directSystems.length} systems`
                              : "Not Found"}
                          </li>
                          <li>
                            <strong>Recent Activities Status:</strong>{" "}
                            {dashboardData.recentActivities &&
                            dashboardData.recentActivities.length > 0
                              ? `Found ${dashboardData.recentActivities.length} activities`
                              : "Not Found"}
                          </li>
                        </ul>

                        {dashboardData.growthSystems &&
                          dashboardData.growthSystems.length > 0 &&
                          !dashboardData.currentCycle && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                              <p className="font-medium">
                                Possible Issue Detected:
                              </p>
                              <p>
                                Growth systems exist but no current cycle is
                                being returned. Check if the dashboard is
                                expecting the most recently updated system to be
                                the current cycle.
                              </p>
                            </div>
                          )}

                        {dashboardData.directSystems &&
                          dashboardData.directSystems.length > 0 &&
                          (!dashboardData.growthSystems ||
                            dashboardData.growthSystems.length === 0) && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                              <p className="font-medium">
                                Possible Issue Detected:
                              </p>
                              <p>
                                Systems exist in the database but
                                fetchGrowthSystems() is not returning them.
                                Check the fetchGrowthSystems implementation in
                                db.ts.
                              </p>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
