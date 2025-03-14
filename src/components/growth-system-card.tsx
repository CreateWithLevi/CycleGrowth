"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

interface GrowthSystemCardProps {
  title: string;
  description: string;
  progress: number;
  phase: string;
  icon: React.ReactNode;
  detailsLink?: string;
}

export default function GrowthSystemCard({
  title,
  description,
  progress,
  phase,
  icon,
  detailsLink = "/dashboard/growth-cycles",
}: GrowthSystemCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="p-2 rounded-full bg-purple-100 text-purple-600">
            {icon}
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500">
            Current phase: <span className="font-medium">{phase}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={detailsLink} className="w-full">
          <Button
            variant="outline"
            className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
