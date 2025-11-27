import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserNav } from "@/components/user-nav"
import { CreditsBadge } from "@/components/credits-badge"
import { ArrowLeft, FileText, Calendar, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function HistoryPage() {
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

  const { data: analyses } = await supabase
    .from("analyses")
    .select(`
      id,
      ats_score,
      job_description,
      template_used,
      created_at,
      optimized_content,
      resumes (
        original_filename
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

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
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>View and manage all your resume analyses</CardDescription>
          </CardHeader>
          <CardContent>
            {!analyses || analyses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 font-medium text-foreground">No analyses yet</h3>
                <p className="mb-4 text-sm text-muted-foreground">Start by uploading your first resume</p>
                <Button asChild>
                  <Link href="/optimize">Start Analysis</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {analyses.map((analysis) => {
                  const score = analysis.ats_score || 0
                  const scoreColor =
                    score >= 80
                      ? "bg-primary/10 text-primary"
                      : score >= 60
                        ? "bg-chart-4/10 text-chart-4"
                        : "bg-destructive/10 text-destructive"
                  const fileName =
                    (analysis.resumes as { original_filename: string } | null)?.original_filename || "Untitled Resume"
                  const hasOptimized = !!analysis.optimized_content

                  return (
                    <div
                      key={analysis.id}
                      className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-foreground">{fileName}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(analysis.created_at).toLocaleDateString()}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {analysis.template_used || "classic"}
                            </Badge>
                            {analysis.job_description && (
                              <Badge variant="outline" className="text-xs">
                                Job Matched
                              </Badge>
                            )}
                            {hasOptimized && <Badge className="bg-primary/10 text-primary text-xs">Optimized</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className={cn("rounded-lg px-3 py-1.5 text-center", scoreColor)}>
                          <p className="text-xl font-bold">{score}%</p>
                          <p className="text-xs opacity-80">ATS Score</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" asChild title="View Details">
                            <Link href={`/dashboard/analysis/${analysis.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {hasOptimized && (
                            <Button variant="ghost" size="icon" title="Download">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
