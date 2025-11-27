import { NextRequest } from 'next/server'
import { GET, PATCH } from '../user/profile/route'

// Mock Supabase client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}))

describe('/api/user/profile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET', () => {
    it('should require authentication', async () => {
      const { createClient } = require('@/lib/supabase/server')
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should return user profile', async () => {
      const { createClient } = require('@/lib/supabase/server')
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ 
            data: { user: { id: 'user-123', email: 'test@example.com' } }, 
            error: null 
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  email: 'test@example.com',
                  full_name: 'Test User',
                  credits: 10,
                  subscription_tier: 'pro',
                  created_at: '2024-01-01',
                  updated_at: '2024-01-01',
                },
                error: null,
              }),
            }),
          }),
        }),
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.id).toBe('user-123')
      expect(data.email).toBe('test@example.com')
      expect(data.credits).toBe(10)
      expect(data.subscription_tier).toBe('pro')
    })

    it('should handle profile not found', async () => {
      const { createClient } = require('@/lib/supabase/server')
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ 
            data: { user: { id: 'user-123', email: 'test@example.com' } }, 
            error: null 
          }),
        },
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Profile not found' },
              }),
            }),
          }),
        }),
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Profile not found')
    })
  })

  describe('PATCH', () => {
    it('should require authentication', async () => {
      const { createClient } = require('@/lib/supabase/server')
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify({ full_name: 'Updated Name' }),
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')
    })

    it('should update user profile', async () => {
      const { createClient } = require('@/lib/supabase/server')
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ 
            data: { user: { id: 'user-123', email: 'test@example.com' } }, 
            error: null 
          }),
        },
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: 'user-123',
                  email: 'test@example.com',
                  full_name: 'Updated Name',
                  credits: 10,
                  subscription_tier: 'pro',
                  created_at: '2024-01-01',
                  updated_at: '2024-01-02',
                },
                error: null,
              }),
            }),
          }),
        }),
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify({ full_name: 'Updated Name' }),
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.full_name).toBe('Updated Name')
      expect(data.updated_at).toBe('2024-01-02')
    })

    it('should validate update data', async () => {
      const { createClient } = require('@/lib/supabase/server')
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ 
            data: { user: { id: 'user-123', email: 'test@example.com' } }, 
            error: null 
          }),
        },
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify({}), // Empty update
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('No update data provided')
    })

    it('should prevent updating sensitive fields', async () => {
      const { createClient } = require('@/lib/supabase/server')
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ 
            data: { user: { id: 'user-123', email: 'test@example.com' } }, 
            error: null 
          }),
        },
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify({ 
          id: 'hacked-id',
          credits: 1000,
          subscription_tier: 'enterprise',
        }),
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('Cannot update')
    })

    it('should handle update errors', async () => {
      const { createClient } = require('@/lib/supabase/server')
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ 
            data: { user: { id: 'user-123', email: 'test@example.com' } }, 
            error: null 
          }),
        },
        from: jest.fn().mockReturnValue({
          update: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Update failed' },
              }),
            }),
          }),
        }),
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        body: JSON.stringify({ full_name: 'Updated Name' }),
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Update failed')
    })

    it('should handle malformed JSON', async () => {
      const { createClient } = require('@/lib/supabase/server')
      createClient.mockReturnValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ 
            data: { user: { id: 'user-123', email: 'test@example.com' } }, 
            error: null 
          }),
        },
      })

      const request = new NextRequest('http://localhost:3000/api/user/profile', {
        method: 'PATCH',
        body: 'invalid json',
      })

      const response = await PATCH(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Invalid JSON')
    })
  })
})
