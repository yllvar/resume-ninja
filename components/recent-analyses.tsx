import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, ArrowRight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface RecentAnalysesProps {
  userId: string
}

export async function RecentAnalyses({ userId }: RecentAnalysesProps) {
  const supabase = await createClient()

  const { data: analyses } = await supabase
    .from("analyses")
    .select(`
      id,
      ats_score,
      job_description,
      created_at,
      resumes (
        original_filename
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (!analyses || analyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 font-medium text-foreground">No analyses yet</h3>
        <p className="mb-4 text-sm text-muted-foreground">Upload your first resume to get started</p>
        <Button asChild>
          <Link href="/optimize">Start Analysis</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {analyses.map((analysis) => {
        const score = analysis.ats_score || 0
        const scoreColor = score >= 80 ? "text-primary" : score >= 60 ? "text-chart-4" : "text-destructive"
        const fileName =
          (analysis.resumes as { original_filename: string } | null)?.original_filename || "Untitled Resume"

        return (
          <div
            key={analysis.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-colors hover:bg-secondary/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">{fileName}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(analysis.created_at).toLocaleDateString()}
                  {analysis.job_description && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      Job Matched
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className={cn("text-xl font-bold", scoreColor)}>{score}%</p>
                <p className="text-xs text-muted-foreground">ATS Score</p>
              </div>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`/dashboard/analysis/${analysis.id}`}>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )
      })}

      {analyses.length >= 5 && (
        <div className="pt-2 text-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard/history">View All History</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
