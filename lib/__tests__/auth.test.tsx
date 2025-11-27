import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../auth'

// Test component that uses the auth context
function TestComponent() {
  const { user, loading, signOut } = useAuth()
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not loading'}</div>
      <div data-testid="user">{user ? user.email : 'no user'}</div>
      <button onClick={signOut} data-testid="sign-out">Sign Out</button>
    </div>
  )
}

describe('Auth Context', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should provide initial loading state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('loading')).toHaveTextContent('loading')
  })

  it('should handle sign out functionality', async () => {
    const mockSignOut = jest.fn()
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

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    const signOutButton = screen.getByTestId('sign-out')
    
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not loading')
    })

    signOutButton.click()
    
    // Should attempt to sign out
    expect(createClient().auth.signOut).toHaveBeenCalled()
  })

  it('should throw error when useAuth is used outside AuthProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation()
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleError.mockRestore()
  })
})
