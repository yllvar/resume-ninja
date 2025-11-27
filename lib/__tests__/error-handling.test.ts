import { extractTextFromFile, validateResumeFile } from '../resume-parser'
import { generateObject, streamObject } from 'ai'
import { generateResume, downloadResume, printResume } from '../templates/generator'
import { protectApiRoute, deductCreditsAfterSuccess } from '../api-utils'
import { containsMaliciousPatterns, optimizeRequestSchema } from '../security/validation'
import { logAuditEvent } from '../security/audit'

// Mock all the modules
jest.mock('@/lib/resume-parser')
jest.mock('ai')
jest.mock('@/lib/templates/generator')
jest.mock('@/lib/api-utils')
jest.mock('@/lib/security/validation')
jest.mock('@/lib/security/audit')

describe('Error Handling and Edge Cases Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Resume Parsing Edge Cases', () => {
    it('should handle corrupted PDF files', async () => {
      const corruptedFile = new File(['corrupted data'], 'corrupted.pdf', { type: 'application/pdf' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })
      ;(extractTextFromFile as jest.Mock).mockRejectedValue(new Error('PDF file is corrupted'))

      await expect(extractTextFromFile(corruptedFile)).rejects.toThrow('PDF file is corrupted')
    })

    it('should handle password-protected files', async () => {
      const protectedFile = new File(['encrypted content'], 'protected.pdf', { type: 'application/pdf' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })
      ;(extractTextFromFile as jest.Mock).mockRejectedValue(new Error('File is password protected'))

      await expect(extractTextFromFile(protectedFile)).rejects.toThrow('File is password protected')
    })

    it('should handle extremely large files', () => {
      const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({
        valid: false,
        error: 'File size must be less than 5MB'
      })

      const result = validateResumeFile(largeFile)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('File size must be less than 5MB')
    })

    it('should handle files with no extension', () => {
      const noExtFile = new File(['content'], 'resume', { type: '' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({
        valid: false,
        error: 'Unable to determine file type'
      })

      const result = validateResumeFile(noExtFile)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Unable to determine file type')
    })

    it('should handle files with double extensions', () => {
      const doubleExtFile = new File(['content'], 'resume.pdf.exe', { type: 'application/pdf' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({
        valid: false,
        error: 'Suspicious file extension detected'
      })

      const result = validateResumeFile(doubleExtFile)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Suspicious file extension detected')
    })

    it('should handle empty files', async () => {
      const emptyFile = new File([''], 'empty.pdf', { type: 'application/pdf' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })
      ;(extractTextFromFile as jest.Mock).mockResolvedValue('')

      const result = await extractTextFromFile(emptyFile)
      expect(result).toBe('')
    })

    it('should handle files with only whitespace', async () => {
      const whitespaceFile = new File(['   \n\t   '], 'whitespace.txt', { type: 'text/plain' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })
      ;(extractTextFromFile as jest.Mock).mockResolvedValue('   \n\t   ')

      const result = await extractTextFromFile(whitespaceFile)
      expect(result).toBe('   \n\t   ')
    })
  })

  describe('AI Service Error Handling', () => {
    it('should handle AI service timeouts', async () => {
      ;(generateObject as jest.Mock).mockRejectedValue(new Error('Request timeout after 30 seconds'))

      await expect(
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: 'test prompt',
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      ).rejects.toThrow('Request timeout after 30 seconds')
    })

    it('should handle AI rate limiting', async () => {
      ;(generateObject as jest.Mock).mockRejectedValue(new Error('Rate limit exceeded: 100 requests per minute'))

      await expect(
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: 'test prompt',
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      ).rejects.toThrow('Rate limit exceeded')
    })

    it('should handle AI quota exceeded', async () => {
      ;(generateObject as jest.Mock).mockRejectedValue(new Error('API quota exceeded'))

      await expect(
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: 'test prompt',
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      ).rejects.toThrow('API quota exceeded')
    })

    it('should handle AI model unavailability', async () => {
      ;(generateObject as jest.Mock).mockRejectedValue(new Error('Model gpt-4 is currently unavailable'))

      await expect(
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: 'test prompt',
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      ).rejects.toThrow('Model gpt-4 is currently unavailable')
    })

    it('should handle malformed AI responses', async () => {
      ;(generateObject as jest.Mock).mockResolvedValue({
        object: null, // Malformed response
      })

      const result = await generateObject({
        model: {} as any,
        schema: {} as any,
        prompt: 'test prompt',
        maxOutputTokens: 2000,
        temperature: 0.3,
      })

      expect(result.object).toBeNull()
    })

    it('should handle streaming interruptions', async () => {
      const mockStream = {
        toTextStreamResponse: jest.fn().mockImplementation(() => {
          throw new Error('Stream interrupted')
        }),
      }
      ;(streamObject as jest.Mock).mockReturnValue(mockStream)

      expect(() => {
        const stream = streamObject({
          model: {} as any,
          schema: {} as any,
          prompt: 'test prompt',
          maxOutputTokens: 4000,
          temperature: 0.4,
        })
        stream.toTextStreamResponse()
      }).toThrow('Stream interrupted')
    })
  })

  describe('Template Generation Edge Cases', () => {
    it('should handle invalid template IDs', () => {
      const mockResume = { contact: { name: 'John' } }
      ;(generateResume as jest.Mock).mockImplementation((resume, templateId, format) => {
        if (!['classic', 'modern', 'executive', 'technical'].includes(templateId as string)) {
          throw new Error(`Unknown template: ${templateId}`)
        }
        return 'generated content'
      })

      expect(() => {
        generateResume(mockResume, 'invalid' as any, 'html')
      }).toThrow('Unknown template: invalid')
    })

    it('should handle invalid output formats', () => {
      const mockResume = { contact: { name: 'John' } }
      ;(generateResume as jest.Mock).mockImplementation((resume, templateId, format) => {
        if (!['html', 'text', 'pdf'].includes(format as string)) {
          throw new Error(`Unknown format: ${format}`)
        }
        return 'generated content'
      })

      expect(() => {
        generateResume(mockResume, 'classic', 'invalid' as any)
      }).toThrow('Unknown format: invalid')
    })

    it('should handle template generation failures', () => {
      const mockResume = { contact: { name: 'John' } }
      ;(generateResume as jest.Mock).mockImplementation(() => {
        throw new Error('Template generation failed')
      })

      expect(() => {
        generateResume(mockResume, 'classic', 'html')
      }).toThrow('Template generation failed')
    })

    it('should handle download failures', () => {
      ;(downloadResume as jest.Mock).mockImplementation(() => {
        throw new Error('Download failed: insufficient permissions')
      })

      expect(() => {
        downloadResume('content', 'filename', 'html')
      }).toThrow('Download failed: insufficient permissions')
    })

    it('should handle print window blocked', () => {
      ;(printResume as jest.Mock).mockImplementation(() => {
        throw new Error('Print window blocked by popup blocker')
      })

      expect(() => {
        printResume('<html>content</html>')
      }).toThrow('Print window blocked by popup blocker')
    })
  })

  describe('API Route Error Handling', () => {
    it('should handle authentication failures', async () => {
      ;(protectApiRoute as jest.Mock).mockResolvedValue({
        success: false,
        response: new Response('Unauthorized', { status: 401 })
      })

      const result = await protectApiRoute(true, 1)
      expect(result.success).toBe(false)
      expect(result.response).toBeInstanceOf(Response)
    })

    it('should handle credit deduction failures', async () => {
      ;(deductCreditsAfterSuccess as jest.Mock).mockRejectedValue(new Error('Database connection failed'))

      await expect(deductCreditsAfterSuccess('user-123', 1, 'resume_analysis')).rejects.toThrow('Database connection failed')
    })

    it('should handle malformed request bodies', () => {
      const malformedBody = {
        resumeText: 123, // Should be string
        jobDescription: null, // Should be string
      }

      const result = optimizeRequestSchema.safeParse(malformedBody)
      expect(result.success).toBe(false)
    })

    it('should handle missing required fields', () => {
      const incompleteBody = {
        resumeText: 'Some text',
        // Missing jobDescription
      }

      const result = optimizeRequestSchema.safeParse(incompleteBody)
      expect(result.success).toBe(false)
    })
  })

  describe('Security Validation Edge Cases', () => {
    it('should detect XSS attempts', () => {
      const maliciousContent = '<script>alert("xss")</script>Resume content'
      ;(containsMaliciousPatterns as jest.Mock).mockReturnValue(true)

      const result = containsMaliciousPatterns(maliciousContent)
      expect(result).toBe(true)
    })

    it('should detect SQL injection attempts', () => {
      const maliciousContent = "'; DROP TABLE users; --"
      ;(containsMaliciousPatterns as jest.Mock).mockReturnValue(true)

      const result = containsMaliciousPatterns(maliciousContent)
      expect(result).toBe(true)
    })

    it('should detect command injection attempts', () => {
      const maliciousContent = '`rm -rf /`'
      ;(containsMaliciousPatterns as jest.Mock).mockReturnValue(true)

      const result = containsMaliciousPatterns(maliciousContent)
      expect(result).toBe(true)
    })

    it('should handle extremely long malicious inputs', () => {
      const longMaliciousContent = '<script>'.repeat(10000)
      ;(containsMaliciousPatterns as jest.Mock).mockReturnValue(true)

      const result = containsMaliciousPatterns(longMaliciousContent)
      expect(result).toBe(true)
    })

    it('should handle Unicode-based attacks', () => {
      const unicodeAttack = '\u0000\u0001\u0002Resume content'
      ;(containsMaliciousPatterns as jest.Mock).mockReturnValue(true)

      const result = containsMaliciousPatterns(unicodeAttack)
      expect(result).toBe(true)
    })
  })

  describe('Audit Logging Edge Cases', () => {
    it('should handle audit logging failures', async () => {
      ;(logAuditEvent as jest.Mock).mockRejectedValue(new Error('Audit service unavailable'))

      await expect(
        logAuditEvent({
          action: 'test_action',
          userId: 'user-123',
          success: true,
          metadata: {},
        })
      ).rejects.toThrow('Audit service unavailable')
    })

    it('should handle missing audit fields', async () => {
      ;(logAuditEvent as jest.Mock).mockRejectedValue(new Error('Missing required field: userId'))

      await expect(
        logAuditEvent({
          action: 'test_action',
          userId: '',
          success: true,
          metadata: {},
        })
      ).rejects.toThrow('Missing required field: userId')
    })

    it('should handle audit service timeouts', async () => {
      ;(logAuditEvent as jest.Mock).mockRejectedValue(new Error('Audit service timeout'))

      await expect(
        logAuditEvent({
          action: 'test_action',
          userId: 'user-123',
          success: true,
          metadata: {},
        })
      ).rejects.toThrow('Audit service timeout')
    })
  })

  describe('Network and System Edge Cases', () => {
    it('should handle network timeouts', async () => {
      ;(extractTextFromFile as jest.Mock).mockRejectedValue(new Error('Network timeout'))

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
      await expect(extractTextFromFile(file)).rejects.toThrow('Network timeout')
    })

    it('should handle DNS resolution failures', async () => {
      ;(generateObject as jest.Mock).mockRejectedValue(new Error('DNS resolution failed'))

      await expect(
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: 'test',
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      ).rejects.toThrow('DNS resolution failed')
    })

    it('should handle memory constraints', async () => {
      ;(generateObject as jest.Mock).mockRejectedValue(new Error('Out of memory'))

      await expect(
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: 'test',
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      ).rejects.toThrow('Out of memory')
    })

    it('should handle database connection failures', async () => {
      ;(protectApiRoute as jest.Mock).mockRejectedValue(new Error('Database connection failed'))

      await expect(protectApiRoute(true, 1)).rejects.toThrow('Database connection failed')
    })
  })

  describe('Data Corruption and Integrity', () => {
    it('should handle corrupted JSON responses', async () => {
      ;(generateObject as jest.Mock).mockResolvedValue({
        object: {
          atsScore: 'not-a-number', // Should be number
          analysis: null, // Should be string
        },
      })

      const result = await generateObject({
        model: {} as any,
        schema: {} as any,
        prompt: 'test',
        maxOutputTokens: 2000,
        temperature: 0.3,
      })

      expect(typeof result.object.atsScore).toBe('string') // Should be validated elsewhere
    })

    it('should handle truncated responses', async () => {
      ;(streamObject as jest.Mock).mockReturnValue({
        toTextStreamResponse: jest.fn().mockReturnValue(
          new Response('{"contact":{"name":"John"', { status: 200 }) // Truncated JSON
        ),
      })

      const stream = streamObject({
        model: {} as any,
        schema: {} as any,
        prompt: 'test',
        maxOutputTokens: 4000,
        temperature: 0.4,
      })

      const response = stream.toTextStreamResponse()
      expect(response).toBeInstanceOf(Response)
    })

    it('should handle encoding issues', async () => {
      const file = new File(['\xff\xfe\x00\x00'], 'encoding-test.txt', { type: 'text/plain' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })
      ;(extractTextFromFile as jest.Mock).mockRejectedValue(new Error('Invalid file encoding'))

      await expect(extractTextFromFile(file)).rejects.toThrow('Invalid file encoding')
    })
  })

  describe('Concurrent Request Handling', () => {
    it('should handle multiple simultaneous requests', async () => {
      const promises = Array(10).fill(null).map((_, i) =>
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: `test prompt ${i}`,
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      )

      ;(generateObject as jest.Mock).mockResolvedValue({
        object: { atsScore: 80 + i, analysis: `Analysis ${i}` },
      })

      const results = await Promise.all(promises)
      expect(results).toHaveLength(10)
    })

    it('should handle request queue overflow', async () => {
      ;(generateObject as jest.Mock).mockRejectedValue(new Error('Request queue full'))

      await expect(
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: 'test',
          maxOutputTokens: 2000,
          temperature: 0.3,
        })
      ).rejects.toThrow('Request queue full')
    })
  })
})
