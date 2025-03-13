"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { cycloEvolutionStages, CycloStage } from "./cyclo-evolution-stages";
import { Check, Sparkles } from "lucide-react";

interface CycloUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: CycloStage;
  onUpgrade: (stage: CycloStage) => void;
}

export default function CycloUpgradeModal({
  isOpen,
  onClose,
  currentStage,
  onUpgrade,
}: CycloUpgradeModalProps) {
  const [selectedStage, setSelectedStage] = useState<CycloStage>(
    Math.min(currentStage + 1, 4) as CycloStage,
  );

  const handleUpgrade = () => {
    onUpgrade(selectedStage);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Upgrade Your Cyclo Assistant
          </DialogTitle>
          <DialogDescription>
            Choose the evolution stage that best fits your growth journey needs.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {cycloEvolutionStages.map((stage) => (
            <div
              key={stage.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedStage === stage.id
                  ? `border-${stage.color}-500 bg-${stage.color}-50`
                  : "border-gray-200 hover:border-gray-300"
              } ${currentStage >= stage.id ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() =>
                currentStage < stage.id && setSelectedStage(stage.id)
              }
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-2 rounded-full bg-${stage.color}-100 text-${stage.color}-600`}
                  >
                    {stage.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{stage.title}</h3>
                    <div className="text-xs text-gray-500">{stage.name}</div>
                  </div>
                </div>
                {currentStage >= stage.id && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                    <Check className="h-3 w-3" /> Current
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-3">{stage.description}</p>

              <div className="space-y-2">
                <div className="text-sm font-medium">Key Capabilities:</div>
                <ul className="text-xs space-y-1">
                  {stage.capabilities.map((capability, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check
                        className={`h-3 w-3 text-${stage.color}-500 mt-0.5`}
                      />
                      <span>{capability}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 text-right">
                <span className="font-medium">{stage.price}</span>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={currentStage >= selectedStage}
            className={`bg-gradient-to-r ${cycloEvolutionStages[selectedStage - 1].gradientFrom} ${cycloEvolutionStages[selectedStage - 1].gradientTo}`}
          >
            Upgrade to {cycloEvolutionStages[selectedStage - 1].title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
