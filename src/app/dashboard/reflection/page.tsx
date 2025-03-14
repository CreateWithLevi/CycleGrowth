import DashboardNavbar from "@/components/dashboard-navbar";
import ReflectionToolConnected from "@/components/reflection-tool-connected";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";

export default async function ReflectionPage() {
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
            <h1 className="text-3xl font-bold mb-2">Reflection & Analysis</h1>
            <p className="text-gray-600">
              Capture your thoughts, extract insights, and connect learnings
              across your growth journey.
            </p>
          </div>

          <ReflectionToolConnected />
        </div>
      </main>
    </SubscriptionCheck>
  );
}
