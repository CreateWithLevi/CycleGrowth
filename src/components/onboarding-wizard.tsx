"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowRight,
  Check,
  Target,
  RefreshCcw,
  LineChart,
  Brain,
} from "lucide-react";

interface OnboardingWizardProps {
  onComplete?: () => void;
}

export default function OnboardingWizard({
  onComplete = () => {},
}: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const domains = [
    {
      id: "professional",
      name: "Professional Skills",
      icon: <Target className="h-5 w-5" />,
    },
    {
      id: "personal",
      name: "Personal Development",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      id: "health",
      name: "Health & Fitness",
      icon: <RefreshCcw className="h-5 w-5" />,
    },
    {
      id: "learning",
      name: "Learning & Education",
      icon: <LineChart className="h-5 w-5" />,
    },
  ];

  const templates = [
    {
      id: "leadership",
      domain: "professional",
      name: "Leadership Development",
    },
    {
      id: "communication",
      domain: "professional",
      name: "Communication Skills",
    },
    { id: "productivity", domain: "professional", name: "Productivity System" },
    { id: "mindfulness", domain: "personal", name: "Mindfulness Practice" },
    { id: "habits", domain: "personal", name: "Habit Building" },
    { id: "relationships", domain: "personal", name: "Relationship Growth" },
    { id: "strength", domain: "health", name: "Strength Training" },
    { id: "nutrition", domain: "health", name: "Nutrition Optimization" },
    { id: "cardio", domain: "health", name: "Cardio Progression" },
    { id: "language", domain: "learning", name: "Language Learning" },
    { id: "coding", domain: "learning", name: "Coding Skills" },
    { id: "reading", domain: "learning", name: "Reading Habit" },
  ];

  const filteredTemplates = templates.filter(
    (t) => t.domain === selectedDomain,
  );

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Welcome to CycleGrowth
        </CardTitle>
        <div className="flex justify-between items-center mt-6">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${s === step ? "bg-purple-600 text-white" : s < step ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}
              >
                {s < step ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`w-24 h-1 ${s < step ? "bg-green-100" : "bg-gray-100"}`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Let's get to know you</h3>
            <p className="text-gray-600">
              Tell us a bit about yourself so we can personalize your
              experience.
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">What are your main growth goals?</Label>
                <textarea
                  id="goals"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Briefly describe what you're hoping to achieve..."
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Select a growth domain</h3>
            <p className="text-gray-600">
              Choose the area you'd like to focus on first.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {domains.map((domain) => (
                <div
                  key={domain.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors ${selectedDomain === domain.id ? "border-purple-500 bg-purple-50" : ""}`}
                  onClick={() => setSelectedDomain(domain.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                      {domain.icon}
                    </div>
                    <span className="font-medium">{domain.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Choose a template</h3>
            <p className="text-gray-600">
              Select a starting point for your growth system.
            </p>

            <div className="grid grid-cols-1 gap-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors ${selectedTemplate === template.id ? "border-purple-500 bg-purple-50" : ""}`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{template.name}</span>
                    {selectedTemplate === template.id && (
                      <Check className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                </div>
              ))}
              <div
                className={`p-4 border rounded-lg cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-colors ${selectedTemplate === "blank" ? "border-purple-500 bg-purple-50" : ""}`}
                onClick={() => setSelectedTemplate("blank")}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Start from scratch</span>
                  {selectedTemplate === "blank" && (
                    <Check className="h-5 w-5 text-purple-600" />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">You're all set!</h3>
            <p className="text-gray-600">
              Your growth system is ready to go. Here's what's next:
            </p>

            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" /> Planning Phase
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Start by setting clear goals and breaking them down into
                  manageable tasks.
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium flex items-center gap-2">
                  <RefreshCcw className="h-5 w-5 text-blue-600" /> Execution
                  Phase
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Track your progress and maintain momentum throughout your
                  growth journey.
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-yellow-600" /> Analysis
                  Phase
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Review your performance and extract valuable insights from
                  your experience.
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium flex items-center gap-2">
                  <Brain className="h-5 w-5 text-green-600" /> Improvement Phase
                </h4>
                <p className="text-sm text-gray-600 mt-2">
                  Refine your approach based on what you've learned and plan
                  your next cycle.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={step === 1}>
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            (step === 2 && !selectedDomain) || (step === 3 && !selectedTemplate)
          }
          className="bg-purple-600 hover:bg-purple-700"
        >
          {step < 4 ? "Next" : "Get Started"}{" "}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
