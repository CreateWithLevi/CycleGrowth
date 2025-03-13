"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { CycloStage, getCycloStage } from "./cyclo-evolution-stages";
import { ArrowRight, Lightbulb, Sparkles, X } from "lucide-react";

interface CycloInsightsPanelProps {
  stage: CycloStage;
  domain?: string;
  phase?: string;
  onClose?: () => void;
}

export default function CycloInsightsPanel({
  stage = 1,
  domain = "professional",
  phase = "planning",
  onClose,
}: CycloInsightsPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const cycloStage = getCycloStage(stage);

  // Generate insights based on stage, domain and phase
  const getInsights = () => {
    const baseInsights = [
      "Consider breaking down your goals into smaller, measurable milestones.",
      "Regular reflection helps identify patterns in your progress.",
    ];

    // Add more sophisticated insights based on stage
    if (stage >= 2) {
      baseInsights.push(
        "Your task completion rate is highest on Tuesday mornings.",
        "You tend to make more progress when you work in 25-minute focused sessions.",
      );
    }

    if (stage >= 3) {
      baseInsights.push(
        "Based on your past cycles, you might face a motivation dip next week.",
        "Your communication skills have improved 23% since your last assessment.",
      );
    }

    if (stage >= 4) {
      baseInsights.push(
        "The strategies you used in your fitness domain could be applied to your current professional challenge.",
        "Predictive analysis suggests focusing on leadership scenarios for maximum growth impact.",
      );
    }

    // Domain-specific insights
    if (domain === "professional") {
      baseInsights.push(
        "Consider seeking feedback from peers on your communication style.",
        "Practicing presentations with video recording can accelerate your progress.",
      );
    }

    // Phase-specific insights
    if (phase === "planning") {
      baseInsights.push(
        "Setting specific criteria for success will make your reflection phase more effective.",
        "Consider scheduling regular check-ins to maintain accountability.",
      );
    }

    return baseInsights;
  };

  const insights = getInsights();

  return (
    <Card
      className={`w-full transition-all duration-300 ${expanded ? "" : "hover:shadow-md"}`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div
            className={`p-1.5 rounded-full bg-${cycloStage.color}-100 text-${cycloStage.color}-600`}
          >
            <Lightbulb className="h-4 w-4" />
          </div>
          <span>Cyclo Insights</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {expanded ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Based on your current growth cycle and past patterns, Cyclo has
              generated the following insights:
            </p>
            <ul className="space-y-3">
              {insights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <Sparkles
                    className={`h-5 w-5 text-${cycloStage.color}-500 mt-0.5 flex-shrink-0`}
                  />
                  <div>
                    <p className="text-sm">{insight}</p>
                    {stage >= 3 && index < 2 && (
                      <div className="mt-2">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                        >
                          Apply this insight{" "}
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="pt-2 text-xs text-gray-500 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>Insights powered by {cycloStage.title}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {stage >= 3
                ? "Cyclo has generated 7 personalized insights based on your growth patterns."
                : "Cyclo has some suggestions to help with your current growth cycle."}
            </p>
            <Button
              size="sm"
              onClick={() => setExpanded(true)}
              className={`bg-gradient-to-r ${cycloStage.gradientFrom} ${cycloStage.gradientTo}`}
            >
              View Insights
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
