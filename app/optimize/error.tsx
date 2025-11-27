"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react"

export default function OptimizeError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Optimize page error:", error)
  }, [error])

  const isRateLimited = error.message?.includes("rate") || error.message?.includes("limit")
  const isCreditsError = error.message?.includes("credit") || error.message?.includes("insufficient")

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-border bg-card text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-xl text-foreground">
            {isRateLimited ? "Too Many Requests" : isCreditsError ? "Insufficient Credits" : "Analysis Failed"}
          </CardTitle>
          <CardDescription>
            {isRateLimited
              ? "Please wait a moment before trying again."
              : isCreditsError
                ? "You've run out of credits. Upgrade your plan to continue."
                : "We couldn't complete your resume analysis. Please try again."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            {!isCreditsError && (
              <Button onClick={reset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
            {isCreditsError && <Button>Upgrade Plan</Button>}
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
