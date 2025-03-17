"use client";

import { Card, CardContent } from "./ui/card";
import { LucideIcon } from "lucide-react";

interface Activity {
  action: string;
  item: string;
  time: string;
  icon: React.ReactNode;
}

interface DashboardActivityFeedProps {
  activities: Activity[];
}

export default function DashboardActivityFeed({
  activities = [],
}: DashboardActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No recent activity to display.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <ul className="space-y-4">
          {activities.map((activity, index) => (
            <li
              key={`activity-${index}-${activity.time}`}
              className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
            >
              <div className="p-2 rounded-full bg-purple-100 text-purple-600 mt-1">
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {activity.action}:{" "}
                  <span className="font-normal">{activity.item}</span>
                </p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
