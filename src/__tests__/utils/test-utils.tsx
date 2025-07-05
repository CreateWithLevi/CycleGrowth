import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

// override render method
export { customRender as render }

// Common test utilities
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    email: 'test@example.com',
  },
  app_metadata: {},
  aud: 'authenticated',
  confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const createMockGrowthSystem = (overrides = {}) => ({
  id: 'test-system-id',
  user_id: 'test-user-id',
  title: 'Test Growth System',
  description: 'Test description',
  domain: 'personal',
  current_phase: 'planning',
  progress: 0,
  start_date: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  status: 'active',
  ...overrides,
})

export const createMockGrowthTask = (overrides = {}) => ({
  id: 'test-task-id',
  system_id: 'test-system-id',
  title: 'Test Task',
  description: 'Test task description',
  due_date: new Date().toISOString(),
  priority: 'medium',
  status: 'pending',
  cycle_phase: 'planning',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const createMockKnowledgeItem = (overrides = {}) => ({
  id: 'test-knowledge-id',
  user_id: 'test-user-id',
  title: 'Test Knowledge Item',
  content: 'Test knowledge content',
  source: 'manual',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const createMockReflection = (overrides = {}) => ({
  id: 'test-reflection-id',
  user_id: 'test-user-id',
  system_id: 'test-system-id',
  title: 'Test Reflection',
  content: 'Test reflection content',
  domain: 'personal',
  cycle_phase: 'planning',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const createMockActivity = (overrides = {}) => ({
  id: 'test-activity-id',
  user_id: 'test-user-id',
  system_id: 'test-system-id',
  action: 'Created new task',
  item: 'Test Task',
  created_at: new Date().toISOString(),
  ...overrides,
})

export const createMockUserEvolution = (overrides = {}) => ({
  id: 'test-evolution-id',
  user_id: 'test-user-id',
  current_stage: 1,
  interactions_count: 0,
  systems_created: 0,
  tasks_completed: 0,
  knowledge_items_created: 0,
  reflections_created: 0,
  last_interaction: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

// Wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Re-export everything from React Testing Library
export { fireEvent, screen, waitFor } from '@testing-library/react'

// Common test utilities
export const mockConsoleError = () => {
  const originalError = console.error
  console.error = jest.fn()
  return () => {
    console.error = originalError
  }
}

export const mockConsoleWarn = () => {
  const originalWarn = console.warn
  console.warn = jest.fn()
  return () => {
    console.warn = originalWarn
  }
}

export const waitForTimeout = (ms: number) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Mock Next.js Server Actions
export const mockServerAction = <T extends any[], R>(
  implementation?: (...args: T) => Promise<R>
) => {
  const mockFn = jest.fn<Promise<R>, T>()
  
  if (implementation) {
    mockFn.mockImplementation(implementation)
  } else {
    mockFn.mockResolvedValue(undefined as R)
  }
  
  return mockFn
}

// Mock fetch for API testing
export const mockFetch = (response: any, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => response,
    text: async () => JSON.stringify(response),
  })
}

// Helper to create mock form data
export const createMockFormData = (data: Record<string, string>) => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, value)
  })
  return formData
} 