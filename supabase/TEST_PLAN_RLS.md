# RLS Policy Verification Test Plan

## Overview
This document outlines the testing strategy for Row Level Security (RLS) policies implemented for the event-driven growth cycles system.

## Tables Under Test
- `cycles`
- `cycle_stages`
- `cyclo_interactions`

## Testing Approaches

### 1. Manual Testing (Using Supabase Dashboard or psql)

#### Setup
```sql
-- Create two test users for cross-user access testing
-- User 1: Will own test data
-- User 2: Will attempt unauthorized access
```

#### Test Cases for `cycles` Table

**TC1: User can view their own cycles**
```sql
-- Login as User 1
SET request.jwt.claim.sub = '<user_1_uuid>';

-- Should return rows
SELECT * FROM cycles WHERE user_id = '<user_1_uuid>';
```
**Expected**: Returns all cycles for user 1
**Actual**: ___________

---

**TC2: User cannot view other users' cycles**
```sql
-- Login as User 2
SET request.jwt.claim.sub = '<user_2_uuid>';

-- Should return empty
SELECT * FROM cycles WHERE user_id = '<user_1_uuid>';
```
**Expected**: Returns 0 rows
**Actual**: ___________

---

**TC3: User can insert their own cycles**
```sql
-- Login as User 1
SET request.jwt.claim.sub = '<user_1_uuid>';

INSERT INTO cycles (user_id, title, domain)
VALUES ('<user_1_uuid>', 'Test Cycle', 'Testing');
```
**Expected**: Insert succeeds
**Actual**: ___________

---

**TC4: User cannot insert cycles for other users**
```sql
-- Login as User 1
SET request.jwt.claim.sub = '<user_1_uuid>';

-- Should fail
INSERT INTO cycles (user_id, title, domain)
VALUES ('<user_2_uuid>', 'Malicious Cycle', 'Hacking');
```
**Expected**: Insert fails with RLS policy violation
**Actual**: ___________

---

**TC5: User can update their own cycles**
```sql
-- Login as User 1
SET request.jwt.claim.sub = '<user_1_uuid>';

UPDATE cycles
SET status = 'active'
WHERE user_id = '<user_1_uuid>'
AND id = '<test_cycle_id>';
```
**Expected**: Update succeeds
**Actual**: ___________

---

**TC6: User cannot update other users' cycles**
```sql
-- Login as User 2
SET request.jwt.claim.sub = '<user_2_uuid>';

UPDATE cycles
SET status = 'archived'
WHERE user_id = '<user_1_uuid>'
AND id = '<test_cycle_id>';
```
**Expected**: Update affects 0 rows
**Actual**: ___________

---

**TC7: User can delete their own cycles**
```sql
-- Login as User 1
SET request.jwt.claim.sub = '<user_1_uuid>';

DELETE FROM cycles
WHERE user_id = '<user_1_uuid>'
AND id = '<test_cycle_id>';
```
**Expected**: Delete succeeds
**Actual**: ___________

---

**TC8: Service role can manage all cycles**
```sql
-- Login as service_role (bypass RLS for admin operations)
SET ROLE service_role;

SELECT * FROM cycles;
-- Should see all cycles from all users

INSERT INTO cycles (user_id, title, domain)
VALUES ('<any_user_uuid>', 'Admin Cycle', 'System');
-- Should succeed
```
**Expected**: Service role has full access
**Actual**: ___________

---

#### Test Cases for `cycle_stages` Table

**TC9: User can view stages for their cycles**
```sql
-- Login as User 1
SET request.jwt.claim.sub = '<user_1_uuid>';

SELECT cs.* FROM cycle_stages cs
JOIN cycles c ON cs.cycle_id = c.id
WHERE c.user_id = '<user_1_uuid>';
```
**Expected**: Returns all stages for user 1's cycles
**Actual**: ___________

---

**TC10: User cannot view stages for other users' cycles**
```sql
-- Login as User 2
SET request.jwt.claim.sub = '<user_2_uuid>';

SELECT cs.* FROM cycle_stages cs
JOIN cycles c ON cs.cycle_id = c.id
WHERE c.user_id = '<user_1_uuid>';
```
**Expected**: Returns 0 rows
**Actual**: ___________

---

**TC11: User can insert stages for their cycles**
```sql
-- Login as User 1
SET request.jwt.claim.sub = '<user_1_uuid>';

INSERT INTO cycle_stages (cycle_id, stage_type, title)
VALUES ('<user_1_cycle_id>', 'planning_define_goals', 'Test Stage');
```
**Expected**: Insert succeeds
**Actual**: ___________

---

**TC12: User cannot insert stages for other users' cycles**
```sql
-- Login as User 2
SET request.jwt.claim.sub = '<user_2_uuid>';

INSERT INTO cycle_stages (cycle_id, stage_type, title)
VALUES ('<user_1_cycle_id>', 'planning_define_goals', 'Malicious Stage');
```
**Expected**: Insert fails with RLS policy violation
**Actual**: ___________

---

**TC13: User can update stages for their cycles**
```sql
-- Login as User 1
SET request.jwt.claim.sub = '<user_1_uuid>';

UPDATE cycle_stages
SET is_completed = true
WHERE cycle_id = '<user_1_cycle_id>'
AND id = '<stage_id>';
```
**Expected**: Update succeeds
**Actual**: ___________

---

**TC14: User cannot update stages for other users' cycles**
```sql
-- Login as User 2
SET request.jwt.claim.sub = '<user_2_uuid>';

UPDATE cycle_stages
SET is_completed = false
WHERE cycle_id = '<user_1_cycle_id>';
```
**Expected**: Update affects 0 rows
**Actual**: ___________

---

#### Test Cases for `cyclo_interactions` Table

**TC15: User can view their own interactions**
```sql
-- Login as User 1
SET request.jwt.claim.sub = '<user_1_uuid>';

SELECT * FROM cyclo_interactions
WHERE user_id = '<user_1_uuid>';
```
**Expected**: Returns all interactions for user 1
**Actual**: ___________

---

**TC16: User cannot view other users' interactions**
```sql
-- Login as User 2
SET request.jwt.claim.sub = '<user_2_uuid>';

SELECT * FROM cyclo_interactions
WHERE user_id = '<user_1_uuid>';
```
**Expected**: Returns 0 rows
**Actual**: ___________

---

**TC17: User can insert their own interactions**
```sql
-- Login as User 1
SET request.jwt.claim.sub = '<user_1_uuid>';

INSERT INTO cyclo_interactions (cycle_id, user_id, role, content)
VALUES ('<user_1_cycle_id>', '<user_1_uuid>', 'user', 'Test message');
```
**Expected**: Insert succeeds
**Actual**: ___________

---

**TC18: User cannot insert interactions for other users**
```sql
-- Login as User 1
SET request.jwt.claim.sub = '<user_1_uuid>';

INSERT INTO cyclo_interactions (cycle_id, user_id, role, content)
VALUES ('<user_1_cycle_id>', '<user_2_uuid>', 'user', 'Impersonation attempt');
```
**Expected**: Insert fails with RLS policy violation
**Actual**: ___________

---

**TC19: Service role can insert AI responses**
```sql
-- Login as service_role
SET ROLE service_role;

INSERT INTO cyclo_interactions (cycle_id, user_id, role, content, model_name)
VALUES (
    '<user_1_cycle_id>',
    '<user_1_uuid>',
    'assistant',
    'AI generated response',
    'gpt-4'
);
```
**Expected**: Insert succeeds (AI can respond on behalf of users)
**Actual**: ___________

---

### 2. Automated Testing with pgTAP

Create a test file: `supabase/tests/rls_policies.test.sql`

```sql
-- Install pgTAP extension if not already installed
CREATE EXTENSION IF NOT EXISTS pgtap;

BEGIN;
SELECT plan(25); -- Number of tests

-- Setup test data
SET search_path TO public, auth;

-- Create test users
INSERT INTO auth.users (id, email)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'user1@test.com'),
    ('22222222-2222-2222-2222-222222222222', 'user2@test.com');

-- Create test cycle for user 1
INSERT INTO cycles (id, user_id, title, domain)
VALUES (
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'User 1 Cycle',
    'Testing'
);

-- Test: User can view their own cycles
SET request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
SELECT ok(
    EXISTS(
        SELECT 1 FROM cycles
        WHERE user_id = '11111111-1111-1111-1111-111111111111'
    ),
    'User can view their own cycles'
);

-- Test: User cannot view other users' cycles
SET request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
SELECT ok(
    NOT EXISTS(
        SELECT 1 FROM cycles
        WHERE user_id = '11111111-1111-1111-1111-111111111111'
    ),
    'User cannot view other users cycles'
);

-- Test: User can insert their own cycles
SET request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
SELECT lives_ok(
    $$INSERT INTO cycles (user_id, title, domain)
      VALUES ('11111111-1111-1111-1111-111111111111', 'New Cycle', 'Test')$$,
    'User can insert their own cycles'
);

-- Test: User cannot insert cycles for other users
SET request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
SELECT throws_ok(
    $$INSERT INTO cycles (user_id, title, domain)
      VALUES ('22222222-2222-2222-2222-222222222222', 'Malicious', 'Test')$$,
    'User cannot insert cycles for other users'
);

-- Test: User can update their own cycles
SET request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';
SELECT lives_ok(
    $$UPDATE cycles SET status = 'active'
      WHERE user_id = '11111111-1111-1111-1111-111111111111'$$,
    'User can update their own cycles'
);

-- Test: User cannot update other users' cycles
SET request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';
SELECT ok(
    (UPDATE cycles SET status = 'archived'
     WHERE user_id = '11111111-1111-1111-1111-111111111111'
     RETURNING id) IS NULL,
    'User cannot update other users cycles'
);

-- Add more tests for cycle_stages and cyclo_interactions...

-- Cleanup
ROLLBACK;
```

**To run pgTAP tests:**
```bash
# Install pg_prove if not already installed
# Ubuntu/Debian: sudo apt-get install libtap-parser-sourcehandler-pgtap-perl

# Run tests
pg_prove -U postgres -d your_database supabase/tests/rls_policies.test.sql
```

---

### 3. Integration Testing with Jest/Vitest

Create: `src/__tests__/integration/rls-policies.test.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import type { Database } from '@/types/supabase';

describe('RLS Policies', () => {
  let supabaseUser1: ReturnType<typeof createClient<Database>>;
  let supabaseUser2: ReturnType<typeof createClient<Database>>;
  let user1Id: string;
  let user2Id: string;
  let testCycleId: string;

  beforeAll(async () => {
    // Create two test users and their authenticated clients
    // This assumes you have test user credentials set up

    // User 1 client
    supabaseUser1 = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: authData1 } = await supabaseUser1.auth.signInWithPassword({
      email: 'test-user-1@example.com',
      password: 'testpassword123'
    });
    user1Id = authData1.user!.id;

    // User 2 client
    supabaseUser2 = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: authData2 } = await supabaseUser2.auth.signInWithPassword({
      email: 'test-user-2@example.com',
      password: 'testpassword123'
    });
    user2Id = authData2.user!.id;

    // Create a test cycle for user 1
    const { data } = await supabaseUser1
      .from('cycles')
      .insert({
        title: 'Test Cycle',
        domain: 'Testing',
        user_id: user1Id
      })
      .select()
      .single();

    testCycleId = data!.id;
  });

  afterAll(async () => {
    // Cleanup: Delete test cycle
    await supabaseUser1
      .from('cycles')
      .delete()
      .eq('id', testCycleId);

    // Sign out users
    await supabaseUser1.auth.signOut();
    await supabaseUser2.auth.signOut();
  });

  describe('Cycles Table', () => {
    it('should allow user to view their own cycles', async () => {
      const { data, error } = await supabaseUser1
        .from('cycles')
        .select()
        .eq('user_id', user1Id);

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
      expect(data![0].id).toBe(testCycleId);
    });

    it('should not allow user to view other users cycles', async () => {
      const { data, error } = await supabaseUser2
        .from('cycles')
        .select()
        .eq('user_id', user1Id);

      expect(error).toBeNull();
      expect(data).toHaveLength(0);
    });

    it('should allow user to insert their own cycles', async () => {
      const { data, error } = await supabaseUser1
        .from('cycles')
        .insert({
          title: 'New Cycle',
          domain: 'Testing',
          user_id: user1Id
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data!.user_id).toBe(user1Id);

      // Cleanup
      await supabaseUser1.from('cycles').delete().eq('id', data!.id);
    });

    it('should not allow user to insert cycles for other users', async () => {
      const { error } = await supabaseUser1
        .from('cycles')
        .insert({
          title: 'Malicious Cycle',
          domain: 'Hacking',
          user_id: user2Id // Trying to insert for user 2
        });

      expect(error).toBeDefined();
      expect(error!.code).toBe('42501'); // RLS policy violation
    });

    it('should allow user to update their own cycles', async () => {
      const { error } = await supabaseUser1
        .from('cycles')
        .update({ status: 'active' })
        .eq('id', testCycleId);

      expect(error).toBeNull();
    });

    it('should not allow user to update other users cycles', async () => {
      const { data, error } = await supabaseUser2
        .from('cycles')
        .update({ status: 'archived' })
        .eq('id', testCycleId)
        .select();

      expect(error).toBeNull(); // No error, but...
      expect(data).toHaveLength(0); // No rows affected
    });

    it('should allow user to delete their own cycles', async () => {
      // Create a cycle to delete
      const { data: newCycle } = await supabaseUser1
        .from('cycles')
        .insert({
          title: 'Cycle to Delete',
          domain: 'Testing',
          user_id: user1Id
        })
        .select()
        .single();

      const { error } = await supabaseUser1
        .from('cycles')
        .delete()
        .eq('id', newCycle!.id);

      expect(error).toBeNull();
    });

    it('should not allow user to delete other users cycles', async () => {
      const { data, error } = await supabaseUser2
        .from('cycles')
        .delete()
        .eq('id', testCycleId)
        .select();

      expect(error).toBeNull();
      expect(data).toHaveLength(0); // No rows affected
    });
  });

  describe('Cycle Stages Table', () => {
    let testStageId: string;

    beforeAll(async () => {
      // Create a test stage for user 1's cycle
      const { data } = await supabaseUser1
        .from('cycle_stages')
        .insert({
          cycle_id: testCycleId,
          stage_type: 'planning_define_goals',
          title: 'Test Stage'
        })
        .select()
        .single();

      testStageId = data!.id;
    });

    it('should allow user to view stages for their cycles', async () => {
      const { data, error } = await supabaseUser1
        .from('cycle_stages')
        .select()
        .eq('cycle_id', testCycleId);

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
    });

    it('should not allow user to view stages for other users cycles', async () => {
      const { data, error } = await supabaseUser2
        .from('cycle_stages')
        .select()
        .eq('cycle_id', testCycleId);

      expect(error).toBeNull();
      expect(data).toHaveLength(0);
    });

    // Add more stage tests...
  });

  describe('Cyclo Interactions Table', () => {
    it('should allow user to insert their own interactions', async () => {
      const { data, error } = await supabaseUser1
        .from('cyclo_interactions')
        .insert({
          cycle_id: testCycleId,
          user_id: user1Id,
          role: 'user',
          content: 'Test message'
        })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();

      // Cleanup
      await supabaseUser1
        .from('cyclo_interactions')
        .delete()
        .eq('id', data!.id);
    });

    it('should not allow user to insert interactions for other users', async () => {
      const { error } = await supabaseUser1
        .from('cyclo_interactions')
        .insert({
          cycle_id: testCycleId,
          user_id: user2Id, // Wrong user
          role: 'user',
          content: 'Impersonation attempt'
        });

      expect(error).toBeDefined();
    });

    // Add more interaction tests...
  });
});
```

**To run integration tests:**
```bash
npm run test:integration
```

---

## Test Execution Checklist

- [ ] Manual testing completed (all TCs passed)
- [ ] pgTAP tests written and passing
- [ ] Integration tests written and passing
- [ ] Service role access verified
- [ ] Cross-user access restrictions verified
- [ ] Edge cases tested (null values, cascading deletes, etc.)
- [ ] Performance impact of RLS policies measured

## Security Considerations

1. **Service Role Access**: Ensure service role credentials are never exposed to client-side code
2. **Token Validation**: Verify that JWT tokens are properly validated
3. **Bypass Mechanisms**: Document any legitimate RLS bypass mechanisms (e.g., for admin functions)
4. **Audit Logging**: Consider implementing audit logs for sensitive operations

## Performance Monitoring

Monitor query performance with RLS enabled:

```sql
-- Check query execution plan
EXPLAIN ANALYZE
SELECT * FROM cycles WHERE user_id = '<user_uuid>';

-- Check if indexes are being used effectively
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE tablename IN ('cycles', 'cycle_stages', 'cyclo_interactions');
```

## Troubleshooting

### Common Issues

1. **Policy not applying**: Ensure RLS is enabled on the table
   ```sql
   ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
   ```

2. **Unexpected access denied**: Check if JWT claims are properly set
   ```sql
   SELECT current_setting('request.jwt.claim.sub', true);
   ```

3. **Performance degradation**: Verify indexes are properly set up for RLS policy conditions

---

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | __________ | __________ | __________ |
| QA Engineer | __________ | __________ | __________ |
| Security Reviewer | __________ | __________ | __________ |
| Database Admin | __________ | __________ | __________ |
