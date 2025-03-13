"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { cycloEvolutionStages, CycloStage } from "./cyclo-evolution-stages";
import CycloUpgradeModal from "./cyclo-upgrade-modal";
import { ArrowRight, Check } from "lucide-react";

interface CycloEvolutionCardProps {
  currentStage: CycloStage;
  onUpgrade?: (stage: CycloStage) => void;
}

export default function CycloEvolutionCard({
  currentStage = 1,
  onUpgrade,
}: CycloEvolutionCardProps) {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const currentCycloStage = cycloEvolutionStages[currentStage - 1];
  const nextStage =
    currentStage < 4 ? cycloEvolutionStages[currentStage] : null;

  const handleUpgrade = (stage: CycloStage) => {
    if (onUpgrade) {
      onUpgrade(stage);
    }
  };

  return (
    <>
      <Card className="w-full overflow-hidden">
        <div
          className={`h-2 bg-gradient-to-r ${currentCycloStage.gradientFrom} ${currentCycloStage.gradientTo}`}
        ></div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                {currentCycloStage.icon}
                <span>{currentCycloStage.title}</span>
              </CardTitle>
              <CardDescription>{currentCycloStage.name}</CardDescription>
            </div>
            <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Current Stage
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            {currentCycloStage.description}
          </p>

          <div className="space-y-3">
            <div className="text-sm font-medium">Current Capabilities:</div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentCycloStage.capabilities.map((capability, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Check
                    className={`h-4 w-4 text-${currentCycloStage.color}-500 mt-0.5 flex-shrink-0`}
                  />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </div>

          {nextStage && (
            <div className="mt-6 p-4 border border-dashed rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {nextStage.icon}
                  <div>
                    <h3 className="font-medium">{nextStage.title}</h3>
                    <div className="text-xs text-gray-500">Next Evolution</div>
                  </div>
                </div>
                <div className="text-sm font-medium">{nextStage.price}</div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {nextStage.description}
              </p>
              <Button
                onClick={() => setIsUpgradeModalOpen(true)}
                className={`w-full bg-gradient-to-r ${nextStage.gradientFrom} ${nextStage.gradientTo}`}
              >
                Upgrade Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm text-gray-500">
            Current plan:{" "}
            <span className="font-medium">{currentCycloStage.price}</span>
          </div>
          <Button variant="outline" onClick={() => setIsUpgradeModalOpen(true)}>
            View All Plans
          </Button>
        </CardFooter>
      </Card>

      <CycloUpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        currentStage={currentStage}
        onUpgrade={handleUpgrade}
      />
    </>
  );
}
