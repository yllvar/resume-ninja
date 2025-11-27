"use client"

import { useState, useCallback } from "react"
import { experimental_useObject as useObject } from "@ai-sdk/react"
import { ResumeAnalysisSchema, type ResumeAnalysis } from "@/lib/ai/schemas"

export type AnalysisStatus = "idle" | "parsing" | "analyzing" | "complete" | "error"

interface UseResumeAnalysisReturn {
  status: AnalysisStatus
  progress: number
  analysis: Partial<ResumeAnalysis> | null
  error: string | null
  resumeText: string | null
  analyze: (text: string, jobDescription?: string) => void
  reset: () => void
}

export function useResumeAnalysis(): UseResumeAnalysisReturn {
  const [status, setStatus] = useState<AnalysisStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [resumeText, setResumeText] = useState<string | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

  const { object, submit, isLoading, error } = useObject({
    api: "/api/analyze",
    schema: ResumeAnalysisSchema,
    onFinish: () => {
      setStatus("complete")
      setProgress(100)
    },
    onError: (err) => {
      setStatus("error")
      setAnalysisError(err.message || "Analysis failed")
    },
  })

  const analyze = useCallback(
    (text: string, jobDescription?: string) => {
      setResumeText(text)
      setStatus("analyzing")
      setProgress(30)
      setAnalysisError(null)

      // Simulate progress while analyzing
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90))
      }, 500)

      submit({ resumeText: text, jobDescription })

      // Clear interval when done
      setTimeout(() => clearInterval(interval), 5000)
    },
    [submit],
  )

  const reset = useCallback(() => {
    setStatus("idle")
    setProgress(0)
    setResumeText(null)
    setAnalysisError(null)
  }, [])

  return {
    status: isLoading ? "analyzing" : status,
    progress,
    analysis: object as Partial<ResumeAnalysis> | null,
    error: analysisError || error?.message || null,
    resumeText,
    analyze,
    reset,
  }
}
