import { createClient } from "@/lib/supabase/server"
import type { SubscriptionTier } from "@/lib/supabase/types"

export interface CreditCheckResult {
  hasCredits: boolean
  currentCredits: number
  requiredCredits: number
  tier: SubscriptionTier
}

export async function checkCredits(userId: string, requiredCredits = 1): Promise<CreditCheckResult> {
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("credits, subscription_tier")
    .eq("id", userId)
    .single()

  if (error || !profile) {
    return {
      hasCredits: false,
      currentCredits: 0,
      requiredCredits,
      tier: "free",
    }
  }

  // Enterprise has unlimited credits
  if (profile.subscription_tier === "enterprise") {
    return {
      hasCredits: true,
      currentCredits: Number.POSITIVE_INFINITY,
      requiredCredits,
      tier: profile.subscription_tier,
    }
  }

  return {
    hasCredits: profile.credits >= requiredCredits,
    currentCredits: profile.credits,
    requiredCredits,
    tier: profile.subscription_tier as SubscriptionTier,
  }
}

export async function deductCredits(
  userId: string,
  amount = 1,
  action = "analysis",
): Promise<{ success: boolean; remainingCredits: number; error?: string }> {
  const supabase = await createClient()

  // First check current credits
  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("credits, subscription_tier")
    .eq("id", userId)
    .single()

  if (fetchError || !profile) {
    return { success: false, remainingCredits: 0, error: "Profile not found" }
  }

  // Enterprise doesn't deduct credits
  if (profile.subscription_tier === "enterprise") {
    // Log usage without deducting
    await logUsage(userId, action, 0)
    return { success: true, remainingCredits: Number.POSITIVE_INFINITY }
  }

  if (profile.credits < amount) {
    return {
      success: false,
      remainingCredits: profile.credits,
      error: "Insufficient credits",
    }
  }

  // Deduct credits
  const { data: updated, error: updateError } = await supabase
    .from("profiles")
    .update({ credits: profile.credits - amount, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select("credits")
    .single()

  if (updateError) {
    return { success: false, remainingCredits: profile.credits, error: updateError.message }
  }

  // Log the usage
  await logUsage(userId, action, amount)

  return { success: true, remainingCredits: updated.credits }
}

export async function addCredits(
  userId: string,
  amount: number,
  reason = "purchase",
): Promise<{ success: boolean; newBalance: number; error?: string }> {
  const supabase = await createClient()

  const { data: profile, error: fetchError } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", userId)
    .single()

  if (fetchError || !profile) {
    return { success: false, newBalance: 0, error: "Profile not found" }
  }

  const newCredits = profile.credits + amount

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ credits: newCredits, updated_at: new Date().toISOString() })
    .eq("id", userId)

  if (updateError) {
    return { success: false, newBalance: profile.credits, error: updateError.message }
  }

  // Log the credit addition
  await logUsage(userId, `credit_${reason}`, -amount) // Negative to indicate addition

  return { success: true, newBalance: newCredits }
}

async function logUsage(userId: string, action: string, creditsUsed: number): Promise<void> {
  const supabase = await createClient()

  await supabase.from("usage_logs").insert({
    user_id: userId,
    action,
    credits_used: creditsUsed,
    metadata: { timestamp: new Date().toISOString() },
  })
}

export async function getUsageStats(userId: string): Promise<{
  totalAnalyses: number
  creditsUsed: number
  recentActivity: Array<{ action: string; created_at: string; credits_used: number }>
}> {
  const supabase = await createClient()

  // Get total analyses count
  const { count: totalAnalyses } = await supabase
    .from("analyses")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Get total credits used
  const { data: usageLogs } = await supabase
    .from("usage_logs")
    .select("credits_used, action, created_at")
    .eq("user_id", userId)
    .gt("credits_used", 0)
    .order("created_at", { ascending: false })
    .limit(10)

  const creditsUsed = usageLogs?.reduce((sum, log) => sum + log.credits_used, 0) || 0

  return {
    totalAnalyses: totalAnalyses || 0,
    creditsUsed,
    recentActivity: usageLogs || [],
  }
}
