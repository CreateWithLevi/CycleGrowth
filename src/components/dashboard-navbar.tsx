"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  Home,
  RefreshCcw,
  LineChart,
  Target,
  Brain,
  Layers,
  Plus,
  Settings,
  Check,
  Sparkles,
  Database,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import CycloLogo from "./cyclo-logo";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    return `flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors ${
      pathname === href ? "text-purple-600 font-bold" : ""
    }`;
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            prefetch
            className="text-xl font-bold flex items-center gap-2"
          >
            <CycloLogo size="md" />
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className={getLinkClass("/dashboard")}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/dashboard/growth-cycles"
            className={getLinkClass("/dashboard/growth-cycles")}
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Growth Cycles</span>
          </Link>
          <Link
            href="/dashboard/system-builder"
            className={getLinkClass("/dashboard/system-builder")}
          >
            <Target className="h-4 w-4" />
            <span>System Builder</span>
          </Link>
          <Link
            href="/dashboard/knowledge-hub"
            className={getLinkClass("/dashboard/knowledge-hub")}
          >
            <Layers className="h-4 w-4" />
            <span>Knowledge Hub</span>
          </Link>
          <Link
            href="/dashboard/tasks"
            className={getLinkClass("/dashboard/tasks")}
          >
            <Check className="h-4 w-4" />
            <span>Tasks</span>
          </Link>
          <Link
            href="/dashboard/analytics"
            className={getLinkClass("/dashboard/analytics")}
          >
            <LineChart className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          <Link
            href="/dashboard/reflection"
            className={getLinkClass("/dashboard/reflection")}
          >
            <Brain className="h-4 w-4" />
            <span>Reflection</span>
          </Link>
          <Link
            href="/dashboard/cyclo-assistant"
            className={getLinkClass("/dashboard/cyclo-assistant")}
          >
            <Sparkles className="h-4 w-4" />
            <span>Cyclo Assistant</span>
          </Link>
          {/* <Link
            href="/dashboard/diagnostics"
            className={getLinkClass("/dashboard/diagnostics")}
          >
            <Database className="h-4 w-4" />
            <span>Diagnostics</span>
          </Link> */}
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/dashboard/system-builder">
            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex items-center gap-2 border-purple-200 text-purple-600 hover:bg-purple-50"
            >
              <Plus className="h-4 w-4" />
              <span>New System</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <UserCircle className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/cyclo-settings">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Cyclo Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await supabase.auth.signOut();
                  router.push("/sign-in");
                }}
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
