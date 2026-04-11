import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { sampleDecisions } from "@/lib/data/decisions";
import {
  Brain,
  CalendarClock,
  TrendingUp,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const activeDecisions = sampleDecisions.filter(
    (d) => d.status === "exploring" || d.status === "analyzing"
  );
  const decidedThisMonth = sampleDecisions.filter(
    (d) => d.status === "decided" || d.status === "reviewed"
  );
  const avgConfidence = Math.round(
    sampleDecisions.reduce((sum, d) => sum + d.confidence, 0) / sampleDecisions.length
  );
  const pendingReviews = sampleDecisions.filter((d) => d.reviewDate);

  const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    exploring: "outline",
    analyzing: "secondary",
    decided: "default",
    reviewed: "default",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decision Inbox</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
          </p>
        </div>
        <Link href="/decisions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Decision
          </Button>
        </Link>
      </div>

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
          value={String(pendingReviews.length)}
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
              {sampleDecisions.slice(0, 4).map((decision) => (
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
              {sampleDecisions
                .filter((d) => d.reviewDate)
                .sort((a, b) => new Date(a.reviewDate!).getTime() - new Date(b.reviewDate!).getTime())
                .map((decision) => (
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
              {sampleDecisions.filter((d) => d.reviewDate).length === 0 && (
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
