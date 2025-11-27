"use client"

import { useState } from "react"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { OptimizedResumeSchema, type OptimizedResume, type ResumeAnalysis } from "@/lib/ai/schemas"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Loader2, Download, Check } from "lucide-react"
import { ResumeDownloader } from "@/components/resume-downloader"

interface OptimizePanelProps {
  resumeText: string
  analysis: Partial<ResumeAnalysis>
  jobDescription?: string
  fileName: string
}

export function OptimizePanel({ resumeText, analysis, jobDescription, fileName }: OptimizePanelProps) {
  const [showDownloader, setShowDownloader] = useState(false)

  const { object, submit, isLoading, error } = useObject({
    api: "/api/optimize",
    schema: OptimizedResumeSchema,
  })

  const handleOptimize = () => {
    const analysisInsights = JSON.stringify({
      atsScore: analysis.atsScore,
      issues: analysis.issues?.slice(0, 5),
      suggestedKeywords: analysis.suggestedKeywords,
      improvements: analysis.improvements,
    })

    submit({ resumeText, analysisInsights, jobDescription })
  }

  const optimizedResume = object as Partial<OptimizedResume> | null

  return (
    <div className="space-y-6">
      {/* Optimize CTA */}
      {!optimizedResume && !isLoading && (
        <Card className="border-primary/30 bg-primary/5 p-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
            <div className="mb-4 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 sm:mb-0 sm:mr-6">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-foreground">Ready to Optimize?</h3>
              <p className="mt-1 text-muted-foreground">
                Our AI will rewrite your resume to maximize ATS compatibility while maintaining a professional tone.
              </p>
            </div>
            <Button
              onClick={handleOptimize}
              size="lg"
              className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 sm:ml-4 sm:mt-0"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Optimize Now
            </Button>
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div>
              <p className="font-medium text-foreground">Optimizing your resume...</p>
              <p className="text-sm text-muted-foreground">This may take a few seconds</p>
            </div>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-destructive/50 bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error.message}</p>
          <Button variant="outline" size="sm" className="mt-3 bg-transparent" onClick={handleOptimize}>
            Try Again
          </Button>
        </Card>
      )}

      {/* Optimized Results */}
      {optimizedResume && !isLoading && (
        <div className="space-y-6">
          {/* Success Header */}
          <Card className="border-primary/30 bg-primary/5 p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">Resume Optimized!</h3>
                <p className="text-sm text-muted-foreground">Your ATS-friendly resume is ready to download</p>
              </div>
              <Button
                onClick={() => setShowDownloader(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </Card>

          {/* Improvements Made */}
          {optimizedResume.improvements && optimizedResume.improvements.length > 0 && (
            <Card className="p-6">
              <h4 className="mb-4 font-semibold text-foreground">Improvements Made</h4>
              <ul className="space-y-2">
                {optimizedResume.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    {imp}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Preview Optimized Summary */}
          {optimizedResume.summary && (
            <Card className="p-6">
              <h4 className="mb-3 font-semibold text-foreground">Optimized Summary</h4>
              <p className="text-muted-foreground leading-relaxed">{optimizedResume.summary}</p>
            </Card>
          )}
        </div>
      )}

      {/* Download Modal */}
      {showDownloader && optimizedResume && (
        <ResumeDownloader resume={optimizedResume} fileName={fileName} onClose={() => setShowDownloader(false)} />
      )}
    </div>
  )
}
