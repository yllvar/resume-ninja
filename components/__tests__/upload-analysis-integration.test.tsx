import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResumeDropzone } from '../resume-dropzone'
import { useResumeAnalysis } from '@/hooks/use-resume-analysis'

// Mock the resume analysis hook
jest.mock('@/hooks/use-resume-analysis', () => ({
  useResumeAnalysis: jest.fn(),
}))

// Mock the resume parser functions
jest.mock('@/lib/resume-parser', () => ({
  validateResumeFile: jest.fn(),
  extractTextFromFile: jest.fn(),
}))

describe('Resume Upload to Analysis Integration', () => {
  const mockAnalyze = jest.fn()
  const mockReset = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Mock URL.createObjectURL and URL.revokeObjectURL for file handling
    global.URL.createObjectURL = jest.fn(() => 'mock-url')
    global.URL.revokeObjectURL = jest.fn()
    
    // Default hook implementation
    ;(useResumeAnalysis as jest.Mock).mockReturnValue({
      status: 'idle',
      progress: 0,
      analysis: null,
      error: null,
      resumeText: null,
      analyze: mockAnalyze,
      reset: mockReset,
    })
  })

  it('should complete full upload-to-analysis workflow', async () => {
    const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
    
    // Mock file validation to pass
    validateResumeFile.mockReturnValue({ valid: true })
    
    // Mock text extraction to return resume content
    extractTextFromFile.mockResolvedValue('John Doe\nSoftware Engineer\nExperience: 5 years...')
    
    // Mock analysis to succeed
    mockAnalyze.mockImplementation(() => {
      // Simulate successful analysis
      setTimeout(() => {
        ;(useResumeAnalysis as jest.Mock).mockReturnValue({
          status: 'complete',
          progress: 100,
          analysis: {
            atsScore: 85,
            atsBreakdown: { formatting: 90, keywords: 80, structure: 85, content: 85 },
            issues: [],
            strengths: ['Good experience', 'Clear structure'],
            improvements: ['Add more keywords', 'Improve formatting'],
            skills: ['JavaScript', 'React', 'Node.js'],
            detectedKeywords: ['software', 'engineer', 'javascript'],
            suggestedKeywords: ['full-stack', 'agile', 'typescript'],
            experience: [],
            education: [],
            contact: {},
          },
          error: null,
          resumeText: 'John Doe\nSoftware Engineer\nExperience: 5 years...',
          analyze: mockAnalyze,
          reset: mockReset,
        })
      }, 100)
    })

    render(<ResumeDropzone onTextExtracted={mockAnalyze} />)
    
    // Create a mock file
    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' })
    
    // Get the dropzone input
    const input = screen.getByRole('presentation').querySelector('input[type="file"]')
    
    // Upload the file
    await userEvent.upload(input!, file)
    
    // Verify file validation was called
    expect(validateResumeFile).toHaveBeenCalledWith(file)
    
    // Verify text extraction was called
    await waitFor(() => {
      expect(extractTextFromFile).toHaveBeenCalledWith(file)
    })
    
    // Verify analysis was triggered with extracted text
    await waitFor(() => {
      expect(mockAnalyze).toHaveBeenCalledWith(
        'John Doe\nSoftware Engineer\nExperience: 5 years...',
        undefined
      )
    })
  })

  it('should handle file upload errors gracefully', async () => {
    const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
    
    render(<ResumeDropzone onTextExtracted={mockAnalyze} />)
    
    // Create a mock file with unsupported type
    const file = new File(['resume content'], 'resume.exe', { type: 'application/exe' })
    
    // Get the dropzone input
    const input = screen.getByRole('presentation').querySelector('input[type="file"]')
    
    // Upload the file
    await userEvent.upload(input!, file)
    
    // Verify error message is shown (react-dropzone handles file type validation)
    await waitFor(() => {
      expect(screen.getByText(/File type not supported|Files must be/)).toBeInTheDocument()
    })
    
    // Verify analysis was not called
    expect(mockAnalyze).not.toHaveBeenCalled()
  })

  it('should handle text extraction errors', async () => {
    const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
    
    // Mock text extraction to fail with insufficient text
    extractTextFromFile.mockResolvedValue('Short text')
    
    render(<ResumeDropzone onTextExtracted={mockAnalyze} />)
    
    // Create a mock file
    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' })
    
    // Get the dropzone input
    const input = screen.getByRole('presentation').querySelector('input[type="file"]')
    
    // Upload the file
    await userEvent.upload(input!, file)
    
    // Verify error message is shown
    await waitFor(() => {
      expect(screen.getByText('Could not extract enough text from the file. Please try a different format.')).toBeInTheDocument()
    })
    
    // Verify analysis was not called
    expect(mockAnalyze).not.toHaveBeenCalled()
  })

  it('should handle analysis errors', async () => {
    const { validateResumeFile, extractTextFromFile } = require('@/lib/resume-parser')
    
    // Mock file validation to pass
    validateResumeFile.mockReturnValue({ valid: true })
    
    // Mock text extraction to return resume content
    extractTextFromFile.mockResolvedValue('John Doe\nSoftware Engineer\nExperience: 5 years...')
    
    // Mock analysis to fail
    ;(useResumeAnalysis as jest.Mock).mockReturnValue({
      status: 'error',
      progress: 0,
      analysis: null,
      error: 'Analysis failed due to server error',
      resumeText: null,
      analyze: mockAnalyze,
      reset: mockReset,
    })
    
    render(<ResumeDropzone onTextExtracted={mockAnalyze} />)
    
    // Create a mock file
    const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' })
    
    // Get the dropzone input
    const input = screen.getByRole('presentation').querySelector('input[type="file"]')
    
    // Upload the file
    await userEvent.upload(input!, file)
    
    // Verify analysis was triggered
    await waitFor(() => {
      expect(mockAnalyze).toHaveBeenCalledWith(
        'John Doe\nSoftware Engineer\nExperience: 5 years...',
        undefined
      )
    })
    
    // Verify error state is reflected
    await waitFor(() => {
      expect(screen.getByText('Analysis failed due to server error')).toBeInTheDocument()
    })
  })
})
