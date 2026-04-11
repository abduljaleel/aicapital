"use client";

import { useState, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getDecisionById,
  type Decision,
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
  const decision = getDecisionById(id);

  if (!decision) {
    notFound();
  }

  return <DecisionWorkspace decision={decision} />;
}

function DecisionWorkspace({ decision }: { decision: Decision }) {
  const statusColors: Record<string, "default" | "secondary" | "outline"> = {
    exploring: "outline",
    analyzing: "secondary",
    decided: "default",
    reviewed: "default",
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
            <Badge variant={statusColors[decision.status]} className="capitalize">
              {decision.status}
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

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="framework">Framework</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab decision={decision} />
        </TabsContent>
        <TabsContent value="scenarios">
          <ScenariosTab decision={decision} />
        </TabsContent>
        <TabsContent value="evidence">
          <EvidenceTab decision={decision} />
        </TabsContent>
        <TabsContent value="framework">
          <FrameworkTab />
        </TabsContent>
        <TabsContent value="journal">
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

  const handleAddScenario = () => {
    if (!newName.trim()) return;
    const newScenario: Scenario = {
      id: `sc-new-${Date.now()}`,
      name: newName,
      description: newDesc,
      assumptions: [],
      projectedOutcomes: [],
      probability: 50,
      score: 50,
    };
    setScenarios([...scenarios, newScenario]);
    setNewName("");
    setNewDesc("");
    setShowAdd(false);
  };

  const updateProbability = (id: string, value: number) => {
    setScenarios(
      scenarios.map((s) => (s.id === id ? { ...s, probability: value } : s))
    );
  };

  const updateScore = (id: string, value: number) => {
    setScenarios(
      scenarios.map((s) => (s.id === id ? { ...s, score: value } : s))
    );
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
              <Button size="sm" onClick={handleAddScenario} disabled={!newName.trim()}>
                Add
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
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Score</span>
                  <span className="text-lg font-bold">{scenario.score}</span>
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

  const handleAdd = () => {
    if (!newContent.trim()) return;
    const item: Evidence = {
      id: `ev-new-${Date.now()}`,
      sourceType: newSourceType,
      content: newContent,
      relevance: newRelevance,
      sentiment: newSentiment,
      addedAt: new Date().toISOString().split("T")[0],
    };
    setEvidence([item, ...evidence]);
    setNewContent("");
    setShowAdd(false);
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
              <Button size="sm" onClick={handleAdd} disabled={!newContent.trim()}>
                Add Evidence
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

function FrameworkTab() {
  const [selected, setSelected] = useState<FrameworkType>("swot");

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

      {selected === "swot" && <SwotFramework />}
      {selected === "weighted_scoring" && <WeightedScoringFramework />}
      {selected === "pre_mortem" && <PreMortemFramework />}
      {selected === "pros_cons" && <ProsConsFramework />}
    </div>
  );
}

function SwotFramework() {
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [opportunities, setOpportunities] = useState("");
  const [threats, setThreats] = useState("");

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

function WeightedScoringFramework() {
  const [criteria, setCriteria] = useState([
    { name: "Strategic Fit", weight: 30, scoreA: 8, scoreB: 6 },
    { name: "Cost", weight: 25, scoreA: 6, scoreB: 8 },
    { name: "Risk", weight: 20, scoreA: 7, scoreB: 5 },
    { name: "Time to Value", weight: 15, scoreA: 5, scoreB: 9 },
    { name: "Team Impact", weight: 10, scoreA: 7, scoreB: 7 },
  ]);

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

function PreMortemFramework() {
  const [items, setItems] = useState([
    "We underestimated the competitive response",
    "Key assumptions about market timing were wrong",
    "",
  ]);

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

function ProsConsFramework() {
  const [pros, setPros] = useState(["", ""]);
  const [cons, setCons] = useState(["", ""]);

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

  const handleAdd = () => {
    if (!newContent.trim()) return;
    const entry: JournalEntry = {
      id: `je-new-${Date.now()}`,
      decisionId: decision.id,
      type: newType,
      content: newContent,
      confidence: newConfidence,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setEntries([entry, ...entries]);
    setNewContent("");
    setShowAdd(false);
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
              <Button size="sm" onClick={handleAdd} disabled={!newContent.trim()}>
                Add Entry
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
