import { google } from "@ai-sdk/google"

// Configure Google AI provider
export const googleProvider = google("gemini-2.0-flash-exp")

// Get provider instance (only Google for now)
export function getProvider(model: string) {
  return googleProvider
}
