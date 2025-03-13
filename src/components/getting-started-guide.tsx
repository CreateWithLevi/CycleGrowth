"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  ArrowRight,
  Target,
  RefreshCcw,
  LineChart,
  Brain,
  Check,
} from "lucide-react";
import Link from "next/link";

export default function GettingStartedGuide() {
  const steps = [
    {
      title: "Create Your First Growth System",
      description:
        "Start by building a personalized framework for your growth journey.",
      icon: <Target className="h-5 w-5" />,
      link: "/dashboard/system-builder",
      linkText: "System Builder",
      completed: false,
    },
    {
      title: "Set Up Your First Cycle",
      description:
        "Define goals, tasks, and metrics for your initial growth cycle.",
      icon: <RefreshCcw className="h-5 w-5" />,
      link: "/dashboard/growth-cycles",
      linkText: "Growth Cycles",
      completed: false,
    },
    {
      title: "Track Your Progress",
      description:
        "Use the task manager to stay on top of your growth activities.",
      icon: <LineChart className="h-5 w-5" />,
      link: "/dashboard/tasks",
      linkText: "Task Manager",
      completed: false,
    },
    {
      title: "Reflect and Learn",
      description:
        "Capture insights and connect knowledge across your growth journey.",
      icon: <Brain className="h-5 w-5" />,
      link: "/dashboard/reflection",
      linkText: "Reflection Tool",
      completed: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Getting Started with CycleGrowth</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`p-2 rounded-full ${step.completed ? "bg-green-100 text-green-600" : "bg-purple-100 text-purple-600"} mt-1`}
              >
                {step.completed ? <Check className="h-4 w-4" /> : step.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                <Link href={step.link}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    {step.linkText} <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
