"use client"

import { AlertCircle, AlertTriangle, Lightbulb, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Issue {
  type: "critical" | "warning" | "suggestion"
  category: string
  message: string
  fix: string
}

interface IssuesPanelProps {
  issues: Issue[]
}

export function IssuesPanel({ issues }: IssuesPanelProps) {
  const criticalIssues = issues.filter((i) => i.type === "critical")
  const warnings = issues.filter((i) => i.type === "warning")
  const suggestions = issues.filter((i) => i.type === "suggestion")

  if (issues.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lightbulb className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No Issues Found</h3>
        <p className="mt-2 text-muted-foreground">Your resume looks great! No critical issues were detected.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {criticalIssues.length > 0 && (
        <IssueSection
          title="Critical Issues"
          description="These issues will likely cause ATS rejection"
          icon={AlertCircle}
          iconColor="text-destructive"
          bgColor="bg-destructive/10"
          issues={criticalIssues}
        />
      )}

      {warnings.length > 0 && (
        <IssueSection
          title="Warnings"
          description="These may reduce your ATS score"
          icon={AlertTriangle}
          iconColor="text-chart-5"
          bgColor="bg-chart-5/10"
          issues={warnings}
        />
      )}

      {suggestions.length > 0 && (
        <IssueSection
          title="Suggestions"
          description="Optional improvements for human readers"
          icon={Lightbulb}
          iconColor="text-primary"
          bgColor="bg-primary/10"
          issues={suggestions}
        />
      )}
    </div>
  )
}

function IssueSection({
  title,
  description,
  icon: Icon,
  iconColor,
  bgColor,
  issues,
}: {
  title: string
  description: string
  icon: typeof AlertCircle
  iconColor: string
  bgColor: string
  issues: Issue[]
}) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="border-b border-border bg-secondary/30 p-4">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", bgColor)}>
            <Icon className={cn("h-5 w-5", iconColor)} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {title} ({issues.length})
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {issues.map((issue, i) => (
          <li key={i} className="p-4">
            <div className="flex items-start gap-3">
              <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{issue.message}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-primary">Fix:</span> {issue.fix}
                </p>
                <span className="mt-2 inline-block rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {issue.category}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
