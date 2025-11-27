import { z } from "zod"

export const ResumeContactSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().optional(),
})

export const ResumeExperienceSchema = z.object({
  company: z.string(),
  title: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  bullets: z.array(z.string()),
  improvements: z.array(z.string()).optional(),
})

export const ResumeEducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  field: z.string().optional(),
  graduationDate: z.string().optional(),
  gpa: z.string().optional(),
})

export const ResumeIssueSchema = z.object({
  type: z.enum(["critical", "warning", "suggestion"]),
  category: z.string(),
  message: z.string(),
  fix: z.string(),
})

export const ResumeAnalysisSchema = z.object({
  // Parsed sections
  contact: ResumeContactSchema,
  summary: z.string().optional(),
  experience: z.array(ResumeExperienceSchema),
  education: z.array(ResumeEducationSchema),
  skills: z.array(z.string()),

  // ATS Analysis
  atsScore: z.number().min(0).max(100),
  atsBreakdown: z.object({
    formatting: z.number().min(0).max(100),
    keywords: z.number().min(0).max(100),
    structure: z.number().min(0).max(100),
    content: z.number().min(0).max(100),
  }),

  // Issues and recommendations
  issues: z.array(ResumeIssueSchema),

  // Keywords analysis
  detectedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()).optional(),
  suggestedKeywords: z.array(z.string()),

  // Overall assessment
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
})

export const OptimizedResumeSchema = z.object({
  contact: ResumeContactSchema,
  summary: z.string(),
  experience: z.array(ResumeExperienceSchema),
  education: z.array(ResumeEducationSchema),
  skills: z.array(z.string()),
  improvements: z.array(z.string()),
})

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>
export type OptimizedResume = z.infer<typeof OptimizedResumeSchema>
export type ResumeExperience = z.infer<typeof ResumeExperienceSchema>
export type ResumeEducation = z.infer<typeof ResumeEducationSchema>
export type ResumeContact = z.infer<typeof ResumeContactSchema>
