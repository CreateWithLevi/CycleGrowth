import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import LayoutWithSubscription from "../layout-with-subscription";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <LayoutWithSubscription>
      <div className="min-h-screen bg-background">
        <main>{children}</main>
      </div>
    </LayoutWithSubscription>
  );
}
