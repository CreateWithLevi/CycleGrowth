import { RefreshCcw, Sparkles, Zap, Lightbulb, Layers } from "lucide-react";

export type CycloStage = 1 | 2 | 3 | 4;

export interface CycloEvolutionStage {
  id: CycloStage;
  name: string;
  title: string;
  description: string;
  capabilities: string[];
  icon: React.ReactNode;
  price: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export const cycloEvolutionStages: CycloEvolutionStage[] = [
  {
    id: 1,
    name: "Stage 1",
    title: "Seed Cyclo",
    description:
      "Basic guidance with template suggestions and fundamental growth principles to help you get started.",
    capabilities: [
      "Template suggestions",
      "Basic guidance",
      "Reminder assistance",
      "Simple task tracking",
      "Fundamental growth principles",
    ],
    icon: <Sparkles className="w-6 h-6" />,
    price: "$10/month",
    color: "purple",
    gradientFrom: "from-purple-500",
    gradientTo: "to-blue-500",
  },
  {
    id: 2,
    name: "Stage 2",
    title: "Growth Cyclo",
    description:
      "Personalized insights based on your progress data, with pattern recognition and basic insight generation.",
    capabilities: [
      "All Seed capabilities",
      "Pattern recognition",
      "Basic insight generation",
      "Personalized recommendations",
      "Progress analysis",
    ],
    icon: <Zap className="w-6 h-6" />,
    price: "$15/month",
    color: "blue",
    gradientFrom: "from-blue-500",
    gradientTo: "to-indigo-500",
  },
  {
    id: 3,
    name: "Stage 3",
    title: "Bloom Cyclo",
    description:
      "Advanced recommendations with proactive optimization suggestions and advanced analytics capabilities.",
    capabilities: [
      "All Growth capabilities",
      "Proactive optimization",
      "Advanced analytics",
      "System refinement suggestions",
      "Intelligent task prioritization",
    ],
    icon: <Lightbulb className="w-6 h-6" />,
    price: "$20/month",
    color: "green",
    gradientFrom: "from-green-500",
    gradientTo: "to-teal-500",
  },
  {
    id: 4,
    name: "Stage 4",
    title: "Wisdom Cyclo",
    description:
      "Expert assistance with cross-domain insights and predictive analysis to anticipate challenges before they arise.",
    capabilities: [
      "All Bloom capabilities",
      "Cross-domain insights",
      "Predictive analysis",
      "Challenge anticipation",
      "Strategic growth planning",
    ],
    icon: <Layers className="w-6 h-6" />,
    price: "$25/month",
    color: "amber",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-500",
  },
];

export function getCycloStage(stage: CycloStage): CycloEvolutionStage {
  return (
    cycloEvolutionStages.find((s) => s.id === stage) || cycloEvolutionStages[0]
  );
}
