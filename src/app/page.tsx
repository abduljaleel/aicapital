import Link from "next/link";
import { appConfig } from "@/lib/config";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#1a1814] text-[#e8e0d0]">
      {/* Nav */}
      <header className="border-b border-[#3a3428] sticky top-0 z-50 bg-[#1a1814]/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-[#8b7a5e] text-[#c9a84c] text-sm font-serif font-bold">
              A
            </div>
            <span className="font-serif text-lg text-[#c9a84c] tracking-wide">{appConfig.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#a09080] hover:text-[#c9a84c] transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm bg-[#c9a84c] text-[#1a1814] px-4 py-2 rounded font-medium hover:bg-[#d4b05c] transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        <div className="mx-auto flex max-w-4xl flex-col items-center px-4 pt-32 pb-24 text-center relative">
          {/* Decorative quotation mark */}
          <div className="font-serif text-[120px] leading-none text-[#c9a84c]/20 select-none mb-[-20px]">
            &#10077;
          </div>
          <h1 className="max-w-3xl text-4xl md:text-5xl font-serif leading-tight text-[#e8e0d0] italic">
            What would you decide if you could see all the angles?
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-[#a09080] leading-relaxed">
            AI Capital is your decision companion. Not a chatbot — a structured thinking space.
          </p>
          <div className="mt-10">
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1a1814] px-6 py-3 rounded font-medium hover:bg-[#d4b05c] transition-colors text-sm">
              Enter the decision room
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Decision in action */}
      <section className="mx-auto max-w-5xl px-4 pb-28">
        <p className="text-xs font-mono text-[#8b7a5e] uppercase tracking-[0.2em] mb-6 text-center">
          The Decision in Action
        </p>
        <div className="rounded-xl border border-[#3a3428] bg-[#211e18] shadow-2xl shadow-black/30 p-6 md:p-8">
          {/* Scenario cards */}
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-0 items-stretch">
            {/* Card 1 */}
            <div className="rounded-lg border border-[#3a3428] bg-[#1a1814] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-[#c9a84c]" />
                <span className="text-sm font-semibold text-[#c9a84c] font-serif">Expand to Europe</span>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-[#8b7a5e] uppercase tracking-wider mb-2">Assumptions</p>
                  <div className="space-y-1.5 text-[#a09080]">
                    <div className="flex justify-between">
                      <span>Market size</span>
                      <span className="text-[#e8e0d0] font-mono">$4.2B</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Regulatory cost</span>
                      <span className="text-[#e8e0d0] font-mono">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time to revenue</span>
                      <span className="text-[#e8e0d0] font-mono">18mo</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#3a3428]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8b7a5e] text-xs uppercase tracking-wider">Probability</span>
                    <span className="text-2xl font-serif text-[#c9a84c]">35%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VS divider */}
            <div className="flex items-center justify-center px-4">
              <div className="flex flex-col items-center gap-2">
                <div className="hidden md:block w-px h-16 bg-[#3a3428]" />
                <span className="text-xs font-mono text-[#8b7a5e] uppercase tracking-widest">vs</span>
                <div className="hidden md:block w-px h-16 bg-[#3a3428]" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-lg border border-[#3a3428] bg-[#1a1814] p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-2 w-2 rounded-full bg-[#7a9e7e]" />
                <span className="text-sm font-semibold text-[#7a9e7e] font-serif">Double down on US</span>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-[#8b7a5e] uppercase tracking-wider mb-2">Assumptions</p>
                  <div className="space-y-1.5 text-[#a09080]">
                    <div className="flex justify-between">
                      <span>Market size</span>
                      <span className="text-[#e8e0d0] font-mono">$2.1B</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk level</span>
                      <span className="text-[#e8e0d0] font-mono">Low</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time to revenue</span>
                      <span className="text-[#e8e0d0] font-mono">6mo</span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#3a3428]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#8b7a5e] text-xs uppercase tracking-wider">Probability</span>
                    <span className="text-2xl font-serif text-[#7a9e7e]">65%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Synthesis */}
          <div className="mt-6 rounded-lg border border-[#3a3428] bg-[#16140f] p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#c9a84c]">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 4v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-xs text-[#c9a84c] font-mono uppercase tracking-wider">AI Synthesis</span>
            </div>
            <p className="text-sm text-[#a09080] leading-relaxed italic font-serif">
              &ldquo;The US path has 2.3x faster payback but 47% lower ceiling. Europe offers higher upside at
              the cost of regulatory complexity and 3x the capital requirement. Consider: a phased
              approach — secure US revenue first, then fund European expansion from operating cash flow.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Framework gallery */}
      <section className="border-t border-[#3a3428]">
        <div className="mx-auto max-w-5xl px-4 py-24">
          <p className="text-xs font-mono text-[#8b7a5e] uppercase tracking-[0.2em] mb-3 text-center">
            Decision Frameworks
          </p>
          <h2 className="text-center text-3xl font-serif text-[#e8e0d0] mb-4">
            Structured thinking, not guessing
          </h2>
          <p className="text-center text-[#a09080] mb-14 max-w-xl mx-auto text-sm">
            Apply proven frameworks to any decision. Each one guides your reasoning through a different lens.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* SWOT */}
            <div className="rounded-lg border border-[#3a3428] bg-[#211e18] p-5 hover:border-[#8b7a5e] transition-colors">
              <div className="grid grid-cols-2 grid-rows-2 gap-1 mb-4 h-20">
                <div className="bg-[#2a4a2a] rounded-tl-md flex items-center justify-center text-[10px] font-mono text-[#7a9e7e] font-bold">S</div>
                <div className="bg-[#4a2a2a] rounded-tr-md flex items-center justify-center text-[10px] font-mono text-[#c97a7a] font-bold">W</div>
                <div className="bg-[#2a3a4a] rounded-bl-md flex items-center justify-center text-[10px] font-mono text-[#7a9ec9] font-bold">O</div>
                <div className="bg-[#4a3a2a] rounded-br-md flex items-center justify-center text-[10px] font-mono text-[#c9a84c] font-bold">T</div>
              </div>
              <h3 className="font-serif text-[#e8e0d0] text-sm font-semibold">SWOT Analysis</h3>
              <p className="text-xs text-[#8b7a5e] mt-1">Strengths, weaknesses, opportunities, threats</p>
            </div>

            {/* Pre-Mortem */}
            <div className="rounded-lg border border-[#3a3428] bg-[#211e18] p-5 hover:border-[#8b7a5e] transition-colors">
              <div className="flex items-center justify-center h-20 mb-4">
                <svg width="48" height="56" viewBox="0 0 48 56" fill="none" className="text-[#8b7a5e]">
                  <path d="M8 8h32v40c0 2-2 4-4 4H12c-2 0-4-2-4-4V8z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 0h24v8H12z" fill="currentColor" opacity="0.3"/>
                  <path d="M18 4h12" stroke="currentColor" strokeWidth="1"/>
                  <text x="24" y="34" textAnchor="middle" fill="currentColor" fontSize="7" fontFamily="serif" opacity="0.7">RIP</text>
                  <path d="M16 42h16" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
                  <path d="M18 45h12" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
                </svg>
              </div>
              <h3 className="font-serif text-[#e8e0d0] text-sm font-semibold">Pre-Mortem</h3>
              <p className="text-xs text-[#8b7a5e] mt-1">&ldquo;What killed this?&rdquo;</p>
            </div>

            {/* Weighted Matrix */}
            <div className="rounded-lg border border-[#3a3428] bg-[#211e18] p-5 hover:border-[#8b7a5e] transition-colors">
              <div className="h-20 mb-4 flex items-center justify-center">
                <table className="text-[10px] font-mono text-[#8b7a5e] border-collapse">
                  <thead>
                    <tr>
                      <th className="px-1.5 py-0.5 text-left border-b border-[#3a3428]"></th>
                      <th className="px-1.5 py-0.5 border-b border-[#3a3428] text-[#c9a84c]">Wt</th>
                      <th className="px-1.5 py-0.5 border-b border-[#3a3428]">A</th>
                      <th className="px-1.5 py-0.5 border-b border-[#3a3428]">B</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-1.5 py-0.5">Cost</td>
                      <td className="px-1.5 py-0.5 text-center text-[#c9a84c]">3</td>
                      <td className="px-1.5 py-0.5 text-center">7</td>
                      <td className="px-1.5 py-0.5 text-center">9</td>
                    </tr>
                    <tr>
                      <td className="px-1.5 py-0.5">Speed</td>
                      <td className="px-1.5 py-0.5 text-center text-[#c9a84c]">5</td>
                      <td className="px-1.5 py-0.5 text-center">8</td>
                      <td className="px-1.5 py-0.5 text-center">4</td>
                    </tr>
                    <tr className="border-t border-[#3a3428]">
                      <td className="px-1.5 py-0.5">Risk</td>
                      <td className="px-1.5 py-0.5 text-center text-[#c9a84c]">4</td>
                      <td className="px-1.5 py-0.5 text-center">6</td>
                      <td className="px-1.5 py-0.5 text-center">8</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h3 className="font-serif text-[#e8e0d0] text-sm font-semibold">Weighted Matrix</h3>
              <p className="text-xs text-[#8b7a5e] mt-1">Score and rank your options</p>
            </div>

            {/* Decision Journal */}
            <div className="rounded-lg border border-[#3a3428] bg-[#211e18] p-5 hover:border-[#8b7a5e] transition-colors">
              <div className="h-20 mb-4 flex items-center justify-center">
                <svg width="44" height="52" viewBox="0 0 44 52" fill="none" className="text-[#8b7a5e]">
                  <rect x="4" y="2" width="36" height="48" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M4 2h4v48H4" fill="currentColor" opacity="0.2"/>
                  <line x1="14" y1="12" x2="34" y2="12" stroke="currentColor" strokeWidth="0.75" opacity="0.4"/>
                  <line x1="14" y1="18" x2="30" y2="18" stroke="currentColor" strokeWidth="0.75" opacity="0.4"/>
                  <line x1="14" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="0.75" opacity="0.4"/>
                  <line x1="14" y1="30" x2="28" y2="30" stroke="currentColor" strokeWidth="0.75" opacity="0.4"/>
                  <text x="14" y="42" fill="#c9a84c" fontSize="6" fontFamily="monospace" opacity="0.6">Mar 14</text>
                  <text x="14" y="48" fill="#c9a84c" fontSize="6" fontFamily="monospace" opacity="0.4">Feb 28</text>
                </svg>
              </div>
              <h3 className="font-serif text-[#e8e0d0] text-sm font-semibold">Decision Journal</h3>
              <p className="text-xs text-[#8b7a5e] mt-1">Track decisions over time</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Compound Effect */}
      <section className="border-t border-[#3a3428]">
        <div className="mx-auto max-w-4xl px-4 py-24">
          <p className="text-xs font-mono text-[#8b7a5e] uppercase tracking-[0.2em] mb-3 text-center">
            The Compound Effect
          </p>
          <h2 className="text-center text-3xl font-serif text-[#e8e0d0] mb-4">
            Every decision compounds. Track yours.
          </h2>
          <p className="text-center text-[#a09080] mb-16 max-w-xl mx-auto text-sm">
            Decisions are not isolated events. Each one feeds the next. Build a record that makes you wiser.
          </p>

          {/* Timeline */}
          <div className="relative flex items-center justify-between max-w-3xl mx-auto px-4">
            {/* Connecting line */}
            <div className="absolute left-[10%] right-[10%] top-1/2 h-px bg-[#3a3428]" />
            <div className="absolute left-[10%] right-[10%] top-1/2 h-px bg-gradient-to-r from-[#c9a84c]/40 via-[#c9a84c]/20 to-[#c9a84c]/40" />

            {[
              { label: "Decision Made", sublabel: "Day 0" },
              { label: "3 Months", sublabel: "Check-in" },
              { label: "Outcome Reviewed", sublabel: "Assessment" },
              { label: "Lesson Learned", sublabel: "Wisdom" },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-3 h-3 rounded-full bg-[#c9a84c] border-2 border-[#1a1814] shadow-[0_0_8px_rgba(201,168,76,0.3)]" />
                <span className="mt-3 text-xs font-serif text-[#e8e0d0] whitespace-nowrap">{item.label}</span>
                <span className="text-[10px] text-[#8b7a5e] font-mono">{item.sublabel}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#3a3428]">
        <div className="mx-auto max-w-4xl px-4 py-24 text-center">
          <div className="font-serif text-[60px] leading-none text-[#c9a84c]/15 select-none mb-4">
            &#10077;
          </div>
          <h2 className="text-3xl font-serif text-[#e8e0d0] mb-4 italic">
            The best time to think clearly was yesterday.
          </h2>
          <p className="text-[#a09080] mb-10 max-w-lg mx-auto">
            The second best time is now.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#1a1814] px-8 py-3.5 rounded font-medium hover:bg-[#d4b05c] transition-colors">
            Enter the decision room
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#3a3428]">
        <div className="mx-auto flex flex-col sm:flex-row h-auto sm:h-16 max-w-6xl items-center justify-between px-4 py-4 sm:py-0 gap-2">
          <span className="text-xs text-[#8b7a5e] font-serif italic">
            Think better. Decide faster. Learn always.
          </span>
          <div className="flex items-center gap-6 text-xs text-[#5a5040]">
            <span>&copy; {new Date().getFullYear()} {appConfig.name}</span>
            <span>A 12 Cities venture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
