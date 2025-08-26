import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PricingCard from "@/components/pricing-card";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  RefreshCcw,
  Brain,
  Target,
  LineChart,
  Sparkles,
  Check,
  Zap,
  Lightbulb,
  Layers,
} from "lucide-react";
import Link from "next/link";
import CycloLogo from "@/components/cyclo-logo";
import { MeshGradient, DotOrbit } from "@paper-design/shaders-react";
import AnimatedHero from "@/components/animated-hero";
import AnimatedHowItWorks from "@/components/animated-how-it-works";
import AnimatedFeatures from "@/components/animated-features";
import AnimatedFreeVsPaid from "@/components/animated-free-vs-paid";
import AnimatedCTA from "@/components/animated-cta";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black pt-24 pb-32">
        {/* Paper Shaders Background */}
        <div className="absolute inset-0">
          {/* Primary MeshGradient Layer */}
          <MeshGradient
            colors={['#000000', '#5100ff', '#00ff80', '#ffffff']}
            distortion={1}
            swirl={0.8}
            speed={0.3}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
          {/* Wireframe MeshGradient Layer */}
          <MeshGradient
            colors={['#000000', '#ea00ff', '#ffcc00', '#5100ff']}
            distortion={0.8}
            swirl={1.0}
            speed={0.2}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0.6,
            }}
          />
        </div>

        <AnimatedHero />
      </section>

      <AnimatedHowItWorks />

      {/* Cyclo Evolution Section */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
        {/* Elegant MeshGradient Background */}
        <div className="absolute inset-0">
          <MeshGradient
            colors={['#1a0b2e', '#7c3aed', '#2563eb', '#0f172a']}
            distortion={0.6}
            swirl={0.4}
            speed={0.1}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: 0.7,
            }}
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cyclo Evolves With You</h2>
            <p className="text-gray-200 max-w-2xl mx-auto">
              As you progress through your growth cycles, Cyclo evolves to
              provide increasingly personalized guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                stage: "Stage 1",
                title: "Seed Cyclo",
                description:
                  "Basic guidance with template suggestions and fundamental growth principles to help you get started.",
                icon: <Sparkles className="w-6 h-6" />,
                price: "$10/month",
              },
              {
                stage: "Stage 2",
                title: "Growth Cyclo",
                description:
                  "Personalized insights based on your progress data, with pattern recognition and basic insight generation.",
                icon: <Zap className="w-6 h-6" />,
                price: "$15/month",
              },
              {
                stage: "Stage 3",
                title: "Bloom Cyclo",
                description:
                  "Advanced recommendations with proactive optimization suggestions and advanced analytics capabilities.",
                icon: <Lightbulb className="w-6 h-6" />,
                price: "$20/month",
              },
              {
                stage: "Stage 4",
                title: "Wisdom Cyclo",
                description:
                  "Expert assistance with cross-domain insights and predictive analysis to anticipate challenges before they arise.",
                icon: <Layers className="w-6 h-6" />,
                price: "$25/month",
              },
            ].map((stage, index) => (
              <div
                key={index}
                className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="text-white/80 mb-2">{stage.stage}</div>
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  {stage.icon} {stage.title}
                </h3>
                <p className="text-gray-200 mb-4">{stage.description}</p>
                <div className="text-white font-medium">{stage.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatedFreeVsPaid />

      <AnimatedFeatures />

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your growth journey. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Transparency & Trust</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We believe in complete transparency and user ownership of data and
              growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Cost Transparency</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Clear breakdown of pricing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Explanation of evolution rationale</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Regular development updates</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">
                User Data & Ownership
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Complete data portability</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Clear data usage policies</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>User ownership of all content</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">
                Community Governance
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>User feedback channels</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Transparent roadmap</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Community template voting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <AnimatedCTA />

      <Footer />
    </div>
  );
}
