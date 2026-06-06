import Link from "next/link";
import { appConfig } from "@/lib/config";

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
const DOWN = "#f06060"; // red
const HOT = "#ff5a4d";
const DIM = "#5a6270";

/* Ticker tape entries — fake live cost feed */
const ticker: { sym: string; px: string; dir: "up" | "down" | "hot" }[] = [
  { sym: "GPT-4o", px: "$0.031", dir: "up" },
  { sym: "claude", px: "$0.018", dir: "down" },
  { sym: "loop#42", px: "$4,287", dir: "hot" },
  { sym: "haiku", px: "$0.002", dir: "down" },
  { sym: "o3-mini", px: "$0.014", dir: "up" },
  { sym: "embed", px: "$0.0001", dir: "down" },
  { sym: "agent#4821", px: "$612", dir: "up" },
  { sym: "tool.code", px: "$3.91", dir: "hot" },
  { sym: "sonnet", px: "$0.022", dir: "up" },
  { sym: "rerank", px: "$0.008", dir: "down" },
  { sym: "loop#17", px: "$1,204", dir: "hot" },
  { sym: "gpt-4o-mini", px: "$0.006", dir: "down" },
];

function tickColor(dir: "up" | "down" | "hot") {
  if (dir === "up") return UP;
  if (dir === "down") return DOWN;
  return HOT;
}
function tickGlyph(dir: "up" | "down" | "hot") {
  if (dir === "up") return "▲";
  if (dir === "down") return "▼";
  return "▲▲";
}

/* Forecast bars (Panel B) — climbing spend, breaches the ceiling */
const forecastBars = [12, 18, 24, 31, 40, 52, 66, 79, 88, 96];
const CEILING_AT = 7; // bar index where projection crosses the budget ceiling

/* Task-tree nodes (Panel A) */
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
  { id: "b1", label: "model", cost: "$0.22", x: 76, y: 82, parent: "b" },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen font-mono text-[13px] leading-tight"
      style={{ backgroundColor: BG, color: "#c9d1d9" }}
    >
      {/* ══ TOP TICKER BAR ══ A scrolling stock-ticker strip of fake cost feeds */}
      <div
        className="w-full overflow-hidden border-b whitespace-nowrap"
        style={{ borderColor: GRID, backgroundColor: "#060708" }}
      >
        <div className="flex items-center">
          <span
            className="shrink-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] border-r"
            style={{ backgroundColor: AMBER, color: "#0a0b0d", borderColor: GRID }}
          >
            COST·FEED
          </span>
          <div
            className="flex items-center gap-0 py-1.5"
            style={{ animation: "aic-marquee 38s linear infinite" }}
          >
            {[...ticker, ...ticker].map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-4 border-r tabular-nums text-[11px]"
                style={{ borderColor: "#15181c" }}
              >
                <span style={{ color: DIM }}>{t.sym}</span>
                <span style={{ color: tickColor(t.dir) }}>{t.px}</span>
                <span style={{ color: tickColor(t.dir) }}>{tickGlyph(t.dir)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BRAND ROW ══ ticker symbol + city + session, mono buttons right-aligned */}
      <header
        className="flex items-center justify-between gap-3 border-b px-3 py-2"
        style={{ borderColor: GRID }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="text-sm font-bold tracking-[0.18em] uppercase"
            style={{ color: AMBER }}
          >
            {appConfig.name}
          </span>
          <span className="hidden sm:inline text-[10px]" style={{ color: GRID }}>
            ▌
          </span>
          <span
            className="hidden sm:inline text-[10px] uppercase tracking-[0.25em]"
            style={{ color: DIM }}
          >
            Tallinn 🇪🇪 · Hanse port
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span
            className="hidden md:inline tabular-nums px-2 py-1 border"
            style={{ borderColor: GRID, color: DIM }}
          >
            LIVE <span style={{ color: UP }}>●</span> 04:12:07 EET
          </span>
          <Link
            href="/login"
            className="px-2.5 py-1 border uppercase tracking-wider transition-colors hover:bg-white/5"
            style={{ borderColor: GRID, color: "#9aa3b0" }}
          >
            sign in
          </Link>
          <Link
            href="/signup"
            className="px-2.5 py-1 border uppercase tracking-wider font-bold transition-colors"
            style={{ borderColor: AMBER, color: "#0a0b0d", backgroundColor: AMBER }}
          >
            get started
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          HERO = MULTI-PANEL DASHBOARD GRID (the hero is the data, not a headline)
          ══════════════════════════════════════════════════════════════════ */}
      <main className="p-2 sm:p-3">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {/* ── PANEL A · AGENT TASK TREE ── */}
          <Panel
            tag="A"
            title="AGENT TASK TREE"
            right={
              <span
                className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                style={{ backgroundColor: `${HOT}1a`, color: HOT, border: `1px solid ${HOT}66` }}
              >
                ⚠ $4,200 OVER BUDGET
              </span>
            }
          >
            <div className="relative w-full" style={{ height: 210 }}>
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
              >
                {treeNodes.map((n) => {
                  if (!n.parent) return null;
                  const p = treeNodes.find((x) => x.id === n.parent)!;
                  return (
                    <line
                      key={`e-${n.id}`}
                      x1={p.x}
                      y1={p.y}
                      x2={n.x}
                      y2={n.y}
                      stroke={n.hot ? HOT : "#2a2f37"}
                      strokeWidth={n.hot ? 0.7 : 0.35}
                      vectorEffect="non-scaling-stroke"
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
                      className="rounded-sm"
                      style={{
                        width: n.hot ? 13 : 9,
                        height: n.hot ? 13 : 9,
                        backgroundColor: n.hot ? `${HOT}33` : `${AMBER}22`,
                        border: `1px solid ${n.hot ? HOT : `${AMBER}88`}`,
                        boxShadow: n.hot ? `0 0 14px ${HOT}aa` : "none",
                      }}
                    />
                    <span className="mt-1 text-[9px] whitespace-nowrap" style={{ color: "#9aa3b0" }}>
                      {n.label}
                    </span>
                    <span
                      className="text-[9px] tabular-nums whitespace-nowrap"
                      style={{ color: n.hot ? HOT : AMBER }}
                    >
                      {n.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <PanelFoot left="predicted cost / branch" right="depth=3 · 6 nodes" />
          </Panel>

          {/* ── PANEL B · COST FORECAST ── */}
          <Panel
            tag="B"
            title="COST FORECAST"
            right={<span className="text-[9px]" style={{ color: DOWN }}>PROJ ▲ +218%</span>}
          >
            <div className="relative w-full" style={{ height: 210 }}>
              {/* red budget ceiling line */}
              <div
                className="absolute left-0 right-0 flex items-center"
                style={{ top: "22%" }}
              >
                <div className="h-px w-full" style={{ backgroundColor: HOT, opacity: 0.7 }} />
                <span
                  className="absolute right-0 -top-3.5 px-1 text-[9px] tabular-nums"
                  style={{ color: HOT }}
                >
                  ceiling $4,200
                </span>
              </div>
              <div className="absolute inset-0 flex items-end gap-[3px] px-1 pb-px">
                {forecastBars.map((h, i) => {
                  const breach = i >= CEILING_AT;
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center justify-end">
                      <div
                        className="w-full"
                        style={{
                          height: `${h}%`,
                          backgroundColor: breach ? HOT : AMBER,
                          opacity: breach ? 0.92 : 0.32 + i * 0.05,
                          boxShadow: breach ? `0 0 10px ${HOT}66` : "none",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <PanelFoot left="cum. spend → projected" right="t+10 iterations" />
          </Panel>

          {/* ── PANEL C · LINT OUTPUT ── terminal block */}
          <Panel tag="C" title="LINT OUTPUT" mono>
            <pre className="overflow-x-auto px-3 py-3 text-[11px] sm:text-[12px] leading-[1.65]">
              <span style={{ color: DIM }}>$</span>{" "}
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
              <span style={{ color: DIM }}>(downgrade → haiku?)</span>
              {"\n"}
              {"  └ "}<span className="tabular-nums">18</span> tool calls / iteration
              {"\n"}
              <span style={{ color: UP }}>✔</span> suggested fix →{" "}
              <span style={{ color: UP }} className="tabular-nums">$127</span>
              {"\n"}
              <span style={{ color: DIM }}>{"  "}─────────────────────────────</span>
              {"\n"}
              <span style={{ color: DIM }}>{"  "}saved/run </span>
              <span style={{ color: UP }} className="tabular-nums">$4,160</span>
              <span style={{ color: DIM }}> · static · 63ms</span>
            </pre>
            <PanelFoot left="aicapital@v0 — pre-flight" right="exit 1 · 1 warning" />
          </Panel>

          {/* ── PANEL D · BUDGET GUARD ── gauge/meter at 96% amber→red */}
          <Panel
            tag="D"
            title="BUDGET GUARD"
            right={<span className="text-[9px] tabular-nums" style={{ color: HOT }}>96% · CRITICAL</span>}
          >
            <div className="flex flex-col items-center justify-center px-3 py-4" style={{ height: 210 }}>
              {/* semicircle gauge */}
              <div className="relative" style={{ width: 220, height: 118 }}>
                <svg viewBox="0 0 200 110" className="h-full w-full">
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
                    strokeDasharray="270"
                    strokeDashoffset={270 * (1 - 0.96)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                  <span className="text-3xl font-bold tabular-nums" style={{ color: HOT }}>
                    96<span className="text-lg">%</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em]" style={{ color: DIM }}>
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
          className="mt-2 flex flex-col gap-2 border px-4 py-5 sm:flex-row sm:items-end sm:justify-between"
          style={{ borderColor: GRID, backgroundColor: PANEL }}
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: "#e6edf3" }}>
              See the bill before the agent runs.
            </h1>
            <p className="mt-1.5 text-[12px]" style={{ color: DIM }}>
              Linter for agentic logic that predicts hidden costs — static analysis, before a
              single token is spent.
            </p>
          </div>
          <Link
            href="/signup"
            className="shrink-0 self-start px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition-opacity hover:opacity-90"
            style={{ backgroundColor: AMBER, color: "#0a0b0d" }}
          >
            $ aicapital lint →
          </Link>
        </section>

        {/* ── thin numeric ribbon ── */}
        <div
          className="mt-2 grid grid-cols-1 divide-y border text-[11px] sm:grid-cols-3 sm:divide-x sm:divide-y-0"
          style={{ borderColor: GRID, backgroundColor: PANEL_HEAD }}
        >
          <Ribbon value="$2.4M" label="runaway loops prevented" />
          <Ribbon value="18,000" label="budgets enforced" />
          <Ribbon value="63ms" label="static analysis / run" />
        </div>
      </main>

      {/* ══ FOOTER ══ mono, terminal status-bar style */}
      <footer
        className="mt-2 flex flex-col gap-2 border-t px-3 py-3 text-[10px] sm:flex-row sm:items-center sm:justify-between"
        style={{ borderColor: GRID, backgroundColor: "#060708", color: DIM }}
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
          className="self-start border px-2.5 py-1 uppercase tracking-[0.2em] transition-colors hover:text-white sm:self-auto"
          style={{ borderColor: GRID }}
        >
          Part of the Aletheia stack ↗
        </a>
      </footer>

      {/* marquee keyframes (Tailwind v4 — inline style tag, no config edit) */}
      <style>{`
        @keyframes aic-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
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
}: {
  tag: string;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <section className="border" style={{ borderColor: GRID, backgroundColor: mono ? "#060708" : PANEL }}>
      <div
        className="flex items-center justify-between border-b px-2.5 py-1.5"
        style={{ borderColor: GRID, backgroundColor: PANEL_HEAD }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex h-4 w-4 items-center justify-center text-[9px] font-bold"
            style={{ backgroundColor: `${AMBER}22`, color: AMBER, border: `1px solid ${AMBER}55` }}
          >
            {tag}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#9aa3b0" }}>
            {title}
          </span>
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
      className="flex items-center justify-between border-t px-2.5 py-1.5 text-[9px] uppercase tracking-[0.18em]"
      style={{ borderColor: GRID, color: DIM }}
    >
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

function GuardStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="border px-1 py-1" style={{ borderColor: GRID }}>
      <div className="tabular-nums text-[12px] font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-[8px] uppercase tracking-[0.2em]" style={{ color: DIM }}>
        {label}
      </div>
    </div>
  );
}

function Ribbon({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2 px-4 py-3" style={{ borderColor: GRID }}>
      <span className="tabular-nums text-lg font-bold" style={{ color: AMBER }}>
        {value}
      </span>
      <span className="uppercase tracking-[0.18em]" style={{ color: DIM }}>
        {label}
      </span>
    </div>
  );
}
