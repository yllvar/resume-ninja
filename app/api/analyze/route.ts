import { streamObject } from "ai"
import { ResumeAnalysisSchema } from "@/lib/ai/schemas"
import { getModel } from "@/lib/ai/config"
import { getProvider } from "@/lib/ai/providers"
import { buildPrompt, ANALYZE_RESUME_PROMPT } from "@/lib/ai/prompts"
import { protectApiRoute, deductCreditsAfterSuccess } from "@/lib/api-utils"
import { checkCredits } from "@/lib/credits"
import { createClient } from "@/lib/supabase/server"
import { analyzeRequestSchema, containsMaliciousPatterns } from "@/lib/security/validation"
import { logAuditEvent } from "@/lib/security/audit"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    // Allow unauthenticated users for demo purposes with rate limiting
    const protection = await protectApiRoute(false, 0)

    if (!protection.success) {
      return protection.response
    }

    // For authenticated users, check credits
    if (protection.success && protection.context) {
      const { userId } = protection.context
      const creditResult = await checkCredits(userId, 1)
      
      if (!creditResult.hasCredits) {
        return Response.json(
          {
            error: "Insufficient credits. Please upgrade your plan or purchase more credits.",
            code: "INSUFFICIENT_CREDITS",
            currentCredits: creditResult.currentCredits,
            requiredCredits: creditResult.requiredCredits,
            upgradeRequired: true,
          },
          { status: 402 }
        )
      }
    }

    const userId = protection.success && protection.context ? protection.context.userId : null
    const body = await req.json()

    const validation = analyzeRequestSchema.safeParse(body)

    if (!validation.success) {
      await logAuditEvent({
        action: "validation_failed",
        userId: userId || undefined,
        success: false,
        errorMessage: validation.error.message,
        metadata: { endpoint: "analyze" },
      })
      return Response.json({ error: "Invalid input", details: validation.error.message }, { status: 400 })
    }

    const { resumeText, jobDescription, resumeId } = validation.data

    if (containsMaliciousPatterns(resumeText)) {
      await logAuditEvent({
        action: "validation_failed",
        userId: userId || undefined,
        success: false,
        errorMessage: "Malicious content detected",
        metadata: { endpoint: "analyze" },
      })
      return Response.json({ error: "Invalid content detected" }, { status: 400 })
    }

    // Log analysis start
    await logAuditEvent({
      action: "analysis_started",
      userId: userId || undefined,
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
      model: getProvider(getModel("primary")),
      schema: ResumeAnalysisSchema,
      prompt,
      maxOutputTokens: 4000,
      temperature: 0.3,
      onFinish: async ({ object }) => {
        if (object) {
          // Only deduct credits and save to database for authenticated users
          if (userId) {
            await deductCreditsAfterSuccess(userId, 1, "resume_analysis")

            const supabase = await createClient()
            await supabase.from("analyses").insert({
              resume_id: resumeId || null,
              user_id: userId,
              job_description: jobDescription || null,
              ats_score: object.atsScore,
              analysis_result: object,
              template_used: "classic",
              credits_used: 1,
            })
          }

          await logAuditEvent({
            action: "analysis_completed",
            userId: userId || "anonymous",
            success: true,
            metadata: { atsScore: object.atsScore },
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
