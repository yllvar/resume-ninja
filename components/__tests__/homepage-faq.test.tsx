import { render, screen, fireEvent } from '@testing-library/react'
import { HomepageFAQ } from '../homepage-faq'

describe('HomepageFAQ Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the FAQ section with title', () => {
    render(<HomepageFAQ />)
    
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
    expect(screen.getByText('Everything you need to know about Resume Ninja and how we help you land more interviews.')).toBeInTheDocument()
  })

  it('should render all FAQ questions', () => {
    render(<HomepageFAQ />)
    
    const expectedQuestions = [
      'What is Resume Ninja and how does it work?',
      'Is Resume Ninja really free to try?',
      'Which ATS systems do you support?',
      'Will my resume still look professional to humans?',
      'How is my data kept secure and private?',
      'What if I\'m not satisfied with the results?',
      'Can I use Resume Ninja for multiple job applications?',
      'How do I get started?'
    ]

    expectedQuestions.forEach(question => {
      expect(screen.getByText(question)).toBeInTheDocument()
    })
  })

  it('should have first FAQ item open by default', () => {
    render(<HomepageFAQ />)
    
    // First question should be expanded (content visible)
    expect(screen.getByText(/world's first AI-powered resume optimization platform/)).toBeInTheDocument()
  })

  it('should toggle FAQ items when clicked', async () => {
    render(<HomepageFAQ />)
    
    // Find a closed FAQ item (second one)
    const secondQuestion = screen.getByText('Is Resume Ninja really free to try?')
    const secondButton = secondQuestion.closest('button')
    
    // Check initial state - button should have aria-expanded="false"
    expect(secondButton).toHaveAttribute('aria-expanded', 'false')
    
    // Click to open
    fireEvent.click(secondButton!)
    
    // Wait for state change
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should now be expanded
    expect(secondButton).toHaveAttribute('aria-expanded', 'true')
    
    // Content should be visible
    expect(screen.getByText(/3 free resume optimizations/)).toBeInTheDocument()
    
    // Click to close
    fireEvent.click(secondButton!)
    
    // Wait for state change
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Should be collapsed again
    expect(secondButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('should render action buttons at the bottom', () => {
    render(<HomepageFAQ />)
    
    expect(screen.getByText('Email Support')).toBeInTheDocument()
    expect(screen.getByText('View Full FAQ')).toBeInTheDocument()
  })

  it('should have correct email link', () => {
    render(<HomepageFAQ />)
    
    const emailLink = screen.getByText('Email Support').closest('a')
    expect(emailLink).toHaveAttribute('href', 'mailto:hello@resumeninja.com')
  })

  it('should have correct FAQ page link', () => {
    render(<HomepageFAQ />)
    
    const faqLink = screen.getByText('View Full FAQ').closest('a')
    expect(faqLink).toHaveAttribute('href', '/faq')
  })

  it('should display chevron icons for expand/collapse state', () => {
    render(<HomepageFAQ />)
    
    // All FAQ items should have chevron icons (using SVG elements)
    const chevrons = document.querySelectorAll('svg.lucide')
    expect(chevrons.length).toBeGreaterThan(0)
    
    // Check that chevrons have the correct lucide class
    expect(chevrons[0]).toHaveClass('lucide')
  })

  it('should have proper accessibility attributes', () => {
    render(<HomepageFAQ />)
    
    const faqButtons = screen.getAllByRole('button')
    faqButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded')
      expect(button).toHaveAttribute('aria-controls')
    })
  })

  it('should render structured content within FAQ items', () => {
    render(<HomepageFAQ />)
    
    // Check for structured content like lists, bold text, etc.
    expect(screen.getByText(/4-step process/)).toBeInTheDocument()
    expect(screen.getByText(/Upload any resume/)).toBeInTheDocument()
    expect(screen.getByText(/AI analyzes and scores/)).toBeInTheDocument()
  })

  it('should have responsive design classes', () => {
    render(<HomepageFAQ />)
    
    const container = screen.getByText('Frequently Asked Questions').closest('section')
    expect(container).toHaveClass('py-20', 'sm:py-28')
  })
})
