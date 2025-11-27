import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { checkRateLimit, getClientIP, createRateLimitHeaders, type RateLimitTier } from "@/lib/rate-limit"
import { checkCredits, deductCredits } from "@/lib/credits"
import type { SubscriptionTier } from "@/lib/supabase/types"

export interface ApiContext {
  userId: string
  email: string
  tier: SubscriptionTier
  credits: number
}

export interface ProtectedApiResult {
  success: true
  context: ApiContext
}

export interface ProtectedApiError {
  success: false
  response: NextResponse
}

// Map subscription tier to rate limit tier
function tierToRateLimitTier(tier: SubscriptionTier): RateLimitTier {
  return tier as RateLimitTier
}

/**
 * Protects an API route with authentication, rate limiting, and credit checks
 */
export async function protectApiRoute(
  requireCredits = true,
  creditsRequired = 1,
): Promise<ProtectedApiResult | ProtectedApiError> {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    // For unauthenticated requests, apply anonymous rate limiting
    const ip = await getClientIP()
    const rateLimitResult = await checkRateLimit(ip, "anonymous")

    if (!rateLimitResult.success) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: "Rate limit exceeded",
            code: "RATE_LIMITED",
            retryAfter: rateLimitResult.retryAfter,
          },
          { status: 429, headers: createRateLimitHeaders(rateLimitResult) },
        ),
      }
    }

    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Authentication required",
          code: "UNAUTHORIZED",
        },
        { status: 401 },
      ),
    }
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits, subscription_tier")
    .eq("id", user.id)
    .single()

  const tier = (profile?.subscription_tier as SubscriptionTier) || "free"
  const credits = profile?.credits || 0

  // Check rate limit based on tier
  const rateLimitResult = await checkRateLimit(user.id, tierToRateLimitTier(tier))

  if (!rateLimitResult.success) {
    return {
      success: false,
      response: NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait before making another request.",
          code: "RATE_LIMITED",
          retryAfter: rateLimitResult.retryAfter,
          upgradeRequired: tier === "free",
        },
        { status: 429, headers: createRateLimitHeaders(rateLimitResult) },
      ),
    }
  }

  // Check credits if required
  if (requireCredits) {
    const creditResult = await checkCredits(user.id, creditsRequired)

    if (!creditResult.hasCredits) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: "Insufficient credits. Please upgrade your plan or purchase more credits.",
            code: "INSUFFICIENT_CREDITS",
            currentCredits: creditResult.currentCredits,
            requiredCredits: creditResult.requiredCredits,
            upgradeRequired: true,
          },
          { status: 402 },
        ),
      }
    }
  }

  return {
    success: true,
    context: {
      userId: user.id,
      email: user.email || "",
      tier,
      credits,
    },
  }
}

/**
 * Deduct credits after successful operation
 */
export async function deductCreditsAfterSuccess(userId: string, amount = 1, action = "analysis"): Promise<void> {
  await deductCredits(userId, amount, action)
}
