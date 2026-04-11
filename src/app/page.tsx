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
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Nav */}
      <header className="border-b">
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
      <section className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
          <Brain className="mr-2 h-3.5 w-3.5" />
          AI-guided decision support
        </div>
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight sm:text-6xl">
          Think better with AI
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          A structured workspace for high-stakes decisions. Not a chatbot &mdash; a decision companion.
          Scenario analysis, evidence boards, and proven frameworks in one place.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/signup">
            <Button size="lg">
              Start making better decisions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            The highest-leverage skill in business is judgment. Yet most decision-making
            is unstructured, undocumented, and unrepeatable. AI Capital brings rigor
            to the decisions that matter most.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <h2 className="text-center text-3xl font-bold">Tools for structured thinking</h2>
          <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">
            Every feature is designed to improve the quality of your reasoning, not just the speed of your output.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {[
              {
                icon: <Layers className="h-6 w-6" />,
                title: "Scenario Analysis",
                desc: "Compare multiple paths forward side by side. Assign probabilities, score outcomes, and adjust as you learn. Stop debating in your head \u2014 see the trade-offs clearly.",
              },
              {
                icon: <Search className="h-6 w-6" />,
                title: "Evidence Board",
                desc: "Collect and categorize evidence as you discover it. Tag sources, rate relevance, and track whether data supports or contradicts your hypothesis.",
              },
              {
                icon: <Target className="h-6 w-6" />,
                title: "Decision Frameworks",
                desc: "Apply SWOT, weighted scoring, pre-mortems, and more. Each framework is interactive \u2014 fill it in, adjust weights, and let the structure guide your thinking.",
              },
              {
                icon: <BookOpen className="h-6 w-6" />,
                title: "Decision Journal",
                desc: "Document your reasoning at each stage. Track how your confidence changes over time. Review past decisions to improve your judgment systematically.",
              },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4 rounded-lg border bg-background p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <div className="grid gap-12 md:grid-cols-3">
            {[
              {
                icon: <Brain className="h-5 w-5" />,
                title: "Judgment, not automation",
                desc: "AI Capital helps you think, not think for you. The goal is better human decisions, not faster machine outputs.",
              },
              {
                icon: <Shield className="h-5 w-5" />,
                title: "Structure, not rigidity",
                desc: "Frameworks provide scaffolding for your thinking. Use what helps, skip what doesn't. Adapt the process to the decision.",
              },
              {
                icon: <BookOpen className="h-5 w-5" />,
                title: "Learning, not just deciding",
                desc: "Track your reasoning over time. The decision journal turns every choice into a learning opportunity for future judgment.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <h2 className="text-3xl font-bold">Better decisions start here</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            The cost of a bad decision is rarely the decision itself. It is the opportunity cost of the better path you did not see.
          </p>
          <Link href="/signup" className="mt-8 inline-block">
            <Button size="lg">
              Create free account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} {appConfig.name}. All rights reserved.</span>
          <span>A 12 Cities venture</span>
        </div>
      </footer>
    </div>
  );
}
