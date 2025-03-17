"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "../../../../supabase/client";

export default function DiagnosticsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<any>(null);
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

        setResults((prev) => ({
          ...prev,
          directAccess: {
            success: !directError,
            data: directTest,
            error: directError,
          },
        }));
      } catch (directErr) {
        setResults((prev) => ({
          ...prev,
          directAccess: {
            success: false,
            error: directErr.message,
          },
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
            <h1 className="text-3xl font-bold mb-2">Database Diagnostics</h1>
            <p className="text-gray-600">
              Use this page to diagnose database connection issues.
            </p>
          </div>

          <div className="grid gap-6">
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
                      <h3 className="font-semibold mb-2">Connection Status</h3>
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
                            : "Failed: " + results.directAccess.error?.message}
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
          </div>
        </div>
      </main>
    </>
  );
}
