export interface ResumeTemplate {
  id: string
  name: string
  description: string
  atsScore: number
  tier: "free" | "pro" | "enterprise"
  preview: string // thumbnail placeholder
}

export const TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional format with clean lines. Maximum ATS compatibility.",
    atsScore: 95,
    tier: "free",
    preview: "/classic-resume-template.png",
  },
  {
    id: "modern",
    name: "Modern Minimal",
    description: "Clean, contemporary design for tech and startup roles.",
    atsScore: 92,
    tier: "pro",
    preview: "/modern-minimal-resume-template.jpg",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Professional layout for senior and leadership positions.",
    atsScore: 93,
    tier: "pro",
    preview: "/executive-resume-template.png",
  },
  {
    id: "technical",
    name: "Technical",
    description: "Optimized for engineering, IT, and data roles.",
    atsScore: 94,
    tier: "pro",
    preview: "/technical-resume-template.png",
  },
]

export function getTemplate(id: string): ResumeTemplate | undefined {
  return TEMPLATES.find((t) => t.id === id)
}

export function getAvailableTemplates(tier: string): ResumeTemplate[] {
  const tierOrder = { free: 0, pro: 1, enterprise: 2 }
  const userTierLevel = tierOrder[tier as keyof typeof tierOrder] || 0

  return TEMPLATES.filter((t) => {
    const templateTierLevel = tierOrder[t.tier as keyof typeof tierOrder] || 0
    return templateTierLevel <= userTierLevel
  })
}
