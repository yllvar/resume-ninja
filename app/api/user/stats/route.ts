import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUsageStats } from "@/lib/credits"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await getUsageStats(user.id)

    // Get average ATS score improvement
    const { data: analyses } = await supabase
      .from("analyses")
      .select("ats_score")
      .eq("user_id", user.id)
      .not("ats_score", "is", null)

    const avgScore =
      analyses && analyses.length > 0
        ? Math.round(analyses.reduce((sum, a) => sum + (a.ats_score || 0), 0) / analyses.length)
        : null

    return NextResponse.json({
      ...stats,
      averageScore: avgScore,
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
