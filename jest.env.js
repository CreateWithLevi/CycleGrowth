// Jest environment configuration
const { TestEnvironment } = require('jest-environment-jsdom')

class CustomTestEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context)
    
    // Set up custom environment variables for testing
    this.global.process.env = {
      ...this.global.process.env,
      NODE_ENV: 'test',
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
      SUPABASE_SERVICE_KEY: 'test-service-key',
    }
  }
}

module.exports = CustomTestEnvironment 