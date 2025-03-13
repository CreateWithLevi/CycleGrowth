"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/client";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CycloStage, getCycloStage } from "@/components/cyclo-evolution-stages";
import CycloEvolutionCard from "@/components/cyclo-evolution-card";

export default function CycloSettingsPage() {
  const [currentStage, setCurrentStage] = useState<CycloStage>(1);
  const cycloStage = getCycloStage(currentStage);

  const handleUpgrade = (stage: CycloStage) => {
    setCurrentStage(stage);
    // In a real implementation, this would call an API to update the subscription
  };

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Cyclo Assistant Settings
            </h1>
            <p className="text-gray-600">
              Customize your Cyclo experience and manage your subscription.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cyclo Preferences</CardTitle>
                  <CardDescription>
                    Customize how Cyclo interacts with you and your growth
                    cycles.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="notifications">
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger value="privacy">Privacy & Data</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Cyclo Visibility
                            </h3>
                            <p className="text-sm text-gray-500">
                              Show or hide Cyclo assistant in your dashboard.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Proactive Insights
                            </h3>
                            <p className="text-sm text-gray-500">
                              Allow Cyclo to suggest insights based on your
                              activity.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">Cyclo Voice</h3>
                            <p className="text-sm text-gray-500">
                              Choose how Cyclo communicates with you.
                            </p>
                          </div>
                          <select className="p-2 border rounded-md">
                            <option value="supportive">Supportive</option>
                            <option value="direct">Direct</option>
                            <option value="analytical">Analytical</option>
                            <option value="motivational">Motivational</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cyclo-name">Cyclo Name</Label>
                          <Input id="cyclo-name" defaultValue="Cyclo" />
                        </div>

                        <Button
                          className={`bg-gradient-to-r ${cycloStage.gradientFrom} ${cycloStage.gradientTo}`}
                        >
                          Save Preferences
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Task Reminders
                            </h3>
                            <p className="text-sm text-gray-500">
                              Receive reminders for upcoming tasks and
                              deadlines.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Milestone Celebrations
                            </h3>
                            <p className="text-sm text-gray-500">
                              Get notifications when you complete important
                              milestones.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Insight Alerts
                            </h3>
                            <p className="text-sm text-gray-500">
                              Be notified when Cyclo generates new insights.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Weekly Summaries
                            </h3>
                            <p className="text-sm text-gray-500">
                              Receive weekly progress reports and
                              recommendations.
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>

                        <Button
                          className={`bg-gradient-to-r ${cycloStage.gradientFrom} ${cycloStage.gradientTo}`}
                        >
                          Save Notification Settings
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="privacy" className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Data Collection
                            </h3>
                            <p className="text-sm text-gray-500">
                              Allow Cyclo to analyze your growth data for
                              personalized insights.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Conversation History
                            </h3>
                            <p className="text-sm text-gray-500">
                              Store conversation history for context and
                              continuity.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Anonymous Usage Data
                            </h3>
                            <p className="text-sm text-gray-500">
                              Share anonymous usage data to improve Cyclo's
                              capabilities.
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>

                        <div className="pt-4">
                          <Button variant="outline" className="mr-2">
                            Export My Data
                          </Button>
                          <Button
                            variant="outline"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                          >
                            Clear Conversation History
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div>
              <CycloEvolutionCard
                currentStage={currentStage}
                onUpgrade={handleUpgrade}
              />

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>
                    Your Cyclo interaction metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Conversations
                      </span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Insights Generated
                      </span>
                      <span className="font-medium">47</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Tasks Completed
                      </span>
                      <span className="font-medium">18</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Growth Cycles
                      </span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="pt-2 text-xs text-gray-500">
                      Last updated: Today at 10:45 AM
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
