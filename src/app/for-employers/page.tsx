import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ClipboardCheck,
  UserCheck,
  BarChart,
  FileText,
  TruckIcon,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function ForEmployers() {
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
                Streamline Your Logistics Staffing
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Find qualified temporary staff for your logistics operations in
                Morocco. Our AI-powered platform matches you with the right
                candidates, faster.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/post-job">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Post Your First Job
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" size="lg">
                    Create Employer Account
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
              Why Choose LogiStaff?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Fast Staffing</h3>
                <p className="text-gray-600">
                  Fill positions within 24 hours with pre-vetted candidates
                  ready to work immediately.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Verified Workers</h3>
                <p className="text-gray-600">
                  All candidates are pre-screened with verified skills,
                  experience, and documentation.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <BarChart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Matching</h3>
                <p className="text-gray-600">
                  Our algorithm ranks candidates based on your specific
                  requirements and job details.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Legal Compliance</h3>
                <p className="text-gray-600">
                  All contracts are compliant with Moroccan labor laws, reducing
                  your administrative burden.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <ClipboardCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Simplified Process
                </h3>
                <p className="text-gray-600">
                  Post jobs, review candidates, and generate contracts all in
                  one streamlined platform.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="text-blue-600 mb-4">
                  <TruckIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Logistics Focused
                </h3>
                <p className="text-gray-600">
                  Specialized in the logistics industry with candidates
                  experienced in warehouse, transport, and supply chain.
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
                        Create Your Account
                      </h3>
                      <p className="text-gray-600">
                        Sign up as an employer and complete your company profile
                        with details about your logistics operations.
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
                      <h3 className="text-xl font-semibold mb-2">Post a Job</h3>
                      <p className="text-gray-600">
                        Create a detailed job listing with specific
                        requirements, duration, and compensation details.
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
                        Review Matched Candidates
                      </h3>
                      <p className="text-gray-600">
                        Our AI algorithm will match and rank candidates based on
                        your requirements. Review profiles and select the best
                        fit.
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
                        Generate Contracts
                      </h3>
                      <p className="text-gray-600">
                        Create compliant CDD contracts with our automated
                        system, tailored to Moroccan labor regulations.
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
                        Onboard & Manage
                      </h3>
                      <p className="text-gray-600">
                        Onboard your temporary staff and manage the entire
                        process through our platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Streamline Your Logistics Staffing?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join leading Moroccan logistics companies who are transforming how
              they hire temporary staff.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/post-job">
                <Button size="lg" variant="secondary">
                  Post Your First Job
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Create Employer Account
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
