import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import {
  InfoIcon,
  UserCircle,
  RefreshCcw,
  Target,
  LineChart,
  Brain,
  Plus,
  ArrowRight,
  Check,
} from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import GettingStartedGuide from "@/components/getting-started-guide";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CycloAssistant from "@/components/cyclo-assistant";
import CycloInsightsPanel from "@/components/cyclo-insights-panel";
import CycloSubscriptionBanner from "@/components/cyclo-subscription-banner";
import CurrentCycleCard from "@/components/current-cycle-card";
import GrowthSystemCard from "@/components/growth-system-card";
import DashboardActivityFeed from "@/components/dashboard-activity-feed";
import {
  EmptyCurrentCycle,
  EmptyGrowthSystems,
  EmptyRecentActivity,
  GrowthCyclePhaseInfo,
} from "@/components/empty-states";
import {
  fetchCurrentCycle,
  fetchGrowthSystems,
  fetchRecentActivities,
  fetchUserCycloEvolution,
  createOrUpdateUserCycloEvolution,
} from "@/lib/db";
import { formatDistanceToNow } from "date-fns";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch real data from the database
  const currentCycle = await fetchCurrentCycle(user.id);
  const growthSystems = await fetchGrowthSystems(user.id);
  const recentActivities = await fetchRecentActivities(user.id);

  // Get or create user's Cyclo evolution data
  let cycloEvolution = await fetchUserCycloEvolution(user.id);
  if (!cycloEvolution) {
    cycloEvolution = await createOrUpdateUserCycloEvolution(user.id);
  }

  // Map activities to the format expected by the component
  const mappedActivities = recentActivities.map((activity) => {
    let icon;
    switch (activity.action) {
      case "Created new system":
        icon = <Plus className="h-4 w-4" />;
        break;
      case "Completed task":
        icon = <Check className="h-4 w-4" />;
        break;
      case "Updated phase to":
        if (activity.item === "planning") icon = <Target className="h-4 w-4" />;
        else if (activity.item === "execution")
          icon = <RefreshCcw className="h-4 w-4" />;
        else if (activity.item === "analysis")
          icon = <LineChart className="h-4 w-4" />;
        else if (activity.item === "improvement")
          icon = <Brain className="h-4 w-4" />;
        else icon = <RefreshCcw className="h-4 w-4" />;
        break;
      default:
        icon = <RefreshCcw className="h-4 w-4" />;
    }

    return {
      action: activity.action,
      item: activity.item,
      time: formatDistanceToNow(new Date(activity.created_at), {
        addSuffix: true,
      }),
      icon,
    };
  });

  // Map growth systems to the format expected by the component
  const mappedSystems = growthSystems.map((system) => {
    let icon;
    switch (system.domain) {
      case "professional":
        icon = <Target className="h-5 w-5" />;
        break;
      case "health":
        icon = <RefreshCcw className="h-5 w-5" />;
        break;
      case "learning":
        icon = <LineChart className="h-5 w-5" />;
        break;
      default:
        icon = <Brain className="h-5 w-5" />;
    }

    return {
      title: system.title,
      description: system.description || "",
      progress: system.progress,
      phase:
        system.current_phase.charAt(0).toUpperCase() +
        system.current_phase.slice(1),
      icon,
      detailsLink: `/dashboard/growth-cycles?system=${system.id}`,
    };
  });

  const isNewUser = growthSystems.length === 0;

  return (
    <SubscriptionCheck>
      <CycloSubscriptionBanner />
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Your CycleGrowth Dashboard</h1>
              <Link href="/dashboard/system-builder">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="mr-2 h-4 w-4" /> Create New System
                </Button>
              </Link>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-600 flex gap-2 items-center">
              <InfoIcon size="16" className="text-purple-600" />
              <span>
                Welcome to your CycleGrowth dashboard! This is where you'll
                track your growth cycles and see your progress over time.
              </span>
            </div>
          </header>

          {/* Getting Started Guide - Only show for new users */}
          {isNewUser && (
            <section className="mb-8">
              <GettingStartedGuide />
            </section>
          )}

          {/* Current Cycle Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Current Growth Cycle</h2>
            {currentCycle ? (
              <CurrentCycleCard
                name={currentCycle.title}
                description={currentCycle.description || ""}
                currentPhase={
                  currentCycle.current_phase as
                    | "planning"
                    | "execution"
                    | "analysis"
                    | "improvement"
                }
                startDate={new Date(
                  currentCycle.start_date,
                ).toLocaleDateString()}
                phaseCompletion={25} // This would need to be calculated based on tasks
                overallProgress={currentCycle.progress}
                continueLink={`/dashboard/growth-cycles?system=${currentCycle.id}`}
              />
            ) : (
              <EmptyCurrentCycle />
            )}
          </section>

          {/* Growth Systems Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Growth Systems</h2>
              {growthSystems.length > 0 && (
                <Link href="/dashboard/growth-cycles">
                  <Button
                    variant="outline"
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    View All
                  </Button>
                </Link>
              )}
            </div>

            {growthSystems.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {mappedSystems.slice(0, 3).map((system, index) => (
                  <GrowthSystemCard
                    key={index}
                    title={system.title}
                    description={system.description}
                    progress={system.progress}
                    phase={system.phase}
                    icon={system.icon}
                    detailsLink={system.detailsLink}
                  />
                ))}
              </div>
            ) : (
              <EmptyGrowthSystems />
            )}
          </section>

          {/* Recent Activity Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {mappedActivities.length > 0 ? (
              <DashboardActivityFeed activities={mappedActivities} />
            ) : (
              <EmptyRecentActivity />
            )}
          </section>

          {/* Growth Cycle Phases Info - Show for new users */}
          {isNewUser && (
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Growth Cycle Phases
              </h2>
              <GrowthCyclePhaseInfo />
            </section>
          )}
        </div>
      </main>

      {/* Cyclo Assistant */}
      <CycloAssistant stage={cycloEvolution?.current_stage || 1} />

      {/* Cyclo Insights Panel - Only show if there's an active cycle */}
      {currentCycle && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96">
          <CycloInsightsPanel
            stage={cycloEvolution?.current_stage || 1}
            domain={currentCycle.domain}
            phase={currentCycle.current_phase}
          />
        </div>
      )}
    </SubscriptionCheck>
  );
}
