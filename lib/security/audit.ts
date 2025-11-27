import { createClient } from "@/lib/supabase/server"

export type AuditAction =
  | "login"
  | "logout"
  | "signup"
  | "resume_upload"
  | "analysis_started"
  | "analysis_completed"
  | "optimization_started"
  | "optimization_completed"
  | "download"
  | "rate_limited"
  | "auth_failed"
  | "validation_failed"

export interface AuditLogEntry {
  action: AuditAction
  userId?: string
  ipAddress?: string
  userAgent?: string
  metadata?: Record<string, unknown>
  success: boolean
  errorMessage?: string
}

/**
 * Log security and audit events
 */
export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    const supabase = await createClient()

    await supabase.from("usage_logs").insert({
      user_id: entry.userId || null,
      action: `audit:${entry.action}`,
      credits_used: 0,
      metadata: {
        ip_address: entry.ipAddress,
        user_agent: entry.userAgent,
        success: entry.success,
        error: entry.errorMessage,
        timestamp: new Date().toISOString(),
        ...entry.metadata,
      },
    })
  } catch (error) {
    // Don't fail the request if audit logging fails
    console.error("Audit log error:", error)
  }
}

/**
 * Log failed authentication attempt
 */
export async function logAuthFailure(ipAddress: string, reason: string): Promise<void> {
  await logAuditEvent({
    action: "auth_failed",
    ipAddress,
    success: false,
    errorMessage: reason,
  })
}

/**
 * Log rate limit hit
 */
export async function logRateLimitHit(identifier: string, endpoint: string): Promise<void> {
  await logAuditEvent({
    action: "rate_limited",
    userId: identifier.startsWith("ip:") ? undefined : identifier,
    ipAddress: identifier.startsWith("ip:") ? identifier.replace("ip:", "") : undefined,
    success: false,
    metadata: { endpoint },
  })
}
