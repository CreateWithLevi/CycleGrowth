"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Sparkles, X } from "lucide-react";
import Link from "next/link";

export default function CycloSubscriptionBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 relative">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          <p className="text-sm font-medium">
            Upgrade to Cyclo Assistant for personalized growth guidance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/cyclo-assistant">
            <Button
              size="sm"
              variant="outline"
              className="text-white bg-white/0 border-white hover:bg-white/20 hover:text-white"
            >
              Learn More
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              size="sm"
              className="bg-white text-purple-600 hover:bg-white/90"
            >
              Upgrade Now
            </Button>
          </Link>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-1/2 right-4 -translate-y-1/2 sm:static sm:translate-y-0 text-white/80 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
