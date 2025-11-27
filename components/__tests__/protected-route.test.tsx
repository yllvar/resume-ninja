import { render, screen } from '@testing-library/react'
import { ProtectedRoute } from '../protected-route'
import { AuthProvider } from '@/lib/auth'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should show loading state initially', () => {
    const TestComponent = () => <div>Protected Content</div>
    
    render(
      <AuthProvider>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    )

    // Should show loading spinner initially
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should render children when user is authenticated', async () => {
    // Mock authenticated user
    const createClient = require('@/lib/supabase/client').createClient
    createClient.mockReturnValue({
      auth: {
        onAuthStateChange: jest.fn(() => ({
          data: { subscription: { unsubscribe: jest.fn() } }
        })),
        getSession: jest.fn(() => Promise.resolve({
          data: { session: { user: { email: 'test@example.com' } } }
        }))
      }
    })

    const TestComponent = () => <div>Protected Content</div>
    
    render(
      <AuthProvider>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    )

    // Should render protected content
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('should show fallback when user is not authenticated', async () => {
    // Mock unauthenticated user
    const createClient = require('@/lib/supabase/client').createClient
    createClient.mockReturnValue({
      auth: {
        onAuthStateChange: jest.fn(() => ({
          data: { subscription: { unsubscribe: jest.fn() } }
        })),
        getSession: jest.fn(() => Promise.resolve({
          data: { session: null }
        }))
      }
    })

    const TestComponent = () => <div>Protected Content</div>
    const FallbackComponent = () => <div>Please sign in</div>
    
    render(
      <AuthProvider>
        <ProtectedRoute fallback={<FallbackComponent />}>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    )

    // Should show fallback content
    expect(screen.getByText('Please sign in')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should show nothing when no fallback provided and user not authenticated', async () => {
    // Mock unauthenticated user
    const createClient = require('@/lib/supabase/client').createClient
    createClient.mockReturnValue({
      auth: {
        onAuthStateChange: jest.fn(() => ({
          data: { subscription: { unsubscribe: jest.fn() } }
        })),
        getSession: jest.fn(() => Promise.resolve({
          data: { session: null }
        }))
      }
    })

    const TestComponent = () => <div>Protected Content</div>
    
    render(
      <AuthProvider>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    )

    // Should not render anything
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.queryByText('Please sign in')).not.toBeInTheDocument()
  })

  it('should redirect to login when user not authenticated', async () => {
    const mockPush = jest.fn()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockPush,
      }),
    }))

    // Mock unauthenticated user
    const createClient = require('@/lib/supabase/client').createClient
    createClient.mockReturnValue({
      auth: {
        onAuthStateChange: jest.fn(() => ({
          data: { subscription: { unsubscribe: jest.fn() } }
        })),
        getSession: jest.fn(() => Promise.resolve({
          data: { session: null }
        }))
      }
    })

    const TestComponent = () => <div>Protected Content</div>
    
    render(
      <AuthProvider>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    )

    // Should redirect to login
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(mockPush).toHaveBeenCalledWith('/auth/login')
  })

  it('should handle nested protected routes', async () => {
    // Mock authenticated user
    const createClient = require('@/lib/supabase/client').createClient
    createClient.mockReturnValue({
      auth: {
        onAuthStateChange: jest.fn(() => ({
          data: { subscription: { unsubscribe: jest.fn() } }
        })),
        getSession: jest.fn(() => Promise.resolve({
          data: { session: { user: { email: 'test@example.com' } } }
        }))
      }
    })

    const NestedComponent = () => (
      <div>
        <h1>Nested Protected</h1>
        <ProtectedRoute>
          <div>Deeply nested content</div>
        </ProtectedRoute>
      </div>
    )
    
    render(
      <AuthProvider>
        <ProtectedRoute>
          <NestedComponent />
        </ProtectedRoute>
      </AuthProvider>
    )

    // Should render all nested content
    expect(screen.getByText('Nested Protected')).toBeInTheDocument()
    expect(screen.getByText('Deeply nested content')).toBeInTheDocument()
  })

  it('should handle authentication state changes', async () => {
    const createClient = require('@/lib/supabase/client').createClient
    let authCallback: ((event: string, session: any) => void) | null = null
    
    createClient.mockReturnValue({
      auth: {
        onAuthStateChange: jest.fn((callback) => {
          authCallback = callback
          return {
            data: { subscription: { unsubscribe: jest.fn() } }
          }
        }),
        getSession: jest.fn(() => Promise.resolve({
          data: { session: null }
        }))
      }
    })

    const TestComponent = () => <div>Protected Content</div>
    
    render(
      <AuthProvider>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    )

    // Initially should not show protected content
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()

    // Simulate user signing in
    if (authCallback) {
      authCallback('SIGNED_IN', { user: { email: 'test@example.com' } })
    }

    // Should now show protected content
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
