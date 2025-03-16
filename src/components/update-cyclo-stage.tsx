"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { createClient } from "../../supabase/client";
import { useToast } from "./ui/use-toast";
import { CycloStage } from "./cyclo-evolution-stages";

interface UpdateCycloStageProps {
  onSuccess?: (stage: CycloStage) => void;
}

export default function UpdateCycloStage({ onSuccess }: UpdateCycloStageProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedStage, setSelectedStage] = useState<CycloStage>(1);
  const { toast } = useToast();
  const supabase = createClient();

  const handleUpgrade = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "update-cyclo-stage",
        {
          body: { stage: selectedStage },
        },
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: `Cyclo has been upgraded to Stage ${selectedStage}`,
      });

      if (onSuccess) {
        onSuccess(selectedStage);
      }
    } catch (error) {
      console.error("Error upgrading Cyclo:", error);
      toast({
        title: "Error",
        description: "Failed to upgrade Cyclo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Upgrade Cyclo</h3>
        <p className="text-sm text-gray-500">
          Select a stage to upgrade your Cyclo assistant
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((stage) => (
          <Button
            key={stage}
            variant={selectedStage === stage ? "default" : "outline"}
            className={selectedStage === stage ? "bg-purple-600" : ""}
            onClick={() => setSelectedStage(stage as CycloStage)}
          >
            Stage {stage}
          </Button>
        ))}
      </div>

      <Button
        className="w-full bg-purple-600 hover:bg-purple-700"
        onClick={handleUpgrade}
        disabled={isUpdating}
      >
        {isUpdating ? "Upgrading..." : "Confirm Upgrade"}
      </Button>
    </div>
  );
}
