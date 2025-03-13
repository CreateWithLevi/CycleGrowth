import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user profile data
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
            <p className="text-gray-600">
              Manage your account preferences and subscription settings.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="notifications">
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger value="preferences">Preferences</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile" className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              defaultValue={profile?.name || ""}
                              placeholder="Your name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              defaultValue={profile?.email || user.email || ""}
                              placeholder="Your email"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <textarea
                            id="bio"
                            className="w-full min-h-[100px] p-2 border rounded-md"
                            placeholder="Tell us about yourself"
                          ></textarea>
                        </div>

                        <Button className="bg-purple-600 hover:bg-purple-700">
                          Save Changes
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Email Notifications
                            </h3>
                            <p className="text-sm text-gray-500">
                              Receive email updates about your growth cycles.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Task Reminders
                            </h3>
                            <p className="text-sm text-gray-500">
                              Get reminders for upcoming tasks and milestones.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Cycle Completion
                            </h3>
                            <p className="text-sm text-gray-500">
                              Notifications when you complete a growth cycle
                              phase.
                            </p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Product Updates
                            </h3>
                            <p className="text-sm text-gray-500">
                              Stay informed about new features and improvements.
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>

                        <Button className="bg-purple-600 hover:bg-purple-700">
                          Save Preferences
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="preferences" className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">Dark Mode</h3>
                            <p className="text-sm text-gray-500">
                              Toggle between light and dark theme.
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              Compact View
                            </h3>
                            <p className="text-sm text-gray-500">
                              Display more information with less spacing.
                            </p>
                          </div>
                          <Switch defaultChecked={false} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <select
                            id="timezone"
                            className="w-full p-2 border rounded-md"
                            defaultValue="UTC"
                          >
                            <option value="UTC">
                              UTC (Coordinated Universal Time)
                            </option>
                            <option value="EST">
                              EST (Eastern Standard Time)
                            </option>
                            <option value="CST">
                              CST (Central Standard Time)
                            </option>
                            <option value="MST">
                              MST (Mountain Standard Time)
                            </option>
                            <option value="PST">
                              PST (Pacific Standard Time)
                            </option>
                          </select>
                        </div>

                        <Button className="bg-purple-600 hover:bg-purple-700">
                          Save Preferences
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>
                    Manage your subscription and billing information.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <h3 className="font-medium text-purple-800 mb-1">
                        Current Plan: Seed Cyclo
                      </h3>
                      <p className="text-sm text-purple-700 mb-2">
                        Your subscription renews on October 15, 2023
                      </p>
                      <Button
                        variant="outline"
                        className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        Manage Subscription
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Payment Method</h3>
                      <div className="p-3 border rounded-md flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 bg-blue-500 rounded"></div>
                          <span>•••• 4242</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Change
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Billing Address</h3>
                      <div className="p-3 border rounded-md">
                        <p className="text-sm text-gray-600">
                          123 Growth Street
                          <br />
                          San Francisco, CA 94103
                          <br />
                          United States
                        </p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      View Billing History
                    </Button>
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
