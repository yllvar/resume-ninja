import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import { CreditsBadge } from "@/components/credits-badge"
import { ArrowLeft, FileText, Calendar, Download, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnalysisPageProps {
  params: Promise<{ id: string }>
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, subscription_tier")
    .eq("id", user.id)
    .single()

  const { data: analysis } = await supabase
    .from("analyses")
    .select(`
      *,
      resumes (
        original_filename
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (!analysis) {
    notFound()
  }

  const analysisResult = analysis.analysis_result as {
    overallScore: number
    categoryScores: { category: string; score: number; maxScore: number }[]
    issues: { severity: string; category: string; issue: string; suggestion: string }[]
    keywords: { found: string[]; missing: string[]; recommended: string[] }
    summary: string
  } | null

  const score = analysis.ats_score || 0
  const scoreColor = score >= 80 ? "text-primary" : score >= 60 ? "text-chart-4" : "text-destructive"
  const fileName = (analysis.resumes as { original_filename: string } | null)?.original_filename || "Untitled Resume"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
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
          <div className="flex items-center gap-4">
            <CreditsBadge credits={profile?.credits || 0} tier={profile?.subscription_tier || "free"} />
            <UserNav user={user} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Back Link */}
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/dashboard/history">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to History
          </Link>
        </Button>

        {/* Header Info */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
              <FileText className="h-7 w-7 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{fileName}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {new Date(analysis.created_at).toLocaleDateString()}
                {analysis.job_description && (
                  <Badge variant="outline" className="ml-2">
                    Job Matched
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {analysis.optimized_content && (
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
            <Button asChild>
              <Link href="/optimize">New Analysis</Link>
            </Button>
          </div>
        </div>

        {/* Score Card */}
        <Card className="mb-6">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className={cn("text-6xl font-bold", scoreColor)}>{score}%</p>
            <p className="mt-2 text-lg text-muted-foreground">ATS Compatibility Score</p>
            {analysisResult?.summary && (
              <p className="mt-4 max-w-2xl text-center text-sm text-muted-foreground">{analysisResult.summary}</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Scores */}
          {analysisResult?.categoryScores && (
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
                <CardDescription>Scores by resume section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResult.categoryScores.map((cat) => (
                  <div key={cat.category}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-foreground">{cat.category}</span>
                      <span className="text-muted-foreground">
                        {cat.score}/{cat.maxScore}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Keywords */}
          {analysisResult?.keywords && (
            <Card>
              <CardHeader>
                <CardTitle>Keywords Analysis</CardTitle>
                <CardDescription>Important terms for ATS matching</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysisResult.keywords.found.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-primary">Found Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywords.found.slice(0, 10).map((kw) => (
                        <Badge key={kw} variant="secondary" className="bg-primary/10 text-primary">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {analysisResult.keywords.missing.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-destructive">Missing Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keywords.missing.slice(0, 10).map((kw) => (
                        <Badge key={kw} variant="secondary" className="bg-destructive/10 text-destructive">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Issues */}
        {analysisResult?.issues && analysisResult.issues.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Issues & Recommendations</CardTitle>
              <CardDescription>{analysisResult.issues.length} items need attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysisResult.issues.map((issue, i) => {
                const Icon =
                  issue.severity === "critical" ? XCircle : issue.severity === "major" ? AlertTriangle : CheckCircle
                const color =
                  issue.severity === "critical"
                    ? "text-destructive"
                    : issue.severity === "major"
                      ? "text-chart-4"
                      : "text-muted-foreground"

                return (
                  <div key={i} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex items-start gap-3">
                      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", color)} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{issue.issue}</p>
                          <Badge variant="outline" className="text-xs">
                            {issue.category}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{issue.suggestion}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
