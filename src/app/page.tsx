import Link from "next/link";
import { appConfig } from "@/lib/config";
import { CostFeed, LiveClock, ProjCounter } from "@/components/landing/terminal";

/* ────────────────────────────────────────────────────────────────────────
   AI CAPITAL — TRADING TERMINAL ARCHETYPE
   A Bloomberg-dense financial cockpit. Dark, monospace numerals, multi-panel.
   The 4-up dashboard grid IS the hero. No giant centered headline.
   ──────────────────────────────────────────────────────────────────────── */

const BG = "#0a0b0d";
const PANEL = "#101216";
const PANEL_HEAD = "#0c0e11";
const GRID = "#1c2026";
const AMBER = "#f0a050";
const UP = "#4ade80"; // green
const HOT = "#ff5a4d";
const DIM = "#5a6270"; // decorative marks only (rules, separators)
const DIM_READ = "#8b94a3"; // readable micro-copy (≈4.6:1 on panel bg)

/* Forecast bars (Panel B) — climbing spend that breaches the ceiling */
const forecastBars = [10, 15, 21, 29, 39, 51, 63, 80, 90, 98];
const CEILING_AT = 7; // first bar index that crosses the budget ceiling
const CEILING_TOP = 28; // ceiling line, % from panel top (≈72% bar height)

/* Task-tree nodes (Panel A) — both branches fan into two leaves */
interface Node {
  id: string;
  label: string;
  cost: string;
  x: number;
  y: number;
  parent?: string;
  hot?: boolean;
}
const treeNodes: Node[] = [
  { id: "root", label: "run()", cost: "$0.04", x: 50, y: 14 },
  { id: "a", label: "plan", cost: "$0.31", x: 24, y: 46, parent: "root" },
  { id: "b", label: "synth", cost: "$0.12", x: 76, y: 46, parent: "root" },
  { id: "a1", label: "web", cost: "$0.18", x: 12, y: 82, parent: "a" },
  { id: "a2", label: "code·loop", cost: "$4.12", x: 40, y: 82, parent: "a", hot: true },
  { id: "b1", label: "model", cost: "$0.22", x: 64, y: 82, parent: "b" },
  { id: "b2", label: "eval", cost: "$0.09", x: 88, y: 82, parent: "b" },
];

const GAUGE_LEN = Math.PI * 86; // arc length of the semicircle (r = 86)

export default function LandingPage() {
  return (
    <div
      className="flex min-h-screen flex-col font-mono text-[13px] leading-tight"
      style={{ backgroundColor: BG, color: "#c9d1d9" }}
    >
      {/* ══ TOP TICKER BAR ══ live scrolling cost feed (client island) */}
      <CostFeed />

      {/* ══ BRAND ROW ══ ticker symbol + city + live clock, mono buttons right */}
      <header
        className="flex items-center justify-between gap-3 border-b px-3 py-2"
        style={{ borderColor: GRID }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="text-sm font-bold uppercase tracking-[0.18em]"
            style={{ color: AMBER }}
          >
            {appConfig.name}
          </span>
          <span className="hidden text-[10px] sm:inline" style={{ color: GRID }}>
            ▌
          </span>
          <span
            className="hidden text-[10px] uppercase tracking-[0.25em] sm:inline"
            style={{ color: DIM_READ }}
          >
            Tallinn{" "}
            <span role="img" aria-label="Estonia">
              🇪🇪
            </span>{" "}
            · Hanse port
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <LiveClock />
          <Link
            href="/login"
            className="aic-focus inline-flex min-h-[44px] items-center justify-center border px-3 py-1 uppercase tracking-wider transition-colors hover:bg-white/5 sm:min-h-0"
            style={{ borderColor: GRID, color: "#9aa3b0" }}
          >
            sign in
          </Link>
          <Link
            href="/signup"
            className="aic-focus inline-flex min-h-[44px] items-center justify-center border px-3 py-1 font-bold uppercase tracking-wider transition-colors sm:min-h-0"
            style={{ borderColor: AMBER, color: "#0a0b0d", backgroundColor: AMBER }}
          >
            get started
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          HERO = MULTI-PANEL DASHBOARD GRID (the hero is the data, not a headline)
          ══════════════════════════════════════════════════════════════════ */}
      <main className="flex flex-1 flex-col p-2 sm:p-3">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {/* ── PANEL A · AGENT TASK TREE ── */}
          <Panel
            tag="A"
            title="AGENT TASK TREE"
            className="order-1"
            right={
              <span
                className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${HOT}1a`, color: HOT, border: `1px solid ${HOT}66` }}
              >
                ⚠ $4,200 OVER BUDGET
              </span>
            }
          >
            <div className="relative w-full" style={{ height: 200 }}>
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                {treeNodes.map((n, idx) => {
                  if (!n.parent) return null;
                  const p = treeNodes.find((x) => x.id === n.parent)!;
                  return (
                    <line
                      key={`e-${n.id}`}
                      className="aic-edge"
                      x1={p.x}
                      y1={p.y}
                      x2={n.x}
                      y2={n.y}
                      pathLength={1}
                      stroke={n.hot ? HOT : "#3a4150"}
                      strokeWidth={n.hot ? 0.7 : 0.4}
                      vectorEffect="non-scaling-stroke"
                      style={{ "--d": `${idx * 90}ms` } as React.CSSProperties}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0">
                {treeNodes.map((n) => (
                  <div
                    key={n.id}
                    className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  >
                    <div
                      className={`rounded-sm ${n.hot ? "aic-pulse" : ""}`}
                      style={{
                        width: n.hot ? 13 : 9,
                        height: n.hot ? 13 : 9,
                        backgroundColor: n.hot ? `${HOT}33` : `${AMBER}22`,
                        border: `1px solid ${n.hot ? HOT : `${AMBER}88`}`,
                        boxShadow: n.hot ? `0 0 14px ${HOT}aa` : "none",
                      }}
                    />
                    <span className="mt-1 whitespace-nowrap text-[10px]" style={{ color: "#9aa3b0" }}>
                      {n.label}
                    </span>
                    <span
                      className="whitespace-nowrap text-[10px] tabular-nums"
                      style={{ color: n.hot ? HOT : AMBER }}
                    >
                      {n.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <PanelFoot left="predicted cost / branch" right="depth=3 · 7 nodes" />
          </Panel>

          {/* ── PANEL B · COST FORECAST ── */}
          <Panel
            tag="B"
            title="COST FORECAST"
            className="order-3 lg:order-2"
            right={<ProjCounter />}
          >
            <div className="relative w-full" style={{ height: 200 }}>
              <div className="absolute inset-0 flex items-stretch gap-[3px] px-1 pb-px">
                {forecastBars.map((h, i) => {
                  const breach = i >= CEILING_AT;
                  return (
                    <div key={i} className="flex flex-1 flex-col justify-end">
                      <div
                        className={`aic-bar w-full ${breach ? "aic-bar-breach" : ""}`}
                        style={
                          {
                            height: `${h}%`,
                            backgroundColor: breach ? HOT : AMBER,
                            opacity: breach ? 0.95 : 0.45 + i * 0.05,
                            boxShadow: breach ? `0 0 10px ${HOT}66` : "none",
                            "--d": `${i * 55}ms`,
                          } as React.CSSProperties
                        }
                      />
                    </div>
                  );
                })}
              </div>
              {/* red budget ceiling line — painted on top of the bars so the
                  breach reads and the label stays legible over the red bars */}
              <div
                className="absolute left-0 right-0 flex items-center"
                style={{ top: `${CEILING_TOP}%` }}
              >
                <div className="h-px w-full" style={{ backgroundColor: HOT, opacity: 0.85 }} />
                <span
                  className="aic-ceiling absolute -top-3.5 right-2 rounded-sm px-1 text-[10px] tabular-nums"
                  style={{ color: HOT, backgroundColor: "rgba(6,7,8,0.82)" }}
                >
                  ceiling $4,200
                </span>
              </div>
            </div>
            <PanelFoot left="cum. spend → projected" right="t+10 iterations" />
          </Panel>

          {/* ── PANEL C · LINT OUTPUT ── terminal block */}
          <Panel tag="C" title="LINT OUTPUT" className="order-2 lg:order-3" mono>
            <pre className="overflow-x-auto px-3 py-3 text-[11px] leading-[1.65] sm:text-[12px]">
              <span style={{ color: DIM_READ }}>$</span>{" "}
              <span style={{ color: AMBER }}>aicapital lint</span>{" "}
              <span style={{ color: "#c9d1d9" }}>./agent-loop.ts</span>
              {"\n"}
              <span style={{ color: HOT }}>⚠</span>{" "}
              <span style={{ color: "#e6edf3" }}>line 42</span> — projected cost:{" "}
              <span style={{ color: HOT }} className="tabular-nums">$4,287</span>
              {"\n"}
              {"  └ "}recursion depth:{" "}
              <span style={{ color: AMBER }}>unbounded</span>
              {"\n"}
              {"  └ "}model:{" "}
              <span style={{ color: AMBER }}>claude</span>{" "}
              <span style={{ color: DIM_READ }}>(downgrade → haiku?)</span>
              {"\n"}
              {"  └ "}<span className="tabular-nums">18</span> tool calls / iteration
              {"\n"}
              <span style={{ color: UP }}>✔</span> suggested fix →{" "}
              <span style={{ color: UP }} className="tabular-nums">$127</span>
              {"\n"}
              <span style={{ color: DIM }}>{"  "}─────────────────────────────</span>
              {"\n"}
              <span style={{ color: DIM_READ }}>{"  "}saved/run </span>
              <span style={{ color: UP }} className="tabular-nums">$4,160</span>
              <span style={{ color: DIM_READ }}> · static · 63ms</span>
            </pre>
            <PanelFoot left="aicapital@v0 — pre-flight" right="exit 1 · 1 warning" />
          </Panel>

          {/* ── PANEL D · BUDGET GUARD ── gauge/meter at 96% amber→red */}
          <Panel
            tag="D"
            title="BUDGET GUARD"
            className="order-4"
            right={<span className="text-[10px] tabular-nums" style={{ color: HOT }}>96% · CRITICAL</span>}
          >
            <div className="flex flex-col items-center justify-center px-3 py-4" style={{ height: 200 }}>
              {/* semicircle gauge */}
              <div
                className="relative"
                style={{ width: 220, height: 118 }}
                role="meter"
                aria-valuenow={96}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Budget consumed: 96 percent, critical"
              >
                <svg viewBox="0 0 200 110" className="h-full w-full" aria-hidden="true">
                  <path
                    d="M 14 100 A 86 86 0 0 1 186 100"
                    fill="none"
                    stroke="#1c2026"
                    strokeWidth="14"
                    strokeLinecap="round"
                  />
                  {/* 96% arc — gradient amber→red */}
                  <defs>
                    <linearGradient id="aic-gauge" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={AMBER} />
                      <stop offset="70%" stopColor={AMBER} />
                      <stop offset="100%" stopColor={HOT} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 14 100 A 86 86 0 0 1 186 100"
                    fill="none"
                    stroke="url(#aic-gauge)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={GAUGE_LEN}
                    strokeDashoffset={GAUGE_LEN * (1 - 0.96)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                  <span className="text-4xl font-bold tabular-nums" style={{ color: HOT }}>
                    96<span className="text-lg">%</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: DIM_READ }}>
                    of budget consumed
                  </span>
                </div>
              </div>
              <div className="mt-2 grid w-full grid-cols-3 gap-2 text-center text-[10px]">
                <GuardStat label="spent" value="$4,032" color={HOT} />
                <GuardStat label="cap" value="$4,200" color="#9aa3b0" />
                <GuardStat label="left" value="$168" color={AMBER} />
              </div>
            </div>
            <PanelFoot left="auto-halt at 100%" right="policy: hard-stop" />
          </Panel>
        </div>

        {/* ── ONE modest headline UNDER the dashboard grid ── */}
        <section
          className="mt-2 flex flex-col gap-4 border px-4 py-5 sm:flex-row sm:items-end sm:justify-between"
          style={{ borderColor: GRID, backgroundColor: PANEL }}
        >
          <div>
            <h1
              className="text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: "#e6edf3" }}
            >
              See the bill before the agent runs.
              <span
                aria-hidden="true"
                className="aic-cursor ml-1 inline-block"
                style={{ color: AMBER }}
              >
                ▮
              </span>
            </h1>
            <p className="mt-2 text-[12px]" style={{ color: DIM_READ }}>
              Linter for agentic logic that predicts hidden costs — static analysis, before a
              single token is spent.
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <Link
              href="/signup"
              className="aic-cta aic-focus px-6 py-3 text-[13px] font-bold uppercase tracking-wider"
            >
              $ aicapital lint →
            </Link>
            <span
              className="text-[10px] uppercase tracking-[0.15em]"
              style={{ color: DIM_READ }}
            >
              free · no card · first lint in 60s
            </span>
          </div>
        </section>

        {/* ── proof ribbon — one three-column status strip ── */}
        <div
          className="mt-2 grid grid-cols-3 divide-x divide-[#1c2026] border"
          style={{ borderColor: GRID, backgroundColor: PANEL_HEAD }}
        >
          <Ribbon value="$2.4M" label="runaway loops prevented" />
          <Ribbon value="18,000" label="budgets enforced" />
          <Ribbon value="63ms" label="static analysis / run" />
        </div>
      </main>

      {/* ══ FOOTER ══ mono, terminal status-bar style */}
      <footer
        className="flex flex-col gap-2 border-t px-3 py-3 text-[10px] sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: GRID, backgroundColor: "#060708", color: DIM_READ }}
      >
        <div className="flex items-center gap-2 uppercase tracking-[0.2em]">
          <span style={{ color: AMBER }}>{appConfig.name}</span>
          <span style={{ color: GRID }}>·</span>
          <span>Tallinn</span>
          <span style={{ color: GRID }}>·</span>
          <span>aicapital.ee</span>
        </div>
        <a
          href="https://abduljaleel.xyz/aletheia/"
          target="_blank"
          rel="noopener noreferrer"
          className="aic-focus self-start border px-2.5 py-1 uppercase tracking-[0.2em] transition-colors hover:text-white sm:self-auto"
          style={{ borderColor: GRID }}
        >
          Part of the Aletheia stack ↗
        </a>
      </footer>

      {/* keyframes + interaction states — plain <style> with template literal.
          All motion is gated behind prefers-reduced-motion: no-preference. */}
      <style>{`
        .aic-focus:focus-visible {
          outline: 2px solid ${AMBER};
          outline-offset: 2px;
        }
        .aic-cta {
          background: ${AMBER};
          color: #0a0b0d;
          border: 1px solid ${AMBER};
          transition: background-color 0.15s ease, color 0.15s ease;
        }
        .aic-cta:hover {
          background: transparent;
          color: ${AMBER};
        }
        @media (prefers-reduced-motion: no-preference) {
          .aic-marquee {
            animation: aic-marquee 42s linear infinite;
            will-change: transform;
          }
          .aic-marquee:hover {
            animation-play-state: paused;
          }
          .aic-bar {
            transform-origin: bottom;
            animation: aic-grow 0.7s cubic-bezier(0.2, 0.85, 0.3, 1) both;
            animation-delay: var(--d, 0ms);
          }
          .aic-bar-breach {
            animation-name: aic-grow-breach;
          }
          .aic-edge {
            stroke-dasharray: 1;
            stroke-dashoffset: 1;
            animation: aic-draw 0.7s ease forwards;
            animation-delay: var(--d, 0ms);
          }
          .aic-pulse {
            animation: aic-pulse 2.2s ease-in-out infinite;
          }
          .aic-cursor {
            animation: aic-blink 1.1s step-end infinite;
          }
          .aic-ceiling {
            animation: aic-flash 1s ease-in-out 0.95s 1;
          }
        }
        @keyframes aic-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.3333%); }
        }
        @keyframes aic-grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes aic-grow-breach {
          0% { transform: scaleY(0); }
          78% { transform: scaleY(1.06); }
          100% { transform: scaleY(1); }
        }
        @keyframes aic-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes aic-pulse {
          0%, 100% { box-shadow: 0 0 8px ${HOT}88; }
          50% { box-shadow: 0 0 18px ${HOT}dd; }
        }
        @keyframes aic-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes aic-flash {
          0%, 100% { opacity: 1; }
          30% { opacity: 0.4; text-shadow: 0 0 8px ${HOT}; }
        }
      `}</style>
    </div>
  );
}

/* ── Reusable terminal panel chrome ── */
function Panel({
  tag,
  title,
  right,
  children,
  mono,
  className,
}: {
  tag: string;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <section
      className={`border ${className ?? ""}`}
      style={{ borderColor: GRID, backgroundColor: mono ? "#060708" : PANEL }}
    >
      <div
        className="flex items-center justify-between border-b px-2.5 py-1.5"
        style={{ borderColor: GRID, backgroundColor: PANEL_HEAD }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-4 w-4 items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: `${AMBER}22`, color: AMBER, border: `1px solid ${AMBER}55` }}
          >
            {tag}
          </span>
          <h2 className="m-0 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#9aa3b0" }}>
            {title}
          </h2>
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}

function PanelFoot({ left, right }: { left: string; right: string }) {
  return (
    <div
      className="flex items-center justify-between border-t px-2.5 py-1.5 text-[10px] uppercase tracking-[0.18em]"
      style={{ borderColor: GRID, color: DIM_READ }}
    >
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function GuardStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="border px-1 py-1" style={{ borderColor: GRID }}>
      <div className="text-[12px] font-bold tabular-nums" style={{ color }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em]" style={{ color: DIM_READ }}>
        {label}
      </div>
    </div>
  );
}

function Ribbon({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1 px-3 py-3 sm:px-4">
      <span
        className="text-2xl font-bold leading-none tabular-nums sm:text-3xl"
        style={{ color: AMBER }}
      >
        {value}
      </span>
      <span
        className="text-[10px] uppercase leading-tight tracking-[0.15em]"
        style={{ color: DIM_READ }}
      >
        {label}
      </span>
    </div>
  );
}
