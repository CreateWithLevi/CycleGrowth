import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  // Clean up any global test data or configurations here
  console.log('Tearing down global test environment...')
  
  // You can add any cleanup logic here, such as:
  // - Removing test users
  // - Cleaning up test database
  // - Shutting down external services
  
  console.log('Global teardown completed!')
}

export default globalTeardown 