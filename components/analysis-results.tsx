"use client"

import { useState } from "react"
import type { ResumeAnalysis } from "@/lib/ai/schemas"
import { ATSScoreCard } from "@/components/ats-score-card"
import { IssuesPanel } from "@/components/issues-panel"
import { KeywordsPanel } from "@/components/keywords-panel"
import { ResumePreview } from "@/components/resume-preview"
import { OptimizePanel } from "@/components/optimize-panel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, AlertTriangle, Tags, FileText, Sparkles } from "lucide-react"

interface AnalysisResultsProps {
  analysis: Partial<ResumeAnalysis>
  resumeText: string
  jobDescription?: string
  fileName: string
}

export function AnalysisResults({ analysis, resumeText, jobDescription, fileName }: AnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      {/* Header with ATS Score */}
      <ATSScoreCard score={analysis.atsScore || 0} breakdown={analysis.atsBreakdown} />

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-card">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="issues" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Issues</span>
            {analysis.issues && analysis.issues.length > 0 && (
              <span className="ml-1 rounded-full bg-destructive/20 px-2 py-0.5 text-xs text-destructive">
                {analysis.issues.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="keywords" className="gap-2">
            <Tags className="h-4 w-4" />
            <span className="hidden sm:inline">Keywords</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </TabsTrigger>
          <TabsTrigger value="optimize" className="gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Optimize</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Strengths */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                Strengths
              </h3>
              <ul className="space-y-3">
                {(analysis.strengths || []).map((strength, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                    {strength}
                  </li>
                ))}
                {(!analysis.strengths || analysis.strengths.length === 0) && (
                  <li className="text-sm text-muted-foreground">No strengths identified yet</li>
                )}
              </ul>
            </div>

            {/* Improvements */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-5/10">
                  <AlertTriangle className="h-4 w-4 text-chart-5" />
                </div>
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {(analysis.improvements || []).map((improvement, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-chart-5" />
                    {improvement}
                  </li>
                ))}
                {(!analysis.improvements || analysis.improvements.length === 0) && (
                  <li className="text-sm text-muted-foreground">No improvements identified yet</li>
                )}
              </ul>
            </div>
          </div>

          {/* Parsed Sections Summary */}
          <div className="mt-6 rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Detected Sections</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <SectionSummary
                title="Contact"
                count={analysis.contact?.name ? 1 : 0}
                details={analysis.contact?.name || "Not detected"}
              />
              <SectionSummary
                title="Experience"
                count={analysis.experience?.length || 0}
                details={`${analysis.experience?.length || 0} positions`}
              />
              <SectionSummary
                title="Education"
                count={analysis.education?.length || 0}
                details={`${analysis.education?.length || 0} entries`}
              />
              <SectionSummary
                title="Skills"
                count={analysis.skills?.length || 0}
                details={`${analysis.skills?.length || 0} skills detected`}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="mt-6">
          <IssuesPanel issues={analysis.issues || []} />
        </TabsContent>

        <TabsContent value="keywords" className="mt-6">
          <KeywordsPanel
            detected={analysis.detectedKeywords || []}
            missing={analysis.missingKeywords || []}
            suggested={analysis.suggestedKeywords || []}
          />
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <ResumePreview analysis={analysis} />
        </TabsContent>

        <TabsContent value="optimize" className="mt-6">
          <OptimizePanel
            resumeText={resumeText}
            analysis={analysis}
            jobDescription={jobDescription}
            fileName={fileName}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SectionSummary({
  title,
  count,
  details,
}: {
  title: string
  count: number
  details: string
}) {
  return (
    <div className="rounded-lg bg-secondary/50 p-4">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-2xl font-bold text-primary">{count}</p>
      <p className="text-xs text-muted-foreground">{details}</p>
    </div>
  )
}
