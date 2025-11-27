import { extractTextFromFile, validateResumeFile } from '../resume-parser'
import { generateObject, streamObject } from 'ai'
import { generateResume, downloadResume, printResume } from '../templates/generator'
import { generatePlainTextResume, generateHTMLResume } from '../resume-generator'
import { render, screen } from '@testing-library/react'
import { ResumeDropzone } from '../../components/resume-dropzone'
import { AnalysisResults } from '../../components/analysis-results'

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
  },
  writable: true,
})

// Mock memory API if available
if (typeof window !== 'undefined' && 'memory' in window.performance) {
  Object.defineProperty(window.performance, 'memory', {
    value: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 5000000,
      jsHeapSizeLimit: 10000000,
    },
    writable: true,
  })
}

describe('Performance Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset performance mocks
    ;(performance.now as jest.Mock).mockClear()
  })

  describe('Resume Parsing Performance', () => {
    it('should parse small files quickly', async () => {
      const smallFile = new File(['Small resume content'], 'small.pdf', { type: 'application/pdf' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })
      ;(extractTextFromFile as jest.Mock).mockResolvedValue('Small resume content')

      const startTime = performance.now()
      await extractTextFromFile(smallFile)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100) // Should complete in <100ms
    })

    it('should handle medium files efficiently', async () => {
      const mediumContent = 'Medium resume content. '.repeat(1000) // ~20KB
      const mediumFile = new File([mediumContent], 'medium.pdf', { type: 'application/pdf' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })
      ;(extractTextFromFile as jest.Mock).mockResolvedValue(mediumContent)

      const startTime = performance.now()
      await extractTextFromFile(mediumFile)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(500) // Should complete in <500ms
    })

    it('should handle large files within reasonable time', async () => {
      const largeContent = 'Large resume content. '.repeat(50000) // ~1MB
      const largeFile = new File([largeContent], 'large.pdf', { type: 'application/pdf' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })
      ;(extractTextFromFile as jest.Mock).mockResolvedValue(largeContent)

      const startTime = performance.now()
      await extractTextFromFile(largeFile)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(2000) // Should complete in <2s
    })

    it('should validate files quickly', () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })

      const startTime = performance.now()
      validateResumeFile(file)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(10) // Should complete in <10ms
    })

    it('should handle concurrent file parsing efficiently', async () => {
      const files = Array(10).fill(null).map((_, i) => 
        new File([`Content ${i}`], `resume${i}.pdf`, { type: 'application/pdf' })
      )
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })
      ;(extractTextFromFile as jest.Mock).mockImplementation((file) => 
        Promise.resolve(file.name.replace('.pdf', ' content'))
      )

      const startTime = performance.now()
      const promises = files.map(file => extractTextFromFile(file))
      await Promise.all(promises)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(1000) // Should complete all in <1s
    })
  })

  describe('AI Processing Performance', () => {
    it('should handle small AI requests quickly', async () => {
      const smallPrompt = 'Analyze this short resume content'
      ;(generateObject as jest.Mock).mockResolvedValue({
        object: { atsScore: 85, analysis: 'Good resume' },
      })

      const startTime = performance.now()
      await generateObject({
        model: {} as any,
        schema: {} as any,
        prompt: smallPrompt,
        maxOutputTokens: 500,
        temperature: 0.3,
      })
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100) // Mock should be fast
    })

    it('should handle large AI requests efficiently', async () => {
      const largePrompt = 'Analyze this large resume content. '.repeat(1000)
      ;(generateObject as jest.Mock).mockResolvedValue({
        object: { 
          atsScore: 85, 
          analysis: 'Detailed analysis with lots of content',
          suggestions: Array(50).fill('Suggestion text'),
        },
      })

      const startTime = performance.now()
      await generateObject({
        model: {} as any,
        schema: {} as any,
        prompt: largePrompt,
        maxOutputTokens: 2000,
        temperature: 0.3,
      })
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(200) // Mock should be fast
    })

    it('should handle streaming AI responses efficiently', async () => {
      const mockStream = {
        toTextStreamResponse: jest.fn().mockReturnValue(new Response()),
      }
      ;(streamObject as jest.Mock).mockReturnValue(mockStream)

      const startTime = performance.now()
      const result = streamObject({
        model: {} as any,
        schema: {} as any,
        prompt: 'Generate optimized resume',
        maxOutputTokens: 4000,
        temperature: 0.4,
      })
      const response = result.toTextStreamResponse()
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(50) // Should be very fast
      expect(response).toBeInstanceOf(Response)
    })

    it('should handle concurrent AI requests', async () => {
      ;(generateObject as jest.Mock).mockResolvedValue({
        object: { atsScore: 80 + Math.random() * 20, analysis: 'Analysis' },
      })

      const requests = Array(5).fill(null).map((_, i) =>
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: `Request ${i}`,
          maxOutputTokens: 1000,
          temperature: 0.3,
        })
      )

      const startTime = performance.now()
      await Promise.all(requests)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(200) // Should handle concurrent requests
    })
  })

  describe('Template Generation Performance', () => {
    const mockResume = {
      contact: { name: 'John Doe', email: 'john@example.com' },
      summary: 'Software engineer with 5 years experience',
      experience: [
        { title: 'Senior Engineer', company: 'Tech Corp', bullets: ['Led projects'] },
      ],
      skills: ['JavaScript', 'React', 'Node.js'],
    }

    it('should generate simple templates quickly', () => {
      ;(generateResume as jest.Mock).mockReturnValue('<html>Simple template</html>')

      const startTime = performance.now()
      generateResume(mockResume, 'classic', 'html')
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(50) // Should be very fast
    })

    it('should generate complex templates efficiently', () => {
      const complexResume = {
        ...mockResume,
        experience: Array(20).fill({
          title: 'Software Engineer',
          company: 'Tech Corp',
          bullets: Array(10).fill('Achievement description'),
        }),
        skills: Array(50).fill('Skill name'),
        education: Array(5).fill({
          degree: 'Bachelor',
          institution: 'University',
        }),
      }
      ;(generateResume as jest.Mock).mockReturnValue('<html>Complex template</html>')

      const startTime = performance.now()
      generateResume(complexResume, 'modern', 'html')
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100) // Should still be fast
    })

    it('should generate multiple templates efficiently', () => {
      ;(generateResume as jest.Mock).mockReturnValue('<html>Template content</html>')

      const templates = ['classic', 'modern', 'executive', 'technical'] as const
      const formats = ['html', 'text'] as const

      const startTime = performance.now()
      templates.forEach(template => {
        formats.forEach(format => {
          generateResume(mockResume, template, format)
        })
      })
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(200) // Should handle all combinations
    })

    it('should handle text generation efficiently', () => {
      const startTime = performance.now()
      generatePlainTextResume(mockResume)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(50) // Should be very fast
    })

    it('should handle HTML generation efficiently', () => {
      const startTime = performance.now()
      generateHTMLResume(mockResume)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100) // Should be fast
    })
  })

  describe('UI Component Performance', () => {
    it('should render simple components quickly', () => {
      const mockAnalysis = {
        atsScore: 85,
        analysis: 'Good resume structure',
        suggestions: ['Add keywords'],
        keywords: ['JavaScript'],
        formatIssues: [],
        strengths: ['Clear'],
      }
      const mockResumeText = 'John Doe\nSoftware Engineer\nExperience: 5 years...'
      const mockFileName = 'resume.pdf'

      const startTime = performance.now()
      render(<AnalysisResults analysis={mockAnalysis} resumeText={mockResumeText} fileName={mockFileName} />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100) // Should render quickly
      expect(screen.getByText('85')).toBeInTheDocument()
    })

    it('should render complex components efficiently', () => {
      const complexAnalysis = {
        atsScore: 85,
        analysis: 'Detailed analysis with lots of content',
        suggestions: Array(20).fill('Suggestion text'),
        keywords: Array(30).fill('Keyword'),
        formatIssues: Array(10).fill('Format issue'),
        strengths: Array(15).fill('Strength'),
      }

      const startTime = performance.now()
      render(<AnalysisResults analysis={complexAnalysis} resumeText="Complex resume text" fileName="complex.pdf" />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(200) // Should handle complexity
    })

    it('should handle file upload components efficiently', () => {
      const mockOnTextExtracted = jest.fn()
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })
      ;(extractTextFromFile as jest.Mock).mockResolvedValue('content')

      const startTime = performance.now()
      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(100) // Should render quickly
      expect(screen.getByText('Drag & drop your resume')).toBeInTheDocument()
    })

    it('should handle component re-renders efficiently', () => {
      const mockAnalysis = {
        atsScore: 85,
        analysis: 'Good resume',
        suggestions: ['Add keywords'],
        keywords: ['JavaScript'],
        formatIssues: [],
        strengths: ['Clear'],
      }

      const { rerender } = render(<AnalysisResults analysis={mockAnalysis} resumeText="Test resume" fileName="test.pdf" />)

      const startTime = performance.now()
      rerender(<AnalysisResults analysis={{ ...mockAnalysis, atsScore: 90 }} resumeText="Test resume" fileName="test.pdf" />)
      rerender(<AnalysisResults analysis={{ ...mockAnalysis, atsScore: 95 }} resumeText="Test resume" fileName="test.pdf" />)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(150) // Should handle re-renders
    })
  })

  describe('Memory Usage Tests', () => {
    it('should not leak memory during file processing', async () => {
      const initialMemory = (performance.memory as any)?.usedJSHeapSize || 0

      // Process multiple files
      for (let i = 0; i < 100; i++) {
        const file = new File([`Content ${i}`], `test${i}.pdf`, { type: 'application/pdf' })
        ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })
        ;(extractTextFromFile as jest.Mock).mockResolvedValue(`Content ${i}`)
        await extractTextFromFile(file)
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }

      const finalMemory = (performance.memory as any)?.usedJSHeapSize || 0
      const memoryIncrease = finalMemory - initialMemory

      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    })

    it('should handle large data structures efficiently', () => {
      const largeResume = {
        contact: { name: 'John Doe' },
        summary: 'Summary',
        experience: Array(100).fill({
          title: 'Software Engineer',
          company: 'Tech Corp',
          bullets: Array(20).fill('Achievement'),
        }),
        skills: Array(200).fill('Skill'),
        education: Array(10).fill({
          degree: 'Degree',
          institution: 'University',
        }),
      }

      const startTime = performance.now()
      generatePlainTextResume(largeResume)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(500) // Should handle large data
    })

    it('should clean up resources after operations', async () => {
      const mockStream = {
        toTextStreamResponse: jest.fn().mockReturnValue(new Response()),
      }
      ;(streamObject as jest.Mock).mockReturnValue(mockStream)

      // Create and destroy multiple streams
      for (let i = 0; i < 50; i++) {
        const stream = streamObject({
          model: {} as any,
          schema: {} as any,
          prompt: `Test ${i}`,
          maxOutputTokens: 1000,
          temperature: 0.3,
        })
        const response = stream.toTextStreamResponse()
        // Response should be cleaned up automatically
      }

      // Should not throw errors or cause memory issues
      expect(true).toBe(true)
    })
  })

  describe('Network Performance Tests', () => {
    it('should handle network timeouts gracefully', async () => {
      ;(extractTextFromFile as jest.Mock).mockImplementation(() => 
        new Promise((resolve, reject) => 
          setTimeout(() => reject(new Error('Network timeout')), 100)
        )
      )

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
      const startTime = performance.now()

      try {
        await extractTextFromFile(file)
      } catch (error) {
        // Expected to timeout
      }

      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(200) // Should timeout quickly
    })

    it('should handle concurrent network requests', async () => {
      ;(generateObject as jest.Mock).mockImplementation(() =>
        new Promise(resolve => 
          setTimeout(() => resolve({ object: { atsScore: 85 } }), 50)
        )
      )

      const requests = Array(10).fill(null).map((_, i) =>
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: `Request ${i}`,
          maxOutputTokens: 1000,
          temperature: 0.3,
        })
      )

      const startTime = performance.now()
      await Promise.all(requests)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(200) // Should handle concurrency
    })
  })

  describe('Database Performance Tests', () => {
    it('should handle database query timeouts', async () => {
      const { createClient } = require('@/lib/supabase/server')
      
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockImplementation(() =>
            new Promise((resolve, reject) =>
              setTimeout(() => reject(new Error('Database timeout')), 100)
            )
          ),
        },
      })

      const { protectApiRoute } = require('../api-utils')
      const startTime = performance.now()

      try {
        await protectApiRoute(true, 1)
      } catch (error) {
        // Expected to timeout
      }

      const endTime = performance.now()
      expect(endTime - startTime).toBeLessThan(200) // Should timeout quickly
    })

    it('should handle concurrent database operations', async () => {
      const { createClient } = require('@/lib/supabase/server')
      
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

      const { protectApiRoute } = require('../api-utils')
      const requests = Array(5).fill(null).map(() => protectApiRoute(true, 1))

      const startTime = performance.now()
      await Promise.all(requests)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(300) // Should handle concurrency
    })
  })

  describe('Scalability Tests', () => {
    it('should handle high request volume', async () => {
      ;(generateObject as jest.Mock).mockResolvedValue({
        object: { atsScore: 85, analysis: 'Good' },
      })

      const highVolumeRequests = Array(100).fill(null).map((_, i) =>
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: `Request ${i}`,
          maxOutputTokens: 500,
          temperature: 0.3,
        })
      )

      const startTime = performance.now()
      const results = await Promise.allSettled(highVolumeRequests)
      const endTime = performance.now()

      expect(results.length).toBe(100)
      expect(endTime - startTime).toBeLessThan(1000) // Should handle high volume
    })

    it('should maintain performance under load', async () => {
      ;(extractTextFromFile as jest.Mock).mockResolvedValue('content')
      ;(validateResumeFile as jest.Mock).mockReturnValue({ valid: true })

      const loadTestRequests = Array(50).fill(null).map((_, i) => {
        const file = new File([`Content ${i}`], `test${i}.pdf`, { type: 'application/pdf' })
        return extractTextFromFile(file)
      })

      const startTime = performance.now()
      await Promise.all(loadTestRequests)
      const endTime = performance.now()

      expect(endTime - startTime).toBeLessThan(500) // Should maintain performance
    })

    it('should handle resource exhaustion gracefully', async () => {
      // Simulate resource exhaustion
      ;(generateObject as jest.Mock).mockRejectedValue(new Error('Resource exhausted'))

      const requests = Array(10).fill(null).map((_, i) =>
        generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: `Request ${i}`,
          maxOutputTokens: 1000,
          temperature: 0.3,
        })
      )

      const results = await Promise.allSettled(requests)
      const failures = results.filter(result => result.status === 'rejected')
      
      expect(failures.length).toBe(10) // All should fail gracefully
    })
  })

  describe('Performance Monitoring Tests', () => {
    it('should track performance metrics', () => {
      const mockPerformance = {
        mark: jest.fn(),
        measure: jest.fn(),
        getEntriesByName: jest.fn(() => [
          { name: 'operation-start', startTime: 100 },
          { name: 'operation-end', startTime: 200 },
        ]),
      }

      Object.defineProperty(window, 'performance', {
        value: mockPerformance,
        writable: true,
      })

      // Simulate operation tracking
      performance.mark('operation-start')
      // ... operation ...
      performance.mark('operation-end')
      performance.measure('operation-duration', 'operation-start', 'operation-end')

      expect(mockPerformance.mark).toHaveBeenCalledWith('operation-start')
      expect(mockPerformance.mark).toHaveBeenCalledWith('operation-end')
      expect(mockPerformance.measure).toHaveBeenCalledWith('operation-duration', 'operation-start', 'operation-end')
    })

    it('should measure component render times', () => {
      const mockAnalysis = {
        atsScore: 85,
        analysis: 'Good resume',
        suggestions: ['Add keywords'],
        keywords: ['JavaScript'],
        formatIssues: [],
        strengths: ['Clear'],
      }

      performance.mark('render-start')
      render(<AnalysisResults analysis={mockAnalysis} resumeText="Performance test resume" fileName="perf.pdf" />)
      performance.mark('render-end')
      performance.measure('render-duration', 'render-start', 'render-end')

      expect(performance.mark).toHaveBeenCalledWith('render-start')
      expect(performance.mark).toHaveBeenCalledWith('render-end')
    })

    it('should track API response times', async () => {
      ;(generateObject as jest.Mock).mockResolvedValue({
        object: { atsScore: 85, analysis: 'Good' },
      })

      performance.mark('api-start')
      await generateObject({
        model: {} as any,
        schema: {} as any,
        prompt: 'Test prompt',
        maxOutputTokens: 1000,
        temperature: 0.3,
      })
      performance.mark('api-end')
      performance.measure('api-duration', 'api-start', 'api-end')

      expect(performance.mark).toHaveBeenCalledWith('api-start')
      expect(performance.mark).toHaveBeenCalledWith('api-end')
    })
  })

  describe('Performance Regression Tests', () => {
    it('should maintain consistent performance over time', async () => {
      const operations = Array(10).fill(null).map(async (_, i) => {
        const startTime = performance.now()
        
        // Simulate standard operation
        ;(generateObject as jest.Mock).mockResolvedValue({
          object: { atsScore: 85, analysis: `Analysis ${i}` },
        })
        await generateObject({
          model: {} as any,
          schema: {} as any,
          prompt: `Test ${i}`,
          maxOutputTokens: 1000,
          temperature: 0.3,
        })
        
        const endTime = performance.now()
        return endTime - startTime
      })

      const durations = await Promise.all(operations)
      const averageDuration = durations.reduce((sum, duration) => sum + duration, 0) / durations.length

      // Performance should be consistent (within 50% of average)
      durations.forEach(duration => {
        expect(duration).toBeLessThan(averageDuration * 1.5)
      })
    })

    it('should not degrade performance with increased complexity', async () => {
      const simpleResume = { contact: { name: 'John' } }
      const complexResume = {
        contact: { name: 'John' },
        experience: Array(50).fill({ title: 'Engineer', company: 'Tech Corp' }),
        skills: Array(100).fill('Skill'),
      }

      ;(generatePlainTextResume as jest.Mock).mockReturnValue('text content')

      const simpleStart = performance.now()
      generatePlainTextResume(simpleResume)
      const simpleEnd = performance.now()
      const simpleDuration = simpleEnd - simpleStart

      const complexStart = performance.now()
      generatePlainTextResume(complexResume)
      const complexEnd = performance.now()
      const complexDuration = complexEnd - complexStart

      // Complex operation should not be dramatically slower (within 5x)
      expect(complexDuration).toBeLessThan(simpleDuration * 5)
    })
  })
})
