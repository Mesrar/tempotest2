import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { InfoIcon, UserCircle, ClipboardCheck, UserCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { SubscriptionCheck } from "@/components/subscription-check";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <SubscriptionCheck>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                This is a protected page only visible to authenticated users
              </span>
            </div>
          </header>

          {/* User Profile Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <UserCircle size={48} className="text-primary" />
              <div>
                <h2 className="font-semibold text-xl">User Profile</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 overflow-hidden">
              <pre className="text-xs font-mono max-h-48 overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
            </div>
          </section>

          {/* Quick Actions Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <h2 className="font-semibold text-xl mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/post-job"
                className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-100 flex items-center gap-3 transition-colors"
              >
                <div className="bg-blue-100 p-2 rounded-full">
                  <ClipboardCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Post a New Job</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a new temporary staffing position
                  </p>
                </div>
              </Link>
              <div className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg border border-blue-100 flex items-center gap-3 transition-colors">
                <div className="bg-blue-100 p-2 rounded-full">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">View Candidates</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse matched candidates for your jobs
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
