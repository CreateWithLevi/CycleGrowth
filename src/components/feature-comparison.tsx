"use client";

import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function FeatureComparison() {
  const features = [
    {
      name: "System Builder Interface",
      free: true,
      description: "Create and customize your growth frameworks",
    },
    {
      name: "Execution Dashboard",
      free: true,
      description: "Track tasks and visualize progress",
    },
    {
      name: "Reflection & Analysis Tools",
      free: true,
      description: "Extract insights from your growth journey",
    },
    {
      name: "System Evolution Interface",
      free: true,
      description: "Refine and evolve your growth system",
    },
    {
      name: "Knowledge Integration Hub",
      free: true,
      description: "Connect insights across domains",
    },
    {
      name: "Community & Sharing",
      free: true,
      description: "Learn from and share with others",
    },
    {
      name: "AI-powered strategy development",
      free: false,
      description: "Get personalized guidance for your growth journey",
    },
    {
      name: "Automated pattern recognition",
      free: false,
      description: "Identify trends and insights automatically",
    },
    {
      name: "Proactive system optimization",
      free: false,
      description: "Receive suggestions to improve your system",
    },
    {
      name: "Personalized reflection guidance",
      free: false,
      description: "Get tailored prompts for deeper insights",
    },
    {
      name: "Intelligent knowledge linking",
      free: false,
      description: "Automatically connect related insights",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Feature Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-4 text-sm">
          <div className="col-span-6 font-medium">Feature</div>
          <div className="col-span-3 font-medium text-center">
            Free Platform
          </div>
          <div className="col-span-3 font-medium text-center">
            Cyclo Assistant
          </div>

          {features.map((feature, index) => (
            <>
              <div key={`name-${index}`} className="col-span-6 py-2 border-t">
                <div className="font-medium">{feature.name}</div>
                <div className="text-gray-500 text-xs">
                  {feature.description}
                </div>
              </div>
              <div
                key={`free-${index}`}
                className="col-span-3 py-2 border-t flex justify-center items-center"
              >
                {feature.free ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <X className="h-5 w-5 text-gray-300" />
                )}
              </div>
              <div
                key={`paid-${index}`}
                className="col-span-3 py-2 border-t flex justify-center items-center"
              >
                <Check className="h-5 w-5 text-green-500" />
              </div>
            </>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
