import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpPage from '../sign-up/page'

// Mock the createClient function
const mockSignUp = jest.fn()
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signUp: mockSignUp,
    },
  }),
}))

// Mock window.location.origin
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost:3000',
  },
  writable: true,
})

describe('SignUpPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the sign up form', () => {
    render(<SignUpPage />)
    
    expect(screen.getByText('Create an account')).toBeInTheDocument()
    expect(screen.getByText('Start optimizing your resume with 3 free credits')).toBeInTheDocument()
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument()
  })

  it('should show validation error for password mismatch', async () => {
    render(<SignUpPage />)
    
    const fullNameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    const signUpButton = screen.getByRole('button', { name: 'Sign up' })
    
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } })
    fireEvent.click(signUpButton)
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('should show validation error for short password', async () => {
    render(<SignUpPage />)
    
    const fullNameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    const signUpButton = screen.getByRole('button', { name: 'Sign up' })
    
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: '123' } })
    fireEvent.click(signUpButton)
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('should handle successful sign up', async () => {
    const mockPush = jest.fn()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }))
    
    mockSignUp.mockResolvedValue({ error: null })
    
    render(<SignUpPage />)
    
    const fullNameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    const signUpButton = screen.getByRole('button', { name: 'Sign up' })
    
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(signUpButton)
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: 'http://localhost:3000/dashboard',
          data: {
            full_name: 'John Doe',
          },
        },
      })
    })
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/sign-up-success')
    })
  })

  it('should handle sign up errors', async () => {
    const errorMessage = 'User already registered'
    mockSignUp.mockResolvedValue({ error: { message: errorMessage } })
    
    render(<SignUpPage />)
    
    const fullNameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    const signUpButton = screen.getByRole('button', { name: 'Sign up' })
    
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(signUpButton)
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('should show loading state during sign up', async () => {
    mockSignUp.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<SignUpPage />)
    
    const fullNameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    const signUpButton = screen.getByRole('button', { name: 'Sign up' })
    
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(signUpButton)
    
    // Should show loading state
    expect(screen.getByText('Creating account...')).toBeInTheDocument()
    expect(signUpButton).toBeDisabled()
  })

  it('should have sign in link', () => {
    render(<SignUpPage />)
    
    const signInLink = screen.getByText('Sign in')
    expect(signInLink).toBeInTheDocument()
    expect(signInLink.closest('a')).toHaveAttribute('href', '/auth/login')
  })

  it('should have proper branding', () => {
    render(<SignUpPage />)
    
    expect(screen.getByText('Resume Ninja')).toBeInTheDocument()
    expect(screen.getByAltText('Resume Ninja')).toBeInTheDocument()
  })

  it('should have proper input placeholders', () => {
    render(<SignUpPage />)
    
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('ninja@example.com')).toBeInTheDocument()
  })

  it('should handle network errors gracefully', async () => {
    mockSignUp.mockRejectedValue(new Error('Network error'))
    
    render(<SignUpPage />)
    
    const fullNameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    const signUpButton = screen.getByRole('button', { name: 'Sign up' })
    
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(signUpButton)
    
    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument()
    })
  })

  it('should use custom redirect URL from environment', async () => {
    // Mock environment variable
    const originalEnv = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL = 'http://localhost:3000/custom-redirect'
    
    const mockPush = jest.fn()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }))
    
    mockSignUp.mockResolvedValue({ error: null })
    
    render(<SignUpPage />)
    
    const fullNameInput = screen.getByLabelText(/Full Name/i)
    const emailInput = screen.getByLabelText(/Email/i)
    const passwordInput = screen.getByLabelText(/^Password/i)
    const confirmPasswordInput = screen.getByLabelText(/Confirm Password/i)
    const signUpButton = screen.getByRole('button', { name: 'Sign up' })
    
    fireEvent.change(fullNameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(signUpButton)
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: 'http://localhost:3000/custom-redirect',
          data: {
            full_name: 'John Doe',
          },
        },
      })
    })
    
    // Restore original environment variable
    process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL = originalEnv
  })
})
