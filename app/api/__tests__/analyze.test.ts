import { NextRequest } from 'next/server'
import { POST } from '../analyze/route'

// Mock the AI and resume parsing functions
jest.mock('@/lib/ai/config', () => ({
  getModel: jest.fn(() => 'gemini-2.0-flash-exp'),
}))

jest.mock('@/lib/ai/providers', () => ({
  getProvider: jest.fn(() => ({
    streamObject: jest.fn(),
  })),
}))

jest.mock('@/lib/ai/prompts', () => ({
  buildPrompt: jest.fn((prompt, data) => `${prompt} ${JSON.stringify(data)}`),
  ANALYZE_RESUME_PROMPT: 'Analyze this resume:',
}))

jest.mock('@/lib/resume-parser', () => ({
  extractTextFromFile: jest.fn(),
}))

jest.mock('@/lib/api-utils', () => ({
  protectApiRoute: jest.fn(),
  deductCreditsAfterSuccess: jest.fn(),
}))

jest.mock('@/lib/credits', () => ({
  checkCredits: jest.fn(() => ({ hasCredits: true, currentCredits: 5, requiredCredits: 1 })),
}))

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/lib/security/validation', () => ({
  analyzeRequestSchema: {
    safeParse: jest.fn(),
  },
  containsMaliciousPatterns: jest.fn(() => false),
}))

jest.mock('@/lib/security/audit', () => ({
  logAuditEvent: jest.fn(),
}))

jest.mock('ai', () => ({
  streamObject: jest.fn(),
}))

describe('/api/analyze', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should allow unauthenticated users with rate limiting', async () => {
    const { protectApiRoute } = require('@/lib/api-utils')
    protectApiRoute.mockResolvedValue({
      success: true,
      context: null, // Unauthenticated user
    })

    const { analyzeRequestSchema } = require('@/lib/security/validation')
    analyzeRequestSchema.safeParse.mockReturnValue({
      success: true,
      data: {
        resumeText: 'Sample resume text',
        jobDescription: 'Software Engineer position',
      },
    })

    const { streamObject } = require('ai')
    const mockStream = {
      toTextStreamResponse: jest.fn(() => new Response('stream data')),
    }
    streamObject.mockReturnValue(mockStream)

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        resumeText: 'Sample resume text',
        jobDescription: 'Software Engineer position',
      }),
    })

    const response = await POST(request)
    
    expect(response).toBeDefined()
    expect(streamObject).toHaveBeenCalled()
  })

  it('should handle authenticated users with credit checks', async () => {
    const { protectApiRoute } = require('@/lib/api-utils')
    protectApiRoute.mockResolvedValue({
      success: true,
      context: {
        userId: 'user-123',
        email: 'test@example.com',
        tier: 'free',
        credits: 5,
      },
    })

    const { checkCredits } = require('@/lib/credits')
    checkCredits.mockReturnValue({ hasCredits: true, currentCredits: 5, requiredCredits: 1 })

    const { analyzeRequestSchema } = require('@/lib/security/validation')
    analyzeRequestSchema.safeParse.mockReturnValue({
      success: true,
      data: {
        resumeText: 'Sample resume text',
        jobDescription: 'Software Engineer position',
      },
    })

    const { streamObject } = require('ai')
    const mockStream = {
      toTextStreamResponse: jest.fn(() => new Response('stream data')),
    }
    streamObject.mockReturnValue(mockStream)

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        resumeText: 'Sample resume text',
        jobDescription: 'Software Engineer position',
      }),
    })

    const response = await POST(request)
    
    expect(response).toBeDefined()
    expect(checkCredits).toHaveBeenCalledWith('user-123', 1)
  })

  it('should reject requests with insufficient credits', async () => {
    const { protectApiRoute } = require('@/lib/api-utils')
    protectApiRoute.mockResolvedValue({
      success: true,
      context: {
        userId: 'user-123',
        email: 'test@example.com',
        tier: 'free',
        credits: 0,
      },
    })

    const { checkCredits } = require('@/lib/credits')
    checkCredits.mockReturnValue({ hasCredits: false, currentCredits: 0, requiredCredits: 1 })

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        resumeText: 'Sample resume text',
        jobDescription: 'Software Engineer position',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(402)
    expect(data.error).toBe('Insufficient credits. Please upgrade your plan or purchase more credits.')
  })

  it('should validate request body', async () => {
    const { protectApiRoute } = require('@/lib/api-utils')
    protectApiRoute.mockResolvedValue({
      success: true,
      context: null,
    })

    const { analyzeRequestSchema } = require('@/lib/security/validation')
    analyzeRequestSchema.safeParse.mockReturnValue({
      success: false,
      error: { message: 'Invalid input' },
    })

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({}), // Missing required fields
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid input')
  })
})
