import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResumeDropzone } from '../resume-dropzone'

// Mock the resume parser functions
jest.mock('@/lib/resume-parser', () => ({
  validateResumeFile: jest.fn(),
  extractTextFromFile: jest.fn(),
}))

describe('ResumeDropzone Component', () => {
  const mockOnTextExtracted = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock URL.createObjectURL and URL.revokeObjectURL for file handling
    global.URL.createObjectURL = jest.fn(() => 'mock-url')
    global.URL.revokeObjectURL = jest.fn()
  })

  describe('File Upload Workflow', () => {
    it('should render dropzone with correct elements', () => {
      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      expect(screen.getByText('Drag & drop your resume')).toBeInTheDocument()
      expect(screen.getByText('or click to browse (PDF, DOCX, TXT)')).toBeInTheDocument()
      expect(screen.getByText('Max file size: 5MB')).toBeInTheDocument()
    })

    it('should accept valid PDF file', async () => {
      const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ valid: true })
      extractTextFromFile.mockResolvedValue('Sample resume text content')

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(validateResumeFile).toHaveBeenCalledWith(file)
        expect(extractTextFromFile).toHaveBeenCalledWith(file)
        expect(mockOnTextExtracted).toHaveBeenCalledWith('Sample resume text content', 'resume.pdf')
      })
    })

    it('should accept valid DOCX file', async () => {
      const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ valid: true })
      extractTextFromFile.mockResolvedValue('DOCX resume content')

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['docx content'], 'resume.docx', { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(mockOnTextExtracted).toHaveBeenCalledWith('DOCX resume content', 'resume.docx')
      })
    })

    it('should accept valid TXT file', async () => {
      const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ valid: true })
      extractTextFromFile.mockResolvedValue('Plain text resume')

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['plain text'], 'resume.txt', { type: 'text/plain' })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(mockOnTextExtracted).toHaveBeenCalledWith('Plain text resume', 'resume.txt')
      })
    })

    it('should reject invalid file types', async () => {
      const { validateResumeFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ 
        valid: false, 
        error: 'Please upload a PDF, DOCX, or TXT file' 
      })

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['image content'], 'resume.jpg', { type: 'image/jpeg' })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('Please upload a PDF, DOCX, or TXT file')).toBeInTheDocument()
        expect(mockOnTextExtracted).not.toHaveBeenCalled()
      })
    })

    it('should handle file parsing errors gracefully', async () => {
      const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ valid: true })
      extractTextFromFile.mockRejectedValue(new Error('Failed to parse file'))

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('Failed to parse file')).toBeInTheDocument()
        expect(mockOnTextExtracted).not.toHaveBeenCalled()
      })
    })

    it('should reject files with insufficient text content', async () => {
      const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ valid: true })
      extractTextFromFile.mockResolvedValue('Short text') // Less than 50 characters

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('Could not extract enough text from the file. Please try a different format.')).toBeInTheDocument()
        expect(mockOnTextExtracted).not.toHaveBeenCalled()
      })
    })
  })

  describe('Drag and Drop Functionality', () => {
    it('should show drag active state', async () => {
      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const dropzone = screen.getByRole('button')
      
      fireEvent.dragEnter(dropzone)
      expect(screen.getByText('Drop your resume here')).toBeInTheDocument()
      
      fireEvent.dragLeave(dropzone)
      expect(screen.getByText('Drag & drop your resume')).toBeInTheDocument()
    })

    it('should handle dropped files', async () => {
      const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ valid: true })
      extractTextFromFile.mockResolvedValue('Dropped file content')

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' })
      const dropzone = screen.getByRole('button')
      
      fireEvent.drop(dropzone, {
        dataTransfer: {
          files: [file],
        },
      })

      await waitFor(() => {
        expect(mockOnTextExtracted).toHaveBeenCalledWith('Dropped file content', 'resume.pdf')
      })
    })
  })

  describe('Loading States', () => {
    it('should show loading state during file processing', async () => {
      const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ valid: true })
      extractTextFromFile.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('content'), 100)))

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(input, file)

      // Should show loading state
      expect(screen.getByText('Processing...')).toBeInTheDocument()
      
      // Wait for processing to complete
      await waitFor(() => {
        expect(screen.getByText('Ready for analysis')).toBeInTheDocument()
      })
    })

    it('should disable dropzone during processing', async () => {
      const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ valid: true })
      extractTextFromFile.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve('content'), 100)))

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(input, file)

      const dropzone = screen.getByRole('button')
      expect(dropzone).toHaveClass('pointer-events-none', 'opacity-50')
    })

    it('should respect external processing state', () => {
      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} isProcessing={true} />)
      
      const dropzone = screen.getByRole('button')
      expect(dropzone).toHaveClass('pointer-events-none', 'opacity-50')
    })
  })

  describe('File Management', () => {
    it('should display uploaded file information', async () => {
      const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ valid: true })
      extractTextFromFile.mockResolvedValue('content')

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['content'], 'my-resume.pdf', { type: 'application/pdf' })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('my-resume.pdf')).toBeInTheDocument()
        expect(screen.getByText('Ready for analysis')).toBeInTheDocument()
      })
    })

    it('should allow file removal', async () => {
      const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ valid: true })
      extractTextFromFile.mockResolvedValue('content')

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['content'], 'resume.pdf', { type: 'application/pdf' })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('resume.pdf')).toBeInTheDocument()
      })

      const removeButton = screen.getByRole('button', { name: /remove file/i })
      await userEvent.click(removeButton)

      // Should return to initial state
      expect(screen.getByText('Drag & drop your resume')).toBeInTheDocument()
      expect(screen.queryByText('resume.pdf')).not.toBeInTheDocument()
    })

    it('should clear error when file is removed', async () => {
      const { validateResumeFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ 
        valid: false, 
        error: 'Invalid file type' 
      })

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file = new File(['content'], 'invalid.jpg', { type: 'image/jpeg' })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      await userEvent.upload(input, file)

      await waitFor(() => {
        expect(screen.getByText('Invalid file type')).toBeInTheDocument()
      })

      // Error should be cleared automatically when validation fails
      expect(screen.queryByText('Invalid file type')).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple files (should only process first)', async () => {
      const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
      validateResumeFile.mockReturnValue({ valid: true })
      extractTextFromFile.mockResolvedValue('first file content')

      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const file1 = new File(['content1'], 'resume1.pdf', { type: 'application/pdf' })
      const file2 = new File(['content2'], 'resume2.pdf', { type: 'application/pdf' })
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      // Simulate multiple file selection
      Object.defineProperty(input, 'files', {
        value: [file1, file2],
        writable: false,
      })

      fireEvent.change(input)

      await waitFor(() => {
        expect(mockOnTextExtracted).toHaveBeenCalledTimes(1)
        expect(mockOnTextExtracted).toHaveBeenCalledWith('first file content', 'resume1.pdf')
      })
    })

    it('should handle empty file selection', async () => {
      render(<ResumeDropzone onTextExtracted={mockOnTextExtracted} />)
      
      const input = screen.getByRole('button').querySelector('input[type="file"]') as HTMLInputElement
      
      // Simulate empty file selection
      Object.defineProperty(input, 'files', {
        value: [],
        writable: false,
      })

      fireEvent.change(input)

      // Should remain in initial state
      expect(screen.getByText('Drag & drop your resume')).toBeInTheDocument()
      expect(mockOnTextExtracted).not.toHaveBeenCalled()
    })
  })
})
