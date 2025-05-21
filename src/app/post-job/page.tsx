import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { SubscriptionCheck } from "@/components/subscription-check";
import { InfoIcon } from "lucide-react";

export default async function PostJob() {
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
            <h1 className="text-3xl font-bold">Post a Job</h1>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Create a new temporary staffing position for your logistics
                operations
              </span>
            </div>
          </header>

          {/* Job Form Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <form className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Job Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input
                      id="job-title"
                      placeholder="e.g. Warehouse Associate"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job-location">Location</Label>
                    <Input id="job-location" placeholder="e.g. Casablanca" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-description">Job Description</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Describe the job responsibilities and requirements"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="job-type">Job Type</Label>
                    <select
                      id="job-type"
                      className="w-full p-2 border rounded-md bg-background"
                    >
                      <option value="full-time-temp">
                        Full-time Temporary
                      </option>
                      <option value="part-time-temp">
                        Part-time Temporary
                      </option>
                      <option value="seasonal">Seasonal</option>
                      <option value="day-labor">Day Labor</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input id="start-date" type="date" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (days)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      placeholder="e.g. 30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hourly-rate">Hourly Rate (MAD)</Label>
                    <Input
                      id="hourly-rate"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g. 50.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="positions">Number of Positions</Label>
                    <Input
                      id="positions"
                      type="number"
                      min="1"
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills-required">Required Skills</Label>
                  <Input
                    id="skills-required"
                    placeholder="e.g. Forklift operation, inventory management"
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button type="submit" className="w-full md:w-auto">
                  Post Job
                </Button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </SubscriptionCheck>
  );
}
