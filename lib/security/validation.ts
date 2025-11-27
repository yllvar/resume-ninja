import { z } from "zod"

// File validation constants
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MAX_RESUME_TEXT_LENGTH = 50000
export const MAX_JOB_DESCRIPTION_LENGTH = 10000

// Schemas for input validation
export const fileUploadSchema = z.object({
  file: z.object({
    type: z.enum(ALLOWED_FILE_TYPES, {
      errorMap: () => ({ message: "Only PDF, DOCX, and TXT files are allowed" }),
    }),
    size: z.number().max(MAX_FILE_SIZE, "File size must be under 10MB"),
    name: z.string().min(1),
  }),
})

export const analyzeRequestSchema = z.object({
  resumeText: z
    .string()
    .min(100, "Resume text is too short")
    .max(MAX_RESUME_TEXT_LENGTH, "Resume text exceeds maximum length")
    .transform((text) => sanitizeText(text)),
  jobDescription: z
    .string()
    .max(MAX_JOB_DESCRIPTION_LENGTH, "Job description exceeds maximum length")
    .optional()
    .transform((text) => (text ? sanitizeText(text) : undefined)),
  resumeId: z.string().uuid().optional(),
})

export const optimizeRequestSchema = z.object({
  resumeText: z
    .string()
    .min(100, "Resume text is too short")
    .max(MAX_RESUME_TEXT_LENGTH, "Resume text exceeds maximum length")
    .transform((text) => sanitizeText(text)),
  analysisInsights: z.string().optional(),
  jobDescription: z
    .string()
    .max(MAX_JOB_DESCRIPTION_LENGTH)
    .optional()
    .transform((text) => (text ? sanitizeText(text) : undefined)),
  analysisId: z.string().uuid().optional(),
})

/**
 * Sanitize text input to prevent XSS and injection attacks
 */
export function sanitizeText(text: string): string {
  return (
    text
      // Remove HTML tags
      .replace(/<[^>]*>/g, "")
      // Remove script-like patterns
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      // Remove potential SQL injection patterns (basic)
      .replace(/['";\\]/g, "")
      // Normalize whitespace
      .replace(/\s+/g, " ")
      .trim()
  )
}

/**
 * Validate file magic bytes (basic implementation)
 */
export function validateFileMagicBytes(buffer: ArrayBuffer, expectedType: string): boolean {
  const bytes = new Uint8Array(buffer.slice(0, 8))

  // PDF magic bytes: %PDF
  if (expectedType === "application/pdf") {
    return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46
  }

  // DOCX magic bytes: PK (ZIP format)
  if (expectedType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return bytes[0] === 0x50 && bytes[1] === 0x4b
  }

  // TXT has no magic bytes, always return true
  if (expectedType === "text/plain") {
    return true
  }

  return false
}

/**
 * Check for potentially malicious content in text
 */
export function containsMaliciousPatterns(text: string): boolean {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
    /expression\s*\(/i,
  ]

  return maliciousPatterns.some((pattern) => pattern.test(text))
}

/**
 * Rate limit key generators
 */
export function generateRateLimitKey(userId: string | null, ip: string): string {
  return userId || `ip:${ip}`
}
