import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Award,
  FileText,
  Briefcase,
  UserCheck,
} from "lucide-react";

export default function ForWorkers() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find Temporary Logistics Jobs in Morocco
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with top logistics employers and find temporary
                positions that match your skills and availability.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/join-staff">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Join as Staff
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="outline" size="lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Benefits of Joining LogiStaff
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Flexible Scheduling
                </h3>
                <p className="text-gray-600">
                  Choose when you work with temporary positions ranging from one
                  day to several months.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Competitive Pay</h3>
                <p className="text-gray-600">
                  Earn competitive wages with transparent payment terms and
                  timely deposits.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Legal Protection</h3>
                <p className="text-gray-600">
                  All contracts comply with Moroccan labor laws, ensuring your
                  rights are protected.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Career Growth</h3>
                <p className="text-gray-600">
                  Build experience and connections in the logistics industry
                  with varied assignments.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Matching</h3>
                <p className="text-gray-600">
                  Our algorithm matches you with positions that fit your skills
                  and preferences.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Verified Employers
                </h3>
                <p className="text-gray-600">
                  Work with vetted logistics companies that maintain high
                  standards for their staff.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              How It Works
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200 hidden md:block" />

                <div className="space-y-12">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex md:justify-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                        1
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <h3 className="text-xl font-semibold mb-2">
                        Create Your Profile
                      </h3>
                      <p className="text-gray-600">
                        Sign up and build your profile with your skills,
                        experience, and certifications.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex md:justify-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                        2
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <h3 className="text-xl font-semibold mb-2">
                        Upload Your Resume
                      </h3>
                      <p className="text-gray-600">
                        Our AI will parse your resume to highlight your
                        logistics skills and experience.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex md:justify-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                        3
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <h3 className="text-xl font-semibold mb-2">
                        Get Matched to Jobs
                      </h3>
                      <p className="text-gray-600">
                        Our AI matching engine will connect you with temporary
                        positions that fit your profile.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex md:justify-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                        4
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <h3 className="text-xl font-semibold mb-2">
                        Accept Job Offers
                      </h3>
                      <p className="text-gray-600">
                        Review and accept job offers that match your preferences
                        and availability.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4 flex md:justify-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                        5
                      </div>
                    </div>
                    <div className="md:w-3/4">
                      <h3 className="text-xl font-semibold mb-2">
                        Work & Build Your Reputation
                      </h3>
                      <p className="text-gray-600">
                        Complete assignments and receive ratings to build your
                        profile and get more opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              What Our Workers Say
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    M
                  </div>
                  <div>
                    <h4 className="font-semibold">Mohammed L.</h4>
                    <p className="text-sm text-gray-500">Warehouse Associate</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "LogiStaff helped me find consistent work in warehousing. The
                  flexible schedule allows me to balance work with my studies."
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    F
                  </div>
                  <div>
                    <h4 className="font-semibold">Fatima B.</h4>
                    <p className="text-sm text-gray-500">
                      Inventory Specialist
                    </p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "I've been able to build my skills across different logistics
                  companies. The platform makes it easy to find new
                  opportunities."
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    Y
                  </div>
                  <div>
                    <h4 className="font-semibold">Youssef A.</h4>
                    <p className="text-sm text-gray-500">Forklift Operator</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The contracts are always clear and payment is reliable. I
                  appreciate how the platform protects workers' rights."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Find Your Next Logistics Job?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join hundreds of logistics professionals finding flexible work
              opportunities across Morocco.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/join-staff">
                <Button size="lg" variant="secondary">
                  Create Your Profile
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
