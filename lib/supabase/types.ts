export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  credits: number
  subscription_tier: "free" | "pro" | "enterprise"
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  original_filename: string
  parsed_content: Record<string, unknown> | null
  file_size: number | null
  file_type: string | null
  created_at: string
}

export interface Analysis {
  id: string
  resume_id: string
  user_id: string
  job_description: string | null
  ats_score: number | null
  analysis_result: Record<string, unknown> | null
  optimized_content: Record<string, unknown> | null
  template_used: string
  credits_used: number
  created_at: string
}

export interface UsageLog {
  id: string
  user_id: string | null
  action: string
  credits_used: number
  metadata: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export type SubscriptionTier = Profile["subscription_tier"]

export const TIER_LIMITS = {
  free: {
    creditsPerMonth: 3,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    templates: ["classic"],
    requestsPerMinute: 5,
  },
  pro: {
    creditsPerMonth: 50,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    templates: ["classic", "modern", "executive", "technical"],
    requestsPerMinute: 30,
  },
  enterprise: {
    creditsPerMonth: Number.POSITIVE_INFINITY,
    maxFileSize: 25 * 1024 * 1024, // 25MB
    templates: ["classic", "modern", "executive", "technical"],
    requestsPerMinute: 100,
  },
} as const
