import { generateResume, downloadResume, printResume, TemplateId, OutputFormat } from '../generator'
import { generateClassicHTML, generateClassicText } from '../classic'
import { generateModernHTML } from '../modern'
import { generateExecutiveHTML } from '../executive'
import { generateTechnicalHTML } from '../technical'
import type { OptimizedResume } from '@/lib/ai/schemas'

// Mock template generators
jest.mock('../classic', () => ({
  generateClassicHTML: jest.fn(),
  generateClassicText: jest.fn(),
}))

jest.mock('../modern', () => ({
  generateModernHTML: jest.fn(),
}))

jest.mock('../executive', () => ({
  generateExecutiveHTML: jest.fn(),
}))

jest.mock('../technical', () => ({
  generateTechnicalHTML: jest.fn(),
}))

// Mock DOM methods for download functionality
Object.defineProperty(window, 'open', {
  value: jest.fn(),
})

Object.defineProperty(URL, 'createObjectURL', {
  value: jest.fn(() => 'mock-url'),
})

Object.defineProperty(URL, 'revokeObjectURL', {
  value: jest.fn(),
})

describe('ATS Template Generation Tests', () => {
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
    // Mock document methods
    const mockCreateElement = jest.fn(() => ({
      href: '',
      download: '',
      click: jest.fn(),
    }))
    const mockAppendChild = jest.fn()
    const mockRemoveChild = jest.fn()
    
    Object.defineProperty(document, 'createElement', {
      value: mockCreateElement,
    })
    Object.defineProperty(document.body, 'appendChild', {
      value: mockAppendChild,
    })
    Object.defineProperty(document.body, 'removeChild', {
      value: mockRemoveChild,
    })
  })

  describe('Template Generation', () => {
    it('should generate classic HTML template', () => {
      const mockHTML = '<html><body>Classic Resume</body></html>'
      ;(generateClassicHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume(mockResume, 'classic', 'html')

      expect(generateClassicHTML).toHaveBeenCalledWith(mockResume)
      expect(result).toBe(mockHTML)
    })

    it('should generate modern HTML template', () => {
      const mockHTML = '<html><body>Modern Resume</body></html>'
      ;(generateModernHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume(mockResume, 'modern', 'html')

      expect(generateModernHTML).toHaveBeenCalledWith(mockResume)
      expect(result).toBe(mockHTML)
    })

    it('should generate executive HTML template', () => {
      const mockHTML = '<html><body>Executive Resume</body></html>'
      ;(generateExecutiveHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume(mockResume, 'executive', 'html')

      expect(generateExecutiveHTML).toHaveBeenCalledWith(mockResume)
      expect(result).toBe(mockHTML)
    })

    it('should generate technical HTML template', () => {
      const mockHTML = '<html><body>Technical Resume</body></html>'
      ;(generateTechnicalHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume(mockResume, 'technical', 'html')

      expect(generateTechnicalHTML).toHaveBeenCalledWith(mockResume)
      expect(result).toBe(mockHTML)
    })

    it('should default to classic template for unknown template ID', () => {
      const mockHTML = '<html><body>Classic Resume</body></html>'
      ;(generateClassicHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume(mockResume, 'unknown' as TemplateId, 'html')

      expect(generateClassicHTML).toHaveBeenCalledWith(mockResume)
      expect(result).toBe(mockHTML)
    })

    it('should generate text format for any template', () => {
      const mockText = 'JOHN DOE\n\nContact Information\n...'
      ;(generateClassicText as jest.Mock).mockReturnValue(mockText)

      const result = generateResume(mockResume, 'modern', 'text')

      expect(generateClassicText).toHaveBeenCalledWith(mockResume)
      expect(result).toBe(mockText)
    })

    it('should handle empty resume data', () => {
      const mockHTML = '<html><body>Empty Resume</body></html>'
      ;(generateClassicHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume({}, 'classic', 'html')

      expect(generateClassicHTML).toHaveBeenCalledWith({})
      expect(result).toBe(mockHTML)
    })

    it('should handle partial resume data', () => {
      const partialResume = {
        contact: {
          name: 'Jane Doe',
          email: 'jane@example.com',
        },
        summary: 'Brief summary',
      }
      const mockHTML = '<html><body>Partial Resume</body></html>'
      ;(generateClassicHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume(partialResume, 'classic', 'html')

      expect(generateClassicHTML).toHaveBeenCalledWith(partialResume)
      expect(result).toBe(mockHTML)
    })
  })

  describe('Download Functionality', () => {
    const mockContent = '<html><body>Test Resume Content</body></html>'
    const mockFileName = 'john-doe-resume'

    it('should download HTML file', () => {
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      }
      const mockCreateElement = jest.fn(() => mockLink)
      Object.defineProperty(document, 'createElement', {
        value: mockCreateElement,
      })

      downloadResume(mockContent, mockFileName, 'html')

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.any(Blob)
      )
      expect(mockLink.download).toBe(`${mockFileName}.html`)
      expect(mockLink.click).toHaveBeenCalled()
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink)
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink)
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url')
    })

    it('should download text file', () => {
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      }
      const mockCreateElement = jest.fn(() => mockLink)
      Object.defineProperty(document, 'createElement', {
        value: mockCreateElement,
      })

      downloadResume('Plain text content', mockFileName, 'text')

      expect(mockLink.download).toBe(`${mockFileName}.txt`)
      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.any(Blob)
      )
    })

    it('should download PDF (as HTML)', () => {
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      }
      const mockCreateElement = jest.fn(() => mockLink)
      Object.defineProperty(document, 'createElement', {
        value: mockCreateElement,
      })

      downloadResume(mockContent, mockFileName, 'pdf')

      expect(mockLink.download).toBe(`${mockFileName}.html`)
      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.any(Blob)
      )
    })

    it('should handle download errors gracefully', () => {
      // Mock URL.createObjectURL to throw an error
      ;(URL.createObjectURL as jest.Mock).mockImplementation(() => {
        throw new Error('Failed to create object URL')
      })

      expect(() => {
        downloadResume(mockContent, mockFileName, 'html')
      }).not.toThrow() // Should not throw, but handle gracefully
    })
  })

  describe('Print Functionality', () => {
    const mockHTML = '<html><body>Printable Resume</body></html>'

    beforeEach(() => {
      // Mock window.open
      const mockWindow = {
        document: {
          write: jest.fn(),
          close: jest.fn(),
        },
        print: jest.fn(),
        onload: null,
      }
      ;(window.open as jest.Mock).mockReturnValue(mockWindow)
    })

    it('should open print window with resume content', () => {
      printResume(mockHTML)

      expect(window.open).toHaveBeenCalledWith('', '_blank')
      const mockPrintWindow = (window.open as jest.Mock).mock.results[0].value
      expect(mockPrintWindow.document.write).toHaveBeenCalledWith(mockHTML)
      expect(mockPrintWindow.document.close).toHaveBeenCalled()
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

      printResume(mockHTML)

      // Simulate window load
      if (mockWindow.onload) {
        mockWindow.onload()
      }

      expect(mockWindow.print).toHaveBeenCalled()
    })

    it('should handle print window opening failure', () => {
      ;(window.open as jest.Mock).mockReturnValue(null)

      expect(() => {
        printResume(mockHTML)
      }).not.toThrow() // Should handle null window gracefully
    })
  })

  describe('Template Format Validation', () => {
    it('should validate template IDs', () => {
      const validTemplates: TemplateId[] = ['classic', 'modern', 'executive', 'technical']
      
      validTemplates.forEach(template => {
        expect(() => {
          generateResume(mockResume, template, 'html')
        }).not.toThrow()
      })
    })

    it('should validate output formats', () => {
      const validFormats: OutputFormat[] = ['html', 'text', 'pdf']
      
      validFormats.forEach(format => {
        expect(() => {
          generateResume(mockResume, 'classic', format)
        }).not.toThrow()
      })
    })
  })

  describe('Content Generation Edge Cases', () => {
    it('should handle resume with no contact information', () => {
      const resumeWithoutContact = {
        ...mockResume,
        contact: undefined,
      }
      const mockHTML = '<html><body>No Contact Resume</body></html>'
      ;(generateClassicHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume(resumeWithoutContact, 'classic', 'html')

      expect(generateClassicHTML).toHaveBeenCalledWith(resumeWithoutContact)
      expect(result).toBe(mockHTML)
    })

    it('should handle resume with no experience', () => {
      const resumeWithoutExperience = {
        ...mockResume,
        experience: [],
      }
      const mockHTML = '<html><body>No Experience Resume</body></html>'
      ;(generateClassicHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume(resumeWithoutExperience, 'classic', 'html')

      expect(generateClassicHTML).toHaveBeenCalledWith(resumeWithoutExperience)
      expect(result).toBe(mockHTML)
    })

    it('should handle resume with no education', () => {
      const resumeWithoutEducation = {
        ...mockResume,
        education: [],
      }
      const mockHTML = '<html><body>No Education Resume</body></html>'
      ;(generateClassicHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume(resumeWithoutEducation, 'classic', 'html')

      expect(generateClassicHTML).toHaveBeenCalledWith(resumeWithoutEducation)
      expect(result).toBe(mockHTML)
    })

    it('should handle resume with no skills', () => {
      const resumeWithoutSkills = {
        ...mockResume,
        skills: [],
      }
      const mockHTML = '<html><body>No Skills Resume</body></html>'
      ;(generateClassicHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume(resumeWithoutSkills, 'classic', 'html')

      expect(generateClassicHTML).toHaveBeenCalledWith(resumeWithoutSkills)
      expect(result).toBe(mockHTML)
    })

    it('should handle resume with special characters', () => {
      const resumeWithSpecialChars = {
        ...mockResume,
        contact: {
          ...mockResume.contact!,
          name: 'John O\'Connor-Jr.',
        },
        summary: 'Experienced in JavaScript & TypeScript, with knowledge of C++/C#.',
      }
      const mockHTML = '<html><body>Special Chars Resume</body></html>'
      ;(generateClassicHTML as jest.Mock).mockReturnValue(mockHTML)

      const result = generateResume(resumeWithSpecialChars, 'classic', 'html')

      expect(generateClassicHTML).toHaveBeenCalledWith(resumeWithSpecialChars)
      expect(result).toBe(mockHTML)
    })
  })

  describe('Performance Considerations', () => {
    it('should handle large resume content efficiently', () => {
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
      const mockHTML = '<html><body>Large Resume</body></html>'
      ;(generateClassicHTML as jest.Mock).mockReturnValue(mockHTML)

      const startTime = performance.now()
      const result = generateResume(largeResume, 'classic', 'html')
      const endTime = performance.now()

      expect(generateClassicHTML).toHaveBeenCalledWith(largeResume)
      expect(result).toBe(mockHTML)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
    })

    it('should handle multiple template generations', () => {
      const mockHTML = '<html><body>Resume</body></html>'
      ;(generateClassicHTML as jest.Mock).mockReturnValue(mockHTML)
      ;(generateModernHTML as jest.Mock).mockReturnValue(mockHTML)
      ;(generateExecutiveHTML as jest.Mock).mockReturnValue(mockHTML)
      ;(generateTechnicalHTML as jest.Mock).mockReturnValue(mockHTML)

      const templates: TemplateId[] = ['classic', 'modern', 'executive', 'technical']
      const formats: OutputFormat[] = ['html', 'text']

      templates.forEach(template => {
        formats.forEach(format => {
          expect(() => {
            generateResume(mockResume, template, format)
          }).not.toThrow()
        })
      })

      expect(generateClassicHTML).toHaveBeenCalledTimes(2) // html + text
      expect(generateModernHTML).toHaveBeenCalledTimes(1)
      expect(generateExecutiveHTML).toHaveBeenCalledTimes(1)
      expect(generateTechnicalHTML).toHaveBeenCalledTimes(1)
    })
  })
})
