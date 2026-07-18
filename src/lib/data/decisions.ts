export type DecisionType = "investment" | "strategic" | "operational" | "hire";
export type DecisionStatus = "exploring" | "analyzing" | "decided" | "reviewed";
export type EvidenceSentiment = "supports" | "contradicts" | "neutral";
export type EvidenceRelevance = "high" | "medium" | "low";
export type SourceType = "research" | "data" | "expert" | "internal" | "market";
export type JournalEntryType = "rationale" | "update" | "outcome_review";
export type FrameworkType = "swot" | "weighted_scoring" | "pre_mortem" | "pros_cons" | "eisenhower" | "second_order";

export interface Scenario {
  id: string;
  name: string;
  description: string;
  assumptions: string[];
  projectedOutcomes: string[];
  probability: number;
  score: number;
}

export interface Evidence {
  id: string;
  sourceType: SourceType;
  content: string;
  relevance: EvidenceRelevance;
  sentiment: EvidenceSentiment;
  addedAt: string;
}

export interface JournalEntry {
  id: string;
  decisionId: string;
  type: JournalEntryType;
  content: string;
  confidence: number;
  createdAt: string;
}

export interface Decision {
  id: string;
  title: string;
  description: string;
  type: DecisionType;
  status: DecisionStatus;
  confidence: number;
  stakeholders: string[];
  keyQuestion: string;
  scenarios: Scenario[];
  evidence: Evidence[];
  journalEntries: JournalEntry[];
  createdAt: string;
  reviewDate?: string;
  decidedAt?: string;
  outcome?: string;
}

export interface Framework {
  id: FrameworkType;
  name: string;
  description: string;
  whenToUse: string;
  complexity: "low" | "medium" | "high";
}

export const frameworks: Framework[] = [
  {
    id: "swot",
    name: "SWOT Analysis",
    description: "Evaluate strengths, weaknesses, opportunities, and threats to understand the full landscape of a decision.",
    whenToUse: "When you need a comprehensive overview of internal and external factors before making a strategic choice.",
    complexity: "low",
  },
  {
    id: "weighted_scoring",
    name: "Weighted Decision Matrix",
    description: "Score options against weighted criteria to make objective, multi-factor comparisons.",
    whenToUse: "When comparing multiple options across several criteria and you need a quantitative comparison.",
    complexity: "medium",
  },
  {
    id: "pre_mortem",
    name: "Pre-Mortem",
    description: "Imagine the decision has failed and work backward to identify what went wrong. A powerful tool for surfacing hidden risks.",
    whenToUse: "Before committing to a high-stakes decision to stress-test assumptions and uncover blind spots.",
    complexity: "low",
  },
  {
    id: "pros_cons",
    name: "Pros & Cons",
    description: "A simple two-column comparison of arguments for and against a decision. Clear, fast, and universally understood.",
    whenToUse: "For quick decisions where you need clarity on trade-offs without heavy analysis.",
    complexity: "low",
  },
  {
    id: "eisenhower",
    name: "Eisenhower Matrix",
    description: "Prioritize by urgency and importance. Separate what demands action now from what deserves strategic investment.",
    whenToUse: "When overwhelmed with competing priorities and need to decide what to focus on first.",
    complexity: "low",
  },
  {
    id: "second_order",
    name: "Second-Order Thinking",
    description: "Go beyond first-order consequences. Map the cascade of effects a decision will trigger over time.",
    whenToUse: "For decisions with long-term implications where downstream effects matter more than immediate outcomes.",
    complexity: "high",
  },
];

export const sampleDecisions: Decision[] = [
  {
    id: "dec-001",
    title: "Series A Lead Investor Selection",
    description: "Evaluating three potential lead investors for our Series A round. Each brings different strategic value, terms, and network effects. Need to decide by end of month.",
    type: "investment",
    status: "analyzing",
    confidence: 65,
    stakeholders: ["CEO", "CFO", "Board"],
    keyQuestion: "Which investor maximizes long-term strategic value while preserving founder control?",
    scenarios: [
      {
        id: "sc-001",
        name: "Sequoia Partnership",
        description: "Accept Sequoia's term sheet at $40M pre-money with standard terms and board seat.",
        assumptions: ["Brand halo effect accelerates enterprise deals", "Board member adds operational value", "Follow-on capital likely"],
        projectedOutcomes: ["Faster enterprise adoption", "Strong signal to market", "Higher dilution (18%)", "Potential pressure for aggressive growth"],
        probability: 40,
        score: 78,
      },
      {
        id: "sc-002",
        name: "Industry-Specific Fund",
        description: "Accept VerticalAI Partners at $35M pre-money with co-investment rights and two board observers.",
        assumptions: ["Deep industry connections convert to revenue", "Technical advisory adds product value", "Smaller fund means more attention"],
        projectedOutcomes: ["Targeted customer introductions", "Product-market fit validation", "Higher dilution (20%)", "Less brand recognition"],
        probability: 35,
        score: 72,
      },
      {
        id: "sc-003",
        name: "Strategic Corporate Investor",
        description: "Accept TechCorp Ventures at $45M pre-money with partnership agreement and limited governance.",
        assumptions: ["Distribution partnership materializes", "No competitive conflicts emerge", "Corporate bureaucracy manageable"],
        projectedOutcomes: ["Built-in distribution channel", "Highest valuation", "Potential acqui-hire risk", "Lowest dilution (15%)"],
        probability: 25,
        score: 68,
      },
    ],
    evidence: [
      {
        id: "ev-001",
        sourceType: "research",
        content: "Analysis of 200 Series A companies shows that brand-name VCs correlate with 2.3x higher Series B success rates, but industry-specialist funds show higher revenue growth in first 18 months.",
        relevance: "high",
        sentiment: "neutral",
        addedAt: "2026-03-28",
      },
      {
        id: "ev-002",
        sourceType: "expert",
        content: "Former portfolio CEO of VerticalAI reports exceptional hands-on support during product pivots but limited help with talent recruiting.",
        relevance: "medium",
        sentiment: "supports",
        addedAt: "2026-03-30",
      },
      {
        id: "ev-003",
        sourceType: "market",
        content: "Three comparable companies that took strategic corporate investment faced acquisition pressure within 24 months. Two were acquired below potential.",
        relevance: "high",
        sentiment: "contradicts",
        addedAt: "2026-04-01",
      },
      {
        id: "ev-004",
        sourceType: "data",
        content: "Internal financial model shows runway extends to 22 months with Sequoia terms, 20 months with VerticalAI, and 24 months with TechCorp due to higher valuation.",
        relevance: "high",
        sentiment: "neutral",
        addedAt: "2026-04-02",
      },
    ],
    journalEntries: [
      {
        id: "je-001",
        decisionId: "dec-001",
        type: "rationale",
        content: "Starting this decision process because term sheets are in hand and we need to respond within 3 weeks. Key tension is between brand/signal value (Sequoia), domain expertise (VerticalAI), and distribution/valuation (TechCorp).",
        confidence: 50,
        createdAt: "2026-03-25",
      },
      {
        id: "je-002",
        decisionId: "dec-001",
        type: "update",
        content: "After reference calls, leaning away from TechCorp. The acquisition pressure data is concerning. The real choice seems to be between Sequoia's brand and VerticalAI's domain depth.",
        confidence: 65,
        createdAt: "2026-04-03",
      },
    ],
    createdAt: "2026-03-25",
    reviewDate: "2026-04-20",
  },
  {
    id: "dec-002",
    title: "Platform Architecture: Monolith vs Microservices",
    description: "Current monolith is hitting scaling limits. Need to decide on architectural direction for the next 18 months of product development.",
    type: "strategic",
    status: "exploring",
    confidence: 40,
    stakeholders: ["CTO", "VP Engineering", "Product Lead"],
    keyQuestion: "What architecture best balances development velocity with scalability for our current team size?",
    scenarios: [
      {
        id: "sc-004",
        name: "Full Microservices Migration",
        description: "Decompose the monolith into 8-12 independent services over 6 months.",
        assumptions: ["Team can handle distributed systems complexity", "DevOps investment is feasible", "Business can tolerate slower feature velocity during migration"],
        projectedOutcomes: ["Independent scaling per service", "6-month feature velocity slowdown", "Higher infrastructure costs", "Better long-term maintainability"],
        probability: 20,
        score: 55,
      },
      {
        id: "sc-005",
        name: "Modular Monolith",
        description: "Restructure the monolith into well-defined modules with clear boundaries, keeping single deployment.",
        assumptions: ["Module boundaries can be cleanly defined", "Team discipline maintains separation", "Current scale needs can be met with vertical scaling"],
        projectedOutcomes: ["Minimal velocity disruption", "Clear path to future extraction", "Lower complexity overhead", "May need revisiting in 12-18 months"],
        probability: 55,
        score: 80,
      },
    ],
    evidence: [
      {
        id: "ev-005",
        sourceType: "internal",
        content: "Current p95 response times have degraded 40% in the last quarter. Database connection pooling is the primary bottleneck, not application architecture.",
        relevance: "high",
        sentiment: "contradicts",
        addedAt: "2026-04-05",
      },
      {
        id: "ev-006",
        sourceType: "expert",
        content: "Staff engineer recommends modular monolith as intermediate step. Cited Amazon's approach of building service boundaries before extraction.",
        relevance: "high",
        sentiment: "supports",
        addedAt: "2026-04-06",
      },
    ],
    journalEntries: [
      {
        id: "je-003",
        decisionId: "dec-002",
        type: "rationale",
        content: "Triggered by increasing production incidents and slow deploys. Before jumping to microservices, we need to understand if the problem is truly architectural or operational.",
        confidence: 40,
        createdAt: "2026-04-04",
      },
    ],
    createdAt: "2026-04-04",
    reviewDate: "2026-05-01",
  },
  {
    id: "dec-003",
    title: "VP of Sales Hire",
    description: "First senior sales hire. Debating between an enterprise sales veteran and a product-led growth specialist.",
    type: "hire",
    status: "decided",
    confidence: 82,
    stakeholders: ["CEO", "Head of Product", "Board Advisor"],
    keyQuestion: "Do we need someone who can close large deals or someone who can build a scalable sales motion?",
    scenarios: [
      {
        id: "sc-006",
        name: "Enterprise Sales Veteran",
        description: "Hire Sarah K. — 15 years enterprise SaaS, built teams from 0 to 50, strong Rolodex.",
        assumptions: ["Enterprise deals are the primary revenue driver", "She can adapt to startup pace", "Her network translates to our market"],
        projectedOutcomes: ["Faster large deal closure", "Higher initial cost", "Proven playbook", "May over-index on enterprise too early"],
        probability: 70,
        score: 85,
      },
      {
        id: "sc-007",
        name: "PLG Specialist",
        description: "Hire Marcus T. — scaled three PLG companies, strong in product analytics and conversion optimization.",
        assumptions: ["Product-led motion is viable for our category", "Freemium tier drives adoption", "Self-serve can generate meaningful revenue"],
        projectedOutcomes: ["Scalable acquisition engine", "Longer time to large deals", "Better unit economics", "Needs product changes to support PLG"],
        probability: 30,
        score: 70,
      },
    ],
    evidence: [
      {
        id: "ev-007",
        sourceType: "data",
        content: "Pipeline analysis shows 80% of revenue comes from deals over $50K ACV. Only 12% of sign-ups convert through self-serve.",
        relevance: "high",
        sentiment: "supports",
        addedAt: "2026-03-15",
      },
    ],
    journalEntries: [
      {
        id: "je-004",
        decisionId: "dec-003",
        type: "rationale",
        content: "The data is clear — our revenue is enterprise-driven. While PLG is appealing long-term, we need someone who can accelerate what's already working.",
        confidence: 75,
        createdAt: "2026-03-10",
      },
      {
        id: "je-005",
        decisionId: "dec-003",
        type: "update",
        content: "Chose Sarah K. after final interviews. Her references were outstanding and she presented a compelling 90-day plan. Starting April 15.",
        confidence: 82,
        createdAt: "2026-03-20",
      },
      {
        id: "je-006",
        decisionId: "dec-003",
        type: "outcome_review",
        content: "Two weeks in — Sarah has already identified three pipeline opportunities from her network. Early signal is very positive. Scheduling 90-day formal review.",
        confidence: 85,
        createdAt: "2026-04-01",
      },
    ],
    createdAt: "2026-03-01",
    reviewDate: "2026-06-15",
  },
  {
    id: "dec-004",
    title: "Q3 Marketing Budget Allocation",
    description: "Deciding how to allocate the $200K Q3 marketing budget across channels. Previous quarter showed strong content marketing ROI but underperforming paid channels.",
    type: "operational",
    status: "exploring",
    confidence: 35,
    stakeholders: ["CMO", "Head of Growth", "CFO"],
    keyQuestion: "Should we double down on content or diversify into events and partnerships?",
    scenarios: [
      {
        id: "sc-008",
        name: "Content-Heavy Strategy",
        description: "Allocate 60% to content, 25% to SEO/organic, 15% to targeted paid.",
        assumptions: ["Content ROI continues at current rate", "SEO compounds over time", "Paid can be precisely targeted"],
        projectedOutcomes: ["Strong organic pipeline growth", "Longer lead times", "Lower CAC", "Harder to attribute revenue directly"],
        probability: 45,
        score: 72,
      },
      {
        id: "sc-009",
        name: "Balanced Mix with Events",
        description: "Allocate 35% to content, 30% to events/partnerships, 20% to paid, 15% to brand.",
        assumptions: ["Events create high-intent leads", "Partnership co-marketing works", "Brand investment pays off in 6+ months"],
        projectedOutcomes: ["Diversified pipeline sources", "Higher total spend per lead", "Better for enterprise relationships", "More operational complexity"],
        probability: 35,
        score: 68,
      },
    ],
    evidence: [],
    journalEntries: [
      {
        id: "je-007",
        decisionId: "dec-004",
        type: "rationale",
        content: "Q2 content marketing generated 3x the qualified leads of paid campaigns at 40% of the cost. But the board wants us to explore higher-touch channels for enterprise buyers.",
        confidence: 35,
        createdAt: "2026-04-08",
      },
    ],
    createdAt: "2026-04-08",
  },
];

// Helper to get all journal entries across all decisions, sorted by date
export function getAllJournalEntries(): (JournalEntry & { decisionTitle: string })[] {
  return sampleDecisions
    .flatMap((d) =>
      d.journalEntries.map((je) => ({
        ...je,
        decisionTitle: d.title,
      }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getDecisionById(id: string): Decision | undefined {
  return sampleDecisions.find((d) => d.id === id);
}
