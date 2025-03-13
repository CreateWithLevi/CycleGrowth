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
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 opacity-70" />

        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                Meet{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Cyclo
                </span>
                , Your Growth Evolution Assistant
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Navigate your personal growth journey with an AI assistant that
                evolves as you do, guiding you through cycles of planning,
                execution, analysis, and improvement.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-8 py-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
                >
                  Start Your Growth Cycle
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>

                <Link
                  href="#how-it-works"
                  className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
                >
                  How It Works
                </Link>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-500" />
                  <span>Free core platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-500" />
                  <span>Evolving AI assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-purple-500" />
                  <span>Complete data ownership</span>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative w-[320px] h-[320px] mx-auto">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse opacity-20"></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 animate-pulse opacity-30"></div>
                <div className="absolute inset-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                  <div className="w-[240px] h-[240px] rounded-full bg-gradient-to-r from-purple-300 to-blue-300 flex items-center justify-center">
                    <RefreshCcw className="h-20 w-20 text-white" />
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-3 bg-white rounded-full shadow-lg">
                  <RefreshCcw
                    className="w-6 h-6 text-purple-600 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">The Growth Cycle System</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cyclo guides you through four key phases of growth, creating a
              continuous improvement loop for any goal or skill.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Circle connector */}
            <div className="hidden md:block absolute top-1/2 left-1/2 w-[300px] h-[300px] -mt-[150px] -ml-[150px] border-4 border-dashed border-purple-200 rounded-full"></div>

            <div className="grid md:grid-cols-2 gap-16 md:gap-24">
              {[
                {
                  icon: <Target className="w-10 h-10" />,
                  title: "Plan",
                  description:
                    "Set clear goals, break them down into manageable tasks, and create a structured timeline for success.",
                  position: "md:translate-x-[-60px] md:translate-y-[-60px]",
                },
                {
                  icon: <RefreshCcw className="w-10 h-10" />,
                  title: "Execute",
                  description:
                    "Track your progress, update task statuses, and maintain momentum throughout your growth journey.",
                  position: "md:translate-x-[60px] md:translate-y-[-60px]",
                },
                {
                  icon: <LineChart className="w-10 h-10" />,
                  title: "Analyze",
                  description:
                    "Review performance data, complete structured reflection prompts, and connect new knowledge.",
                  position: "md:translate-x-[-60px] md:translate-y-[60px]",
                },
                {
                  icon: <Brain className="w-10 h-10" />,
                  title: "Improve",
                  description:
                    "Review insights, adjust your system based on what you've learned, and plan your next growth cycle.",
                  position: "md:translate-x-[60px] md:translate-y-[60px]",
                },
              ].map((phase, index) => (
                <div
                  key={index}
                  className={`p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all z-10 ${phase.position}`}
                >
                  <div className="p-4 rounded-full bg-purple-100 inline-block text-purple-600 mb-4">
                    {phase.icon}
                  </div>
                  <h3 className="text-2xl font-semibold mb-3">{phase.title}</h3>
                  <p className="text-gray-600">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cyclo Evolution Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cyclo Evolves With You</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">
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
                <p className="text-blue-100 mb-4">{stage.description}</p>
                <div className="text-white font-medium">{stage.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free vs Paid Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Free Core Platform</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              CycleGrowth provides a complete set of tools for free, with
              optional AI assistance for those who want more guidance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="p-8 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Free Forever
              </h3>
              <ul className="space-y-4">
                {[
                  "Complete system building capabilities",
                  "Full execution dashboard",
                  "Comprehensive reflection tools",
                  "System evolution interface",
                  "Knowledge integration hub",
                  "Community features",
                  "Template library access",
                  "Data ownership and portability",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors font-medium w-full justify-center"
                >
                  Get Started Free
                </Link>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-md border border-purple-100">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                Cyclo AI Assistant
              </h3>
              <ul className="space-y-4">
                {[
                  "AI-powered strategy development",
                  "Automated pattern recognition",
                  "Proactive system optimization",
                  "Task management assistance",
                  "Personalized reflection guidance",
                  "Intelligent knowledge linking",
                  "Evolving capabilities as you grow",
                  "Accountability and motivation support",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="#pricing"
                  className="inline-flex items-center px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium w-full justify-center"
                >
                  View Pricing Options
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Growth Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              CycleGrowth provides everything you need to design, track, and
              optimize your personal growth systems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "System Builder",
                description:
                  "Create customized templates for your personal growth frameworks across multiple domains.",
                icon: (
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Target className="w-6 h-6" />
                  </div>
                ),
              },
              {
                title: "Execution Tracker",
                description:
                  "Manage tasks, visualize timelines, and track milestones to maintain momentum.",
                icon: (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <RefreshCcw className="w-6 h-6" />
                  </div>
                ),
              },
              {
                title: "Reflection Tools",
                description:
                  "Structured analysis prompts and knowledge linking capabilities to maximize learning.",
                icon: (
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Brain className="w-6 h-6" />
                  </div>
                ),
              },
              {
                title: "Progress Analytics",
                description:
                  "Visualize your growth journey with beautiful charts and insightful metrics.",
                icon: (
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <LineChart className="w-6 h-6" />
                  </div>
                ),
              },
              {
                title: "Knowledge Integration",
                description:
                  "Connect insights across different domains with a Zettelkasten-inspired linking system.",
                icon: (
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <Layers className="w-6 h-6" />
                  </div>
                ),
              },
              {
                title: "AI-Powered Insights",
                description:
                  "Receive intelligent recommendations based on your unique patterns and progress.",
                icon: (
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Sparkles className="w-6 h-6" />
                  </div>
                ),
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
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

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Growth Journey?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are transforming their lives with
            CycleGrowth's structured approach and Cyclo's guidance.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium"
          >
            Begin Your First Cycle
            <ArrowUpRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
