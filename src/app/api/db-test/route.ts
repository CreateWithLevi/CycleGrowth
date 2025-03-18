import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface RLSStatus {
  [key: string]: {
    hasRLS: boolean | string;
    error: string | null;
  };
}

export async function GET() {
  try {
    // Check environment variables first
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
      SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? "[SET]" : null,
    };

    // Log environment variables (masked for security)
    console.log("Environment variables check:", {
      NEXT_PUBLIC_SUPABASE_URL: envCheck.NEXT_PUBLIC_SUPABASE_URL
        ? "[SET]"
        : null,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: envCheck.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? "[SET]"
        : null,
      SUPABASE_SERVICE_KEY: envCheck.SUPABASE_SERVICE_KEY,
    });

    // Check if required environment variables are set
    if (!envCheck.NEXT_PUBLIC_SUPABASE_URL || !envCheck.SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required environment variables",
          details: {
            missingVars: Object.entries(envCheck)
              .filter(([_, value]) => !value)
              .map(([key]) => key),
          },
          environment: {
            hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
            hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          },
        },
        { status: 500 },
      );
    }

    // Create a direct Supabase client using service role key for admin access
    console.log("Creating Supabase admin client...");
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Test database connection
    console.log("Testing database connection...");
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from("growth_systems")
      .select("id", { count: "exact" });

    if (connectionError) {
      console.error("Database connection failed:", connectionError);
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: connectionError,
          connectionParams: {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "[SET]" : "[MISSING]",
            serviceKeyProvided: !!process.env.SUPABASE_SERVICE_KEY,
          },
        },
        { status: 500 },
      );
    }

    // Try a simpler query first to isolate issues
    console.log("Testing simple query...");
    try {
      const { data: simpleTest, error: simpleError } = await supabaseAdmin
        .from("growth_systems")
        .select("count");

      if (simpleError) {
        console.error("Simple query failed:", simpleError);
      } else {
        console.log("Simple query succeeded");
      }
    } catch (simpleQueryError) {
      console.error("Simple query exception:", simpleQueryError);
    }

    // Check RLS policies
    console.log("Checking RLS policies...");
    const tables = [
      "growth_systems",
      "growth_tasks",
      "growth_activities",
      "knowledge_items",
      "knowledge_tags",
      "knowledge_connections",
      "reflections",
      "reflection_insights",
      "reflection_tags",
      "user_cyclo_evolution",
    ];

    const rlsStatus: RLSStatus = {};

    for (const table of tables) {
      try {
        console.log(`Checking RLS for table: ${table}`);
        const { data: rlsData, error: rlsError } = await supabaseAdmin.rpc(
          "get_table_rls_status",
          { table_name: table },
        );

        rlsStatus[table] = {
          hasRLS: rlsError ? "Error checking" : rlsData,
          error: rlsError ? rlsError.message : null,
        };

        if (rlsError) {
          console.error(`RLS check error for ${table}:`, rlsError);
        }
      } catch (rpcError) {
        console.error(`RPC exception for ${table}:`, rpcError);
        rlsStatus[table] = {
          hasRLS: "Exception occurred",
          error:
            rpcError instanceof Error ? rpcError.message : String(rpcError),
        };
      }
    }

    // Get current auth settings
    console.log("Checking auth settings...");
    let authSettings;
    let authError;
    try {
      // Using auth.config was incorrect - this table doesn't exist
      // Instead, we'll check if auth is enabled by querying a known auth table
      const result = await supabaseAdmin
        .from("auth.users")
        .select("count", { count: "exact" });

      authSettings = { authEnabled: !result.error };
      authError = result.error;

      if (authError) {
        console.error("Auth settings error:", authError);
      }
    } catch (authSettingsError) {
      console.error("Auth settings exception:", authSettingsError);
      authError = authSettingsError;
    }

    console.log("Diagnostics completed successfully");
    return NextResponse.json({
      success: true,
      connection: "Connected successfully",
      rlsStatus,
      authSettings: authError
        ? { error: authError.message || String(authError) }
        : authSettings,
      environment: {
        hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      },
    });
  } catch (error: unknown) {
    console.error("Diagnostic test failed with exception:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        success: false,
        error: "Diagnostic test failed",
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        environment: {
          hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        },
      },
      { status: 500 },
    );
  }
}
