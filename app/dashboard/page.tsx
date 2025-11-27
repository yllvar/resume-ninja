import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserNav } from "@/components/user-nav"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentAnalyses } from "@/components/recent-analyses"
import { CreditsBadge } from "@/components/credits-badge"
import { Plus, History, Zap } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}
          </h1>
          <p className="text-muted-foreground">Manage your resume analyses and track your optimization progress</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">New Analysis</p>
                <p className="text-sm text-muted-foreground">Upload a resume</p>
              </div>
              <Button asChild size="sm">
                <Link href="/optimize">Start</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <History className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">View History</p>
                <p className="text-sm text-muted-foreground">Past analyses</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/history">View</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                <Zap className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Upgrade Plan</p>
                <p className="text-sm text-muted-foreground">Get more credits</p>
              </div>
              <Button size="sm" variant="outline">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <DashboardStats userId={user.id} />

        {/* Recent Analyses */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>Your latest resume optimizations</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentAnalyses userId={user.id} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
