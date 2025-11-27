export const ANALYZE_RESUME_PROMPT = `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume text and provide a comprehensive assessment.

RESUME TEXT:
{resumeText}

{jobDescriptionSection}

Your analysis should:
1. Extract and structure all resume sections (contact, summary, experience, education, skills)
2. Calculate an ATS compatibility score (0-100) based on:
   - Formatting (25%): Simple layout, no tables/graphics, standard sections
   - Keywords (25%): Industry-relevant terms, action verbs, measurable achievements
   - Structure (25%): Clear section headings, chronological order, consistent formatting
   - Content (25%): Quantified achievements, relevant experience, complete information

3. Identify issues categorized as:
   - Critical: Will likely cause ATS rejection
   - Warning: May reduce ATS score
   - Suggestion: Improvements for human readers

4. Extract detected keywords and suggest additional relevant keywords

5. List 3-5 key strengths and 3-5 areas for improvement

Be specific and actionable in your recommendations.`

export const OPTIMIZE_RESUME_PROMPT = `You are an expert resume writer specializing in ATS optimization. Transform the following resume to maximize ATS compatibility while maintaining professional appeal.

ORIGINAL RESUME:
{resumeText}

ANALYSIS INSIGHTS:
{analysisInsights}

{jobDescriptionSection}

OPTIMIZATION GUIDELINES:
1. Rewrite the professional summary to include key skills and achievements
2. Enhance experience bullet points to:
   - Start with strong action verbs
   - Include quantifiable metrics where possible
   - Incorporate relevant keywords naturally
3. Optimize skill section with industry-standard terminology
4. Ensure all sections are clearly labeled and ATS-friendly
5. Remove any formatting that could confuse ATS systems

Provide the optimized resume content and list the key improvements made.`

export function buildPrompt(template: string, variables: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(`{${key}}`, value)
  }
  return result
}
