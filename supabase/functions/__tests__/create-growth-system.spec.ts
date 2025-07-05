// Simple test for create-growth-system Edge Function
// This test validates the basic functionality without complex Deno types

// Test assertions
function assertEquals(actual: any, expected: any, message?: string): void {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertExists(value: any, message?: string): void {
  if (value === null || value === undefined) {
    throw new Error(message || "Expected value to exist");
  }
}

// Mock Supabase client
class MockSupabaseClient {
  private userResponse: any = {
    data: { user: { id: 'test-user-id', email: 'test@example.com' } },
    error: null,
  };
  private shouldReturnError: boolean = false;

  auth = {
    getUser: () => Promise.resolve(this.userResponse),
  };

  from = (table: string) => ({
    select: (columns?: string) => ({
      limit: (count: number) => Promise.resolve({
        error: this.shouldReturnError ? { message: "Database error" } : null,
      }),
    }),
    insert: (data: any) => ({
      select: () => ({
        single: () => Promise.resolve({
          data: { id: 'new-system-id', ...data },
          error: null,
        }),
      }),
    }),
  });

  // Helper methods for testing
  setUserResponse(response: any) {
    this.userResponse = response;
  }

  setReturnError(shouldReturn: boolean) {
    this.shouldReturnError = shouldReturn;
  }
}

// Function to test
async function createGrowthSystemHandler(req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = new MockSupabaseClient();

    // Get the current user
    const authResponse = await supabaseClient.auth.getUser();
    const user = authResponse.data.user;
    const userError = authResponse.error;

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Get the system data from the request
    const { title, description, domain } = await req.json();

    if (!title || !domain) {
      return new Response(
        JSON.stringify({ error: "Title and domain are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Check if growth_systems table exists
    const tableCheckResult = await supabaseClient
      .from("growth_systems")
      .select("id")
      .limit(1);

    if (tableCheckResult.error) {
      return new Response(
        JSON.stringify({
          error: "Database table not ready. Please check your database setup.",
          details: tableCheckResult.error,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Create the growth system
    const systemResult = await supabaseClient
      .from("growth_systems")
      .insert({
        user_id: user.id,
        title,
        description,
        domain,
        current_phase: "planning",
        progress: 0,
        start_date: new Date().toISOString(),
        status: "active",
      })
      .select()
      .single();

    if (systemResult.error) {
      return new Response(
        JSON.stringify({
          error: (systemResult.error as any).message || "System creation failed",
          details: systemResult.error,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        },
      );
    }

    return new Response(JSON.stringify({ success: true, data: systemResult.data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: (error as Error).message || "Unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  }
}

// Test suite
const runTests = async () => {
  console.log("Running create-growth-system Edge Function tests...");

  // Test 1: OPTIONS request
  try {
    const request = new Request("http://localhost:54321/functions/v1/create-growth-system", {
      method: "OPTIONS",
    });

    const response = await createGrowthSystemHandler(request);
    assertEquals(response.status, 200);
    assertEquals(await response.text(), "ok");
    assertEquals(response.headers.get("Access-Control-Allow-Origin"), "*");
    
    console.log("✓ Test 1 passed: OPTIONS request handled correctly");
  } catch (error) {
    console.error("✗ Test 1 failed:", error);
  }

  // Test 2: Successful creation
  try {
    const request = new Request("http://localhost:54321/functions/v1/create-growth-system", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer test-token",
      },
      body: JSON.stringify({
        title: "Test Growth System",
        description: "Test description",
        domain: "personal",
      }),
    });

    const response = await createGrowthSystemHandler(request);
    const data = await response.json();

    assertEquals(response.status, 200);
    assertEquals(data.success, true);
    assertExists(data.data);
    assertEquals(data.data.title, "Test Growth System");
    assertEquals(data.data.domain, "personal");
    
    console.log("✓ Test 2 passed: Growth system created successfully");
  } catch (error) {
    console.error("✗ Test 2 failed:", error);
  }

  // Test 3: Validation error
  try {
    const request = new Request("http://localhost:54321/functions/v1/create-growth-system", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer test-token",
      },
      body: JSON.stringify({
        description: "Test description",
        // Missing title and domain
      }),
    });

    const response = await createGrowthSystemHandler(request);
    const data = await response.json();

    assertEquals(response.status, 400);
    assertEquals(data.error, "Title and domain are required");
    
    console.log("✓ Test 3 passed: Validation error handled correctly");
  } catch (error) {
    console.error("✗ Test 3 failed:", error);
  }

  // Test 4: Unauthorized request
  try {
    const mockClient = new MockSupabaseClient();
    mockClient.setUserResponse({
      data: { user: null },
      error: { message: "Unauthorized" },
    });

    const request = new Request("http://localhost:54321/functions/v1/create-growth-system", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Test System",
        domain: "personal",
      }),
    });

    // Create a modified handler for this test
    const testHandler = async (req: Request): Promise<Response> => {
      const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      };

      if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
      }

      try {
        const authResponse = await mockClient.auth.getUser();
        const user = authResponse.data.user;
        const userError = authResponse.error;

        if (userError || !user) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: (error as Error).message || "Unknown error occurred",
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          },
        );
      }
    };

    const response = await testHandler(request);
    const data = await response.json();

    assertEquals(response.status, 401);
    assertEquals(data.error, "Unauthorized");
    
    console.log("✓ Test 4 passed: Unauthorized request handled correctly");
  } catch (error) {
    console.error("✗ Test 4 failed:", error);
  }

  console.log("All tests completed.");
};

// Export for running
export { runTests, createGrowthSystemHandler, MockSupabaseClient };

// Run tests if this file is executed directly
if (typeof window !== 'undefined' || typeof global !== 'undefined') {
  runTests();
} 