import Link from "next/link";
import { appConfig } from "@/lib/config";

const ACCENT = "#f0a050";
const BG = "#0f0d0a";
const PANEL = "#1a160f";

interface TreeNode {
  id: string;
  label: string;
  cost: string;
  hot?: boolean;
  x: number;
  y: number;
  parent?: string;
}

const nodes: TreeNode[] = [
  { id: "root", label: "run()", cost: "$0.04", x: 50, y: 8 },
  { id: "a", label: "plan", cost: "$0.31", x: 22, y: 32, parent: "root" },
  { id: "b", label: "search", cost: "$0.12", x: 50, y: 32, parent: "root" },
  { id: "c", label: "synth", cost: "$0.09", x: 78, y: 32, parent: "root" },
  { id: "a1", label: "tool.web", cost: "$0.18", x: 10, y: 60, parent: "a" },
  { id: "a2", label: "tool.code", cost: "$4.12", hot: true, x: 32, y: 60, parent: "a" },
  { id: "b1", label: "rerank", cost: "$0.08", x: 50, y: 60, parent: "b" },
  { id: "c1", label: "model.large", cost: "$0.22", x: 70, y: 60, parent: "c" },
  { id: "c2", label: "tool.code", cost: "$3.91", hot: true, x: 88, y: 60, parent: "c" },
  { id: "x1", label: "loop x14", cost: "$2.10", hot: true, x: 32, y: 86, parent: "a2" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: BG, color: "#e8dfcc" }}>
      {/* Thin accent line */}
      <div className="h-[2px] w-full" style={{ backgroundColor: ACCENT }} />

      {/* Nav */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-7 w-7 items-center justify-center rounded border font-serif font-bold text-sm"
              style={{ borderColor: `${ACCENT}66`, color: ACCENT, backgroundColor: `${ACCENT}11` }}
            >
              A
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-base text-white tracking-wide">{appConfig.name}</span>
              <span className="hidden sm:inline text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                Tallinn
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              aicapital.ee
            </span>
            <Link href="/login" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm border rounded px-3 py-1.5 transition-colors hover:bg-white/5"
              style={{ borderColor: `${ACCENT}55`, color: ACCENT }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-20 pb-12 text-center">
        <h1
          className="font-serif text-6xl sm:text-8xl text-white tracking-tight leading-[1.0]"
          style={{ fontFamily: 'ui-serif, Georgia, serif' }}
        >
          AI Capital
        </h1>
        <p className="mt-6 text-xl sm:text-2xl text-slate-300 font-serif italic max-w-2xl mx-auto leading-snug">
          Linter for agentic logic that predicts hidden costs.
        </p>
        <p className="mt-6 text-sm font-mono text-slate-500 tracking-wide">
          From Tallinn — Hanseatic trade port, now digital.
        </p>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-3xl px-4 pb-12 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-600 mb-3">
          The problem
        </p>
        <p className="text-2xl font-serif text-white leading-snug">
          Your agents burned $4,200 overnight. No one noticed.
        </p>
      </section>

      {/* Agent task tree visual */}
      <section className="mx-auto max-w-4xl w-full px-4 pb-12">
        <div className="rounded-lg border border-white/10 overflow-hidden" style={{ backgroundColor: PANEL }}>
          {/* Title bar with alert */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5" style={{ backgroundColor: "#120f09" }}>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                agent.run #4821
              </span>
            </div>
            <span
              className="text-[10px] font-mono px-2 py-1 rounded uppercase tracking-widest border"
              style={{ color: "#ff7070", borderColor: "#ff707055", backgroundColor: "#ff707011" }}
            >
              Warning: $4,200 over budget
            </span>
          </div>

          {/* Tree SVG */}
          <div className="relative w-full" style={{ paddingBottom: "55%" }}>
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
            >
              {/* Edges */}
              {nodes.map((n) => {
                if (!n.parent) return null;
                const parent = nodes.find((p) => p.id === n.parent)!;
                const hot = n.hot;
                return (
                  <line
                    key={`edge-${n.id}`}
                    x1={parent.x}
                    y1={parent.y}
                    x2={n.x}
                    y2={n.y}
                    stroke={hot ? "#ff7070" : "#3a3428"}
                    strokeWidth={hot ? 0.4 : 0.2}
                    vectorEffect="non-scaling-stroke"
                    opacity={hot ? 0.8 : 0.7}
                  />
                );
              })}
            </svg>

            {/* HTML overlay nodes for crisp text */}
            <div className="absolute inset-0">
              {nodes.map((n) => (
                <div
                  key={n.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <div
                    className="rounded-full border flex items-center justify-center"
                    style={{
                      width: n.hot ? 14 : 10,
                      height: n.hot ? 14 : 10,
                      borderColor: n.hot ? "#ff7070" : `${ACCENT}66`,
                      backgroundColor: n.hot ? "#ff707022" : `${ACCENT}11`,
                      boxShadow: n.hot ? "0 0 12px #ff707066" : "none",
                    }}
                  />
                  <span className="mt-1 text-[9px] font-mono text-slate-300 whitespace-nowrap">
                    {n.label}
                  </span>
                  <span
                    className="text-[9px] font-mono whitespace-nowrap tabular-nums"
                    style={{ color: n.hot ? "#ff7070" : ACCENT }}
                  >
                    {n.cost}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
            <span className="text-slate-500">predicted execution cost per branch</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: ACCENT }} />
                <span className="text-slate-500">nominal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "#ff7070" }} />
                <span className="text-slate-500">hot path</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lint output code block */}
      <section className="mx-auto max-w-4xl w-full px-4 pb-12">
        <div className="rounded-lg border border-white/10 overflow-hidden" style={{ backgroundColor: "#08060a" }}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5" style={{ backgroundColor: "#000" }}>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
              terminal
            </span>
          </div>
          <pre className="text-xs sm:text-sm font-mono p-5 leading-relaxed overflow-x-auto text-slate-300">
            <span className="text-slate-500">$</span> <span style={{ color: ACCENT }}>aicapital lint</span> ./agent-loop.ts{"\n"}
            <span style={{ color: "#ff7070" }}>{"⚠"}</span> <span className="text-white">Loop at line 42</span> — projected cost: <span style={{ color: "#ff7070" }}>$4,287</span>{"\n"}
            {"  └ recursion depth: "}<span className="text-amber-300">unbounded</span>{"\n"}
            {"  └ model: "}<span className="text-amber-300">claude-3.5-sonnet</span>{" (use haiku?)"}{"\n"}
            {"  └ tool calls per iteration: "}<span className="text-amber-300">18</span>{"\n"}
            {"\n"}
            <span style={{ color: ACCENT }}>Suggestion:</span> add <span className="text-white">max_depth=10</span> or downgrade model tier.{"\n"}
          </pre>
        </div>
      </section>

      {/* Before/after */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-600 mb-3 text-center">
            Forecast vs reality
          </p>
          <h2 className="text-center text-3xl font-serif text-white mb-12">
            Predict the spend before it happens.
          </h2>
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch max-w-3xl mx-auto">
            <div className="rounded-lg border border-red-500/30 bg-red-500/[0.04] p-6 text-center">
              <p className="text-xs font-mono uppercase tracking-widest text-red-400 mb-3">
                Without AI Capital
              </p>
              <p className="font-serif text-5xl text-white tabular-nums">$4,287</p>
              <p className="mt-3 text-sm text-slate-400 font-mono">forecast for this run</p>
            </div>
            <div className="flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-slate-600 rotate-90 md:rotate-0" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="rounded-lg border p-6 text-center" style={{ borderColor: `${ACCENT}55`, backgroundColor: `${ACCENT}08` }}>
              <p className="text-xs font-mono uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                With suggested fix
              </p>
              <p className="font-serif text-5xl text-white tabular-nums">$127</p>
              <p className="mt-3 text-sm text-slate-400 font-mono">97% reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <div className="grid sm:grid-cols-2 gap-12 text-center">
            <div>
              <p className="font-serif text-5xl text-white tabular-nums" style={{ color: ACCENT }}>$2.4M</p>
              <p className="mt-3 text-xs font-mono uppercase tracking-widest text-slate-500">
                in agent loops prevented
              </p>
            </div>
            <div>
              <p className="font-serif text-5xl text-white tabular-nums" style={{ color: ACCENT }}>18,000</p>
              <p className="mt-3 text-xs font-mono uppercase tracking-widest text-slate-500">
                budgets enforced
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 border-2 rounded px-8 py-4 text-lg font-medium transition-colors hover:bg-white/5"
            style={{ borderColor: ACCENT, color: ACCENT }}
          >
            Lint your first agent
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-auto">
        <div className="mx-auto flex flex-col sm:flex-row gap-3 sm:gap-0 h-auto sm:h-16 max-w-6xl items-center justify-between px-4 py-4 sm:py-0">
          <div className="flex items-center gap-3 text-xs text-slate-600 font-mono">
            <span style={{ color: ACCENT }}>{appConfig.name}</span>
            <span>·</span>
            <span>Tallinn</span>
            <span>·</span>
            <span>aicapital.ee</span>
          </div>
          <a
            href="https://abduljaleel.xyz/aletheia/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-white border border-white/10 rounded px-3 py-1.5 transition-colors hover:border-white/30"
          >
            Part of the Aletheia stack &#8599;
          </a>
        </div>
      </footer>
    </div>
  );
}
