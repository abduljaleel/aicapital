import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { frameworks } from "@/lib/data/decisions";
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Decision Frameworks</h1>
        <p className="text-muted-foreground">
          Structured thinking tools for better decisions. Each framework is designed for a specific type of reasoning challenge.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {frameworks.map((fw) => (
          <Card key={fw.id} className="flex flex-col">
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
    </div>
  );
}
