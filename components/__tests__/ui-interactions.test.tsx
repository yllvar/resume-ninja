import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AnalysisResults } from '../analysis-results'
import { ATSScoreCard } from '../ats-score-card'
import { ResumePreview } from '../resume-preview'
import { TemplateSelector } from '../template-selector'
import { ResumeDownloader } from '../resume-downloader'

// Mock the resume generator
jest.mock('@/lib/resume-generator', () => ({
  generatePlainTextResume: jest.fn(() => 'Plain text resume content'),
  generateHTMLResume: jest.fn(() => '<html>HTML resume content</html>'),
  downloadFile: jest.fn(),
  printAsPDF: jest.fn(),
}))

// Mock template generator
jest.mock('@/lib/templates/generator', () => ({
  generateResume: jest.fn((resume, template, format) => 
    format === 'html' ? `<html>${template} template</html>` : `${template} text content`
  ),
  downloadResume: jest.fn(),
  printResume: jest.fn(),
}))

describe('UI Component Interaction Tests', () => {
  const mockAnalysis = {
    atsScore: 85,
    analysis: 'Strong technical background with good experience progression',
    suggestions: [
      'Add more quantifiable achievements',
      'Include technical skills section',
      'Improve formatting consistency'
    ],
    keywords: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    formatIssues: ['Inconsistent bullet point formatting'],
    strengths: ['Clear experience progression', 'Relevant technical skills'],
  }
  const mockResumeText = 'John Doe\nSoftware Engineer\nExperience: 5 years...'
  const mockFileName = 'resume.pdf'

  const mockResume = {
    contact: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '555-0123',
      location: 'San Francisco, CA',
    },
    summary: 'Experienced software engineer with 5+ years...',
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        startDate: '2020-01',
        endDate: '2023-12',
        bullets: ['Led development of microservices'],
      },
    ],
    skills: ['JavaScript', 'React', 'Node.js'],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // Mock URL.createObjectURL for preview functionality
    global.URL.createObjectURL = jest.fn(() => 'mock-preview-url')
    global.URL.revokeObjectURL = jest.fn()
  })

  describe('AnalysisResults Component', () => {
    it('should display analysis results correctly', () => {
      render(<AnalysisResults analysis={mockAnalysis} resumeText={mockResumeText} fileName={mockFileName} />)

      expect(screen.getByText('85')).toBeInTheDocument() // ATS Score
      expect(screen.getByText(mockAnalysis.analysis)).toBeInTheDocument()
      expect(screen.getByText('Add more quantifiable achievements')).toBeInTheDocument()
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.getByText('Clear experience progression')).toBeInTheDocument()
    })

    it('should expand and collapse suggestion sections', async () => {
      render(<AnalysisResults analysis={mockAnalysis} resumeText={mockResumeText} fileName={mockFileName} />)

      // Find suggestions section toggle
      const suggestionsToggle = screen.getByRole('button', { name: /suggestions/i })
      expect(suggestionsToggle).toBeInTheDocument()

      // Click to collapse
      await userEvent.click(suggestionsToggle)
      
      // Should hide suggestions content
      expect(screen.queryByText('Add more quantifiable achievements')).not.toBeInTheDocument()

      // Click to expand again
      await userEvent.click(suggestionsToggle)
      
      // Should show suggestions again
      expect(screen.getByText('Add more quantifiable achievements')).toBeInTheDocument()
    })

    it('should handle empty analysis gracefully', () => {
      const emptyAnalysis = {
        atsScore: 0,
        analysis: '',
        suggestions: [],
        keywords: [],
        formatIssues: [],
        strengths: [],
      }
      render(<AnalysisResults analysis={emptyAnalysis} resumeText={mockResumeText} fileName={mockFileName} />)

      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('No analysis available')).toBeInTheDocument()
    })

    it('should handle missing analysis data', () => {
      render(<AnalysisResults analysis={{}} resumeText={mockResumeText} fileName={mockFileName} />)

      expect(screen.getByText('Analysis not available')).toBeInTheDocument()
    })

    it('should show different score colors based on ATS score', () => {
      const lowScoreAnalysis = { ...mockAnalysis, atsScore: 45 }
      const mediumScoreAnalysis = { ...mockAnalysis, atsScore: 75 }
      const highScoreAnalysis = { ...mockAnalysis, atsScore: 95 }

      const { rerender } = render(<AnalysisResults analysis={lowScoreAnalysis} resumeText={mockResumeText} fileName={mockFileName} />)
      expect(screen.getByText('45')).toHaveClass('text-destructive')

      rerender(<AnalysisResults analysis={mediumScoreAnalysis} resumeText={mockResumeText} fileName={mockFileName} />)
      expect(screen.getByText('75')).toHaveClass('text-yellow-600')

      rerender(<AnalysisResults analysis={highScoreAnalysis} resumeText={mockResumeText} fileName={mockFileName} />)
      expect(screen.getByText('95')).toHaveClass('text-green-600')
    })
  })

  describe('ATSScoreCard Component', () => {
    it('should display ATS score with visual indicator', () => {
      render(<ATSScoreCard score={85} />)

      expect(screen.getByText('85')).toBeInTheDocument()
      expect(screen.getByText('ATS Score')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('should show appropriate message based on score', () => {
      const { rerender } = render(<ATSScoreCard score={45} />)
      expect(screen.getByText(/needs improvement/i)).toBeInTheDocument()

      rerender(<ATSScoreCard score={75} />)
      expect(screen.getByText(/good progress/i)).toBeInTheDocument()

      rerender(<ATSScoreCard score={95} />)
      expect(screen.getByText(/excellent/i)).toBeInTheDocument()
    })

    it('should animate score display', async () => {
      render(<ATSScoreCard score={85} animated={true} />)

      // Should start from 0 and animate to 85
      await waitFor(() => {
        expect(screen.getByText('85')).toBeInTheDocument()
      })
    })

    it('should handle invalid scores', () => {
      render(<ATSScoreCard score={-5} />)
      expect(screen.getByText('0')).toBeInTheDocument()

      render(<ATSScoreCard score={150} />)
      expect(screen.getByText('100')).toBeInTheDocument()
    })
  })

  describe('ResumePreview Component', () => {
    it('should display resume preview with correct content', () => {
      render(<ResumePreview analysis={mockAnalysis} />)

      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Experienced software engineer')).toBeInTheDocument()
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
    })

    it('should switch between templates', async () => {
      render(<ResumePreview analysis={mockAnalysis} />)

      const templateSelector = screen.getByRole('combobox', { name: /template/i })
      await userEvent.selectOptions(templateSelector, 'modern')

      // Should update preview with modern template
      expect(screen.getByDisplayValue('modern')).toBeInTheDocument()
    })

    it('should toggle between HTML and text view', async () => {
      render(<ResumePreview analysis={mockAnalysis} />)

      const textViewToggle = screen.getByRole('button', { name: /text view/i })
      await userEvent.click(textViewToggle)

      // Should show text version
      expect(screen.getByText('Plain text resume content')).toBeInTheDocument()
    })

    it('should handle empty resume data', () => {
      render(<ResumePreview analysis={{}} />)

      expect(screen.getByText('No resume data available')).toBeInTheDocument()
    })

    it('should handle preview loading state', () => {
      render(<ResumePreview analysis={mockAnalysis} isLoading={true} />)

      expect(screen.getByText('Loading preview...')).toBeInTheDocument()
    })
  })

  describe('TemplateSelector Component', () => {
    it('should display available templates', () => {
      render(<TemplateSelector selectedTemplate="classic" onSelect={jest.fn()} userTier="free" />)

      expect(screen.getByText('Classic')).toBeInTheDocument()
      expect(screen.getByText('Modern')).toBeInTheDocument()
      expect(screen.getByText('Executive')).toBeInTheDocument()
      expect(screen.getByText('Technical')).toBeInTheDocument()
    })

    it('should handle template selection', async () => {
      const mockOnSelect = jest.fn()
      render(<TemplateSelector selectedTemplate="classic" onSelect={mockOnSelect} userTier="free" />)

      const modernTemplate = screen.getByRole('button', { name: /modern/i })
      await userEvent.click(modernTemplate)

      expect(mockOnSelect).toHaveBeenCalledWith('modern')
    })

    it('should show template previews on hover', async () => {
      render(<TemplateSelector selectedTemplate="classic" onSelect={jest.fn()} userTier="free" />)

      const modernTemplate = screen.getByRole('button', { name: /modern/i })
      await userEvent.hover(modernTemplate)

      // Should show preview tooltip
      await waitFor(() => {
        expect(screen.getByText(/modern template preview/i)).toBeInTheDocument()
      })
    })

    it('should highlight selected template', () => {
      render(<TemplateSelector selectedTemplate="modern" onSelect={jest.fn()} userTier="free" />)

      const modernTemplate = screen.getByRole('button', { name: /modern/i })
      expect(modernTemplate).toHaveClass('border-primary')
    })
  })

  describe('ResumeDownloader Component', () => {
    it('should show download options', () => {
      render(<ResumeDownloader resume={mockResume} fileName="john-doe-resume" onClose={jest.fn()} />)

      expect(screen.getByText('Download Resume')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /download html/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /download text/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /download pdf/i })).toBeInTheDocument()
    })

    it('should handle HTML download', async () => {
      const { downloadFile } = require('@/lib/resume-generator')
      render(<ResumeDownloader resume={mockResume} fileName="john-doe-resume" onClose={jest.fn()} />)

      const downloadHtmlButton = screen.getByRole('button', { name: /download html/i })
      await userEvent.click(downloadHtmlButton)

      expect(downloadFile).toHaveBeenCalledWith(
        expect.stringContaining('HTML resume content'),
        expect.stringContaining('john-doe-resume'),
        'text/html'
      )
    })

    it('should handle text download', async () => {
      const { downloadFile } = require('@/lib/resume-generator')
      render(<ResumeDownloader resume={mockResume} fileName="john-doe-resume" onClose={jest.fn()} />)

      const downloadTextButton = screen.getByRole('button', { name: /download text/i })
      await userEvent.click(downloadTextButton)

      expect(downloadFile).toHaveBeenCalledWith(
        expect.stringContaining('Plain text resume content'),
        expect.stringContaining('john-doe-resume'),
        'text/plain'
      )
    })

    it('should handle PDF download (print)', async () => {
      const { printAsPDF } = require('@/lib/resume-generator')
      render(<ResumeDownloader resume={mockResume} fileName="john-doe-resume" onClose={jest.fn()} />)

      const downloadPdfButton = screen.getByRole('button', { name: /download pdf/i })
      await userEvent.click(downloadPdfButton)

      expect(printAsPDF).toHaveBeenCalledWith(
        expect.stringContaining('HTML resume content')
      )
    })

    it('should show download progress', async () => {
      render(<ResumeDownloader resume={mockResume} fileName="john-doe-resume" onClose={jest.fn()} />)

      const downloadHtmlButton = screen.getByRole('button', { name: /download html/i })
      await userEvent.click(downloadHtmlButton)

      // Should show loading state
      expect(screen.getByText('Downloading...')).toBeInTheDocument()
    })

    it('should handle download errors', async () => {
      const { downloadFile } = require('@/lib/resume-generator')
      downloadFile.mockImplementation(() => {
        throw new Error('Download failed')
      })

      render(<ResumeDownloader resume={mockResume} fileName="john-doe-resume" onClose={jest.fn()} />)

      const downloadHtmlButton = screen.getByRole('button', { name: /download html/i })
      await userEvent.click(downloadHtmlButton)

      await waitFor(() => {
        expect(screen.getByText('Download failed')).toBeInTheDocument()
      })
    })
  })

  describe('Component Integration Tests', () => {
    it('should integrate analysis results with resume preview', async () => {
      const mockOnSelect = jest.fn()
      
      render(
        <div>
          <AnalysisResults analysis={mockAnalysis} resumeText={mockResumeText} fileName={mockFileName} />
          <ResumePreview analysis={mockAnalysis} />
          <TemplateSelector selectedTemplate="classic" onSelect={mockOnSelect} userTier="free" />
        </div>
      )

      // Change template
      const modernTemplate = screen.getByRole('button', { name: /modern/i })
      await userEvent.click(modernTemplate)

      // Preview should update
      expect(mockOnSelect).toHaveBeenCalledWith('modern')
    })

    it('should integrate preview with downloader', async () => {
      const { downloadFile, printAsPDF } = require('@/lib/resume-generator')
      
      render(
        <div>
          <ResumePreview analysis={mockAnalysis} />
          <ResumeDownloader resume={mockResume} fileName="john-doe-resume" onClose={jest.fn()} />
        </div>
      )

      // Download should use current template
      const downloadHtmlButton = screen.getByRole('button', { name: /download html/i })
      await userEvent.click(downloadHtmlButton)

      expect(downloadFile).toHaveBeenCalledWith(
        expect.stringContaining('HTML resume content'),
        expect.any(String),
        'text/html'
      )
    })

    it('should handle component state synchronization', async () => {
      const mockOnSelect = jest.fn()
      
      render(
        <div>
          <TemplateSelector selectedTemplate="classic" onSelect={mockOnSelect} userTier="free" />
          <ResumePreview analysis={mockAnalysis} />
          <ResumeDownloader resume={mockResume} fileName="john-doe-resume" onClose={jest.fn()} />
        </div>
      )

      // Change template in selector
      const modernTemplate = screen.getByRole('button', { name: /modern/i })
      await userEvent.click(modernTemplate)

      // All components should reflect the change
      expect(mockOnSelect).toHaveBeenCalledWith('modern')
    })
  })

  describe('Accessibility Tests', () => {
    it('should have proper ARIA labels', () => {
      render(<ATSScoreCard score={85} />)

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'ATS Score')
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '85')
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0')
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100')
    })

    it('should support keyboard navigation', async () => {
      render(<TemplateSelector selectedTemplate="classic" onSelect={jest.fn()} userTier="free" />)

      const firstTemplate = screen.getByRole('button', { name: /classic/i })
      firstTemplate.focus()
      
      // Tab to next template
      await userEvent.tab()
      expect(screen.getByRole('button', { name: /modern/i })).toHaveFocus()

      // Select with Enter key
      await userEvent.keyboard('{Enter}')
    })

    it('should announce changes to screen readers', async () => {
      render(<AnalysisResults analysis={mockAnalysis} resumeText={mockResumeText} fileName={mockFileName} />)

      const suggestionsToggle = screen.getByRole('button', { name: /suggestions/i })
      await userEvent.click(suggestionsToggle)

      // Should have aria-live region for announcements
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('Responsive Design Tests', () => {
    it('should adapt to mobile screens', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(<AnalysisResults analysis={mockAnalysis} resumeText={mockResumeText} fileName={mockFileName} />)

      // Should have mobile-specific classes
      const container = screen.getByTestId('analysis-results')
      expect(container).toHaveClass('md:hidden')
    })

    it('should adapt to tablet screens', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      render(<TemplateSelector selectedTemplate="classic" onSelect={jest.fn()} userTier="free" />)

      // Should have tablet-specific layout
      const container = screen.getByTestId('template-selector')
      expect(container).toHaveClass('md:grid-cols-2')
    })
  })
})
