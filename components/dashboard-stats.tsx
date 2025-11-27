import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, TrendingUp, CheckCircle, Clock } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = await createClient()

  // Get stats
  const { count: totalAnalyses } = await supabase
    .from("analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  const { data: analyses } = await supabase
    .from("analyses")
    .select("ats_score, created_at")
    .eq("user_id", userId)
    .not("ats_score", "is", null)
    .order("created_at", { ascending: false })

  const avgScore =
    analyses && analyses.length > 0
      ? Math.round(analyses.reduce((sum, a) => sum + (a.ats_score || 0), 0) / analyses.length)
      : null

  const highScoreCount = analyses?.filter((a) => (a.ats_score || 0) >= 80).length || 0

  const stats = [
    {
      label: "Total Analyses",
      value: totalAnalyses || 0,
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "Average Score",
      value: avgScore ? `${avgScore}%` : "N/A",
      icon: TrendingUp,
      color: "text-chart-2",
    },
    {
      label: "High Scores (80+)",
      value: highScoreCount,
      icon: CheckCircle,
      color: "text-chart-4",
    },
    {
      label: "This Month",
      value:
        analyses?.filter((a) => {
          const date = new Date(a.created_at)
          const now = new Date()
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }).length || 0,
      icon: Clock,
      color: "text-chart-3",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-secondary", stat.color)}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
