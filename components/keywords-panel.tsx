"use client"

import { Check, X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface KeywordsPanelProps {
  detected: string[]
  missing: string[]
  suggested: string[]
}

export function KeywordsPanel({ detected, missing, suggested }: KeywordsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Detected Keywords */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Check className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Detected Keywords</h3>
            <p className="text-sm text-muted-foreground">Skills and terms found in your resume</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {detected.length > 0 ? (
            detected.map((keyword) => (
              <Badge key={keyword} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                {keyword}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No keywords detected yet</p>
          )}
        </div>
      </div>

      {/* Missing Keywords (from job description) */}
      {missing.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <X className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Missing Keywords</h3>
              <p className="text-sm text-muted-foreground">
                Important terms from the job description not found in your resume
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {missing.map((keyword) => (
              <Badge key={keyword} variant="outline" className="border-destructive/50 text-destructive">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Keywords */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
            <Plus className="h-5 w-5 text-chart-4" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Suggested Keywords</h3>
            <p className="text-sm text-muted-foreground">Consider adding these industry-relevant terms</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggested.length > 0 ? (
            suggested.map((keyword) => (
              <Badge key={keyword} variant="outline" className="border-chart-4/50 text-chart-4">
                + {keyword}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No additional keywords suggested</p>
          )}
        </div>
      </div>
    </div>
  )
}
