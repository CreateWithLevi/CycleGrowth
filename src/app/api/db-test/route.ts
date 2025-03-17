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
    // Create a direct Supabase client using service role key for admin access
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );

    // Test database connection
    const { data: connectionTest, error: connectionError } = await supabaseAdmin
      .from("growth_systems")
      .select("id", { count: "exact" });

    if (connectionError) {
      return NextResponse.json(
        {
          success: false,
          error: "Database connection failed",
          details: connectionError,
        },
        { status: 500 },
      );
    }

    // Check RLS policies
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
      const { data: rlsData, error: rlsError } = await supabaseAdmin.rpc(
        "get_table_rls_status",
        { table_name: table },
      );

      rlsStatus[table] = {
        hasRLS: rlsError ? "Error checking" : rlsData,
        error: rlsError ? rlsError.message : null,
      };
    }

    // Get current auth settings
    const { data: authSettings, error: authError } = await supabaseAdmin
      .from("auth.config")
      .select("*");

    return NextResponse.json({
      success: true,
      connection: "Connected successfully",
      rlsStatus,
      authSettings: authError ? { error: authError.message } : authSettings,
      environment: {
        hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      {
        success: false,
        error: "Diagnostic test failed",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
