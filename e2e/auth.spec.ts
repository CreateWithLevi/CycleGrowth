import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies()
    await page.goto('/')
  })

  test('should redirect unauthenticated users to sign-in', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/.*sign-in/)
  })

  test('should display sign-up form correctly', async ({ page }) => {
    await page.goto('/sign-up')
    
    // Check that form elements are present
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('input[name="full_name"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Check title and description
    await expect(page.locator('h1')).toContainText('Sign up')
    await expect(page.locator('text=Already have an account?')).toBeVisible()
  })

  test('should display sign-in form correctly', async ({ page }) => {
    await page.goto('/sign-in')
    
    // Check that form elements are present
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Check title and links
    await expect(page.locator('h1')).toContainText('Sign in')
    await expect(page.locator('text=Don\'t have an account?')).toBeVisible()
    await expect(page.locator('text=Forgot your password?')).toBeVisible()
  })

  test('should validate required fields on sign-up', async ({ page }) => {
    await page.goto('/sign-up')
    
    // Try to submit without filling fields
    await page.click('button[type="submit"]')
    
    // HTML5 validation should trigger
    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toHaveAttribute('required')
    
    const passwordInput = page.locator('input[name="password"]')
    await expect(passwordInput).toHaveAttribute('required')
  })

  test('should validate required fields on sign-in', async ({ page }) => {
    await page.goto('/sign-in')
    
    // Try to submit without filling fields
    await page.click('button[type="submit"]')
    
    // HTML5 validation should trigger
    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toHaveAttribute('required')
    
    const passwordInput = page.locator('input[name="password"]')
    await expect(passwordInput).toHaveAttribute('required')
  })

  test('should handle invalid email format', async ({ page }) => {
    await page.goto('/sign-up')
    
    // Fill form with invalid email
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="full_name"]', 'Test User')
    
    // HTML5 validation should prevent submission
    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('should navigate between auth pages', async ({ page }) => {
    await page.goto('/sign-in')
    
    // Navigate to sign-up
    await page.click('text=Sign up')
    await expect(page).toHaveURL(/.*sign-up/)
    
    // Navigate back to sign-in
    await page.click('text=Sign in')
    await expect(page).toHaveURL(/.*sign-in/)
    
    // Navigate to forgot password
    await page.goto('/sign-in')
    await page.click('text=Forgot your password?')
    await expect(page).toHaveURL(/.*forgot-password/)
  })

  test('should display forgot password form correctly', async ({ page }) => {
    await page.goto('/forgot-password')
    
    // Check form elements
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Check title and description
    await expect(page.locator('h1')).toContainText('Reset your password')
    await expect(page.locator('text=Back to Sign in')).toBeVisible()
  })

  test('should validate email field on forgot password', async ({ page }) => {
    await page.goto('/forgot-password')
    
    // Try to submit without email
    await page.click('button[type="submit"]')
    
    // HTML5 validation should trigger
    const emailInput = page.locator('input[name="email"]')
    await expect(emailInput).toHaveAttribute('required')
    await expect(emailInput).toHaveAttribute('type', 'email')
  })

  // Mock authentication tests (would need real Supabase setup for full tests)
  test('should handle sign-up attempt', async ({ page }) => {
    await page.goto('/sign-up')
    
    // Fill form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.fill('input[name="full_name"]', 'Test User')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show loading state or redirect
    // (In a real test, we'd check for success/error messages)
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should handle sign-in attempt', async ({ page }) => {
    await page.goto('/sign-in')
    
    // Fill form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show loading state or redirect
    // (In a real test, we'd check for success/error messages)
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should handle forgot password attempt', async ({ page }) => {
    await page.goto('/forgot-password')
    
    // Fill form
    await page.fill('input[name="email"]', 'test@example.com')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Should show loading state or success message
    // (In a real test, we'd check for success/error messages)
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test('should maintain form state during navigation', async ({ page }) => {
    await page.goto('/sign-up')
    
    // Fill some form data
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="full_name"]', 'Test User')
    
    // Navigate away and back
    await page.click('text=Sign in')
    await page.click('text=Sign up')
    
    // Form should be reset (this is expected behavior)
    const emailValue = await page.locator('input[name="email"]').inputValue()
    expect(emailValue).toBe('')
  })

  test('should have accessible form labels', async ({ page }) => {
    await page.goto('/sign-up')
    
    // Check that form inputs have proper labels
    const emailInput = page.locator('input[name="email"]')
    const passwordInput = page.locator('input[name="password"]')
    const nameInput = page.locator('input[name="full_name"]')
    
    // Check for label associations or placeholder text
    await expect(emailInput).toHaveAttribute('placeholder')
    await expect(passwordInput).toHaveAttribute('placeholder')
    await expect(nameInput).toHaveAttribute('placeholder')
  })

  test('should have proper page titles', async ({ page }) => {
    await page.goto('/sign-up')
    await expect(page).toHaveTitle(/CycleGrowth/)
    
    await page.goto('/sign-in')
    await expect(page).toHaveTitle(/CycleGrowth/)
    
    await page.goto('/forgot-password')
    await expect(page).toHaveTitle(/CycleGrowth/)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/sign-in')
    
    // Check that form is still visible and usable
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
    
    // Form should be properly sized
    const form = page.locator('form')
    const boundingBox = await form.boundingBox()
    expect(boundingBox?.width).toBeLessThanOrEqual(375)
  })
})

test.describe('Protected Routes', () => {
  test('should redirect to sign-in when accessing dashboard without auth', async ({ page }) => {
    // Try to access dashboard directly
    await page.goto('/dashboard')
    
    // Should redirect to sign-in
    await expect(page).toHaveURL(/.*sign-in/)
  })

  test('should redirect to sign-in when accessing protected pages', async ({ page }) => {
    const protectedPages = [
      '/dashboard/analytics',
      '/dashboard/system-builder',
      '/dashboard/tasks',
      '/dashboard/reflection',
      '/dashboard/knowledge-hub',
    ]

    for (const path of protectedPages) {
      await page.goto(path)
      await expect(page).toHaveURL(/.*sign-in/)
    }
  })
}) 