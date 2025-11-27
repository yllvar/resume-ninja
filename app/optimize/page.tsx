"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResumeDropzone } from "@/components/resume-dropzone"
import { JobDescriptionInput } from "@/components/job-description-input"
import { AnalysisResults } from "@/components/analysis-results"
import { useResumeAnalysis } from "@/hooks/use-resume-analysis"

export default function OptimizePage() {
  const [jobDescription, setJobDescription] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [resumeText, setResumeText] = useState<string | null>(null)
  const { status, progress, analysis, error, analyze, reset } = useResumeAnalysis()

  const handleTextExtracted = useCallback(
    (text: string, name: string) => {
      setFileName(name)
      setResumeText(text)
      // Don't auto-analyze - wait for user to click execute button
    },
    [],
  )

  const handleExecuteAnalysis = useCallback(() => {
    if (resumeText) {
      analyze(resumeText, jobDescription || undefined)
    }
  }, [analyze, resumeText, jobDescription])

  const handleReset = () => {
    reset()
    setFileName(null)
    setResumeText(null)
    setJobDescription("")
  }

  const isAnalyzing = status === "analyzing" || status === "parsing"
  const showResults = status === "complete" && analysis
  const canExecuteAnalysis = resumeText && !isAnalyzing

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/android-chrome-192x192.png"
              alt="Resume Ninja"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-foreground">Resume Ninja</span>
          </Link>
          {showResults && (
            <Button variant="outline" size="sm" onClick={handleReset}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {!showResults ? (
          <div className="mx-auto max-w-2xl">
            {/* Title */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-foreground">Optimize Your Resume</h1>
              <p className="mt-2 text-muted-foreground">Upload your resume and get instant AI-powered ATS analysis</p>
            </div>

            {/* Upload Section */}
            <div className="space-y-6">
              <ResumeDropzone onTextExtracted={handleTextExtracted} isProcessing={isAnalyzing} />

              {resumeText && (
                <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                      <Sparkles className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Resume uploaded successfully!</p>
                      <p className="text-sm text-muted-foreground">{fileName}</p>
                    </div>
                  </div>
                </div>
              )}

              <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />

              {/* Execute Analysis Button */}
              {canExecuteAnalysis && (
                <div className="flex flex-col items-center space-y-4">
                  <Button 
                    onClick={handleExecuteAnalysis}
                    size="lg"
                    className="w-full max-w-md"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Execute Analysis
                      </>
                    )}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    {jobDescription 
                      ? "Ready to analyze your resume against the job description"
                      : "Analyzing without a specific job description (general ATS check)"}
                  </p>
                </div>
              )}

              {/* Analysis Progress */}
              {isAnalyzing && (
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Analyzing your resume...</p>
                      <p className="text-sm text-muted-foreground">Our AI ninja is scanning for ATS compatibility</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {status === "error" && error && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <p className="text-sm text-destructive">{error}</p>
                  <Button variant="outline" size="sm" className="mt-3 bg-transparent" onClick={handleReset}>
                    Try Again
                  </Button>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {[
                { title: "Private", desc: "Your data never leaves our secure servers" },
                { title: "Fast", desc: "Get results in under 10 seconds" },
                { title: "Accurate", desc: "Powered by advanced AI models" },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <AnalysisResults
            analysis={analysis}
            resumeText={resumeText || ""}
            jobDescription={jobDescription}
            fileName={fileName || "resume"}
          />
        )}
      </main>
    </div>
  )
}
