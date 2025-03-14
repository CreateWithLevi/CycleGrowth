import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Plus, RefreshCcw, Target, LineChart, Brain, Info } from "lucide-react";
import Link from "next/link";

export function EmptyCurrentCycle() {
  return (
    <Card className="w-full">
      <CardContent className="p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
          <RefreshCcw className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Active Growth Cycle</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          Start your growth journey by creating your first growth system. Define
          your goals, track your progress, and evolve your approach over time.
        </p>
        <Link href="/dashboard/system-builder">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Create Your First System
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function EmptyGrowthSystems() {
  return (
    <Card className="w-full">
      <CardContent className="p-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
          <Target className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Growth Systems Yet</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          Build personalized growth systems to guide your development across
          different domains like professional skills, health, learning, and
          more.
        </p>
        <Link href="/dashboard/system-builder">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Plus className="mr-2 h-4 w-4" /> Create New System
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function EmptyRecentActivity() {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col items-center justify-center text-center py-8">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
          <Info className="h-6 w-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Activity Yet</h3>
        <p className="text-gray-500 text-sm max-w-md">
          Your recent actions and progress will appear here as you use the
          platform. Start by creating your first growth system.
        </p>
      </CardContent>
    </Card>
  );
}

export function GrowthCyclePhaseInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <div className="p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-600" /> Planning Phase
        </h4>
        <p className="text-sm text-gray-600 mt-2">
          Set clear goals and break them down into manageable tasks with a
          structured timeline.
        </p>
      </div>

      <div className="p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium flex items-center gap-2">
          <RefreshCcw className="h-5 w-5 text-blue-600" /> Execution Phase
        </h4>
        <p className="text-sm text-gray-600 mt-2">
          Track your progress and maintain momentum throughout your growth
          journey.
        </p>
      </div>

      <div className="p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium flex items-center gap-2">
          <LineChart className="h-5 w-5 text-yellow-600" /> Analysis Phase
        </h4>
        <p className="text-sm text-gray-600 mt-2">
          Review your performance and extract valuable insights from your
          experience.
        </p>
      </div>

      <div className="p-4 border rounded-lg bg-gray-50">
        <h4 className="font-medium flex items-center gap-2">
          <Brain className="h-5 w-5 text-green-600" /> Improvement Phase
        </h4>
        <p className="text-sm text-gray-600 mt-2">
          Refine your approach based on what you've learned and plan your next
          cycle.
        </p>
      </div>
    </div>
  );
}
