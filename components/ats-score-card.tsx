"use client"

import { cn } from "@/lib/utils"

interface ATSScoreCardProps {
  score: number
  breakdown?: {
    formatting: number
    keywords: number
    structure: number
    content: number
  }
}

export function ATSScoreCard({ score, breakdown }: ATSScoreCardProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-primary"
    if (s >= 60) return "text-chart-4"
    if (s >= 40) return "text-chart-5"
    return "text-destructive"
  }

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent"
    if (s >= 60) return "Good"
    if (s >= 40) return "Needs Work"
    return "Poor"
  }

  const getScoreBg = (s: number) => {
    if (s >= 80) return "bg-primary"
    if (s >= 60) return "bg-chart-4"
    if (s >= 40) return "bg-chart-5"
    return "bg-destructive"
  }

  const categories = [
    { label: "Formatting", value: breakdown?.formatting || 0 },
    { label: "Keywords", value: breakdown?.keywords || 0 },
    { label: "Structure", value: breakdown?.structure || 0 },
    { label: "Content", value: breakdown?.content || 0 },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Main Score Circle */}
        <div className="relative flex flex-shrink-0">
          <svg className="h-36 w-36 -rotate-90 transform">
            <circle cx="72" cy="72" r="64" className="fill-none stroke-secondary" strokeWidth="12" />
            <circle
              cx="72"
              cy="72"
              r="64"
              className={cn("fill-none transition-all duration-1000", getScoreBg(score))}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 402} 402`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-4xl font-bold", getScoreColor(score))}>{score}</span>
            <span className="text-sm text-muted-foreground">ATS Score</span>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1">
          <div className="mb-4 text-center md:text-left">
            <h2 className="text-xl font-semibold text-foreground">
              Your ATS Compatibility: <span className={getScoreColor(score)}>{getScoreLabel(score)}</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {score >= 80
                ? "Your resume is well-optimized for ATS systems!"
                : score >= 60
                  ? "Good start, but there's room for improvement."
                  : "Your resume needs optimization to pass ATS filters."}
            </p>
          </div>

          {/* Breakdown */}
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((cat) => (
              <div key={cat.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{cat.label}</span>
                  <span className={cn("font-medium", getScoreColor(cat.value))}>{cat.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn("h-full transition-all duration-500", getScoreBg(cat.value))}
                    style={{ width: `${cat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
