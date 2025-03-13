import DashboardNavbar from "@/components/dashboard-navbar";
import OnboardingWizard from "@/components/onboarding-wizard";
import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <OnboardingWizard />
        </div>
      </main>
    </>
  );
}
