/**
 * AI Configuration for Resume Ninja
 * Uses Vercel AI Gateway with Gemini as primary model
 */

export const AI_CONFIG = {
  // Primary model for resume analysis (best at structured extraction)
  primaryModel: "google/gemini-2.5-flash",
  // Fast model for quick operations
  fastModel: "google/gemini-2.5-flash",
  // Fallback if primary unavailable
  fallbackModel: "openai/gpt-4o-mini",
  // Max tokens for analysis
  maxOutputTokens: 4000,
  // Temperature for consistent outputs
  temperature: 0.3,
} as const

export type ModelType = "primary" | "fast" | "fallback"

export function getModel(type: ModelType = "primary") {
  switch (type) {
    case "fast":
      return AI_CONFIG.fastModel
    case "fallback":
      return AI_CONFIG.fallbackModel
    default:
      return AI_CONFIG.primaryModel
  }
}
