import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const limit = Number.parseInt(url.searchParams.get("limit") || "10")
    const offset = Number.parseInt(url.searchParams.get("offset") || "0")

    // Get analyses with resume info
    const {
      data: analyses,
      error,
      count,
    } = await supabase
      .from("analyses")
      .select(
        `
        id,
        ats_score,
        job_description,
        analysis_result,
        optimized_content,
        template_used,
        created_at,
        resumes (
          id,
          original_filename
        )
      `,
        { count: "exact" },
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("History fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
    }

    return NextResponse.json({
      analyses,
      total: count,
      limit,
      offset,
    })
  } catch (error) {
    console.error("History fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
