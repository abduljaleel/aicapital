"use client";

import { useEffect, useRef, useState } from "react";

/* Client "islands" that make the terminal actually live. The landing page
   itself stays a server component; only the ticking clock, breathing ticker
   tape, and the projection count-up need client-side state. All motion honors
   prefers-reduced-motion. */

const AMBER = "#f0a050";
const UP = "#4ade80";
const DOWN = "#f06060";
const HOT = "#ff5a4d";
const GRID = "#1c2026";
const DIM_READ = "#8b94a3";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/* ── Live EET clock ── */
export function LiveClock() {
  const reduced = useReducedMotion();
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Tallinn",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date());
    setTime(fmt());
    if (reduced) return;
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <span
      className="hidden items-center gap-1.5 border px-2 py-1 tabular-nums md:inline-flex"
      style={{ borderColor: GRID, color: DIM_READ }}
      aria-label={time ? `Live Tallinn time ${time} EET` : "Live Tallinn time"}
    >
      LIVE <span style={{ color: UP }}>●</span> {time ?? "--:--:--"} EET
    </span>
  );
}

/* ── Ticker tape ── */
type Dir = "up" | "down" | "hot";
const ticker: { sym: string; px: string; dir: Dir }[] = [
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

function tickColor(dir: Dir) {
  if (dir === "up") return UP;
  if (dir === "down") return DOWN;
  return HOT;
}
function tickGlyph(dir: Dir) {
  if (dir === "up") return "▲";
  if (dir === "down") return "▼";
  return "▲▲";
}
function tickWord(dir: Dir) {
  if (dir === "up") return "up";
  if (dir === "down") return "down";
  return "spiking";
}

// Nudge the last digit of a price without changing its character width, so the
// tape "breathes" without causing any horizontal reflow.
function nudge(px: string): string {
  const chars = px.split("");
  for (let i = chars.length - 1; i >= 0; i--) {
    if (/[0-9]/.test(chars[i])) {
      chars[i] = String((Number(chars[i]) + 1) % 10);
      break;
    }
  }
  return chars.join("");
}

export function CostFeed() {
  const reduced = useReducedMotion();
  const [prices, setPrices] = useState<string[]>(() => ticker.map((t) => t.px));
  const [flashIdx, setFlashIdx] = useState<number | null>(null);

  useEffect(() => {
    if (reduced) return;
    let flashTimer: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      const i = Math.floor(Math.random() * ticker.length);
      setFlashIdx(i);
      setPrices((prev) => prev.map((p, idx) => (idx === i ? nudge(p) : p)));
      flashTimer = setTimeout(() => setFlashIdx(null), 520);
    }, 3600);
    return () => {
      clearInterval(id);
      clearTimeout(flashTimer);
    };
  }, [reduced]);

  const copies = [0, 1, 2];

  return (
    <div
      className="w-full overflow-hidden whitespace-nowrap border-b"
      style={{ borderColor: GRID, backgroundColor: "#060708" }}
    >
      <div className="flex items-center">
        <span
          className="relative z-20 shrink-0 border-r px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ backgroundColor: AMBER, color: "#0a0b0d", borderColor: GRID }}
        >
          COST·FEED
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div
            className={`flex items-center py-1.5 ${reduced ? "" : "aic-marquee"}`}
            aria-hidden="true"
          >
            {copies.map((c) =>
              ticker.map((t, i) => {
                const color = tickColor(t.dir);
                const flashing = flashIdx === i;
                return (
                  <span
                    key={`${c}-${i}`}
                    className="inline-flex items-center gap-1.5 border-r px-4 text-[11px] tabular-nums transition-colors duration-300"
                    style={{
                      borderColor: "#15181c",
                      backgroundColor: flashing ? `${color}22` : "transparent",
                    }}
                  >
                    <span style={{ color: DIM_READ }}>{t.sym}</span>
                    <span style={{ color }}>{prices[i]}</span>
                    <span style={{ color }}>{tickGlyph(t.dir)}</span>
                  </span>
                );
              })
            )}
          </div>
          {/* fade the tape in from behind the chip on the left, out at the right edge */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8"
            style={{ background: "linear-gradient(to right, #060708, transparent)" }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10"
            style={{ background: "linear-gradient(to left, #060708, transparent)" }}
          />
        </div>
      </div>
      {/* Static, screen-reader-friendly summary of the same data. */}
      <span className="sr-only">
        Live model and agent cost feed:{" "}
        {ticker.map((t) => `${t.sym} ${t.px} ${tickWord(t.dir)}`).join(", ")}.
      </span>
    </div>
  );
}

/* ── Cost-forecast projection counter (Panel B header chip) ── */
export function ProjCounter() {
  const reduced = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (reduced) {
      setVal(218);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 0.5 - Math.cos(Math.PI * p) / 2;
      setVal(Math.round(218 * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <span className="text-[10px] tabular-nums" style={{ color: DOWN }}>
      PROJ ▲ +{val}%
    </span>
  );
}
