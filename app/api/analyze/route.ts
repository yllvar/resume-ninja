import { streamObject } from "ai"
import { ResumeAnalysisSchema } from "@/lib/ai/schemas"
import { getModel } from "@/lib/ai/config"
import { buildPrompt, ANALYZE_RESUME_PROMPT } from "@/lib/ai/prompts"
import { protectApiRoute, deductCreditsAfterSuccess } from "@/lib/api-utils"
import { createClient } from "@/lib/supabase/server"
import { analyzeRequestSchema, containsMaliciousPatterns } from "@/lib/security/validation"
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

    const validation = analyzeRequestSchema.safeParse(body)

    if (!validation.success) {
      await logAuditEvent({
        action: "validation_failed",
        userId,
        success: false,
        errorMessage: validation.error.message,
        metadata: { endpoint: "analyze" },
      })
      return Response.json({ error: "Invalid input", details: validation.error.flatten() }, { status: 400 })
    }

    const { resumeText, jobDescription, resumeId } = validation.data

    if (containsMaliciousPatterns(resumeText)) {
      await logAuditEvent({
        action: "validation_failed",
        userId,
        success: false,
        errorMessage: "Malicious content detected",
        metadata: { endpoint: "analyze" },
      })
      return Response.json({ error: "Invalid content detected" }, { status: 400 })
    }

    // Log analysis start
    await logAuditEvent({
      action: "analysis_started",
      userId,
      success: true,
      metadata: { resumeLength: resumeText.length, hasJobDescription: !!jobDescription },
    })

    const jobDescriptionSection = jobDescription
      ? `JOB DESCRIPTION TO MATCH:\n${jobDescription}\n\nTailor the analysis to this specific job, identifying missing keywords and skills.`
      : "No specific job description provided. Provide general ATS optimization recommendations."

    const prompt = buildPrompt(ANALYZE_RESUME_PROMPT, {
      resumeText,
      jobDescriptionSection,
    })

    const result = streamObject({
      model: getModel("primary"),
      schema: ResumeAnalysisSchema,
      prompt,
      maxOutputTokens: 4000,
      temperature: 0.3,
      onFinish: async ({ object }) => {
        if (object) {
          await deductCreditsAfterSuccess(userId, 1, "resume_analysis")

          const supabase = await createClient()
          await supabase.from("analyses").insert({
            resume_id: resumeId || null,
            user_id: userId,
            job_description: jobDescription || null,
            ats_score: object.overallScore,
            analysis_result: object,
            template_used: "classic",
            credits_used: 1,
          })

          await logAuditEvent({
            action: "analysis_completed",
            userId,
            success: true,
            metadata: { atsScore: object.overallScore },
          })
        }
      },
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Resume analysis error:", error)
    return Response.json({ error: "Failed to analyze resume" }, { status: 500 })
  }
}
