# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development Server
- `npm run dev` - Start development server on port 3001
- `npm run build` - Build for production
- `npm start` - Start production server on port 3001

### Testing
- `npm test` - Run unit tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run test:e2e` - Run end-to-end tests with Playwright
- `npm run test:e2e:ui` - Run E2E tests with UI
- `npm run test:e2e:headed` - Run E2E tests in headed mode

## Architecture Overview

CycleGrowth is a full-stack SaaS application for personal growth management built with:

### Core Stack
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, PostgreSQL, Edge Functions)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Payments**: Stripe integration
- **Testing**: Jest, React Testing Library, Playwright

### Database Architecture
The database follows a multi-tenant design with Row Level Security (RLS) policies:

**Core Tables:**
- `growth_systems` - User's growth frameworks with 4-phase state machine (Planning, Execution, Analysis, Improvement)
- `growth_tasks` - Tasks associated with growth systems
- `growth_activities` - Activity feed tracking user actions
- `user_cyclo_evolution` - AI assistant evolution tracking
- `knowledge_items` - Zettelkasten-inspired knowledge management
- `reflections` - User reflections tied to cycle phases
- `subscriptions` - Stripe subscription management

### State Management
- **Growth Cycle Phases**: Implemented as a state machine with `current_phase` field
- **AI Evolution**: `user_cyclo_evolution` tracks AI assistant progression
- **Authentication**: Supabase Auth with custom user profiles

### Key Patterns

#### Database Access
- Use `src/lib/db.ts` for database operations
- Both admin (service key) and client (anon key) patterns for RLS bypass when needed
- TypeScript types generated from Supabase schema in `src/types/supabase.ts`

#### Authentication
- Server-side auth in `src/utils/auth.ts`
- Client-side auth in `supabase/client.ts`
- Middleware handles auth state in `middleware.ts`

#### Edge Functions
Located in `supabase/functions/`:
- Payment processing (`payments-webhook`, `create-checkout`)
- Growth system operations (`create-growth-system`, `update-cyclo-stage`)
- Task management (`create-growth-task`, `update-task-status`)

### File Structure Conventions

#### Components
- UI components in `src/components/ui/` (shadcn/ui)
- Feature components in `src/components/`
- Connected components (with data fetching) use `-connected` suffix
- Tests in `__tests__/` subdirectories

#### App Router Structure
```
src/app/
├── (auth)/          # Auth-related pages (grouped route)
├── dashboard/       # Main app functionality
├── api/            # API routes
└── actions.ts      # Server actions
```

#### Testing Structure
- Unit tests: `src/**/__tests__/` or `*.test.{ts,tsx}`
- E2E tests: `e2e/*.spec.ts`
- Test utilities: `src/__tests__/utils/`
- Supabase mocking in `src/__tests__/utils/supabase-mock.ts`

### Development Notes

#### Environment Setup
- Requires Supabase project with proper RLS policies
- Stripe webhook endpoint for subscription management
- Test environment uses separate Supabase instance

#### Database Migrations
- Located in `supabase/migrations/`
- Follow timestamp naming convention
- Include both schema changes and RLS policy updates

#### Component Development
- Follow shadcn/ui patterns for UI components
- Use TypeScript strict mode
- Implement proper error boundaries for data fetching components

#### Testing Requirements
- Unit test coverage target: ≥80%
- E2E tests for critical user flows (auth, payment, core features)
- Database operations must include error handling tests