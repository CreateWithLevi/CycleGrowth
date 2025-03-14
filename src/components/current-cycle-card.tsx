"use client";

import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import DashboardCycleProgress from "./dashboard-cycle-progress";

interface CurrentCycleCardProps {
  name: string;
  description: string;
  currentPhase: "planning" | "execution" | "analysis" | "improvement";
  startDate: string;
  phaseCompletion: number;
  overallProgress: number;
  continueLink?: string;
}

export default function CurrentCycleCard({
  name,
  description,
  currentPhase,
  startDate,
  phaseCompletion,
  overallProgress,
  continueLink = "/dashboard/growth-cycles",
}: CurrentCycleCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cycle Progress Visualization */}
        <div className="md:w-1/3 flex justify-center">
          <DashboardCycleProgress
            currentPhase={currentPhase}
            phaseCompletion={phaseCompletion}
          />
        </div>

        {/* Cycle Details */}
        <div className="md:w-2/3">
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          <p className="text-gray-600 mb-4">{description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Current Phase
              </h4>
              <p className="font-medium capitalize">{currentPhase}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Started</h4>
              <p className="font-medium">{startDate}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Phase Completion
              </h4>
              <p className="font-medium">{phaseCompletion}%</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Overall Progress
              </h4>
              <p className="font-medium">{overallProgress}%</p>
            </div>
          </div>

          <Link href={continueLink}>
            <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
              Continue Current Phase <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
