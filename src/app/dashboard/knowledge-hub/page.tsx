import DashboardNavbar from "@/components/dashboard-navbar";
import KnowledgeHub from "@/components/knowledge-hub";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";

export default async function KnowledgeHubPage() {
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
              Knowledge Integration Hub
            </h1>
            <p className="text-gray-600">
              Connect insights across different domains and build your personal
              knowledge system.
            </p>
          </div>

          <KnowledgeHub />
        </div>
      </main>
    </SubscriptionCheck>
  );
}
