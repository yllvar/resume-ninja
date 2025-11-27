import { 
  calculateCreditsRequired, 
  canUserPerformAction, 
  deductCredits, 
  getTierLimits,
  TIER_LIMITS 
} from '../credits'
import type { Profile, SubscriptionTier } from '../supabase/types'

describe('Credits Utility', () => {
  describe('calculateCreditsRequired', () => {
    it('should return 1 credit for basic resume analysis', () => {
      const result = calculateCreditsRequired('resume_analysis')
      expect(result).toBe(1)
    })

    it('should return 2 credits for premium template', () => {
      const result = calculateCreditsRequired('premium_template')
      expect(result).toBe(2)
    })

    it('should return 5 credits for batch analysis', () => {
      const result = calculateCreditsRequired('batch_analysis')
      expect(result).toBe(5)
    })

    it('should throw error for unknown action type', () => {
      expect(() => calculateCreditsRequired('unknown_action' as any)).toThrow()
    })
  })

  describe('canUserPerformAction', () => {
    const freeUser: Profile = {
      id: '1',
      email: 'free@example.com',
      full_name: 'Free User',
      credits: 3,
      subscription_tier: 'free',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    const proUser: Profile = {
      id: '2',
      email: 'pro@example.com',
      full_name: 'Pro User',
      credits: 50,
      subscription_tier: 'pro',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    it('should allow action if user has enough credits', () => {
      const result = canUserPerformAction(freeUser, 'resume_analysis')
      expect(result.canPerform).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    it('should deny action if user lacks credits', () => {
      const result = canUserPerformAction(freeUser, 'batch_analysis')
      expect(result.canPerform).toBe(false)
      expect(result.reason).toBe('Insufficient credits')
    })

    it('should allow action for pro users with sufficient credits', () => {
      const result = canUserPerformAction(proUser, 'batch_analysis')
      expect(result.canPerform).toBe(true)
    })
  })

  describe('deductCredits', () => {
    const user: Profile = {
      id: '1',
      email: 'test@example.com',
      full_name: 'Test User',
      credits: 10,
      subscription_tier: 'free',
      created_at: '2024-01-01',
      updated_at: '2024-01-01'
    }

    it('should deduct correct amount of credits', () => {
      const result = deductCredits(user, 'resume_analysis')
      expect(result.credits).toBe(9)
    })

    it('should not allow negative credits', () => {
      const lowCreditsUser = { ...user, credits: 1 }
      const result = deductCredits(lowCreditsUser, 'batch_analysis')
      expect(result.credits).toBe(0) // Should not go negative
    })
  })

  describe('getTierLimits', () => {
    it('should return correct limits for free tier', () => {
      const limits = getTierLimits('free')
      expect(limits.creditsPerMonth).toBe(3)
      expect(limits.maxFileSize).toBe(5 * 1024 * 1024)
      expect(limits.templates).toEqual(['classic'])
      expect(limits.requestsPerMinute).toBe(5)
    })

    it('should return correct limits for pro tier', () => {
      const limits = getTierLimits('pro')
      expect(limits.creditsPerMonth).toBe(50)
      expect(limits.maxFileSize).toBe(10 * 1024 * 1024)
      expect(limits.templates).toContain('modern')
      expect(limits.requestsPerMinute).toBe(30)
    })

    it('should return unlimited limits for enterprise tier', () => {
      const limits = getTierLimits('enterprise')
      expect(limits.creditsPerMonth).toBe(Number.POSITIVE_INFINITY)
      expect(limits.maxFileSize).toBe(25 * 1024 * 1024)
      expect(limits.requestsPerMinute).toBe(100)
    })
  })

  describe('TIER_LIMITS constant', () => {
    it('should have all required tiers', () => {
      expect(TIER_LIMITS).toHaveProperty('free')
      expect(TIER_LIMITS).toHaveProperty('pro')
      expect(TIER_LIMITS).toHaveProperty('enterprise')
    })

    it('should have consistent structure across tiers', () => {
      const tiers: SubscriptionTier[] = ['free', 'pro', 'enterprise']
      tiers.forEach(tier => {
        const limits = TIER_LIMITS[tier]
        expect(limits).toHaveProperty('creditsPerMonth')
        expect(limits).toHaveProperty('maxFileSize')
        expect(limits).toHaveProperty('templates')
        expect(limits).toHaveProperty('requestsPerMinute')
      })
    })
  })
})
