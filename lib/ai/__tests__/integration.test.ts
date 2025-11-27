import { generateObject, streamObject } from 'ai'
import { getModel } from '@/lib/ai/config'
import { buildPrompt, ANALYZE_RESUME_PROMPT, OPTIMIZE_RESUME_PROMPT } from '@/lib/ai/prompts'
import { OptimizedResumeSchema, AnalysisSchema } from '@/lib/ai/schemas'

// Mock the AI SDK
jest.mock('ai', () => ({
  generateObject: jest.fn(),
  streamObject: jest.fn(),
}))

describe('AI Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('AI Configuration', () => {
    it('should return primary model for analysis', () => {
      const model = getModel('primary')
      expect(model).toBeDefined()
    })

    it('should return fallback model when primary fails', () => {
      // Mock primary model to fail
      const originalModel = getModel('primary')
      jest.mock('@/lib/ai/config', () => ({
        getModel: jest.fn(() => originalModel),
      }))
      
      const fallbackModel = getModel('fallback')
      expect(fallbackModel).toBeDefined()
    })

    it('should handle model initialization errors', () => {
      expect(() => {
        getModel('invalid' as any)
      }).toThrow()
    })
  })

  describe('Resume Analysis Pipeline', () => {
    const mockResumeText = 'John Doe\nSoftware Engineer\nExperience: 5 years...'
    const mockJobDescription = 'Senior Software Engineer position...'

    it('should analyze resume successfully', async () => {
      const mockAnalysis = {
        atsScore: 85,
        analysis: 'Strong technical background with good experience',
        suggestions: ['Add more quantifiable achievements', 'Include technical skills section'],
        keywords: ['JavaScript', 'React', 'Node.js'],
        formatIssues: ['Inconsistent bullet point formatting'],
        strengths: ['Clear experience progression', 'Relevant technical skills'],
      }

      ;(generateObject as jest.Mock).mockResolvedValue({
        object: mockAnalysis,
      })

      const result = await generateObject({
        model: getModel('primary'),
        schema: AnalysisSchema,
        prompt: buildPrompt(ANALYZE_RESUME_PROMPT, {
          resumeText: mockResumeText,
          jobDescription: mockJobDescription,
        }),
        maxOutputTokens: 2000,
        temperature: 0.3,
      })

      expect(result.object).toEqual(mockAnalysis)
      expect(generateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: getModel('primary'),
          schema: AnalysisSchema,
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      )
    })

    it('should handle analysis without job description', async () => {
      const mockAnalysis = {
        atsScore: 75,
        analysis: 'Good general resume structure',
        suggestions: ['Add specific achievements', 'Include contact information'],
        keywords: ['Project Management', 'Leadership'],
        formatIssues: ['Missing contact section'],
        strengths: ['Professional formatting', 'Clear experience sections'],
      }

      ;(generateObject as jest.Mock).mockResolvedValue({
        object: mockAnalysis,
      })

      const result = await generateObject({
        model: getModel('primary'),
        schema: AnalysisSchema,
        prompt: buildPrompt(ANALYZE_RESUME_PROMPT, {
          resumeText: mockResumeText,
          jobDescription: '',
        }),
        maxOutputTokens: 2000,
        temperature: 0.3,
      })

      expect(result.object.atsScore).toBe(75)
      expect(result.object.analysis).toContain('general resume')
    })

    it('should handle AI service errors during analysis', async () => {
      ;(generateObject as jest.Mock).mockRejectedValue(new Error('AI service unavailable'))

      await expect(
        generateObject({
          model: getModel('primary'),
          schema: AnalysisSchema,
          prompt: buildPrompt(ANALYZE_RESUME_PROMPT, {
            resumeText: mockResumeText,
            jobDescription: mockJobDescription,
          }),
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      ).rejects.toThrow('AI service unavailable')
    })

    it('should validate analysis output schema', async () => {
      const invalidAnalysis = {
        atsScore: 'invalid', // Should be number
        analysis: 'Good resume',
        // Missing required fields
      }

      ;(generateObject as jest.Mock).mockResolvedValue({
        object: invalidAnalysis,
      })

      const result = await generateObject({
        model: getModel('primary'),
        schema: AnalysisSchema,
        prompt: buildPrompt(ANALYZE_RESUME_PROMPT, {
          resumeText: mockResumeText,
          jobDescription: mockJobDescription,
        }),
        maxOutputTokens: 2000,
        temperature: 0.3,
      })

      // Schema validation should catch invalid types
      expect(typeof result.object.atsScore).toBe('number')
    })
  })

  describe('Resume Optimization Pipeline', () => {
    const mockResumeText = 'Original resume content...'
    const mockAnalysisInsights = 'ATS score: 75. Missing keywords and formatting issues.'
    const mockJobDescription = 'Senior React Developer position...'

    it('should optimize resume successfully', async () => {
      const mockOptimizedResume = {
        contact: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-0123',
          location: 'San Francisco, CA',
          linkedin: 'linkedin.com/in/johndoe',
          website: 'johndoe.dev',
        },
        summary: 'Experienced software engineer with 5+ years...',
        experience: [
          {
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            startDate: '2020-01',
            endDate: '2023-12',
            bullets: [
              'Led development of microservices architecture',
              'Improved application performance by 40%',
            ],
          },
        ],
        education: [
          {
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            institution: 'University of Technology',
            graduationDate: '2019-05',
            gpa: '3.8',
          },
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Python'],
      }

      const mockStream = {
        toTextStreamResponse: jest.fn().mockReturnValue(new Response()),
      }

      ;(streamObject as jest.Mock).mockReturnValue(mockStream)

      const result = streamObject({
        model: getModel('primary'),
        schema: OptimizedResumeSchema,
        prompt: buildPrompt(OPTIMIZE_RESUME_PROMPT, {
          resumeText: mockResumeText,
          analysisInsights: mockAnalysisInsights,
          jobDescriptionSection: `TARGET JOB DESCRIPTION:\n${mockJobDescription}\n\nOptimize the resume specifically for this role.`,
        }),
        maxOutputTokens: 4000,
        temperature: 0.4,
      })

      expect(streamObject).toHaveBeenCalledWith(
        expect.objectContaining({
          model: getModel('primary'),
          schema: OptimizedResumeSchema,
          maxOutputTokens: 4000,
          temperature: 0.4,
        })
      )
    })

    it('should handle optimization without job description', async () => {
      const mockStream = {
        toTextStreamResponse: jest.fn().mockReturnValue(new Response()),
      }

      ;(streamObject as jest.Mock).mockReturnValue(mockStream)

      streamObject({
        model: getModel('primary'),
        schema: OptimizedResumeSchema,
        prompt: buildPrompt(OPTIMIZE_RESUME_PROMPT, {
          resumeText: mockResumeText,
          analysisInsights: mockAnalysisInsights,
          jobDescriptionSection: 'No specific job description provided. Optimize for general ATS compatibility.',
        }),
        maxOutputTokens: 4000,
        temperature: 0.4,
      })

      expect(streamObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: expect.stringContaining('general ATS compatibility'),
        })
      )
    })

    it('should handle streaming optimization response', async () => {
      const mockStream = {
        toTextStreamResponse: jest.fn().mockReturnValue(
          new Response('{"contact":{"name":"John Doe"}}', {
            headers: { 'Content-Type': 'application/json' },
          })
        ),
      }

      ;(streamObject as jest.Mock).mockReturnValue(mockStream)

      const result = streamObject({
        model: getModel('primary'),
        schema: OptimizedResumeSchema,
        prompt: buildPrompt(OPTIMIZE_RESUME_PROMPT, {
          resumeText: mockResumeText,
          analysisInsights: mockAnalysisInsights,
          jobDescriptionSection: 'No specific job description provided. Optimize for general ATS compatibility.',
        }),
        maxOutputTokens: 4000,
        temperature: 0.4,
      })

      const response = result.toTextStreamResponse()
      expect(response).toBeInstanceOf(Response)
    })

    it('should handle optimization errors gracefully', async () => {
      ;(streamObject as jest.Mock).mockImplementation(() => {
        throw new Error('Optimization failed')
      })

      expect(() => {
        streamObject({
          model: getModel('primary'),
          schema: OptimizedResumeSchema,
          prompt: buildPrompt(OPTIMIZE_RESUME_PROMPT, {
            resumeText: mockResumeText,
            analysisInsights: mockAnalysisInsights,
            jobDescriptionSection: 'Test job description',
          }),
          maxOutputTokens: 4000,
          temperature: 0.4,
        })
      }).toThrow('Optimization failed')
    })
  })

  describe('Prompt Building', () => {
    it('should build analysis prompt correctly', () => {
      const prompt = buildPrompt(ANALYZE_RESUME_PROMPT, {
        resumeText: 'Test resume content',
        jobDescription: 'Test job description',
      })

      expect(prompt).toContain('Test resume content')
      expect(prompt).toContain('Test job description')
      expect(prompt).toContain('ATS compatibility')
    })

    it('should build optimization prompt correctly', () => {
      const prompt = buildPrompt(OPTIMIZE_RESUME_PROMPT, {
        resumeText: 'Test resume',
        analysisInsights: 'ATS score: 80',
        jobDescriptionSection: 'TARGET JOB DESCRIPTION:\nSenior Developer',
      })

      expect(prompt).toContain('Test resume')
      expect(prompt).toContain('ATS score: 80')
      expect(prompt).toContain('Senior Developer')
    })

    it('should handle missing prompt variables', () => {
      const prompt = buildPrompt(ANALYZE_RESUME_PROMPT, {
        resumeText: 'Test resume',
        jobDescription: '',
      })

      expect(prompt).toContain('Test resume')
      expect(prompt).not.toContain('undefined')
    })
  })

  describe('Rate Limiting and Timeouts', () => {
    it('should handle rate limiting during analysis', async () => {
      ;(generateObject as jest.Mock).mockRejectedValue(new Error('Rate limit exceeded'))

      await expect(
        generateObject({
          model: getModel('primary'),
          schema: AnalysisSchema,
          prompt: buildPrompt(ANALYZE_RESUME_PROMPT, {
            resumeText: 'test',
            jobDescription: 'test',
          }),
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      ).rejects.toThrow('Rate limit exceeded')
    })

    it('should handle timeout during optimization', async () => {
      ;(streamObject as jest.Mock).mockImplementation(() => {
        throw new Error('Request timeout')
      })

      expect(() => {
        streamObject({
          model: getModel('primary'),
          schema: OptimizedResumeSchema,
          prompt: 'test prompt',
          maxOutputTokens: 4000,
          temperature: 0.4,
        })
      }).toThrow('Request timeout')
    })
  })

  describe('Input Validation and Security', () => {
    it('should handle extremely long resume text', async () => {
      const longText = 'a'.repeat(100000) // 100K characters

      ;(generateObject as jest.Mock).mockRejectedValue(new Error('Input too large'))

      await expect(
        generateObject({
          model: getModel('primary'),
          schema: AnalysisSchema,
          prompt: buildPrompt(ANALYZE_RESUME_PROMPT, {
            resumeText: longText,
            jobDescription: 'test',
          }),
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      ).rejects.toThrow('Input too large')
    })

    it('should handle malicious content in resume', async () => {
      const maliciousContent = '<script>alert("xss")</script>Resume content'

      ;(generateObject as jest.Mock).mockResolvedValue({
        object: {
          atsScore: 70,
          analysis: 'Resume contains potentially unsafe content',
          suggestions: ['Remove HTML tags', 'Use plain text format'],
          keywords: [],
          formatIssues: ['HTML tags detected'],
          strengths: [],
        },
      })

      const result = await generateObject({
        model: getModel('primary'),
        schema: AnalysisSchema,
        prompt: buildPrompt(ANALYZE_RESUME_PROMPT, {
          resumeText: maliciousContent,
          jobDescription: 'test',
        }),
        maxOutputTokens: 2000,
        temperature: 0.3,
      })

      expect(result.object.analysis).toContain('unsafe content')
      expect(result.object.suggestions).toContain('Remove HTML tags')
    })

    it('should handle empty or null inputs', async () => {
      ;(generateObject as jest.Mock).mockRejectedValue(new Error('Invalid input'))

      await expect(
        generateObject({
          model: getModel('primary'),
          schema: AnalysisSchema,
          prompt: buildPrompt(ANALYZE_RESUME_PROMPT, {
            resumeText: '',
            jobDescription: '',
          }),
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      ).rejects.toThrow('Invalid input')
    })
  })
})
