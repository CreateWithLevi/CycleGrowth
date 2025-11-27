import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { fetchActiveCycle } from "@/features/dashboard";
import DashboardClient from "./dashboard-client";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch active cycle data using the new feature
  const activeCycleData = await fetchActiveCycle();

  // Get user's display name or email
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'there';

  return (
    <SubscriptionCheck>
      <div className="min-h-screen bg-background">
        <DashboardNavbar />

        {/* Linear-inspired main content */}
        <main className="w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            <DashboardClient data={activeCycleData} userName={userName} />
          </div>
        </main>
      </div>
    </SubscriptionCheck>
  );
}
