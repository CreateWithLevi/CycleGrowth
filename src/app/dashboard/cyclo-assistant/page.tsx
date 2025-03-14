"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../../supabase/client";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import CycloEvolutionCard from "@/components/cyclo-evolution-card";
import { CycloStage } from "@/components/cyclo-evolution-stages";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Lightbulb,
  MessageCircle,
  RefreshCcw,
  Sparkles,
  Target,
  Zap,
  Check,
} from "lucide-react";
import CycloAssistant from "@/components/cyclo-assistant";

export default function CycloAssistantPage() {
  const [currentStage, setCurrentStage] = useState<CycloStage>(1);
  const [activeTab, setActiveTab] = useState("overview");

  const handleUpgrade = (stage: CycloStage) => {
    setCurrentStage(stage);
    // In a real implementation, this would call an API to update the subscription
  };

  const examplePrompts = [
    {
      title: "Goal Setting",
      prompts: [
        "Help me break down my goal into actionable steps",
        "What metrics should I track for my professional development?",
        "How can I create a balanced growth system?",
      ],
    },
    {
      title: "Execution Support",
      prompts: [
        "I'm stuck on my current task, what should I do?",
        "How can I maintain momentum in my growth cycle?",
        "What's the best way to track my daily progress?",
      ],
    },
    {
      title: "Reflection Guidance",
      prompts: [
        "What patterns should I look for in my performance data?",
        "How can I extract meaningful insights from my experience?",
        "What questions should I ask myself during reflection?",
      ],
    },
    {
      title: "System Evolution",
      prompts: [
        "How should I adjust my system based on my results?",
        "What's the next logical step in my growth journey?",
        "How can I connect insights across different domains?",
      ],
    },
  ];

  const useCases = [
    {
      title: "Planning Phase",
      description:
        "Cyclo helps you design effective growth systems and set meaningful goals.",
      icon: <Target className="h-8 w-8 text-purple-500" />,
      capabilities: [
        "Template suggestions based on your goals",
        "Breaking down objectives into actionable tasks",
        "Identifying key metrics to track progress",
        "Suggesting realistic timelines",
      ],
    },
    {
      title: "Execution Phase",
      description:
        "Cyclo provides accountability and adaptive guidance during implementation.",
      icon: <RefreshCcw className="h-8 w-8 text-blue-500" />,
      capabilities: [
        "Regular check-ins to maintain momentum",
        "Adaptive suggestions based on progress",
        "Obstacle identification and mitigation",
        "Motivation through milestone recognition",
      ],
    },
    {
      title: "Analysis Phase",
      description:
        "Cyclo helps you extract meaningful insights from your experience.",
      icon: <Brain className="h-8 w-8 text-yellow-500" />,
      capabilities: [
        "Pattern recognition in performance data",
        "Structured reflection prompts",
        "Connecting new learnings to existing knowledge",
        "Identifying key success factors and challenges",
      ],
    },
    {
      title: "Improvement Phase",
      description:
        "Cyclo guides you in refining your system based on what you've learned.",
      icon: <Lightbulb className="h-8 w-8 text-green-500" />,
      capabilities: [
        "System optimization suggestions",
        "Experiment design for testing variations",
        "Integration of insights into next cycle",
        "Long-term growth trajectory planning",
      ],
    },
  ];

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Cyclo AI Assistant</h1>
            <p className="text-gray-600">
              Your evolving AI partner that grows with you through your personal
              development journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
                  <TabsTrigger value="example-prompts">
                    Example Prompts
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Meet Your Growth Evolution Assistant
                      </CardTitle>
                      <CardDescription>
                        Cyclo evolves with you, providing increasingly
                        personalized guidance as you progress.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <p className="text-gray-600">
                          Cyclo is more than just an AI assistant—it's a growth
                          partner that evolves alongside you. As you progress
                          through your growth cycles, Cyclo learns from your
                          patterns, preferences, and progress to provide
                          increasingly personalized guidance.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-4 border rounded-lg bg-purple-50 border-purple-100">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                                <Sparkles className="h-5 w-5" />
                              </div>
                              <h3 className="font-medium">
                                Personalized Guidance
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              Cyclo provides tailored recommendations based on
                              your unique growth patterns, helping you optimize
                              your approach across different domains.
                            </p>
                          </div>

                          <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                                <Zap className="h-5 w-5" />
                              </div>
                              <h3 className="font-medium">
                                Evolving Capabilities
                              </h3>
                            </div>
                            <p className="text-sm text-gray-600">
                              As Cyclo evolves through four distinct stages, it
                              gains new capabilities to provide increasingly
                              sophisticated assistance for your growth journey.
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <Button
                            onClick={() => setActiveTab("use-cases")}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Explore Use Cases{" "}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Evolution Journey</CardTitle>
                      <CardDescription>
                        Cyclo grows through four stages, each with expanded
                        capabilities.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="absolute top-0 bottom-0 left-[15px] w-0.5 bg-gray-200"></div>
                        <div className="space-y-8 relative">
                          {[
                            {
                              stage: "Stage 1",
                              title: "Seed Cyclo",
                              description:
                                "Basic guidance with template suggestions and fundamental growth principles.",
                              icon: <Sparkles className="h-5 w-5" />,
                              color: "purple",
                            },
                            {
                              stage: "Stage 2",
                              title: "Growth Cyclo",
                              description:
                                "Personalized insights based on your progress data and pattern recognition.",
                              icon: <Zap className="h-5 w-5" />,
                              color: "blue",
                            },
                            {
                              stage: "Stage 3",
                              title: "Bloom Cyclo",
                              description:
                                "Advanced recommendations with proactive optimization suggestions.",
                              icon: <Lightbulb className="h-5 w-5" />,
                              color: "green",
                            },
                            {
                              stage: "Stage 4",
                              title: "Wisdom Cyclo",
                              description:
                                "Expert assistance with cross-domain insights and predictive analysis.",
                              icon: <Brain className="h-5 w-5" />,
                              color: "amber",
                            },
                          ].map((stage, index) => (
                            <div key={index} className="flex gap-4">
                              <div
                                className={`w-8 h-8 rounded-full bg-${stage.color}-100 text-${stage.color}-600 flex items-center justify-center z-10 flex-shrink-0`}
                              >
                                {stage.icon}
                              </div>
                              <div
                                className={`flex-1 p-4 rounded-lg border ${currentStage === index + 1 ? `border-${stage.color}-200 bg-${stage.color}-50` : "border-gray-200"}`}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="text-sm text-gray-500">
                                      {stage.stage}
                                    </div>
                                    <h3 className="font-medium">
                                      {stage.title}
                                    </h3>
                                  </div>
                                  {currentStage === index + 1 && (
                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                      Current
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {stage.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="use-cases" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        How Cyclo Supports Your Growth Cycle
                      </CardTitle>
                      <CardDescription>
                        Cyclo provides specialized assistance for each phase of
                        your growth journey.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {useCases.map((useCase, index) => (
                          <div
                            key={index}
                            className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center gap-3 mb-3">
                              {useCase.icon}
                              <h3 className="font-medium">{useCase.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              {useCase.description}
                            </p>
                            <ul className="space-y-2">
                              {useCase.capabilities.map((capability, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{capability}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="example-prompts" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Example Prompts to Try with Cyclo</CardTitle>
                      <CardDescription>
                        Get started with these example prompts to see how Cyclo
                        can assist you.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {examplePrompts.map((category, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <h3 className="font-medium mb-3">
                              {category.title}
                            </h3>
                            <ul className="space-y-2">
                              {category.prompts.map((prompt, idx) => (
                                <li
                                  key={idx}
                                  className="p-2 bg-gray-50 rounded text-sm hover:bg-gray-100 cursor-pointer transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4 text-purple-500" />
                                    <span>{prompt}</span>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <CycloEvolutionCard
                currentStage={currentStage}
                onUpgrade={handleUpgrade}
              />
            </div>
          </div>
        </div>
      </main>

      <CycloAssistant
        stage={currentStage}
        initialMessage="Hi there! I'm Cyclo, your growth evolution assistant. How can I help with your growth journey today?"
        onUpgrade={() => setActiveTab("overview")}
      />
    </SubscriptionCheck>
  );
}
