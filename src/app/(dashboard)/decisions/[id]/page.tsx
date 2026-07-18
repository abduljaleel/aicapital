"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getDecision,
  createScenario,
  updateScenario,
  deleteScenario,
  createEvidence,
  deleteEvidence,
  createJournalEntry,
  deleteJournalEntry,
  updateDecision,
  deleteDecision,
} from "@/lib/data/api";
import {
  type Decision,
  type DecisionStatus,
  type Scenario,
  type Evidence,
  type JournalEntry,
  type EvidenceSentiment,
  type EvidenceRelevance,
  type SourceType,
  type FrameworkType,
} from "@/lib/data/decisions";
import {
  ArrowLeft,
  Plus,
  FileText,
  BarChart3,
  Lightbulb,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Database,
  UserCheck,
  Building,
  Globe,
  Trash2,
} from "lucide-react";

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DecisionWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getDecision(id)
      .then((d) => {
        if (!cancelled) setDecision(d);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load decision");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-8 w-8 rounded-md mt-1" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <Skeleton className="h-9 w-96" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/decisions">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      </div>
    );
  }

  if (!decision) {
    notFound();
  }

  return <DecisionWorkspace decision={decision} />;
}

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
  exploring: "outline",
  analyzing: "secondary",
  decided: "default",
  reviewed: "default",
};

function DecisionWorkspace({ decision }: { decision: Decision }) {
  const router = useRouter();
  const [status, setStatus] = useState<DecisionStatus>(decision.status);
  const [reviewDate, setReviewDate] = useState<string>(
    decision.reviewDate ? decision.reviewDate.slice(0, 10) : ""
  );
  const [outcome, setOutcome] = useState<string>(decision.outcome ?? "");
  const [decidedAt, setDecidedAt] = useState<string | undefined>(decision.decidedAt);
  const savedOutcomeRef = useRef(decision.outcome ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const save = async (fn: () => Promise<void>, okText: string) => {
    setSaving(true);
    setSaveMsg(null);
    try {
      await fn();
      setSaveMsg({ text: okText, ok: true });
    } catch (e) {
      setSaveMsg({
        text: e instanceof Error ? e.message : "Failed to save changes",
        ok: false,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (next: DecisionStatus) => {
    const patch: { status: DecisionStatus; decidedAt?: string } = { status: next };
    let nextDecidedAt = decidedAt;
    if ((next === "decided" || next === "reviewed") && !decidedAt) {
      nextDecidedAt = new Date().toISOString();
      patch.decidedAt = nextDecidedAt;
    }
    setStatus(next);
    setDecidedAt(nextDecidedAt);
    await save(() => updateDecision(decision.id, patch), "Status updated");
  };

  const handleReviewDateChange = async (value: string) => {
    setReviewDate(value);
    await save(
      () => updateDecision(decision.id, { reviewDate: value ? value : null }),
      value ? "Review date set" : "Review date cleared"
    );
  };

  const handleOutcomeBlur = async () => {
    if (outcome === savedOutcomeRef.current) return;
    savedOutcomeRef.current = outcome;
    await save(
      () => updateDecision(decision.id, { outcome: outcome ? outcome : null }),
      "Outcome saved"
    );
  };

  const handleDelete = async () => {
    if (deleting) return;
    if (
      !window.confirm(
        `Delete "${decision.title}"? This permanently removes the decision and all its scenarios, evidence, and journal entries.`
      )
    ) {
      return;
    }
    setDeleting(true);
    setSaveMsg(null);
    try {
      await deleteDecision(decision.id);
      router.push("/decisions");
    } catch (e) {
      setSaveMsg({
        text: e instanceof Error ? e.message : "Failed to delete decision",
        ok: false,
      });
      setDeleting(false);
    }
  };

  const liveDecision: Decision = {
    ...decision,
    status,
    reviewDate: reviewDate || undefined,
    decidedAt,
    outcome: outcome || undefined,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/decisions">
          <Button variant="ghost" size="icon-sm" className="mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">{decision.title}</h1>
            <Badge variant={statusColors[status]} className="capitalize">
              {status}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {decision.type}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
            <span>Confidence: <span className="font-medium text-foreground">{decision.confidence}%</span></span>
            <span>Stakeholders: {decision.stakeholders.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Lifecycle controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => handleStatusChange(v as DecisionStatus)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exploring">Exploring</SelectItem>
                    <SelectItem value="analyzing">Analyzing</SelectItem>
                    <SelectItem value="decided">Decided</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs" htmlFor="review-date">
                  Review date
                </Label>
                <Input
                  id="review-date"
                  type="date"
                  value={reviewDate}
                  onChange={(e) => handleReviewDateChange(e.target.value)}
                  className="w-44"
                />
              </div>
              {saving && (
                <span className="pb-2 text-xs text-muted-foreground">Saving…</span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="self-start text-destructive hover:text-destructive sm:self-auto"
            >
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              {deleting ? "Deleting…" : "Delete decision"}
            </Button>
          </div>

          {(status === "decided" || status === "reviewed") && (
            <div className="mt-4 space-y-1">
              <Label className="text-xs" htmlFor="outcome">
                Outcome
              </Label>
              <Textarea
                id="outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                onBlur={handleOutcomeBlur}
                placeholder="What actually happened? Record the result to compare against your projections."
                rows={2}
              />
            </div>
          )}

          {saveMsg && (
            <p
              className={`mt-3 text-xs ${
                saveMsg.ok
                  ? "text-green-700 dark:text-green-400"
                  : "text-destructive"
              }`}
              role="status"
            >
              {saveMsg.text}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="framework">Framework</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" keepMounted>
          <OverviewTab decision={liveDecision} />
        </TabsContent>
        <TabsContent value="scenarios" keepMounted>
          <ScenariosTab decision={decision} />
        </TabsContent>
        <TabsContent value="evidence" keepMounted>
          <EvidenceTab decision={decision} />
        </TabsContent>
        <TabsContent value="framework" keepMounted>
          <FrameworkTab decisionId={decision.id} />
        </TabsContent>
        <TabsContent value="journal" keepMounted>
          <JournalTab decision={decision} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ─── Overview Tab ────────────────────────────────────────────────────────────

function OverviewTab({ decision }: { decision: Decision }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Decision Context</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{decision.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Question</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-medium leading-snug">{decision.keyQuestion}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
              <p className="mt-1 font-medium capitalize">{decision.status}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Type</p>
              <p className="mt-1 font-medium capitalize">{decision.type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Confidence</p>
              <p className="mt-1 font-medium">{decision.confidence}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Created</p>
              <p className="mt-1 font-medium">
                {new Date(decision.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          {decision.reviewDate && (
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Next Review</p>
              <p className="font-medium">
                {new Date(decision.reviewDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stakeholders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {decision.stakeholders.map((s) => (
              <div
                key={s}
                className="flex items-center gap-2 rounded-lg border px-3 py-2"
              >
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{s}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Scenarios Tab ───────────────────────────────────────────────────────────

function ScenariosTab({ decision }: { decision: Decision }) {
  const [scenarios, setScenarios] = useState<Scenario[]>(decision.scenarios);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const persistTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const pendingFns = useRef<Record<string, () => Promise<void>>>({});

  useEffect(() => {
    const timers = persistTimers.current;
    const fns = pendingFns.current;
    return () => {
      // Flush any pending debounced saves so a slider change made within the
      // debounce window of an unmount/navigation is not silently dropped.
      Object.keys(timers).forEach((key) => {
        clearTimeout(timers[key]);
        const fn = fns[key];
        if (fn) void fn().catch(() => {});
      });
    };
  }, []);

  const cancelPersist = (key: string) => {
    const existing = persistTimers.current[key];
    if (existing) clearTimeout(existing);
    delete persistTimers.current[key];
    delete pendingFns.current[key];
  };

  const queuePersist = (key: string, fn: () => Promise<void>) => {
    // Supersede any pending edit of the same key; keep unrelated keys queued.
    if (persistTimers.current[key]) clearTimeout(persistTimers.current[key]);
    pendingFns.current[key] = fn;
    persistTimers.current[key] = setTimeout(() => {
      delete persistTimers.current[key];
      delete pendingFns.current[key];
      fn().catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to save scenario changes")
      );
    }, 500);
  };

  const handleDeleteScenario = async (id: string) => {
    if (deletingId) return;
    cancelPersist(`${id}:probability`);
    cancelPersist(`${id}:score`);
    setDeletingId(id);
    setError(null);
    try {
      await deleteScenario(id);
      setScenarios((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete scenario");
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddScenario = async () => {
    if (!newName.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      const newScenario = await createScenario(decision.id, {
        name: newName,
        description: newDesc,
      });
      setScenarios([...scenarios, newScenario]);
      setNewName("");
      setNewDesc("");
      setShowAdd(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add scenario");
    } finally {
      setSaving(false);
    }
  };

  const updateProbability = (id: string, value: number) => {
    setScenarios(
      scenarios.map((s) => (s.id === id ? { ...s, probability: value } : s))
    );
    queuePersist(`${id}:probability`, () => updateScenario(id, { probability: value }));
  };

  const updateScore = (id: string, value: number) => {
    setScenarios(
      scenarios.map((s) => (s.id === id ? { ...s, score: value } : s))
    );
    queuePersist(`${id}:score`, () => updateScenario(id, { score: value }));
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Compare scenarios side by side. Adjust probability and score as your understanding evolves.
        </p>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="mr-2 h-3 w-3" />
          Add Scenario
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {showAdd && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <Input
              placeholder="Scenario name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Textarea
              placeholder="Describe this scenario..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddScenario} disabled={!newName.trim() || saving}>
                {saving ? "Adding..." : "Add"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{scenario.name}</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Score</span>
                    <span className="text-lg font-bold">{scenario.score}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDeleteScenario(scenario.id)}
                    disabled={deletingId === scenario.id}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Delete scenario"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <CardDescription>{scenario.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              {scenario.assumptions.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Assumptions
                  </p>
                  <ul className="space-y-1">
                    {scenario.assumptions.map((a, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground mt-0.5">&#8226;</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {scenario.projectedOutcomes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Projected Outcomes
                  </p>
                  <ul className="space-y-1">
                    {scenario.projectedOutcomes.map((o, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-muted-foreground mt-0.5">&#8226;</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Probability slider */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Probability
                  </label>
                  <span className="text-sm font-medium">{scenario.probability}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scenario.probability}
                  onChange={(e) =>
                    updateProbability(scenario.id, parseInt(e.target.value))
                  }
                  className="w-full accent-primary h-1.5 cursor-pointer"
                />
              </div>

              {/* Score slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Score
                  </label>
                  <span className="text-sm font-medium">{scenario.score}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scenario.score}
                  onChange={(e) =>
                    updateScore(scenario.id, parseInt(e.target.value))
                  }
                  className="w-full accent-primary h-1.5 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {scenarios.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No scenarios yet</p>
          <p className="text-sm mt-1">Add scenarios to compare different paths forward.</p>
        </div>
      )}
    </div>
  );
}

// ─── Evidence Tab ────────────────────────────────────────────────────────────

const sourceIcons: Record<SourceType, React.ReactNode> = {
  research: <Search className="h-4 w-4" />,
  data: <Database className="h-4 w-4" />,
  expert: <UserCheck className="h-4 w-4" />,
  internal: <Building className="h-4 w-4" />,
  market: <Globe className="h-4 w-4" />,
};

const sentimentConfig: Record<EvidenceSentiment, { label: string; icon: React.ReactNode; color: string }> = {
  supports: {
    label: "Supports",
    icon: <TrendingUp className="h-3.5 w-3.5" />,
    color: "text-green-600 dark:text-green-400",
  },
  contradicts: {
    label: "Contradicts",
    icon: <TrendingDown className="h-3.5 w-3.5" />,
    color: "text-red-600 dark:text-red-400",
  },
  neutral: {
    label: "Neutral",
    icon: <Minus className="h-3.5 w-3.5" />,
    color: "text-muted-foreground",
  },
};

const relevanceColors: Record<EvidenceRelevance, string> = {
  high: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

function EvidenceTab({ decision }: { decision: Decision }) {
  const [evidence, setEvidence] = useState<Evidence[]>(decision.evidence);
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newSourceType, setNewSourceType] = useState<SourceType>("research");
  const [newRelevance, setNewRelevance] = useState<EvidenceRelevance>("medium");
  const [newSentiment, setNewSentiment] = useState<EvidenceSentiment>("neutral");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newContent.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      const item = await createEvidence(decision.id, {
        sourceType: newSourceType,
        content: newContent,
        relevance: newRelevance,
        sentiment: newSentiment,
      });
      setEvidence([item, ...evidence]);
      setNewContent("");
      setShowAdd(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add evidence");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    setError(null);
    try {
      await deleteEvidence(id);
      setEvidence((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete evidence");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Collect and categorize evidence. Tag whether it supports or contradicts your leading hypothesis.
        </p>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="mr-2 h-3 w-3" />
          Add Evidence
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {showAdd && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <Textarea
              placeholder="Paste or describe the evidence..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
            />
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Source</Label>
                <Select value={newSourceType} onValueChange={(v) => setNewSourceType(v as SourceType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="market">Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Relevance</Label>
                <Select value={newRelevance} onValueChange={(v) => setNewRelevance(v as EvidenceRelevance)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Sentiment</Label>
                <Select value={newSentiment} onValueChange={(v) => setNewSentiment(v as EvidenceSentiment)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supports">Supports</SelectItem>
                    <SelectItem value="contradicts">Contradicts</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={!newContent.trim() || saving}>
                {saving ? "Adding..." : "Add Evidence"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {evidence.map((ev) => {
          const sentCfg = sentimentConfig[ev.sentiment];
          return (
            <Card key={ev.id}>
              <CardContent className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      {sourceIcons[ev.sourceType]}
                    </div>
                    <span className="text-xs font-medium capitalize text-muted-foreground">
                      {ev.sourceType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${relevanceColors[ev.relevance]}`}>
                      {ev.relevance}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(ev.id)}
                      disabled={deletingId === ev.id}
                      className="text-muted-foreground hover:text-destructive"
                      aria-label="Delete evidence"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm leading-relaxed">{ev.content}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className={`flex items-center gap-1 ${sentCfg.color}`}>
                    {sentCfg.icon}
                    <span>{sentCfg.label}</span>
                  </div>
                  <span>{ev.addedAt}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {evidence.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No evidence collected yet</p>
          <p className="text-sm mt-1">Start gathering data, research, and expert opinions.</p>
        </div>
      )}
    </div>
  );
}

// ─── Framework Tab ───────────────────────────────────────────────────────────

/**
 * Local-storage-backed state, keyed per decision. Framework worksheets have no
 * dedicated per-decision DB table (the `frameworks` table is an org-scoped
 * template catalog), so worksheet input is persisted in the browser. Combined
 * with keepMounted on the tab panels this keeps typed input across tab switches
 * AND page reloads instead of silently discarding it.
 */
function usePersistentState<T>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(initial);
  const skipSave = useRef(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setState(JSON.parse(raw) as T);
    } catch {
      /* ignore unavailable or malformed storage */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (skipSave.current) {
      // Skip the mount commit so the initial value never clobbers stored data.
      skipSave.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [key, state]);

  return [state, setState];
}

function FrameworkTab({ decisionId }: { decisionId: string }) {
  const [selected, setSelected] = usePersistentState<FrameworkType>(
    `aicapital:fw:${decisionId}:selected`,
    "swot"
  );

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Apply a structured framework to pressure-test your thinking.
        </p>
        <Select value={selected} onValueChange={(v) => setSelected(v as FrameworkType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="swot">SWOT Analysis</SelectItem>
            <SelectItem value="weighted_scoring">Weighted Scoring</SelectItem>
            <SelectItem value="pre_mortem">Pre-Mortem</SelectItem>
            <SelectItem value="pros_cons">Pros & Cons</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selected === "swot" && <SwotFramework decisionId={decisionId} />}
      {selected === "weighted_scoring" && (
        <WeightedScoringFramework decisionId={decisionId} />
      )}
      {selected === "pre_mortem" && <PreMortemFramework decisionId={decisionId} />}
      {selected === "pros_cons" && <ProsConsFramework decisionId={decisionId} />}
    </div>
  );
}

function SwotFramework({ decisionId }: { decisionId: string }) {
  const [strengths, setStrengths] = usePersistentState(
    `aicapital:fw:${decisionId}:swot:strengths`,
    ""
  );
  const [weaknesses, setWeaknesses] = usePersistentState(
    `aicapital:fw:${decisionId}:swot:weaknesses`,
    ""
  );
  const [opportunities, setOpportunities] = usePersistentState(
    `aicapital:fw:${decisionId}:swot:opportunities`,
    ""
  );
  const [threats, setThreats] = usePersistentState(
    `aicapital:fw:${decisionId}:swot:threats`,
    ""
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-700 dark:text-green-400">Strengths</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Internal advantages..."
            value={strengths}
            onChange={(e) => setStrengths(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-700 dark:text-red-400">Weaknesses</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Internal disadvantages..."
            value={weaknesses}
            onChange={(e) => setWeaknesses(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-blue-700 dark:text-blue-400">Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="External possibilities..."
            value={opportunities}
            onChange={(e) => setOpportunities(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-amber-700 dark:text-amber-400">Threats</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="External risks..."
            value={threats}
            onChange={(e) => setThreats(e.target.value)}
            rows={5}
            className="resize-none"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function WeightedScoringFramework({ decisionId }: { decisionId: string }) {
  const [criteria, setCriteria] = usePersistentState(
    `aicapital:fw:${decisionId}:weighted`,
    [
      { name: "Strategic Fit", weight: 30, scoreA: 8, scoreB: 6 },
      { name: "Cost", weight: 25, scoreA: 6, scoreB: 8 },
      { name: "Risk", weight: 20, scoreA: 7, scoreB: 5 },
      { name: "Time to Value", weight: 15, scoreA: 5, scoreB: 9 },
      { name: "Team Impact", weight: 10, scoreA: 7, scoreB: 7 },
    ]
  );

  const updateCriterion = (index: number, field: string, value: string | number) => {
    setCriteria(
      criteria.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  };

  const addCriterion = () => {
    setCriteria([...criteria, { name: "", weight: 10, scoreA: 5, scoreB: 5 }]);
  };

  const totalA = criteria.reduce((s, c) => s + (c.weight / 100) * c.scoreA, 0);
  const totalB = criteria.reduce((s, c) => s + (c.weight / 100) * c.scoreB, 0);

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4 font-medium">Criteria</th>
                <th className="text-center py-2 px-3 font-medium w-20">Weight</th>
                <th className="text-center py-2 px-3 font-medium w-24">Option A</th>
                <th className="text-center py-2 px-3 font-medium w-24">Option B</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((c, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 pr-4">
                    <Input
                      value={c.name}
                      onChange={(e) => updateCriterion(i, "name", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="Criterion name"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={c.weight}
                      onChange={(e) => updateCriterion(i, "weight", parseInt(e.target.value) || 0)}
                      className="h-8 text-sm text-center"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={c.scoreA}
                      onChange={(e) => updateCriterion(i, "scoreA", parseInt(e.target.value) || 0)}
                      className="h-8 text-sm text-center"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      value={c.scoreB}
                      onChange={(e) => updateCriterion(i, "scoreB", parseInt(e.target.value) || 0)}
                      className="h-8 text-sm text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t font-medium">
                <td className="py-2 pr-4">Weighted Total</td>
                <td className="py-2 px-3 text-center">
                  {criteria.reduce((s, c) => s + c.weight, 0)}%
                </td>
                <td className="py-2 px-3 text-center text-lg">{totalA.toFixed(1)}</td>
                <td className="py-2 px-3 text-center text-lg">{totalB.toFixed(1)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <Button variant="outline" size="sm" className="mt-3" onClick={addCriterion}>
          <Plus className="mr-2 h-3 w-3" />
          Add Criterion
        </Button>
      </CardContent>
    </Card>
  );
}

function PreMortemFramework({ decisionId }: { decisionId: string }) {
  const [items, setItems] = usePersistentState<string[]>(
    `aicapital:fw:${decisionId}:premortem`,
    [
      "We underestimated the competitive response",
      "Key assumptions about market timing were wrong",
      "",
    ]
  );

  const updateItem = (index: number, value: string) => {
    setItems(items.map((item, i) => (i === index ? value : item)));
  };

  const addItem = () => setItems([...items, ""]);

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pre-Mortem Analysis</CardTitle>
        <CardDescription>
          It is 12 months from now. This decision failed spectacularly. What went wrong?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-2.5 text-sm font-medium text-muted-foreground w-6 text-right shrink-0">
              {i + 1}.
            </span>
            <Input
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder="What could go wrong?"
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => removeItem(i)}
              className="shrink-0 mt-0.5 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-2 h-3 w-3" />
          Add Failure Mode
        </Button>
      </CardContent>
    </Card>
  );
}

function ProsConsFramework({ decisionId }: { decisionId: string }) {
  const [pros, setPros] = usePersistentState<string[]>(
    `aicapital:fw:${decisionId}:pros`,
    ["", ""]
  );
  const [cons, setCons] = usePersistentState<string[]>(
    `aicapital:fw:${decisionId}:cons`,
    ["", ""]
  );

  const updatePros = (i: number, v: string) =>
    setPros(pros.map((p, idx) => (idx === i ? v : p)));
  const updateCons = (i: number, v: string) =>
    setCons(cons.map((c, idx) => (idx === i ? v : c)));

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-green-700 dark:text-green-400">
            Pros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {pros.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-green-600">+</span>
              <Input
                value={p}
                onChange={(e) => updatePros(i, e.target.value)}
                placeholder="Argument in favor..."
                className="flex-1"
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPros([...pros, ""])}
          >
            <Plus className="mr-2 h-3 w-3" />
            Add Pro
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-red-700 dark:text-red-400">
            Cons
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {cons.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-red-600">&minus;</span>
              <Input
                value={c}
                onChange={(e) => updateCons(i, e.target.value)}
                placeholder="Argument against..."
                className="flex-1"
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCons([...cons, ""])}
          >
            <Plus className="mr-2 h-3 w-3" />
            Add Con
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Journal Tab ─────────────────────────────────────────────────────────────

function JournalTab({ decision }: { decision: Decision }) {
  const [entries, setEntries] = useState<JournalEntry[]>(decision.journalEntries);
  const [showAdd, setShowAdd] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState<"rationale" | "update" | "outcome_review">("update");
  const [newConfidence, setNewConfidence] = useState(decision.confidence);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newContent.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      const entry = await createJournalEntry(decision.id, {
        type: newType,
        content: newContent,
        confidence: newConfidence,
      });
      setEntries([entry, ...entries]);
      setNewContent("");
      setShowAdd(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add journal entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (deletingId) return;
    setDeletingId(id);
    setError(null);
    try {
      await deleteJournalEntry(id);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete journal entry");
    } finally {
      setDeletingId(null);
    }
  };

  const typeLabels: Record<string, string> = {
    rationale: "Rationale",
    update: "Update",
    outcome_review: "Outcome Review",
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Track your reasoning over time. Your future self will thank you.
        </p>
        <Button variant="outline" size="sm" onClick={() => setShowAdd(!showAdd)}>
          <Plus className="mr-2 h-3 w-3" />
          Add Entry
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {showAdd && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Entry Type</Label>
                <Select value={newType} onValueChange={(v) => setNewType(v as typeof newType)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rationale">Rationale</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="outcome_review">Outcome Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Confidence: {newConfidence}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newConfidence}
                  onChange={(e) => setNewConfidence(parseInt(e.target.value))}
                  className="w-full accent-primary h-1.5 mt-2"
                />
              </div>
            </div>
            <Textarea
              placeholder="What are you thinking? What changed? What did you learn?"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={!newContent.trim() || saving}>
                {saving ? "Adding..." : "Add Entry"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="capitalize">
                  {typeLabels[entry.type] || entry.type}
                </Badge>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>Confidence: <span className="font-medium text-foreground">{entry.confidence}%</span></span>
                  <span>
                    {new Date(entry.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="Delete journal entry"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{entry.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">No journal entries yet</p>
          <p className="text-sm mt-1">Document your thinking as the decision evolves.</p>
        </div>
      )}
    </div>
  );
}
