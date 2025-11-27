import { NextRequest } from 'next/server'
import { POST } from '../analyze/route'

// Mock the AI and resume parsing functions
jest.mock('@/lib/ai/config', () => ({
  generateObject: jest.fn(),
}))

jest.mock('@/lib/resume-parser', () => ({
  extractTextFromFile: jest.fn(),
}))

jest.mock('@/lib/credits', () => ({
  calculateCreditsRequired: jest.fn(() => 1),
  canUserPerformAction: jest.fn(),
  deductCredits: jest.fn(),
}))

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/lib/rate-limit', () => ({
  rateLimit: jest.fn(() => ({ success: true })),
}))

describe('/api/analyze', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should require authentication', async () => {
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    })

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should validate request body', async () => {
    const { createClient } = require('@/lib/supabase/server')
    createClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ 
          data: { user: { id: 'user-123', email: 'test@example.com' } }, 
          error: null 
        }),
      },
    })

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({}), // Missing required fields
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required fields')
  })

  it('should check user credits', async () => {
    const { createClient } = require('@/lib/supabase/server')
    const { canUserPerformAction } = require('@/lib/credits')
    
    createClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ 
          data: { user: { id: 'user-123', email: 'test@example.com' } }, 
          error: null 
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'user-123', credits: 0, subscription_tier: 'free' },
              error: null,
            }),
          }),
        }),
      }),
    })

    canUserPerformAction.mockReturnValue({
      canPerform: false,
      reason: 'Insufficient credits',
    })

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        resumeText: 'Sample resume content',
        jobDescription: 'Sample job description',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Insufficient credits')
  })

  it('should validate file size', async () => {
    const { createClient } = require('@/lib/supabase/server')
    const { canUserPerformAction } = require('@/lib/credits')
    
    createClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ 
          data: { user: { id: 'user-123', email: 'test@example.com' } }, 
          error: null 
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'user-123', credits: 5, subscription_tier: 'free' },
              error: null,
            }),
          }),
        }),
      }),
    })

    canUserPerformAction.mockReturnValue({
      canPerform: true,
    })

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        resumeText: 'x'.repeat(11 * 1024 * 1024), // 11MB - exceeds limit
        jobDescription: 'Sample job description',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Resume text too large')
  })

  it('should handle successful analysis', async () => {
    const { createClient } = require('@/lib/supabase/server')
    const { canUserPerformAction, deductCredits } = require('@/lib/credits')
    const { generateObject } = require('@/lib/ai/config')
    const { extractTextFromFile } = require('@/lib/resume-parser')
    
    createClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ 
          data: { user: { id: 'user-123', email: 'test@example.com' } }, 
          error: null 
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'user-123', credits: 5, subscription_tier: 'free' },
              error: null,
            }),
          }),
        }),
        insert: jest.fn().mockResolvedValue({
          data: { id: 'analysis-123' },
          error: null,
        }),
      }),
    })

    canUserPerformAction.mockReturnValue({
      canPerform: true,
    })

    deductCredits.mockReturnValue({
      credits: 4,
    })

    generateObject.mockResolvedValue({
      object: {
        atsScore: 85,
        analysis: 'Good resume structure',
        suggestions: ['Add more keywords', 'Improve formatting'],
        optimizedContent: 'Optimized resume content',
      },
    })

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        resumeText: 'Sample resume content',
        jobDescription: 'Sample job description',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.atsScore).toBe(85)
    expect(data.analysis).toBe('Good resume structure')
    expect(data.suggestions).toEqual(['Add more keywords', 'Improve formatting'])
    expect(data.optimizedContent).toBe('Optimized resume content')
  })

  it('should handle file upload', async () => {
    const { createClient } = require('@/lib/supabase/server')
    const { canUserPerformAction } = require('@/lib/credits')
    const { extractTextFromFile } = require('@/lib/resume-parser')
    
    createClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ 
          data: { user: { id: 'user-123', email: 'test@example.com' } }, 
          error: null 
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'user-123', credits: 5, subscription_tier: 'free' },
              error: null,
            }),
          }),
        }),
      }),
    })

    canUserPerformAction.mockReturnValue({
      canPerform: true,
    })

    extractTextFromFile.mockResolvedValue('Extracted resume content')

    const formData = new FormData()
    formData.append('file', new File(['content'], 'resume.pdf', { type: 'application/pdf' }))
    formData.append('jobDescription', 'Sample job description')

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    
    // Should attempt to extract text from file
    expect(extractTextFromFile).toHaveBeenCalled()
  })

  it('should handle rate limiting', async () => {
    const { rateLimit } = require('@/lib/rate-limit')
    
    rateLimit.mockReturnValue({
      success: false,
      error: 'Rate limit exceeded',
    })

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        resumeText: 'Sample resume content',
        jobDescription: 'Sample job description',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(429)
    expect(data.error).toBe('Rate limit exceeded')
  })

  it('should handle AI service errors', async () => {
    const { createClient } = require('@/lib/supabase/server')
    const { canUserPerformAction } = require('@/lib/credits')
    const { generateObject } = require('@/lib/ai/config')
    
    createClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({ 
          data: { user: { id: 'user-123', email: 'test@example.com' } }, 
          error: null 
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'user-123', credits: 5, subscription_tier: 'free' },
              error: null,
            }),
          }),
        }),
      }),
    })

    canUserPerformAction.mockReturnValue({
      canPerform: true,
    })

    generateObject.mockRejectedValue(new Error('AI service unavailable'))

    const request = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({
        resumeText: 'Sample resume content',
        jobDescription: 'Sample job description',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('AI service unavailable')
  })
})
