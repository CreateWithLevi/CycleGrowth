import DashboardNavbar from "@/components/dashboard-navbar";
import GrowthCycleViewConnected from "@/components/growth-cycle-view-connected";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function GrowthCyclesPage() {
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Growth Cycles</h1>
              <p className="text-gray-600">
                Manage and track your ongoing growth cycles across different
                domains.
              </p>
            </div>
            <Link href="/dashboard/system-builder">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" /> Create New System
              </Button>
            </Link>
          </div>

          <GrowthCycleViewConnected />
        </div>
      </main>
    </SubscriptionCheck>
  );
}
