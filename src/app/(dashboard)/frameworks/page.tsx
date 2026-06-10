"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { listFrameworks, ensureStandardFrameworks, type FrameworkRecord } from "@/lib/data/api";
import {
  Grid2x2,
  Scale,
  Skull,
  ListChecks,
  LayoutGrid,
  GitBranch,
} from "lucide-react";

const frameworkIcons: Record<string, React.ReactNode> = {
  swot: <Grid2x2 className="h-5 w-5" />,
  weighted_scoring: <Scale className="h-5 w-5" />,
  pre_mortem: <Skull className="h-5 w-5" />,
  pros_cons: <ListChecks className="h-5 w-5" />,
  eisenhower: <LayoutGrid className="h-5 w-5" />,
  second_order: <GitBranch className="h-5 w-5" />,
};

const complexityColors: Record<string, string> = {
  low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function FrameworksPage() {
  const [frameworks, setFrameworks] = useState<FrameworkRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        let rows = await listFrameworks();
        if (rows.length === 0) {
          // First use: seed the standard framework catalog for this org
          await ensureStandardFrameworks();
          rows = await listFrameworks();
        }
        if (!cancelled) setFrameworks(rows);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load frameworks");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Decision Frameworks</h1>
        <p className="text-muted-foreground">
          Structured thinking tools for better decisions. Each framework is designed for a specific type of reasoning challenge.
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          [0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={`skeleton-${i}`} className="h-64 rounded-xl" />
          ))}
        {!loading && frameworks.map((fw) => (
          <Card key={fw.dbId} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  {frameworkIcons[fw.id]}
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${complexityColors[fw.complexity]}`}
                >
                  {fw.complexity}
                </span>
              </div>
              <CardTitle className="mt-3">{fw.name}</CardTitle>
              <CardDescription>{fw.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  When to use
                </p>
                <p className="text-sm">{fw.whenToUse}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && !error && frameworks.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-16">
          No frameworks available yet.
        </p>
      )}
    </div>
  );
}
