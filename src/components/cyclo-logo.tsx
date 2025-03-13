import { RefreshCcw } from "lucide-react";

interface CycloLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white";
}

export default function CycloLogo({
  size = "md",
  variant = "default",
}: CycloLogoProps) {
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  const iconColor = variant === "default" ? "text-purple-600" : "text-white";
  const textGradient =
    variant === "default"
      ? "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
      : "text-white";

  return (
    <div className="flex items-center gap-2">
      <RefreshCcw className={`${iconSizes[size]} ${iconColor}`} />
      <span className={`${textSizes[size]} ${textGradient} font-bold`}>
        CycleGrowth
      </span>
    </div>
  );
}
