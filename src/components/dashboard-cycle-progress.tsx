"use client";

import { RefreshCcw, Target, LineChart, Brain } from "lucide-react";

interface DashboardCycleProgressProps {
  currentPhase: "planning" | "execution" | "analysis" | "improvement";
  phaseCompletion: number;
}

export default function DashboardCycleProgress({
  currentPhase = "planning",
  phaseCompletion = 25,
}: DashboardCycleProgressProps) {
  // Calculate rotation for progress arc
  const rotationDegrees = (phaseCompletion / 100) * 360;

  // Determine which phase icon to highlight
  const isActivePlanning = currentPhase === "planning";
  const isActiveExecution = currentPhase === "execution";
  const isActiveAnalysis = currentPhase === "analysis";
  const isActiveImprovement = currentPhase === "improvement";

  return (
    <div className="relative w-[200px] h-[200px]">
      {/* Outer circle */}
      <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>

      {/* Progress segments - dynamically rotate based on completion */}
      <div
        className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600"
        style={{ transform: `rotate(${rotationDegrees - 90}deg)` }}
      ></div>

      {/* Inner circle with current phase */}
      <div className="absolute inset-[20px] rounded-full bg-white border border-gray-200 flex items-center justify-center flex-col">
        {isActivePlanning && (
          <Target className="h-8 w-8 text-purple-600 mb-2" />
        )}
        {isActiveExecution && (
          <RefreshCcw className="h-8 w-8 text-purple-600 mb-2" />
        )}
        {isActiveAnalysis && (
          <LineChart className="h-8 w-8 text-purple-600 mb-2" />
        )}
        {isActiveImprovement && (
          <Brain className="h-8 w-8 text-purple-600 mb-2" />
        )}

        <span className="text-sm font-medium capitalize">
          {currentPhase} Phase
        </span>
        <span className="text-xs text-gray-500">
          {currentPhase === "planning"
            ? "1"
            : currentPhase === "execution"
              ? "2"
              : currentPhase === "analysis"
                ? "3"
                : "4"}{" "}
          of 4
        </span>
      </div>

      {/* Phase indicators */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isActivePlanning ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"} rounded-full w-8 h-8 flex items-center justify-center`}
      >
        <Target className="h-4 w-4" />
      </div>
      <div
        className={`absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 ${isActiveExecution ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"} rounded-full w-8 h-8 flex items-center justify-center`}
      >
        <RefreshCcw className="h-4 w-4" />
      </div>
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 ${isActiveAnalysis ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"} rounded-full w-8 h-8 flex items-center justify-center`}
      >
        <LineChart className="h-4 w-4" />
      </div>
      <div
        className={`absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 ${isActiveImprovement ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-500"} rounded-full w-8 h-8 flex items-center justify-center`}
      >
        <Brain className="h-4 w-4" />
      </div>
    </div>
  );
}
