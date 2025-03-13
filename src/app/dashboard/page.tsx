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

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

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
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="mr-2 h-4 w-4" /> Create New System
              </Button>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-600 flex gap-2 items-center">
              <InfoIcon size="16" className="text-purple-600" />
              <span>
                Welcome to your CycleGrowth dashboard! This is where you'll
                track your growth cycles and see your progress over time.
              </span>
            </div>
          </header>

          {/* Getting Started Guide */}
          <section className="mb-8">
            <GettingStartedGuide />
          </section>

          {/* Current Cycle Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Current Growth Cycle</h2>
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Cycle Progress Visualization */}
                <div className="md:w-1/3 flex justify-center">
                  <div className="relative w-[200px] h-[200px]">
                    {/* Outer circle */}
                    <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>

                    {/* Progress segments */}
                    <div
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600"
                      style={{ transform: "rotate(-45deg)" }}
                    ></div>

                    {/* Inner circle with current phase */}
                    <div className="absolute inset-[20px] rounded-full bg-white border border-gray-200 flex items-center justify-center flex-col">
                      <RefreshCcw className="h-8 w-8 text-purple-600 mb-2" />
                      <span className="text-sm font-medium">
                        Planning Phase
                      </span>
                      <span className="text-xs text-gray-500">1 of 4</span>
                    </div>

                    {/* Phase indicators */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      <Target className="h-4 w-4" />
                    </div>
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 bg-gray-200 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center">
                      <RefreshCcw className="h-4 w-4" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-gray-200 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center">
                      <LineChart className="h-4 w-4" />
                    </div>
                    <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 bg-gray-200 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center">
                      <Brain className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Cycle Details */}
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">
                    Professional Skill Development
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Focus on improving your leadership and communication skills
                    through structured practice and feedback.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Current Phase
                      </h4>
                      <p className="font-medium">Planning</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Started
                      </h4>
                      <p className="font-medium">June 15, 2023</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Phase Completion
                      </h4>
                      <p className="font-medium">25%</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Overall Progress
                      </h4>
                      <p className="font-medium">10%</p>
                    </div>
                  </div>

                  <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                    Continue Current Phase{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Growth Systems Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Your Growth Systems</h2>
              <Button
                variant="outline"
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                View All
              </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Professional Skill Development",
                  description: "Leadership and communication skills",
                  progress: 10,
                  phase: "Planning",
                  icon: <Target className="h-5 w-5" />,
                },
                {
                  title: "Fitness Journey",
                  description: "Strength training and nutrition",
                  progress: 65,
                  phase: "Execution",
                  icon: <RefreshCcw className="h-5 w-5" />,
                },
                {
                  title: "Learning Spanish",
                  description: "Vocabulary and conversation practice",
                  progress: 85,
                  phase: "Analysis",
                  icon: <LineChart className="h-5 w-5" />,
                },
              ].map((system, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{system.title}</CardTitle>
                      <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                        {system.icon}
                      </div>
                    </div>
                    <CardDescription>{system.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{system.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${system.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Current phase:{" "}
                        <span className="font-medium">{system.phase}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* Recent Activity Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-4">
                  {[
                    {
                      action: "Completed task",
                      item: "Research leadership styles",
                      time: "2 hours ago",
                      icon: <Target className="h-4 w-4" />,
                    },
                    {
                      action: "Updated progress",
                      item: "Spanish vocabulary practice",
                      time: "Yesterday",
                      icon: <RefreshCcw className="h-4 w-4" />,
                    },
                    {
                      action: "Completed phase",
                      item: "Fitness execution phase",
                      time: "3 days ago",
                      icon: <LineChart className="h-4 w-4" />,
                    },
                    {
                      action: "Created new system",
                      item: "Professional Skill Development",
                      time: "1 week ago",
                      icon: <Plus className="h-4 w-4" />,
                    },
                  ].map((activity, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                    >
                      <div className="p-2 rounded-full bg-purple-100 text-purple-600 mt-1">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {activity.action}:{" "}
                          <span className="font-normal">{activity.item}</span>
                        </p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Cyclo Assistant */}
      <CycloAssistant stage={1} />

      {/* Cyclo Insights Panel */}
      <div className="fixed bottom-24 right-6 w-80 sm:w-96">
        <CycloInsightsPanel stage={1} domain="professional" phase="planning" />
      </div>
    </SubscriptionCheck>
  );
}
