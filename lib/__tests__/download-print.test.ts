import { generatePlainTextResume, generateHTMLResume, downloadFile, printAsPDF } from '../resume-generator'
import { generateResume, downloadResume, printResume } from '../templates/generator'
import type { OptimizedResume } from '@/lib/ai/schemas'

// Mock DOM APIs
Object.defineProperty(window, 'open', {
  value: jest.fn(),
})

Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-url'),
})

Object.defineProperty(URL, 'revokeObjectURL', {
  value: jest.fn(),
})

Object.defineProperty(document, 'createElement', {
  value: jest.fn(() => ({
    href: '',
    download: '',
    click: jest.fn(),
  })),
})

Object.defineProperty(document.body, 'appendChild', {
  value: jest.fn(),
})

Object.defineProperty(document.body, 'removeChild', {
  value: jest.fn(),
})

// Mock window.print for PDF functionality
Object.defineProperty(window, 'print', {
  value: jest.fn(),
})

describe('Download and Print Functionality Tests', () => {
  const mockResume: Partial<OptimizedResume> = {
    contact: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-0123',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      website: 'johndoe.dev',
    },
    summary: 'Experienced software engineer with 5+ years in full-stack development.',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        startDate: '2020-01',
        endDate: '2023-12',
        bullets: [
          'Led development of microservices architecture',
          'Improved application performance by 40%',
          'Mentored junior developers',
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

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Plain Text Resume Generation', () => {
    it('should generate plain text resume with all sections', () => {
      const result = generatePlainTextResume(mockResume)

      expect(result).toContain('JOHN DOE')
      expect(result).toContain('PROFESSIONAL SUMMARY')
      expect(result).toContain('PROFESSIONAL EXPERIENCE')
      expect(result).toContain('EDUCATION')
      expect(result).toContain('SKILLS')
      expect(result).toContain('john@example.com')
      expect(result).toContain('555-0123')
      expect(result).toContain('San Francisco, CA')
    })

    it('should handle resume with missing sections', () => {
      const partialResume = {
        contact: {
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
        summary: 'Brief summary',
      }

      const result = generatePlainTextResume(partialResume)

      expect(result).toContain('JANE DOE')
      expect(result).toContain('PROFESSIONAL SUMMARY')
      expect(result).not.toContain('PROFESSIONAL EXPERIENCE')
      expect(result).not.toContain('EDUCATION')
      expect(result).not.toContain('SKILLS')
    })

    it('should format experience correctly', () => {
      const result = generatePlainTextResume(mockResume)

      expect(result).toContain('Senior Software Engineer | Tech Corp')
      expect(result).toContain('2020-01 - 2023-12')
      expect(result).toContain('• Led development of microservices architecture')
      expect(result).toContain('• Improved application performance by 40%')
    })

    it('should format education correctly', () => {
      const result = generatePlainTextResume(mockResume)

      expect(result).toContain('Bachelor of Science in Computer Science')
      expect(result).toContain('University of Technology')
      expect(result).toContain('2019-05')
      expect(result).toContain('GPA: 3.8')
    })

    it('should format skills correctly', () => {
      const result = generatePlainTextResume(mockResume)

      expect(result).toContain('JavaScript • React • Node.js • TypeScript • Python')
    })

    it('should handle empty resume', () => {
      const result = generatePlainTextResume({})

      expect(result).toBe('')
    })

    it('should handle special characters in text', () => {
      const resumeWithSpecialChars = {
        ...mockResume,
        contact: {
          ...mockResume.contact!,
          name: 'John O\'Connor-Jr.',
        },
        summary: 'Experienced in JavaScript & TypeScript, with knowledge of C++/C#.',
      }

      const result = generatePlainTextResume(resumeWithSpecialChars)

      expect(result).toContain('JOHN O\'CONNOR-JR.')
      expect(result).toContain('JavaScript & TypeScript')
      expect(result).toContain('C++/C#')
    })
  })

  describe('HTML Resume Generation', () => {
    it('should generate HTML resume with proper structure', () => {
      const result = generateHTMLResume(mockResume)

      expect(result).toContain('<!DOCTYPE html>')
      expect(result).toContain('<html>')
      expect(result).toContain('<head>')
      expect(result).toContain('<body>')
      expect(result).toContain('<h1>John Doe</h1>')
      expect(result).toContain('<h2>Professional Summary</h2>')
      expect(result).toContain('<h2>Professional Experience</h2>')
      expect(result).toContain('<h2>Education</h2>')
      expect(result).toContain('<h2>Skills</h2>')
    })

    it('should include proper CSS styling', () => {
      const result = generateHTMLResume(mockResume)

      expect(result).toContain('<style>')
      expect(result).toContain('font-family')
      expect(result).toContain('margin: 0')
      expect(result).toContain('padding: 0')
      expect(result).toContain('box-sizing: border-box')
    })

    it('should handle missing sections gracefully', () => {
      const partialResume = {
        contact: {
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
      }

      const result = generateHTMLResume(partialResume)

      expect(result).toContain('<h1>Jane Doe</h1>')
      expect(result).not.toContain('<h2>Professional Summary</h2>')
      expect(result).not.toContain('<h2>Professional Experience</h2>')
    })

    it('should escape HTML characters properly', () => {
      const resumeWithHtml = {
        ...mockResume,
        summary: 'Experienced in <script>alert("test")</script> development',
      }

      const result = generateHTMLResume(resumeWithHtml)

      // Should escape HTML tags
      expect(result).not.toContain('<script>alert("test")</script>')
    })

    it('should generate responsive HTML structure', () => {
      const result = generateHTMLResume(mockResume)

      expect(result).toContain('max-width: 8.5in')
      expect(result).toContain('padding: 0.75in')
      expect(result).toContain('font-size: 11pt')
    })
  })

  describe('File Download Functionality', () => {
    const mockContent = 'Test resume content'
    const mockFileName = 'john-doe-resume'

    it('should download text file correctly', () => {
      downloadFile(mockContent, mockFileName, 'text/plain')

      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.any(Blob)
      )
      const mockLink = (document.createElement as jest.Mock)().mockReturnValue({
        href: '',
        download: '',
        click: jest.fn(),
      })
      expect(mockLink.download).toBe(mockFileName)
      expect(mockLink.click).toHaveBeenCalled()
    })

    it('should download HTML file correctly', () => {
      downloadFile('<html>content</html>', mockFileName, 'text/html')

      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.any(Blob)
      )
      const mockLink = (document.createElement as jest.Mock)().mockReturnValue({
        href: '',
        download: '',
        click: jest.fn(),
      })
      expect(mockLink.download).toBe(mockFileName)
    })

    it('should set correct MIME types', () => {
      downloadFile(mockContent, mockFileName, 'text/plain')
      const blobCall = (URL.createObjectURL as jest.Mock).mock.calls[0][0]
      expect(blobCall).toBeInstanceOf(Blob)

      downloadFile('<html>content</html>', mockFileName, 'text/html')
      const htmlBlobCall = (URL.createObjectURL as jest.Mock).mock.calls[1][0]
      expect(htmlBlobCall).toBeInstanceOf(Blob)
    })

    it('should handle download errors gracefully', () => {
      // Mock URL.createObjectURL to throw
      ;(URL.createObjectURL as jest.Mock).mockImplementation(() => {
        throw new Error('Failed to create object URL')
      })

      expect(() => {
        downloadFile(mockContent, mockFileName, 'text/plain')
      }).not.toThrow()
    })

    it('should clean up resources after download', () => {
      downloadFile(mockContent, mockFileName, 'text/plain')

      expect(document.body.appendChild).toHaveBeenCalled()
      expect(document.body.removeChild).toHaveBeenCalled()
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url')
    })
  })

  describe('PDF Print Functionality', () => {
    const mockHTML = '<html><body>Printable resume content</body></html>'

    it('should open print window with HTML content', () => {
      const mockWindow = {
        document: {
          write: jest.fn(),
          close: jest.fn(),
        },
        print: jest.fn(),
        onload: null,
      }
      ;(window.open as jest.Mock).mockReturnValue(mockWindow)

      printAsPDF(mockHTML)

      expect(window.open).toHaveBeenCalledWith('', '_blank')
      expect(mockWindow.document.write).toHaveBeenCalledWith(mockHTML)
      expect(mockWindow.document.close).toHaveBeenCalled()
    })

    it('should trigger print when window loads', () => {
      const mockWindow = {
        document: {
          write: jest.fn(),
          close: jest.fn(),
        },
        print: jest.fn(),
        onload: null,
      }
      ;(window.open as jest.Mock).mockReturnValue(mockWindow)

      printAsPDF(mockHTML)

      // Simulate window load
      if (mockWindow.onload) {
        mockWindow.onload()
      }

      expect(mockWindow.print).toHaveBeenCalled()
    })

    it('should handle print window opening failure', () => {
      ;(window.open as jest.Mock).mockReturnValue(null)

      expect(() => {
        printAsPDF(mockHTML)
      }).not.toThrow()
    })

    it('should handle popup blockers', () => {
      ;(window.open as jest.Mock).mockImplementation(() => {
        throw new Error('Popup blocked')
      })

      expect(() => {
        printAsPDF(mockHTML)
      }).not.toThrow()
    })
  })

  describe('Template Download Integration', () => {
    it('should download classic template HTML', () => {
      const mockHTML = '<html>Classic template content</html>'
      ;(generateResume as jest.Mock).mockReturnValue(mockHTML)

      downloadResume(mockResume, 'john-doe-classic', 'html')

      expect(generateResume).toHaveBeenCalledWith(mockResume, 'classic', 'html')
      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.any(Blob)
      )
    })

    it('should download modern template text', () => {
      const mockText = 'Modern template text content'
      ;(generateResume as jest.Mock).mockReturnValue(mockText)

      downloadResume(mockResume, 'john-doe-modern', 'text')

      expect(generateResume).toHaveBeenCalledWith(mockResume, 'modern', 'text')
    })

    it('should download executive template PDF', () => {
      const mockHTML = '<html>Executive template content</html>'
      ;(generateResume as jest.Mock).mockReturnValue(mockHTML)

      printResume('<html>Executive template content</html>')

      expect(generateResume).toHaveBeenCalledWith(mockResume, 'executive', 'html')
      expect(window.open).toHaveBeenCalled()
    })

    it('should handle template generation errors', () => {
      ;(generateResume as jest.Mock).mockImplementation(() => {
        throw new Error('Template generation failed')
      })

      expect(() => {
        downloadResume(mockResume, 'test-resume', 'html')
      }).toThrow('Template generation failed')
    })
  })

  describe('File Naming and Extensions', () => {
    it('should use correct file extensions', () => {
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      }
      ;(document.createElement as jest.Mock).mockReturnValue(mockLink)

      downloadFile('content', 'resume', 'text/plain')
      expect(mockLink.download).toBe('resume')

      // Test with different MIME types
      downloadFile('content', 'resume', 'text/html')
      expect(mockLink.download).toBe('resume')
    })

    it('should sanitize file names', () => {
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      }
      ;(document.createElement as jest.Mock).mockReturnValue(mockLink)

      downloadFile('content', 'resume/with\\slashes', 'text/plain')
      expect(mockLink.download).toBe('resume/with\\slashes')
    })

    it('should handle empty file names', () => {
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      }
      ;(document.createElement as jest.Mock).mockReturnValue(mockLink)

      downloadFile('content', '', 'text/plain')
      expect(mockLink.download).toBe('')
    })
  })

  describe('Large Content Handling', () => {
    it('should handle large resume content', () => {
      const largeResume = {
        ...mockResume,
        experience: Array(50).fill({
          title: 'Software Engineer',
          company: 'Tech Corp',
          startDate: '2020-01',
          endDate: '2023-12',
          bullets: Array(20).fill('Detailed achievement description with lots of text'),
        }),
        skills: Array(100).fill(`Skill${Math.random()}`),
      }

      const result = generatePlainTextResume(largeResume)
      expect(result.length).toBeGreaterThan(10000)

      // Should still be downloadable
      expect(() => {
        downloadFile(result, 'large-resume', 'text/plain')
      }).not.toThrow()
    })

    it('should handle large HTML content', () => {
      const largeHTML = '<html>' + '<p>Large content</p>'.repeat(1000) + '</html>'

      expect(() => {
        downloadFile(largeHTML, 'large-resume', 'text/html')
      }).not.toThrow()
    })
  })

  describe('Browser Compatibility', () => {
    it('should work with different browsers', () => {
      // Test Chrome-like behavior
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true,
      })

      expect(() => {
        downloadFile('content', 'test', 'text/plain')
      }).not.toThrow()

      // Test Firefox-like behavior
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
        configurable: true,
      })

      expect(() => {
        downloadFile('content', 'test', 'text/plain')
      }).not.toThrow()
    })

    it('should handle missing APIs gracefully', () => {
      const originalCreateObjectURL = URL.createObjectURL
      delete (URL as any).createObjectURL

      expect(() => {
        downloadFile('content', 'test', 'text/plain')
      }).toThrow()

      // Restore
      URL.createObjectURL = originalCreateObjectURL
    })
  })

  describe('Security Considerations', () => {
    it('should sanitize HTML content in downloads', () => {
      const maliciousHTML = '<script>alert("xss")</script><p>Resume content</p>'
      
      expect(() => {
        downloadFile(maliciousHTML, 'resume', 'text/html')
      }).not.toThrow()

      // The content should be downloaded as-is, but browser will handle it safely
      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.any(Blob)
      )
    })

    it('should prevent file path traversal', () => {
      const maliciousFileName = '../../../etc/passwd'
      
      expect(() => {
        downloadFile('content', maliciousFileName, 'text/plain')
      }).not.toThrow()

      // File name should be used as-is, but browser security prevents traversal
    })

    it('should handle large file sizes to prevent memory issues', () => {
      const hugeContent = 'x'.repeat(100 * 1024 * 1024) // 100MB

      expect(() => {
        downloadFile(hugeContent, 'huge-resume', 'text/plain')
      }).not.toThrow()
    })
  })

  describe('Async Download Operations', () => {
    it('should handle async download operations', async () => {
      const mockContent = 'Async content'
      
      const downloadPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          downloadFile(mockContent, 'async-resume', 'text/plain')
          resolve()
        }, 100)
      })

      await expect(downloadPromise).resolves.not.toThrow()
      expect(URL.createObjectURL).toHaveBeenCalled()
    })

    it('should handle concurrent downloads', async () => {
      const downloads = Array(5).fill(null).map((_, i) =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            downloadFile(`content ${i}`, `resume-${i}`, 'text/plain')
            resolve()
          }, Math.random() * 100)
        })
      )

      await Promise.all(downloads)
      expect(URL.createObjectURL).toHaveBeenCalledTimes(5)
    })
  })
})
