import { extractTextFromFile, validateResumeFile } from '../resume-parser'

describe('Resume Parser', () => {
  describe('validateResumeFile', () => {
    it('should accept valid PDF files', () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' })
      const result = validateResumeFile(file)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should accept valid DOCX files', () => {
      const file = new File(['content'], 'resume.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      const result = validateResumeFile(file)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should accept valid TXT files', () => {
      const file = new File(['content'], 'resume.txt', { type: 'text/plain' })
      const result = validateResumeFile(file)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject files that are too large', () => {
      const largeContent = 'x'.repeat(6 * 1024 * 1024) // 6MB
      const file = new File([largeContent], 'resume.pdf', { type: 'application/pdf' })
      const result = validateResumeFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('File size must be less than 5MB')
    })

    it('should reject unsupported file types', () => {
      const file = new File(['content'], 'resume.jpg', { type: 'image/jpeg' })
      const result = validateResumeFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Please upload a PDF, DOCX, or TXT file')
    })

    it('should accept files based on extension when type is missing', () => {
      const file = new File(['content'], 'resume.pdf', { type: '' })
      const result = validateResumeFile(file)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })

  describe('extractTextFromFile', () => {
    it('should extract text from PDF files', async () => {
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' })
      const result = await extractTextFromFile(file)
      expect(result).toBe('test text')
    })

    it('should extract text from DOCX files', async () => {
      const file = new File(['content'], 'resume.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      const result = await extractTextFromFile(file)
      expect(result).toBe('test docx content')
    })

    it('should extract text from TXT files', async () => {
      // Create a mock file with custom text content
      const file = new File(['plain text content'], 'resume.txt', { type: 'text/plain' })
      // Override the text method for this test
      file.text = jest.fn().mockResolvedValue('plain text content')
      
      const result = await extractTextFromFile(file)
      expect(result).toBe('plain text content')
    })

    it('should throw error for unsupported file types', async () => {
      const file = new File(['content'], 'resume.jpg', { type: 'image/jpeg' })
      await expect(extractTextFromFile(file)).rejects.toThrow('Unsupported file type: image/jpeg')
    })

    it('should handle PDF extraction errors gracefully', async () => {
      // Mock PDF.js to throw an error
      const pdfjsDist = require('pdfjs-dist')
      pdfjsDist.getDocument.mockImplementationOnce(() => ({
        promise: Promise.reject(new Error('PDF parsing failed'))
      }))

      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' })
      
      // Should fallback to worker-less parsing
      const result = await extractTextFromFile(file)
      expect(result).toBe('test text')
    })
  })
})
