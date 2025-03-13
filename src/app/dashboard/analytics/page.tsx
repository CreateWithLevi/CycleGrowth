import DashboardNavbar from "@/components/dashboard-navbar";
import ProgressAnalytics from "@/components/progress-analytics";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";

export default async function AnalyticsPage() {
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
            <h1 className="text-3xl font-bold mb-2">Progress Analytics</h1>
            <p className="text-gray-600">
              Visualize your growth journey with detailed metrics and insights.
            </p>
          </div>

          <ProgressAnalytics />
        </div>
      </main>
    </SubscriptionCheck>
  );
}
