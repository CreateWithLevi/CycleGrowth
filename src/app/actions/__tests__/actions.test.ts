import {
  signUpAction,
  signInAction,
  forgotPasswordAction,
  resetPasswordAction,
  signOutAction,
  checkUserSubscription
} from '../../actions'
import { mockSupabaseClient } from '@/__tests__/utils/supabase-mock'

// Mock the server client
jest.mock('../../../../supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabaseClient)),
}))

// Mock Next.js redirect and encodedRedirect
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

jest.mock('@/utils/utils', () => ({
  encodedRedirect: jest.fn(),
}))

const { redirect } = require('next/navigation')
const { encodedRedirect } = require('@/utils/utils')

describe('Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('signUpAction', () => {
    it('successfully signs up a new user', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      formData.append('full_name', 'Test User')

      // Mock successful signup
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-id', email: 'test@example.com' } },
        error: null,
      })

      // Mock successful user insert
      mockSupabaseClient.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null }),
      })

      await signUpAction(formData)

      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'Test User',
            email: 'test@example.com',
          },
        },
      })

      expect(encodedRedirect).toHaveBeenCalledWith(
        'success',
        '/sign-up',
        'Thanks for signing up! Please check your email for a verification link.'
      )
    })

    it('handles missing email or password', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      // Missing password

      await signUpAction(formData)

      expect(encodedRedirect).toHaveBeenCalledWith(
        'error',
        '/sign-up',
        'Email and password are required'
      )
    })

    it('handles signup errors', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      // Mock signup error
      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: { message: 'Signup failed' },
      })

      await signUpAction(formData)

      expect(encodedRedirect).toHaveBeenCalledWith(
        'error',
        '/sign-up',
        'Signup failed'
      )
    })

    it('handles empty full name gracefully', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')
      // No full_name provided

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: { id: 'user-id', email: 'test@example.com' } },
        error: null,
      })

      await signUpAction(formData)

      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: {
            data: {
              full_name: '',
              email: 'test@example.com',
            },
          },
        })
      )
    })
  })

  describe('signInAction', () => {
    it('successfully signs in a user', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      // Mock successful signin
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-id' } },
        error: null,
      })

      await signInAction(formData)

      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(redirect).toHaveBeenCalledWith('/dashboard')
    })

    it('handles signin errors', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrongpassword')

      // Mock signin error
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid credentials' },
      })

      await signInAction(formData)

      expect(encodedRedirect).toHaveBeenCalledWith(
        'error',
        '/sign-in',
        'Invalid credentials'
      )
    })
  })

  describe('forgotPasswordAction', () => {
    it('successfully sends password reset email', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      // Mock successful password reset
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      })

      await forgotPasswordAction(formData)

      expect(mockSupabaseClient.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {}
      )

      expect(encodedRedirect).toHaveBeenCalledWith(
        'success',
        '/forgot-password',
        'Check your email for a link to reset your password.'
      )
    })

    it('handles missing email', async () => {
      const formData = new FormData()
      // No email provided

      await forgotPasswordAction(formData)

      expect(encodedRedirect).toHaveBeenCalledWith(
        'error',
        '/forgot-password',
        'Email is required'
      )
    })

    it('handles password reset errors', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      // Mock password reset error
      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        data: null,
        error: { message: 'Reset failed' },
      })

      await forgotPasswordAction(formData)

      expect(encodedRedirect).toHaveBeenCalledWith(
        'error',
        '/forgot-password',
        'Could not reset password'
      )
    })

    it('handles callback URL correctly', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('callbackUrl', '/custom-callback')

      mockSupabaseClient.auth.resetPasswordForEmail.mockResolvedValue({
        data: {},
        error: null,
      })

      await forgotPasswordAction(formData)

      expect(redirect).toHaveBeenCalledWith('/custom-callback')
    })
  })

  describe('resetPasswordAction', () => {
    it('successfully resets password', async () => {
      const formData = new FormData()
      formData.append('password', 'newpassword123')
      formData.append('confirmPassword', 'newpassword123')

      // Mock successful password update
      mockSupabaseClient.auth.updateUser.mockResolvedValue({
        data: { user: { id: 'user-id' } },
        error: null,
      })

      await resetPasswordAction(formData)

      expect(mockSupabaseClient.auth.updateUser).toHaveBeenCalledWith({
        password: 'newpassword123',
      })
    })

    it('handles password update errors', async () => {
      const formData = new FormData()
      formData.append('password', 'newpassword123')
      formData.append('confirmPassword', 'newpassword123')

      // Mock password update error
      mockSupabaseClient.auth.updateUser.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      })

      await resetPasswordAction(formData)

      // The function should handle the error (though it doesn't return anything)
      expect(mockSupabaseClient.auth.updateUser).toHaveBeenCalled()
    })
  })

  describe('signOutAction', () => {
    it('successfully signs out user', async () => {
      // Mock successful signout
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: null,
      })

      await signOutAction()

      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
      expect(redirect).toHaveBeenCalledWith('/sign-in')
    })
  })

  describe('checkUserSubscription', () => {
    it('returns true for active subscription', async () => {
      const mockSubscription = {
        id: 'sub-id',
        user_id: 'user-id',
        status: 'active',
      }

      // Mock successful subscription query
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockSubscription,
          error: null,
        }),
      })

      const result = await checkUserSubscription('user-id')

      expect(result).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('subscriptions')
    })

    it('returns false for no subscription', async () => {
      // Mock no subscription found
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'No subscription found' },
        }),
      })

      const result = await checkUserSubscription('user-id')

      expect(result).toBe(false)
    })

    it('returns false when subscription query fails', async () => {
      // Mock query error
      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      })

      const result = await checkUserSubscription('user-id')

      expect(result).toBe(false)
    })
  })
}) 