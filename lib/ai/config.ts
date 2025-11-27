/**
 * AI Configuration for Resume Ninja
 * Uses Google Gemini AI
 */

export const AI_CONFIG = {
  // Primary model for resume analysis
  primaryModel: "gemini-2.0-flash-exp",
  // Fast model for quick operations
  fastModel: "gemini-2.0-flash-exp", 
  // Fallback if primary unavailable
  fallbackModel: "gemini-2.0-flash-exp",
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
