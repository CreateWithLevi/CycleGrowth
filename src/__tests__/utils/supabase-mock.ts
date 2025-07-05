import { Database } from '@/types/supabase'
import { createMockUser, createMockGrowthSystem, createMockGrowthTask, createMockKnowledgeItem, createMockReflection, createMockActivity, createMockUserEvolution } from './test-utils'

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
  },
  created_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {},
  identities: [],
  factors: [],
}

export const mockGrowthSystem = {
  id: 'test-system-id',
  user_id: 'test-user-id',
  title: 'Test Growth System',
  description: 'Test description',
  domain: 'professional',
  current_phase: 'planning',
  progress: 25,
  start_date: new Date().toISOString(),
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockGrowthTask = {
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
}

export const mockKnowledgeItem = {
  id: 'test-knowledge-id',
  user_id: 'test-user-id',
  title: 'Test Knowledge Item',
  content: 'Test knowledge content',
  source: 'test',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockReflection = {
  id: 'test-reflection-id',
  user_id: 'test-user-id',
  system_id: 'test-system-id',
  title: 'Test Reflection',
  content: 'Test reflection content',
  cycle_phase: 'planning',
  domain: 'professional',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockCycloEvolution = {
  id: 'test-evolution-id',
  user_id: 'test-user-id',
  current_stage: 1,
  interactions_count: 5,
  systems_created: 1,
  tasks_completed: 3,
  reflections_created: 2,
  knowledge_items_created: 1,
  last_interaction: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export const mockActivity = {
  id: 'test-activity-id',
  user_id: 'test-user-id',
  system_id: 'test-system-id',
  action: 'created',
  item: 'growth_system',
  created_at: new Date().toISOString(),
}

// Mock data store
export const mockData: Record<string, any[]> = {
  users: [createMockUser()],
  growth_systems: [createMockGrowthSystem()],
  growth_tasks: [createMockGrowthTask()],
  knowledge_items: [createMockKnowledgeItem()],
  reflections: [createMockReflection()],
  growth_activities: [createMockActivity()],
  user_cyclo_evolution: [createMockUserEvolution()],
  subscriptions: [],
}

// Mock Supabase response structure
const createMockResponse = (data: any, error: any = null) => ({
  data,
  error,
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK',
})

// Mock query builder
export const createMockQueryBuilder = (tableName: string) => {
  const mockQuery = {
    data: null as any,
    error: null as any,
    
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gt: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    like: jest.fn().mockReturnThis(),
    ilike: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    in: jest.fn().mockReturnThis(),
    contains: jest.fn().mockReturnThis(),
    containedBy: jest.fn().mockReturnThis(),
    rangeGt: jest.fn().mockReturnThis(),
    rangeGte: jest.fn().mockReturnThis(),
    rangeLt: jest.fn().mockReturnThis(),
    rangeLte: jest.fn().mockReturnThis(),
    rangeAdjacent: jest.fn().mockReturnThis(),
    overlaps: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    match: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    filter: jest.fn().mockReturnThis(),
    
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    
    single: jest.fn().mockResolvedValue(createMockResponse(mockData[tableName]?.[0] || null)),
    maybeSingle: jest.fn().mockResolvedValue(createMockResponse(mockData[tableName]?.[0] || null)),
    
    // Mock execution methods
    then: jest.fn().mockImplementation((onResolve) => {
      const result = createMockResponse(mockData[tableName] || [])
      return Promise.resolve(onResolve ? onResolve(result) : result)
    }),
  }
  
  return mockQuery
}

// Mock Supabase client
export const createMockSupabaseClient = () => ({
  auth: {
    getUser: jest.fn().mockResolvedValue(createMockResponse({ user: createMockUser() })),
    getSession: jest.fn().mockResolvedValue(createMockResponse({ session: { user: createMockUser() } })),
    signUp: jest.fn().mockResolvedValue(createMockResponse({ user: createMockUser() })),
    signInWithPassword: jest.fn().mockResolvedValue(createMockResponse({ user: createMockUser() })),
    signOut: jest.fn().mockResolvedValue(createMockResponse({})),
    resetPasswordForEmail: jest.fn().mockResolvedValue(createMockResponse({})),
    updateUser: jest.fn().mockResolvedValue(createMockResponse({ user: createMockUser() })),
    onAuthStateChange: jest.fn().mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } },
    }),
  },
  
  from: jest.fn().mockImplementation((table: string) => createMockQueryBuilder(table)),
  
  storage: {
    from: jest.fn().mockReturnValue({
      upload: jest.fn().mockResolvedValue(createMockResponse({ path: 'test-path' })),
      download: jest.fn().mockResolvedValue(createMockResponse(new Blob())),
      remove: jest.fn().mockResolvedValue(createMockResponse({})),
      list: jest.fn().mockResolvedValue(createMockResponse([])),
    }),
  },
  
  functions: {
    invoke: jest.fn().mockResolvedValue(createMockResponse({})),
  },
  
  realtime: {
    channel: jest.fn().mockReturnValue({
      on: jest.fn().mockReturnThis(),
      subscribe: jest.fn().mockReturnThis(),
      unsubscribe: jest.fn().mockReturnThis(),
    }),
  },
})

// Export mock functions for jest.mock
export const mockSupabaseClient = createMockSupabaseClient()

// Helper functions for setting up test scenarios
export const setupMockData = {
  withUser: (userData = {}) => {
    mockData.users = [createMockUser(userData)]
    return mockData.users[0]
  },
  
  withGrowthSystem: (systemData = {}) => {
    mockData.growth_systems = [createMockGrowthSystem(systemData)]
    return mockData.growth_systems[0]
  },
  
  withGrowthSystems: (systemsData = [{}]) => {
    mockData.growth_systems = systemsData.map(system => createMockGrowthSystem(system))
    return mockData.growth_systems
  },
  
  withGrowthTasks: (tasksData = [{}]) => {
    mockData.growth_tasks = tasksData.map(task => createMockGrowthTask(task))
    return mockData.growth_tasks
  },
  
  withKnowledgeItems: (itemsData = [{}]) => {
    mockData.knowledge_items = itemsData.map(item => createMockKnowledgeItem(item))
    return mockData.knowledge_items
  },
  
  withReflections: (reflectionsData = [{}]) => {
    mockData.reflections = reflectionsData.map(reflection => createMockReflection(reflection))
    return mockData.reflections
  },
  
  withActivities: (activitiesData = [{}]) => {
    mockData.growth_activities = activitiesData.map(activity => createMockActivity(activity))
    return mockData.growth_activities
  },
  
  withUserEvolution: (evolutionData = {}) => {
    mockData.user_cyclo_evolution = [createMockUserEvolution(evolutionData)]
    return mockData.user_cyclo_evolution[0]
  },
  
  reset: () => {
    mockData.users = [createMockUser()]
    mockData.growth_systems = [createMockGrowthSystem()]
    mockData.growth_tasks = [createMockGrowthTask()]
    mockData.knowledge_items = [createMockKnowledgeItem()]
    mockData.reflections = [createMockReflection()]
    mockData.growth_activities = [createMockActivity()]
    mockData.user_cyclo_evolution = [createMockUserEvolution()]
    mockData.subscriptions = []
  },
}

// Mock the Supabase client creation
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}))

// Mock the server client
jest.mock('../../../supabase/server', () => ({
  createClient: jest.fn(() => Promise.resolve(mockSupabaseClient)),
}))

// Mock the client-side client
jest.mock('../../../supabase/client', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}))

export default mockSupabaseClient 