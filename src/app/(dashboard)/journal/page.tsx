"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllJournalEntries, type JournalEntryType } from "@/lib/data/decisions";
import { BookOpen, Lightbulb, RefreshCw, CheckCircle2 } from "lucide-react";

const entryTypeConfig: Record<
  JournalEntryType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  rationale: {
    label: "Rationale",
    icon: <Lightbulb className="h-4 w-4" />,
    color: "text-amber-600 dark:text-amber-400",
  },
  update: {
    label: "Update",
    icon: <RefreshCw className="h-4 w-4" />,
    color: "text-blue-600 dark:text-blue-400",
  },
  outcome_review: {
    label: "Outcome Review",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-green-600 dark:text-green-400",
  },
};

const filterOptions: { value: JournalEntryType | "all"; label: string }[] = [
  { value: "all", label: "All entries" },
  { value: "rationale", label: "Rationale" },
  { value: "update", label: "Updates" },
  { value: "outcome_review", label: "Outcome Reviews" },
];

export default function JournalPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const allEntries = getAllJournalEntries();

  const filtered = allEntries.filter((entry) => {
    if (typeFilter !== "all" && entry.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Decision Journal</h1>
        <p className="text-muted-foreground">
          A chronological record of your reasoning. The best decision-makers track how they think, not just what they decide.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filtered.map((entry) => {
          const config = entryTypeConfig[entry.type];
          return (
            <Card key={entry.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/decisions/${entry.decisionId}`}
                        className="font-medium hover:underline truncate"
                      >
                        {entry.decisionTitle}
                      </Link>
                      <Badge variant="outline" className="gap-1 shrink-0">
                        <span className={config.color}>{config.icon}</span>
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {entry.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        Confidence: <span className="font-medium text-foreground">{entry.confidence}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <BookOpen className="h-10 w-10 mb-4" />
            <p className="text-lg font-medium">No journal entries yet</p>
            <p className="text-sm">Start making decisions to build your reasoning record.</p>
          </div>
        )}
      </div>
    </div>
  );
}
