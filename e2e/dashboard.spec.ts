import { test, expect } from '@playwright/test'

// Mock authenticated user state
test.use({
  storageState: {
    cookies: [],
    origins: [
      {
        origin: 'http://127.0.0.1:3000',
        localStorage: [
          {
            name: 'supabase.auth.token',
            value: JSON.stringify({
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
              user: {
                id: 'test-user-id',
                email: 'test@example.com',
              },
            }),
          },
        ],
      },
    ],
  },
})

test.describe('Dashboard', () => {
  // Mock authenticated user for dashboard tests
  test.beforeEach(async ({ page }) => {
    // In a real scenario, you'd set up authenticated state
    // For now, we'll test the dashboard structure assuming auth
    await page.goto('/')
  })

  test('should display main navigation correctly', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check main navigation items
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Growth Cycles')).toBeVisible()
    await expect(page.locator('text=System Builder')).toBeVisible()
    await expect(page.locator('text=Knowledge Hub')).toBeVisible()
    await expect(page.locator('text=Tasks')).toBeVisible()
    await expect(page.locator('text=Analytics')).toBeVisible()
    await expect(page.locator('text=Reflection')).toBeVisible()
    await expect(page.locator('text=Cyclo Assistant')).toBeVisible()
  })

  test('should display CycleGrowth logo', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check logo is present
    await expect(page.locator('nav').locator('text=CycleGrowth')).toBeVisible()
  })

  test('should display user menu', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check user menu trigger
    const userMenu = page.locator('[role="button"]').filter({ hasText: /settings|account|user/i }).first()
    if (await userMenu.count() > 0) {
      await expect(userMenu).toBeVisible()
    }
  })

  test('should navigate to growth cycles page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click on Growth Cycles navigation
    await page.click('text=Growth Cycles')
    await expect(page).toHaveURL(/.*growth-cycles/)
  })

  test('should navigate to system builder page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click on System Builder navigation
    await page.click('text=System Builder')
    await expect(page).toHaveURL(/.*system-builder/)
  })

  test('should navigate to knowledge hub page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click on Knowledge Hub navigation
    await page.click('text=Knowledge Hub')
    await expect(page).toHaveURL(/.*knowledge-hub/)
  })

  test('should navigate to tasks page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click on Tasks navigation
    await page.click('text=Tasks')
    await expect(page).toHaveURL(/.*tasks/)
  })

  test('should navigate to analytics page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click on Analytics navigation
    await page.click('text=Analytics')
    await expect(page).toHaveURL(/.*analytics/)
  })

  test('should navigate to reflection page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click on Reflection navigation
    await page.click('text=Reflection')
    await expect(page).toHaveURL(/.*reflection/)
  })

  test('should navigate to cyclo assistant page', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click on Cyclo Assistant navigation
    await page.click('text=Cyclo Assistant')
    await expect(page).toHaveURL(/.*cyclo-assistant/)
  })

  test('should display new system button', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for "New System" button
    const newSystemButton = page.locator('text=New System')
    await expect(newSystemButton).toBeVisible()
  })

  test('should navigate to system builder when clicking new system', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Click "New System" button
    await page.click('text=New System')
    await expect(page).toHaveURL(/.*system-builder/)
  })

  test('should display dashboard content', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for main dashboard content
    // This would include cards, widgets, or main content areas
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/dashboard')
    
    // Check that navigation is still accessible
    // On mobile, navigation might be collapsed
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should highlight active navigation item', async ({ page }) => {
    await page.goto('/dashboard/analytics')
    
    // Check that Analytics nav item is highlighted/active
    const analyticsNav = page.locator('nav').locator('text=Analytics')
    if (await analyticsNav.count() > 0) {
      // Check for active styles (this would depend on your CSS classes)
      await expect(analyticsNav).toBeVisible()
    }
  })

  test('should access user settings', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Try to access user menu and settings
    const userMenuButton = page.locator('[data-testid="user-menu"]').or(
      page.locator('button').filter({ hasText: /user|account|settings/i })
    ).first()
    
    if (await userMenuButton.count() > 0) {
      await userMenuButton.click()
      
      // Look for settings option
      const settingsOption = page.locator('text=Settings').or(
        page.locator('text=Account Settings')
      ).first()
      
      if (await settingsOption.count() > 0) {
        await settingsOption.click()
        await expect(page).toHaveURL(/.*settings/)
      }
    }
  })

  test('should display dashboard title', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for page title or heading
    await expect(page).toHaveTitle(/CycleGrowth/)
  })

  test('should load dashboard without errors', async ({ page }) => {
    // Listen for console errors
    const errors: string[] = []
    page.on('pageerror', error => {
      errors.push(error.message)
    })
    
    await page.goto('/dashboard')
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle')
    
    // Check that no critical errors occurred
    const criticalErrors = errors.filter(error => 
      !error.includes('Warning') && !error.includes('DevTools')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check for proper meta tags
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
    expect(viewport).toContain('width=device-width')
  })

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    
    // Check that focus is visible (this depends on your focus styles)
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeVisible()
  })

  test('should display loading states appropriately', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check that any loading indicators are handled properly
    // This would depend on your specific implementation
    await page.waitForLoadState('domcontentloaded')
    
    // Ensure main content is visible after loading
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('should maintain session across page refreshes', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Refresh the page
    await page.reload()
    
    // Should still be on dashboard (assuming auth is maintained)
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Navigation should still be visible
    await expect(page.locator('nav')).toBeVisible()
  })

  test('should handle navigation back and forward', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Navigate to different pages
    await page.click('text=Analytics')
    await expect(page).toHaveURL(/.*analytics/)
    
    // Go back
    await page.goBack()
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Go forward
    await page.goForward()
    await expect(page).toHaveURL(/.*analytics/)
  })
})

test.describe('System Builder', () => {
  test('should create a new growth system', async ({ page }) => {
    await page.goto('/dashboard/system-builder')
    
    // Fill out the form
    await page.fill('input[name="title"]', 'Test Growth System')
    await page.fill('textarea[name="description"]', 'This is a test growth system')
    await page.selectOption('select[name="domain"]', 'professional')
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Should redirect to dashboard or show success
    await page.waitForURL(/.*dashboard/)
    await expect(page.locator('text=Test Growth System')).toBeVisible()
  })

  test('should show validation errors for empty system form', async ({ page }) => {
    await page.goto('/dashboard/system-builder')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Check for validation messages
    await expect(page.locator('text=Title is required')).toBeVisible()
  })
})

test.describe('Task Management', () => {
  test('should display task management interface', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    
    // Check main elements
    await expect(page.locator('h1')).toContainText('Tasks')
    await expect(page.locator('text=Add Task')).toBeVisible()
  })

  test('should create a new task', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    
    // Click add task button
    await page.click('text=Add Task')
    
    // Fill out task form
    await page.fill('input[name="title"]', 'Test Task')
    await page.fill('textarea[name="description"]', 'This is a test task')
    await page.selectOption('select[name="priority"]', 'high')
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Should show the new task
    await expect(page.locator('text=Test Task')).toBeVisible()
  })

  test('should update task status', async ({ page }) => {
    await page.goto('/dashboard/tasks')
    
    // Assuming there's a task, try to update its status
    const taskCheckbox = page.locator('input[type="checkbox"]').first()
    if (await taskCheckbox.isVisible()) {
      await taskCheckbox.click()
      
      // Should update the task status
      await expect(taskCheckbox).toBeChecked()
    }
  })
})

test.describe('Knowledge Hub', () => {
  test('should display knowledge hub interface', async ({ page }) => {
    await page.goto('/dashboard/knowledge-hub')
    
    // Check main elements
    await expect(page.locator('h1')).toContainText('Knowledge Hub')
    await expect(page.locator('text=Add Knowledge Item')).toBeVisible()
  })

  test('should create a new knowledge item', async ({ page }) => {
    await page.goto('/dashboard/knowledge-hub')
    
    // Click add knowledge item button
    await page.click('text=Add Knowledge Item')
    
    // Fill out the form
    await page.fill('input[name="title"]', 'Test Knowledge Item')
    await page.fill('textarea[name="content"]', 'This is test knowledge content')
    await page.fill('input[name="tags"]', 'test, knowledge')
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Should show the new knowledge item
    await expect(page.locator('text=Test Knowledge Item')).toBeVisible()
  })
})

test.describe('Reflection Tool', () => {
  test('should display reflection interface', async ({ page }) => {
    await page.goto('/dashboard/reflection')
    
    // Check main elements
    await expect(page.locator('h1')).toContainText('Reflection')
    await expect(page.locator('text=New Reflection')).toBeVisible()
  })

  test('should create a new reflection', async ({ page }) => {
    await page.goto('/dashboard/reflection')
    
    // Click new reflection button
    await page.click('text=New Reflection')
    
    // Fill out reflection form
    await page.fill('input[name="title"]', 'Test Reflection')
    await page.fill('textarea[name="content"]', 'This is my test reflection content')
    await page.selectOption('select[name="cycle_phase"]', 'planning')
    
    // Submit the form
    await page.click('button[type="submit"]')
    
    // Should show the new reflection
    await expect(page.locator('text=Test Reflection')).toBeVisible()
  })
})

test.describe('Analytics', () => {
  test('should display analytics dashboard', async ({ page }) => {
    await page.goto('/dashboard/analytics')
    
    // Check main elements
    await expect(page.locator('h1')).toContainText('Analytics')
    
    // Should show analytics widgets or charts
    await expect(page.locator('text=Progress Overview')).toBeVisible()
  })
}) 