import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '../login/page'

// Mock the createClient function
const mockSignIn = jest.fn()
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: mockSignIn,
    },
  }),
}))

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the login form', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to continue optimizing your resume')).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    render(<LoginPage />)
    
    const signInButton = screen.getByRole('button', { name: 'Sign in' })
    fireEvent.click(signInButton)
    
    // HTML5 validation should prevent form submission
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    
    expect(emailInput).toBeRequired()
    expect(passwordInput).toBeRequired()
  })

  it('should handle successful sign in', async () => {
    mockSignIn.mockResolvedValue({ error: null })
    
    const mockPush = jest.fn()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
        refresh: jest.fn(),
      }),
      useSearchParams: () => ({
        get: jest.fn().mockReturnValue(null),
      }),
    }))
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    const signInButton = screen.getByRole('button', { name: 'Sign in' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(signInButton)
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('should handle sign in errors', async () => {
    const errorMessage = 'Invalid login credentials'
    mockSignIn.mockResolvedValue({ error: { message: errorMessage } })
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    const signInButton = screen.getByRole('button', { name: 'Sign in' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
    fireEvent.click(signInButton)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('should show loading state during sign in', async () => {
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    const signInButton = screen.getByRole('button', { name: 'Sign in' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(signInButton)
    
    // Should show loading state
    expect(screen.getByText('Signing in...')).toBeInTheDocument()
    expect(signInButton).toBeDisabled()
  })

  it('should handle redirect parameter', () => {
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn(),
      }),
      useSearchParams: () => ({
        get: jest.fn().mockReturnValue('/dashboard'),
      }),
    }))
    
    render(<LoginPage />)
    
    // Should render without errors
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
  })

  it('should have sign up link', () => {
    render(<LoginPage />)
    
    const signUpLink = screen.getByText('Sign up')
    expect(signUpLink).toBeInTheDocument()
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/auth/sign-up')
  })

  it('should have forgot password link', () => {
    render(<LoginPage />)
    
    const forgotPasswordLink = screen.getByText('Forgot your password?')
    expect(forgotPasswordLink).toBeInTheDocument()
    expect(forgotPasswordLink.closest('a')).toHaveAttribute('href', '/auth/forgot-password')
  })

  it('should have proper branding', () => {
    render(<LoginPage />)
    
    expect(screen.getByText('Resume Ninja')).toBeInTheDocument()
    expect(screen.getByAltText('Resume Ninja')).toBeInTheDocument()
  })

  it('should have proper input placeholders', () => {
    render(<LoginPage />)
    
    expect(screen.getByPlaceholderText('ninja@example.com')).toBeInTheDocument()
  })

  it('should handle network errors gracefully', async () => {
    mockSignIn.mockRejectedValue(new Error('Network error'))
    
    render(<LoginPage />)
    
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    const signInButton = screen.getByRole('button', { name: 'Sign in' })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(signInButton)
    
    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument()
    })
  })
})
