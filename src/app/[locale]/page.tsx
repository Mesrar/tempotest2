import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../../supabase/server";
import { Locale } from "@/lib/i18n";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  TruckIcon,
  UserCheck,
  Clock,
  FileText,
  BarChart,
} from "lucide-react";

export default async function Home({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar locale={locale} />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform streamlines temporary staffing for
              logistics companies in Morocco.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ClipboardCheck className="w-6 h-6" />,
                title: "Job Management",
                description:
                  "Intuitive dashboard for posting positions and managing workflow",
              },
              {
                icon: <UserCheck className="w-6 h-6" />,
                title: "Candidate Profiles",
                description: "AI resume parsing and skill extraction",
              },
              {
                icon: <BarChart className="w-6 h-6" />,
                title: "AI Matching",
                description:
                  "Smart algorithm ranks candidates based on requirements",
              },
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Contract Generation",
                description: "Compliant CDD contracts for Moroccan labor laws",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process connects logistics companies with
              qualified temporary staff.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Post Your Job</h3>
              <p className="text-gray-600">
                Create detailed job listings with specific requirements and
                duration.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">
                AI Matches Candidates
              </h3>
              <p className="text-gray-600">
                Our algorithm finds and ranks the best candidates for your
                position.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Hire & Onboard</h3>
              <p className="text-gray-600">
                Select candidates, generate compliant contracts, and start
                working.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">24h</div>
              <div className="text-blue-100">Average Staffing Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Verified Workers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Employer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your logistics staffing needs. No
              hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Logistics Staffing?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join leading Moroccan logistics companies who are streamlining their
            temporary staffing process.
          </p>
          <a
            href={`/${locale}/post-job`}
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Post Your First Job
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
