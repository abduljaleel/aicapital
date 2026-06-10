"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createDecision } from "@/lib/data/api";
import { type DecisionType } from "@/lib/data/decisions";

export default function NewDecisionPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("strategic");
  const [stakeholders, setStakeholders] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const decision = await createDecision({
        title: title.trim(),
        description: description.trim(),
        type: type as DecisionType,
        stakeholders: stakeholders
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
      router.push(`/decisions/${decision.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create decision");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/decisions">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">New Decision</h1>
          <p className="text-muted-foreground">
            Define the decision you need to make. Clarity here compounds downstream.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Decision Details</CardTitle>
          <CardDescription>
            Start with the core question. You can add scenarios, evidence, and frameworks later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Decision Title</Label>
              <Input
                id="title"
                placeholder="e.g., Series A Lead Investor Selection"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Name the decision clearly. A good title captures the choice, not the outcome.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Context & Description</Label>
              <Textarea
                id="description"
                placeholder="What is the decision about? What's the background? What constraints exist?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
              <p className="text-xs text-muted-foreground">
                Provide enough context so you can revisit this decision in 6 months and understand why it mattered.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Decision Type</Label>
              <Select value={type} onValueChange={(v) => setType(v ?? "all")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="investment">Investment</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="hire">Hire</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Categorizing helps surface patterns in your decision-making over time.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stakeholders">Stakeholders</Label>
              <Input
                id="stakeholders"
                placeholder="e.g., CEO, Board, VP Engineering (comma separated)"
                value={stakeholders}
                onChange={(e) => setStakeholders(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Who has a stake in this decision? Who needs to be consulted or informed?
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={!title.trim() || submitting}>
                {submitting ? "Creating..." : "Create Decision"}
              </Button>
              <Link href="/decisions">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
