import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CheckCircle2, Upload, FileText, Clock, Award } from "lucide-react";

export default async function JoinStaff() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Join Our Logistics Staff Network
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with top logistics employers in Morocco and find temporary
              positions that match your skills and availability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-6">How It Works</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">
                      Create Your Profile
                    </h3>
                    <p className="text-gray-600">
                      Sign up and build your profile with your skills,
                      experience, and certifications.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">
                      Upload Your Resume
                    </h3>
                    <p className="text-gray-600">
                      Our AI will parse your resume to highlight your logistics
                      skills and experience.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">
                      Get Matched to Jobs
                    </h3>
                    <p className="text-gray-600">
                      Our AI matching engine will connect you with temporary
                      positions that fit your profile.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1">
                      Work & Get Paid
                    </h3>
                    <p className="text-gray-600">
                      Accept offers, complete assignments, and build your
                      reputation in the logistics industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-2xl font-semibold mb-6">
                Create Your Account
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Enter your last name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" />
                </div>

                <div className="pt-2">
                  <Button className="w-full">Sign Up as Staff</Button>
                </div>

                <div className="text-center text-sm text-gray-500 pt-2">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="text-blue-600 hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Why Join LogiStaff?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-3">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Flexible Scheduling
                </h3>
                <p className="text-gray-600">
                  Work when it fits your schedule with temporary positions
                  ranging from one day to several months.
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-3">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium mb-2">Competitive Pay</h3>
                <p className="text-gray-600">
                  Earn competitive wages with transparent payment terms and
                  timely deposits.
                </p>
              </div>

              <div className="bg-white p-5 rounded-lg shadow-sm">
                <div className="text-blue-600 mb-3">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-medium mb-2">Legal Compliance</h3>
                <p className="text-gray-600">
                  All contracts comply with Moroccan labor laws, ensuring your
                  rights are protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
