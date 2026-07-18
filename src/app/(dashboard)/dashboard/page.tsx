"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCurrentUser, listDecisions, seedDemoData } from "@/lib/data/api";
import { type Decision } from "@/lib/data/decisions";
import {
  Brain,
  CalendarClock,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>("");
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const [user, rows] = await Promise.all([getCurrentUser(), listDecisions()]);
      setUserName(user.fullName || user.email.split("@")[0]);
      setDecisions(rows);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);
    try {
      await seedDemoData();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load demo data");
    } finally {
      setSeeding(false);
    }
  };

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const activeDecisions = decisions.filter(
    (d) => d.status === "exploring" || d.status === "analyzing"
  );
  const decidedThisMonth = decisions.filter(
    (d) =>
      (d.status === "decided" || d.status === "reviewed") &&
      d.decidedAt !== undefined &&
      new Date(d.decidedAt) >= startOfMonth
  );
  const avgConfidence =
    decisions.length > 0
      ? Math.round(decisions.reduce((sum, d) => sum + d.confidence, 0) / decisions.length)
      : 0;
  // Only decisions with a future/today review date that haven't been reviewed yet.
  const upcomingReviews = decisions
    .filter(
      (d) =>
        d.reviewDate !== undefined &&
        d.status !== "reviewed" &&
        new Date(d.reviewDate) >= startOfToday
    )
    .sort(
      (a, b) => new Date(a.reviewDate!).getTime() - new Date(b.reviewDate!).getTime()
    );

  const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    exploring: "outline",
    analyzing: "secondary",
    decided: "default",
    reviewed: "default",
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decision Inbox</h1>
          <p className="text-muted-foreground">
            Welcome back, {userName}
          </p>
        </div>
        <Link href="/decisions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Decision
          </Button>
        </Link>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Decisions"
          value={String(activeDecisions.length)}
          description="Currently in progress"
          icon={<Brain className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Decisions This Month"
          value={String(decidedThisMonth.length)}
          description="Decided or reviewed"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Avg Confidence"
          value={`${avgConfidence}%`}
          description="Across all decisions"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <MetricCard
          title="Pending Reviews"
          value={String(upcomingReviews.length)}
          description="Scheduled for review"
          icon={<CalendarClock className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Decisions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Decisions</CardTitle>
              <Link href="/decisions">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
            <CardDescription>Decisions requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeDecisions.slice(0, 4).map((decision) => (
                <Link
                  key={decision.id}
                  href={`/decisions/${decision.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{decision.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={statusColors[decision.status] || "outline"} className="text-xs capitalize">
                        {decision.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground capitalize">
                        {decision.type}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end">
                    <span className="text-sm font-medium">{decision.confidence}%</span>
                    <span className="text-xs text-muted-foreground">confidence</span>
                  </div>
                </Link>
              ))}
              {activeDecisions.length === 0 && decisions.length > 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No active decisions — everything is decided or reviewed.
                </p>
              )}
              {decisions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm font-medium">No decisions yet</p>
                  <p className="text-xs text-muted-foreground mt-1 mb-4">
                    Create your first decision or explore with demo data.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding}>
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    {seeding ? "Loading demo data..." : "Load demo data"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reviews</CardTitle>
            <CardDescription>Scheduled decision reviews and checkpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingReviews.map((decision) => (
                <Link
                  key={decision.id}
                  href={`/decisions/${decision.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{decision.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {decision.type} &middot; {decision.status}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs whitespace-nowrap">
                      {new Date(decision.reviewDate!).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </Link>
              ))}
              {upcomingReviews.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No upcoming reviews scheduled
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
