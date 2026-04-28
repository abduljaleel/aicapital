import Link from "next/link";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/lib/config";
import {
  ArrowRight,
  Brain,
  Search,
  Target,
  BookOpen,
  Layers,
  Shield,
  Quote,
  Lightbulb,
  Eye,
  CheckSquare,
  RotateCcw,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="border-b border-amber-200/50 sticky top-0 z-50 bg-[#fffbeb]/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              A
            </div>
            <span className="font-semibold text-lg">{appConfig.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#fffbeb] to-[#fff8e1]/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-24 pb-16 text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm text-amber-700">
            <Brain className="mr-2 h-3.5 w-3.5" />
            AI-guided decision support
          </div>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-7xl text-amber-950">
            Think better with AI
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-amber-800/70 leading-relaxed">
            A structured workspace for high-stakes decisions. Not a chatbot &mdash; a decision companion.
            Scenario analysis, evidence boards, and proven frameworks in one place.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white border-0">
                Start making better decisions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-50">
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Scenario Preview */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-b from-white to-amber-50/30 p-8">
          <p className="text-xs font-medium text-amber-600 uppercase tracking-widest mb-6 text-center">Scenario Comparison</p>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Scenario A */}
            <div className="rounded-xl border border-amber-200/80 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-sm font-semibold text-amber-900">Scenario A: Expand to EU</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-amber-600 font-medium mb-1">Assumptions</p>
                  <ul className="text-sm text-amber-800/70 space-y-1">
                    <li className="flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">-</span> GDPR compliance in 3 months</li>
                    <li className="flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">-</span> Initial team of 4 in Berlin</li>
                    <li className="flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">-</span> $800K additional runway needed</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-medium mb-1">Expected Outcome</p>
                  <p className="text-sm text-amber-800/70">2.4x TAM increase, 18-month payback</p>
                </div>
              </div>
            </div>
            {/* Scenario B */}
            <div className="rounded-xl border border-amber-200/80 bg-white p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-sm font-semibold text-amber-900">Scenario B: Deepen US Market</span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-amber-600 font-medium mb-1">Assumptions</p>
                  <ul className="text-sm text-amber-800/70 space-y-1">
                    <li className="flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">-</span> Hire 2 enterprise AEs</li>
                    <li className="flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">-</span> Launch partner channel Q3</li>
                    <li className="flex items-start gap-1.5"><span className="text-amber-400 mt-0.5">-</span> $400K additional investment</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-amber-600 font-medium mb-1">Expected Outcome</p>
                  <p className="text-sm text-amber-800/70">1.6x revenue growth, 10-month payback</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-amber-200/40">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h2 className="text-center text-3xl font-bold text-amber-950">Tools for structured thinking</h2>
          <p className="mt-4 text-center text-amber-800/60 max-w-xl mx-auto">
            Every feature is designed to improve the quality of your reasoning, not just the speed of your output.
          </p>
          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {[
              {
                icon: <Layers className="h-6 w-6" />,
                title: "Scenario Analysis",
                desc: "Compare multiple paths forward side by side. Assign probabilities, score outcomes, and adjust as you learn. Stop debating in your head — see the trade-offs clearly.",
              },
              {
                icon: <Search className="h-6 w-6" />,
                title: "Evidence Board",
                desc: "Collect and categorize evidence as you discover it. Tag sources, rate relevance, and track whether data supports or contradicts your hypothesis.",
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: "Decision Frameworks",
                desc: "Apply SWOT, weighted scoring, pre-mortems, and more. Each framework is interactive — fill it in, adjust weights, and let the structure guide your thinking.",
              },
              {
                icon: <BookOpen className="h-6 w-6" />,
                title: "Decision Journal",
                desc: "Document your reasoning at each stage. Track how your confidence changes over time. Review past decisions to improve your judgment systematically.",
              },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4 rounded-xl border border-amber-200/60 bg-white p-6 hover:shadow-md hover:shadow-amber-100 transition-all duration-200">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200/50">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-amber-950">{feature.title}</h3>
                  <p className="mt-2 text-sm text-amber-800/60 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-amber-200/40 bg-gradient-to-b from-amber-50/50 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h2 className="text-center text-3xl font-bold text-amber-950">How it works</h2>
          <p className="text-center text-amber-800/60 mt-3 max-w-xl mx-auto">
            A structured process that turns uncertainty into clarity.
          </p>
          <div className="mt-16 grid gap-0 md:grid-cols-4">
            {[
              {
                icon: <Lightbulb className="h-5 w-5" />,
                step: "01",
                title: "Frame",
                desc: "Define the decision, constraints, and what success looks like. Clarity before analysis.",
              },
              {
                icon: <Eye className="h-5 w-5" />,
                step: "02",
                title: "Analyze",
                desc: "Gather evidence, build scenarios, and apply decision frameworks. Structured thinking, not guessing.",
              },
              {
                icon: <CheckSquare className="h-5 w-5" />,
                step: "03",
                title: "Decide",
                desc: "Make the call with confidence. Document your reasoning and the evidence behind it.",
              },
              {
                icon: <RotateCcw className="h-5 w-5" />,
                step: "04",
                title: "Review",
                desc: "Revisit past decisions. Learn what worked. Build better judgment over time.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center px-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 border border-amber-200/50">
                  {item.icon}
                </div>
                <span className="block mt-3 text-xs font-mono text-amber-500">{item.step}</span>
                <h3 className="mt-1 text-lg font-semibold text-amber-950">{item.title}</h3>
                <p className="mt-2 text-sm text-amber-800/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="border-t border-amber-200/40">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <Quote className="h-8 w-8 text-amber-300 mx-auto mb-6" />
          <blockquote className="text-2xl md:text-3xl font-light text-amber-900 leading-relaxed italic">
            Every decision you make today compounds into your future.
          </blockquote>
          <p className="mt-6 text-sm text-amber-600">The principle behind AI Capital</p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-amber-200/40 bg-gradient-to-b from-amber-50/50 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="text-3xl font-bold text-amber-950">Better decisions start here</h2>
          <p className="mt-4 text-lg text-amber-800/60 max-w-xl mx-auto">
            The cost of a bad decision is rarely the decision itself. It is the opportunity cost of the better path you did not see.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white border-0">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-amber-200/40">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-sm text-amber-800/50">
          <span>&copy; {new Date().getFullYear()} {appConfig.name}. All rights reserved.</span>
          <span>A 12 Cities venture</span>
        </div>
      </footer>
    </div>
  );
}
