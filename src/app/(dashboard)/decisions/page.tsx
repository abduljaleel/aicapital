"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sampleDecisions, type DecisionType, type DecisionStatus } from "@/lib/data/decisions";
import { Plus } from "lucide-react";

const typeOptions: { value: DecisionType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "investment", label: "Investment" },
  { value: "strategic", label: "Strategic" },
  { value: "operational", label: "Operational" },
  { value: "hire", label: "Hire" },
];

const statusOptions: { value: DecisionStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "exploring", label: "Exploring" },
  { value: "analyzing", label: "Analyzing" },
  { value: "decided", label: "Decided" },
  { value: "reviewed", label: "Reviewed" },
];

const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  exploring: "outline",
  analyzing: "secondary",
  decided: "default",
  reviewed: "default",
};

const confidenceColor = (confidence: number) => {
  if (confidence >= 75) return "text-green-600 dark:text-green-400";
  if (confidence >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
};

export default function DecisionsPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = sampleDecisions.filter((d) => {
    if (typeFilter !== "all" && d.type !== typeFilter) return false;
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Decisions</h1>
          <p className="text-muted-foreground">
            Track and manage all your decisions in one place.
          </p>
        </div>
        <Link href="/decisions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Decision
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v ?? "all")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Confidence</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((decision) => (
              <TableRow key={decision.id}>
                <TableCell>
                  <Link
                    href={`/decisions/${decision.id}`}
                    className="font-medium hover:underline"
                  >
                    {decision.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="capitalize text-muted-foreground">{decision.type}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={statusColors[decision.status] || "outline"}
                    className="capitalize"
                  >
                    {decision.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`font-medium ${confidenceColor(decision.confidence)}`}>
                    {decision.confidence}%
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(decision.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No decisions match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
