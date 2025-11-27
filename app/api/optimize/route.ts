import { streamObject } from "ai"
import { OptimizedResumeSchema } from "@/lib/ai/schemas"
import { getModel } from "@/lib/ai/config"
import { buildPrompt, OPTIMIZE_RESUME_PROMPT } from "@/lib/ai/prompts"
import { protectApiRoute, deductCreditsAfterSuccess } from "@/lib/api-utils"
import { createClient } from "@/lib/supabase/server"
import { optimizeRequestSchema, containsMaliciousPatterns } from "@/lib/security/validation"
import { logAuditEvent } from "@/lib/security/audit"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const protection = await protectApiRoute(true, 1)

    if (!protection.success) {
      return protection.response
    }

    const { userId } = protection.context
    const body = await req.json()

    const validation = optimizeRequestSchema.safeParse(body)

    if (!validation.success) {
      await logAuditEvent({
        action: "validation_failed",
        userId,
        success: false,
        errorMessage: validation.error.message,
        metadata: { endpoint: "optimize" },
      })
      return Response.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 })
    }

    const { resumeText, analysisInsights, jobDescription, analysisId } = validation.data

    if (containsMaliciousPatterns(resumeText)) {
      await logAuditEvent({
        action: "validation_failed",
        userId,
        success: false,
        errorMessage: "Malicious content detected",
        metadata: { endpoint: "optimize" },
      })
      return Response.json({ error: "Invalid content detected" }, { status: 400 })
    }

    await logAuditEvent({
      action: "optimization_started",
      userId,
      success: true,
      metadata: { analysisId },
    })

    const jobDescriptionSection = jobDescription
      ? `TARGET JOB DESCRIPTION:\n${jobDescription}\n\nOptimize the resume specifically for this role.`
      : "No specific job description provided. Optimize for general ATS compatibility."

    const prompt = buildPrompt(OPTIMIZE_RESUME_PROMPT, {
      resumeText,
      analysisInsights: analysisInsights || "No prior analysis available.",
      jobDescriptionSection,
    })

    const result = streamObject({
      model: getModel("primary"),
      schema: OptimizedResumeSchema,
      prompt,
      maxOutputTokens: 4000,
      temperature: 0.4,
      onFinish: async ({ object }) => {
        if (object && analysisId) {
          await deductCreditsAfterSuccess(userId, 1, "resume_optimization")

          const supabase = await createClient()
          await supabase
            .from("analyses")
            .update({ optimized_content: object })
            .eq("id", analysisId)
            .eq("user_id", userId)

          await logAuditEvent({
            action: "optimization_completed",
            userId,
            success: true,
            metadata: { analysisId },
          })
        }
      },
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Resume optimization error:", error)
    return Response.json({ error: "Failed to optimize resume" }, { status: 500 })
  }
}
