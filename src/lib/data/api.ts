import { createClient } from "@/lib/supabase/client";
import {
  frameworks as standardFrameworks,
  sampleDecisions,
  type Decision,
  type DecisionStatus,
  type DecisionType,
  type Evidence,
  type EvidenceRelevance,
  type EvidenceSentiment,
  type Framework,
  type FrameworkType,
  type JournalEntry,
  type JournalEntryType,
  type Scenario,
  type SourceType,
} from "@/lib/data/decisions";

// ─── Auth context ────────────────────────────────────────────────────────────

let ctxCache: { userId: string; orgId: string } | null = null;

export async function getCtx() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  if (ctxCache && ctxCache.userId === user.id) {
    return { supabase, ...ctxCache };
  }
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();
  if (error || !profile?.org_id) {
    throw new Error("Could not load your workspace profile");
  }
  ctxCache = { userId: user.id, orgId: profile.org_id as string };
  return { supabase, ...ctxCache };
}

export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  fullName: string | null;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return {
    id: user.id,
    email: user.email ?? "",
    fullName: (user.user_metadata?.full_name as string | undefined) ?? null,
  };
}

// ─── DB row shapes (snake_case) ──────────────────────────────────────────────

interface DecisionRow {
  id: string;
  title: string;
  context: string | null;
  status: string | null;
  decision_type: string | null;
  outcome: string | null;
  decided_at: string | null;
  review_date: string | null;
  created_at: string | null;
  scenarios?: ScenarioRow[] | null;
  evidence?: EvidenceRow[] | null;
  decision_journal?: JournalRow[] | null;
}

interface ScenarioRow {
  id: string;
  decision_id: string | null;
  name: string;
  description: string | null;
  assumptions: unknown;
  projected_outcomes: unknown;
  probability: number | null;
  score: number | null;
  created_at: string | null;
}

interface EvidenceRow {
  id: string;
  decision_id: string | null;
  source_type: string | null;
  content: string | null;
  relevance_score: number | null;
  sentiment: string | null;
  created_at: string | null;
}

interface JournalRow {
  id: string;
  decision_id: string | null;
  entry_type: string | null;
  content: string | null;
  confidence_level: number | null;
  created_at: string | null;
  decisions?: { title: string } | null;
}

interface FrameworkRow {
  id: string;
  name: string;
  framework_type: string | null;
  config: Record<string, unknown> | null;
  is_template: boolean | null;
  created_at: string | null;
}

const DECISION_SELECT = "*, scenarios(*), evidence(*), decision_journal(*)";

// ─── Value mapping helpers (DB ↔ UI) ─────────────────────────────────────────

// The decisions table has no dedicated columns for keyQuestion / stakeholders,
// so they are packed into the `context` text column with parseable markers.
const KEY_QUESTION_MARKER = "\n\n[Key Question]\n";
const STAKEHOLDERS_MARKER = "\n\n[Stakeholders]\n";

function composeContext(
  description: string,
  keyQuestion: string,
  stakeholders: string[]
): string {
  let ctx = description.trim();
  if (keyQuestion.trim()) ctx += KEY_QUESTION_MARKER + keyQuestion.trim();
  if (stakeholders.length > 0)
    ctx += STAKEHOLDERS_MARKER + stakeholders.join(", ");
  return ctx;
}

function parseContext(context: string | null): {
  description: string;
  keyQuestion: string;
  stakeholders: string[];
} {
  let rest = context ?? "";
  let keyQuestion = "";
  let stakeholders: string[] = [];
  const sIdx = rest.indexOf(STAKEHOLDERS_MARKER);
  if (sIdx !== -1) {
    stakeholders = rest
      .slice(sIdx + STAKEHOLDERS_MARKER.length)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    rest = rest.slice(0, sIdx);
  }
  const kIdx = rest.indexOf(KEY_QUESTION_MARKER);
  if (kIdx !== -1) {
    keyQuestion = rest.slice(kIdx + KEY_QUESTION_MARKER.length).trim();
    rest = rest.slice(0, kIdx);
  }
  return { description: rest.trim(), keyQuestion, stakeholders };
}

function toUiStatus(db: string | null): DecisionStatus {
  switch (db) {
    case "analyzing":
      return "analyzing";
    case "decided":
      return "decided";
    case "reviewed":
    case "archived":
      return "reviewed";
    case "exploring":
    case "open":
    default:
      return "exploring";
  }
}

function toUiType(db: string | null): DecisionType {
  switch (db) {
    case "investment":
      return "investment";
    case "operational":
      return "operational";
    case "hire":
    case "hiring":
      return "hire";
    default:
      return "strategic";
  }
}

const SOURCE_TYPES: readonly SourceType[] = [
  "research",
  "data",
  "expert",
  "internal",
  "market",
];

function toUiSourceType(db: string | null): SourceType {
  return (SOURCE_TYPES as readonly string[]).includes(db ?? "")
    ? (db as SourceType)
    : "research";
}

function toDbSentiment(ui: EvidenceSentiment): string {
  if (ui === "supports") return "positive";
  if (ui === "contradicts") return "negative";
  return "neutral";
}

function toUiSentiment(db: string | null): EvidenceSentiment {
  if (db === "positive" || db === "supports") return "supports";
  if (db === "negative" || db === "contradicts") return "contradicts";
  return "neutral";
}

function toDbRelevance(ui: EvidenceRelevance): number {
  if (ui === "high") return 9;
  if (ui === "low") return 3;
  return 6;
}

function toUiRelevance(db: number | null): EvidenceRelevance {
  if (db == null) return "medium";
  if (db >= 8) return "high";
  if (db >= 5) return "medium";
  return "low";
}

function toDbEntryType(ui: JournalEntryType): string {
  return ui === "rationale" ? "reasoning" : ui;
}

function toUiEntryType(db: string | null): JournalEntryType {
  switch (db) {
    case "reasoning":
    case "rationale":
      return "rationale";
    case "outcome_review":
    case "lesson_learned":
      return "outcome_review";
    default:
      return "update";
  }
}

// Probability is stored as a 0–1 fraction in the DB; the UI works in 0–100 %.
function toDbProbability(uiPercent: number): number {
  return Math.max(0, Math.min(1, uiPercent / 100));
}

function toUiProbability(db: number | null): number {
  return Math.round(Number(db ?? 0.5) * 100);
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((v) => String(v)) : [];
}

// ─── Row → UI mappers ────────────────────────────────────────────────────────

function mapScenario(row: ScenarioRow): Scenario {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    assumptions: toStringArray(row.assumptions),
    projectedOutcomes: toStringArray(row.projected_outcomes),
    probability: toUiProbability(row.probability),
    score: Math.round(Number(row.score ?? 50)),
  };
}

function mapEvidence(row: EvidenceRow): Evidence {
  return {
    id: row.id,
    sourceType: toUiSourceType(row.source_type),
    content: row.content ?? "",
    relevance: toUiRelevance(row.relevance_score),
    sentiment: toUiSentiment(row.sentiment),
    addedAt: (row.created_at ?? "").slice(0, 10),
  };
}

function mapJournalEntry(row: JournalRow): JournalEntry {
  return {
    id: row.id,
    decisionId: row.decision_id ?? "",
    type: toUiEntryType(row.entry_type),
    content: row.content ?? "",
    confidence: row.confidence_level ?? 50,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

// Decision-level confidence is derived from the most recent journal entry.
function deriveConfidence(journal: JournalRow[]): number {
  if (journal.length === 0) return 50;
  const latest = [...journal].sort((a, b) =>
    (b.created_at ?? "").localeCompare(a.created_at ?? "")
  )[0];
  return latest.confidence_level ?? 50;
}

function byCreatedAtAsc(a: { created_at: string | null }, b: { created_at: string | null }) {
  return (a.created_at ?? "").localeCompare(b.created_at ?? "");
}

function mapDecision(row: DecisionRow): Decision {
  const { description, keyQuestion, stakeholders } = parseContext(row.context);
  const journalRows = row.decision_journal ?? [];
  return {
    id: row.id,
    title: row.title,
    description,
    type: toUiType(row.decision_type),
    status: toUiStatus(row.status),
    confidence: deriveConfidence(journalRows),
    stakeholders,
    keyQuestion,
    scenarios: [...(row.scenarios ?? [])].sort(byCreatedAtAsc).map(mapScenario),
    evidence: [...(row.evidence ?? [])].sort(byCreatedAtAsc).map(mapEvidence),
    journalEntries: [...journalRows].sort(byCreatedAtAsc).map(mapJournalEntry),
    createdAt: row.created_at ?? new Date().toISOString(),
    reviewDate: row.review_date ?? undefined,
  };
}

const FRAMEWORK_TYPE_TO_DB: Record<FrameworkType, string> = {
  swot: "swot",
  weighted_scoring: "weighted_matrix",
  pre_mortem: "custom",
  pros_cons: "pros_cons",
  eisenhower: "custom",
  second_order: "custom",
};

function frameworkSlugFromDb(row: FrameworkRow): FrameworkType {
  const config = row.config ?? {};
  const slug = config.slug as string | undefined;
  const known: readonly FrameworkType[] = [
    "swot",
    "weighted_scoring",
    "pre_mortem",
    "pros_cons",
    "eisenhower",
    "second_order",
  ];
  if (slug && (known as readonly string[]).includes(slug)) {
    return slug as FrameworkType;
  }
  if (row.framework_type === "pros_cons") return "pros_cons";
  if (row.framework_type === "weighted_matrix") return "weighted_scoring";
  return "swot";
}

export type FrameworkRecord = Framework & { dbId: string };

function mapFramework(row: FrameworkRow): FrameworkRecord {
  const config = row.config ?? {};
  const complexity = config.complexity as Framework["complexity"] | undefined;
  return {
    dbId: row.id,
    id: frameworkSlugFromDb(row),
    name: row.name,
    description: (config.description as string | undefined) ?? "",
    whenToUse: (config.when_to_use as string | undefined) ?? "",
    complexity:
      complexity === "low" || complexity === "medium" || complexity === "high"
        ? complexity
        : "medium",
  };
}

function fail(action: string, message: string): never {
  throw new Error(`Failed to ${action}: ${message}`);
}

// ─── Decisions CRUD ──────────────────────────────────────────────────────────

export async function listDecisions(): Promise<Decision[]> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("decisions")
    .select(DECISION_SELECT)
    .order("created_at", { ascending: false });
  if (error) fail("load decisions", error.message);
  return ((data ?? []) as DecisionRow[]).map(mapDecision);
}

export async function getDecision(id: string): Promise<Decision | null> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("decisions")
    .select(DECISION_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) {
    // 22P02 = invalid uuid input → treat as not found
    if (error.code === "22P02") return null;
    fail("load decision", error.message);
  }
  return data ? mapDecision(data as DecisionRow) : null;
}

export async function createDecision(input: {
  title: string;
  description: string;
  type: DecisionType;
  stakeholders: string[];
  keyQuestion?: string;
}): Promise<Decision> {
  const { supabase, userId, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("decisions")
    .insert({
      org_id: orgId,
      user_id: userId,
      title: input.title,
      context: composeContext(
        input.description,
        input.keyQuestion ?? "",
        input.stakeholders
      ),
      status: "exploring",
      decision_type: input.type,
    })
    .select("*")
    .single();
  if (error || !data) fail("create decision", error?.message ?? "no row returned");
  return mapDecision(data as DecisionRow);
}

export async function updateDecision(
  id: string,
  patch: {
    title?: string;
    description?: string;
    keyQuestion?: string;
    stakeholders?: string[];
    status?: DecisionStatus;
    type?: DecisionType;
    outcome?: string | null;
    reviewDate?: string | null;
    decidedAt?: string | null;
  }
): Promise<void> {
  const { supabase } = await getCtx();
  const update: Record<string, unknown> = {};
  if (patch.title !== undefined) update.title = patch.title;
  if (
    patch.description !== undefined ||
    patch.keyQuestion !== undefined ||
    patch.stakeholders !== undefined
  ) {
    // context packs three UI fields — read current value, merge, re-compose
    const { data: current, error: readError } = await supabase
      .from("decisions")
      .select("context")
      .eq("id", id)
      .single();
    if (readError) fail("update decision", readError.message);
    const parsed = parseContext((current as { context: string | null }).context);
    update.context = composeContext(
      patch.description ?? parsed.description,
      patch.keyQuestion ?? parsed.keyQuestion,
      patch.stakeholders ?? parsed.stakeholders
    );
  }
  if (patch.status !== undefined) update.status = patch.status;
  if (patch.type !== undefined) update.decision_type = patch.type;
  if (patch.outcome !== undefined) update.outcome = patch.outcome;
  if (patch.reviewDate !== undefined) update.review_date = patch.reviewDate;
  if (patch.decidedAt !== undefined) update.decided_at = patch.decidedAt;
  if (Object.keys(update).length === 0) return;
  const { error } = await supabase.from("decisions").update(update).eq("id", id);
  if (error) fail("update decision", error.message);
}

export async function deleteDecision(id: string): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("decisions").delete().eq("id", id);
  if (error) fail("delete decision", error.message);
}

// ─── Scenarios CRUD ──────────────────────────────────────────────────────────

export async function createScenario(
  decisionId: string,
  input: {
    name: string;
    description: string;
    assumptions?: string[];
    projectedOutcomes?: string[];
    probability?: number;
    score?: number;
  }
): Promise<Scenario> {
  const { supabase, userId } = await getCtx();
  const { data, error } = await supabase
    .from("scenarios")
    .insert({
      decision_id: decisionId,
      name: input.name,
      description: input.description,
      assumptions: input.assumptions ?? [],
      projected_outcomes: input.projectedOutcomes ?? [],
      probability: toDbProbability(input.probability ?? 50),
      score: input.score ?? 50,
      created_by: userId,
    })
    .select("*")
    .single();
  if (error || !data) fail("add scenario", error?.message ?? "no row returned");
  return mapScenario(data as ScenarioRow);
}

export async function updateScenario(
  id: string,
  patch: {
    name?: string;
    description?: string;
    assumptions?: string[];
    projectedOutcomes?: string[];
    probability?: number;
    score?: number;
  }
): Promise<void> {
  const { supabase } = await getCtx();
  const update: Record<string, unknown> = {};
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.description !== undefined) update.description = patch.description;
  if (patch.assumptions !== undefined) update.assumptions = patch.assumptions;
  if (patch.projectedOutcomes !== undefined)
    update.projected_outcomes = patch.projectedOutcomes;
  if (patch.probability !== undefined)
    update.probability = toDbProbability(patch.probability);
  if (patch.score !== undefined) update.score = patch.score;
  if (Object.keys(update).length === 0) return;
  const { error } = await supabase.from("scenarios").update(update).eq("id", id);
  if (error) fail("update scenario", error.message);
}

export async function deleteScenario(id: string): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("scenarios").delete().eq("id", id);
  if (error) fail("delete scenario", error.message);
}

// ─── Evidence CRUD ───────────────────────────────────────────────────────────

export async function createEvidence(
  decisionId: string,
  input: {
    sourceType: SourceType;
    content: string;
    relevance: EvidenceRelevance;
    sentiment: EvidenceSentiment;
  }
): Promise<Evidence> {
  const { supabase, userId } = await getCtx();
  const { data, error } = await supabase
    .from("evidence")
    .insert({
      decision_id: decisionId,
      source_type: input.sourceType,
      content: input.content,
      relevance_score: toDbRelevance(input.relevance),
      sentiment: toDbSentiment(input.sentiment),
      added_by: userId,
    })
    .select("*")
    .single();
  if (error || !data) fail("add evidence", error?.message ?? "no row returned");
  return mapEvidence(data as EvidenceRow);
}

export async function updateEvidence(
  id: string,
  patch: {
    sourceType?: SourceType;
    content?: string;
    relevance?: EvidenceRelevance;
    sentiment?: EvidenceSentiment;
  }
): Promise<void> {
  const { supabase } = await getCtx();
  const update: Record<string, unknown> = {};
  if (patch.sourceType !== undefined) update.source_type = patch.sourceType;
  if (patch.content !== undefined) update.content = patch.content;
  if (patch.relevance !== undefined)
    update.relevance_score = toDbRelevance(patch.relevance);
  if (patch.sentiment !== undefined)
    update.sentiment = toDbSentiment(patch.sentiment);
  if (Object.keys(update).length === 0) return;
  const { error } = await supabase.from("evidence").update(update).eq("id", id);
  if (error) fail("update evidence", error.message);
}

export async function deleteEvidence(id: string): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("evidence").delete().eq("id", id);
  if (error) fail("delete evidence", error.message);
}

// ─── Decision journal CRUD (user-scoped) ─────────────────────────────────────

export async function listJournalEntries(): Promise<
  (JournalEntry & { decisionTitle: string })[]
> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("decision_journal")
    .select("*, decisions(title)")
    .order("created_at", { ascending: false });
  if (error) fail("load journal entries", error.message);
  return ((data ?? []) as JournalRow[]).map((row) => ({
    ...mapJournalEntry(row),
    decisionTitle: row.decisions?.title ?? "Untitled decision",
  }));
}

export async function createJournalEntry(
  decisionId: string,
  input: { type: JournalEntryType; content: string; confidence: number }
): Promise<JournalEntry> {
  const { supabase, userId } = await getCtx();
  const { data, error } = await supabase
    .from("decision_journal")
    .insert({
      decision_id: decisionId,
      user_id: userId,
      entry_type: toDbEntryType(input.type),
      content: input.content,
      confidence_level: Math.round(input.confidence),
    })
    .select("*")
    .single();
  if (error || !data) fail("add journal entry", error?.message ?? "no row returned");
  return mapJournalEntry(data as JournalRow);
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("decision_journal").delete().eq("id", id);
  if (error) fail("delete journal entry", error.message);
}

// ─── Frameworks CRUD ─────────────────────────────────────────────────────────

export async function listFrameworks(): Promise<FrameworkRecord[]> {
  const { supabase } = await getCtx();
  const { data, error } = await supabase
    .from("frameworks")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) fail("load frameworks", error.message);
  return ((data ?? []) as FrameworkRow[]).map(mapFramework);
}

export async function createFramework(input: {
  type: FrameworkType;
  name: string;
  description: string;
  whenToUse: string;
  complexity: Framework["complexity"];
  isTemplate?: boolean;
}): Promise<FrameworkRecord> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("frameworks")
    .insert({
      org_id: orgId,
      name: input.name,
      framework_type: FRAMEWORK_TYPE_TO_DB[input.type],
      is_template: input.isTemplate ?? false,
      config: {
        slug: input.type,
        description: input.description,
        when_to_use: input.whenToUse,
        complexity: input.complexity,
      },
    })
    .select("*")
    .single();
  if (error || !data) fail("create framework", error?.message ?? "no row returned");
  return mapFramework(data as FrameworkRow);
}

export async function updateFramework(
  dbId: string,
  patch: {
    name?: string;
    description?: string;
    whenToUse?: string;
    complexity?: Framework["complexity"];
    isTemplate?: boolean;
  }
): Promise<void> {
  const { supabase } = await getCtx();
  const { data: current, error: readError } = await supabase
    .from("frameworks")
    .select("*")
    .eq("id", dbId)
    .single();
  if (readError || !current) {
    fail("update framework", readError?.message ?? "framework not found");
  }
  const row = current as FrameworkRow;
  const config = { ...(row.config ?? {}) };
  if (patch.description !== undefined) config.description = patch.description;
  if (patch.whenToUse !== undefined) config.when_to_use = patch.whenToUse;
  if (patch.complexity !== undefined) config.complexity = patch.complexity;
  const update: Record<string, unknown> = { config };
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.isTemplate !== undefined) update.is_template = patch.isTemplate;
  const { error } = await supabase.from("frameworks").update(update).eq("id", dbId);
  if (error) fail("update framework", error.message);
}

export async function deleteFramework(dbId: string): Promise<void> {
  const { supabase } = await getCtx();
  const { error } = await supabase.from("frameworks").delete().eq("id", dbId);
  if (error) fail("delete framework", error.message);
}

/**
 * Seeds the six standard decision frameworks for the org if missing.
 * Idempotent: only inserts frameworks whose slug is not present yet.
 */
export async function ensureStandardFrameworks(): Promise<void> {
  const { supabase, orgId } = await getCtx();
  const { data, error } = await supabase
    .from("frameworks")
    .select("id, name, framework_type, config, is_template, created_at")
    .eq("org_id", orgId);
  if (error) fail("load frameworks", error.message);
  const existing = new Set(
    ((data ?? []) as FrameworkRow[]).map((row) => frameworkSlugFromDb(row))
  );
  const missing = standardFrameworks.filter((f) => !existing.has(f.id));
  if (missing.length === 0) return;
  const { error: insertError } = await supabase.from("frameworks").insert(
    missing.map((f) => ({
      org_id: orgId,
      name: f.name,
      framework_type: FRAMEWORK_TYPE_TO_DB[f.id],
      is_template: true,
      config: {
        slug: f.id,
        description: f.description,
        when_to_use: f.whenToUse,
        complexity: f.complexity,
      },
    }))
  );
  if (insertError) fail("seed standard frameworks", insertError.message);
}

// ─── Demo data seeding ───────────────────────────────────────────────────────

/**
 * Inserts the bundled sample decisions (with scenarios, evidence and journal
 * entries) plus the standard frameworks for the current org/user. Dates are
 * shifted so their spacing is preserved relative to today.
 */
export async function seedDemoData(): Promise<void> {
  const { supabase, userId, orgId } = await getCtx();
  await ensureStandardFrameworks();

  // The sample data was authored against a pseudo-today of 2026-04-10;
  // shift every date by (now - anchor) to keep relative spacing.
  const anchor = new Date("2026-04-10T12:00:00Z").getTime();
  const offset = Date.now() - anchor;
  const rel = (date: string, extraMs = 0) =>
    new Date(new Date(`${date}T12:00:00Z`).getTime() + offset + extraMs).toISOString();

  for (const seed of sampleDecisions) {
    const lastJournalDate =
      seed.journalEntries[seed.journalEntries.length - 1]?.createdAt ??
      seed.createdAt;
    const { data: decisionRow, error } = await supabase
      .from("decisions")
      .insert({
        org_id: orgId,
        user_id: userId,
        title: seed.title,
        context: composeContext(seed.description, seed.keyQuestion, seed.stakeholders),
        status: seed.status,
        decision_type: seed.type,
        review_date: seed.reviewDate ? rel(seed.reviewDate) : null,
        decided_at:
          seed.status === "decided" || seed.status === "reviewed"
            ? rel(lastJournalDate)
            : null,
        created_at: rel(seed.createdAt),
      })
      .select("id")
      .single();
    if (error || !decisionRow) {
      fail("seed demo decision", error?.message ?? "no row returned");
    }
    const decisionId = (decisionRow as { id: string }).id;

    if (seed.scenarios.length > 0) {
      const { error: scenarioError } = await supabase.from("scenarios").insert(
        seed.scenarios.map((s, i) => ({
          decision_id: decisionId,
          name: s.name,
          description: s.description,
          assumptions: s.assumptions,
          projected_outcomes: s.projectedOutcomes,
          probability: toDbProbability(s.probability),
          score: s.score,
          created_by: userId,
          created_at: rel(seed.createdAt, (i + 1) * 60_000),
        }))
      );
      if (scenarioError) fail("seed demo scenarios", scenarioError.message);
    }

    if (seed.evidence.length > 0) {
      const { error: evidenceError } = await supabase.from("evidence").insert(
        seed.evidence.map((e, i) => ({
          decision_id: decisionId,
          source_type: e.sourceType,
          content: e.content,
          relevance_score: toDbRelevance(e.relevance),
          sentiment: toDbSentiment(e.sentiment),
          added_by: userId,
          created_at: rel(e.addedAt, (i + 1) * 60_000),
        }))
      );
      if (evidenceError) fail("seed demo evidence", evidenceError.message);
    }

    if (seed.journalEntries.length > 0) {
      const { error: journalError } = await supabase.from("decision_journal").insert(
        seed.journalEntries.map((j, i) => ({
          decision_id: decisionId,
          user_id: userId,
          entry_type: toDbEntryType(j.type),
          content: j.content,
          confidence_level: j.confidence,
          created_at: rel(j.createdAt, (i + 1) * 60_000),
        }))
      );
      if (journalError) fail("seed demo journal entries", journalError.message);
    }
  }
}
