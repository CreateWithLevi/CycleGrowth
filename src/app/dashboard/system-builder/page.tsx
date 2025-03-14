import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SystemBuilderForm from "@/components/system-builder-form";
import { GrowthCyclePhaseInfo } from "@/components/empty-states";

export default async function SystemBuilderPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Create Your Growth System
            </h1>
            <p className="text-gray-600">
              Design a personalized framework to guide your growth journey
              through planning, execution, analysis, and improvement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>System Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <SystemBuilderForm />
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Growth Cycle Phases</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Your growth system will guide you through these four phases
                    to ensure continuous improvement and learning.
                  </p>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg bg-purple-50 border-purple-100">
                      <h3 className="font-medium flex items-center gap-2 text-purple-800">
                        Planning Phase
                      </h3>
                      <p className="text-sm text-purple-700">
                        Set clear goals and break them down into manageable
                        tasks.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg bg-blue-50 border-blue-100">
                      <h3 className="font-medium flex items-center gap-2 text-blue-800">
                        Execution Phase
                      </h3>
                      <p className="text-sm text-blue-700">
                        Track your progress and maintain momentum throughout
                        your journey.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-100">
                      <h3 className="font-medium flex items-center gap-2 text-yellow-800">
                        Analysis Phase
                      </h3>
                      <p className="text-sm text-yellow-700">
                        Review your performance and extract valuable insights.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg bg-green-50 border-green-100">
                      <h3 className="font-medium flex items-center gap-2 text-green-800">
                        Improvement Phase
                      </h3>
                      <p className="text-sm text-green-700">
                        Refine your approach based on what you've learned.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tips for Success</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500">•</span> Be specific
                      about what you want to achieve
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500">•</span> Break down
                      large goals into smaller milestones
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500">•</span> Set realistic
                      timelines for your growth journey
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500">•</span> Choose a domain
                      you're genuinely interested in
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500">•</span> Consider how
                      you'll measure your progress
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
