import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PricingCard from "@/components/pricing-card";
import { createClient } from "../../supabase/server";
import {
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Lightbulb,
  Layers,
  Target,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Linear Style */}
      <section className="relative overflow-hidden border-b">
        <div className="container mx-auto px-4 py-32 sm:py-40">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-muted/50 text-sm font-medium">
              <Sparkles className="h-4 w-4 text-primary" />
              Powered by AI
            </div>
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight">
              Growth through
              <span className="block text-primary mt-2">intelligent cycles</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              CycleGrowth combines AI-powered guidance with proven frameworks to help you
              plan, execute, and reflect on your personal growth journey.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href={user ? "/dashboard" : "/sign-up"}>
                <Button size="lg" className="text-base px-8">
                  {user ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Subtle gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </section>

      {/* How It Works - Simplified Linear Style */}
      <section className="py-24 border-b" id="features">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Built for sustainable growth
            </h2>
            <p className="text-lg text-muted-foreground">
              A systematic approach to personal development that evolves with you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Target className="h-8 w-8" />,
                title: "Plan with purpose",
                description:
                  "Define clear goals and break them down into actionable tasks with AI-powered suggestions.",
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: "Execute with confidence",
                description:
                  "Track progress, maintain momentum, and adapt your approach based on real-time insights.",
              },
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: "Reflect and improve",
                description:
                  "Review outcomes, identify patterns, and continuously refine your growth strategy.",
              },
            ].map((feature, index) => (
              <div key={index} className="space-y-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cyclo Evolution - Linear Minimal */}
      <section className="py-24 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Cyclo evolves with you
            </h2>
            <p className="text-lg text-muted-foreground">
              Your AI assistant gets smarter as you progress through your growth cycles,
              providing increasingly personalized guidance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                stage: "Stage 1",
                title: "Seed Cyclo",
                description:
                  "Template suggestions and fundamental growth principles to get you started.",
                icon: <Sparkles className="h-6 w-6" />,
                price: "$10/mo",
              },
              {
                stage: "Stage 2",
                title: "Growth Cyclo",
                description:
                  "Personalized insights with pattern recognition based on your progress data.",
                icon: <Zap className="h-6 w-6" />,
                price: "$15/mo",
              },
              {
                stage: "Stage 3",
                title: "Bloom Cyclo",
                description:
                  "Proactive optimization suggestions with advanced analytics capabilities.",
                icon: <Lightbulb className="h-6 w-6" />,
                price: "$20/mo",
              },
              {
                stage: "Stage 4",
                title: "Wisdom Cyclo",
                description:
                  "Cross-domain insights and predictive analysis to anticipate challenges.",
                icon: <Layers className="h-6 w-6" />,
                price: "$25/mo",
              },
            ].map((stage, index) => (
              <div
                key={index}
                className="p-6 bg-background rounded-xl border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  {stage.icon}
                  <span>{stage.stage}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{stage.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {stage.description}
                </p>
                <div className="text-base font-semibold">{stage.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Clean Grid */}
      <section className="py-24 border-b" id="pricing">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that fits your growth journey. Upgrade as Cyclo evolves.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-24 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Built on transparency
            </h2>
            <p className="text-lg text-muted-foreground">
              Your data, your growth, your control.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Cost Transparency",
                items: [
                  "Clear pricing breakdown",
                  "Evolution rationale explained",
                  "Regular development updates",
                ],
              },
              {
                title: "Data Ownership",
                items: [
                  "Complete data portability",
                  "Clear usage policies",
                  "You own all your content",
                ],
              },
              {
                title: "Community Driven",
                items: [
                  "Open feedback channels",
                  "Transparent roadmap",
                  "Community voting on features",
                ],
              },
            ].map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-xl font-semibold">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Start your growth journey today
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of people using CycleGrowth to achieve their goals.
            </p>
            <div className="pt-4">
              <Link href={user ? "/dashboard" : "/sign-up"}>
                <Button size="lg" className="text-base px-8">
                  {user ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
