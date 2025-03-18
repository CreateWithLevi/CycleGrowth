import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check environment variables
    const envVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || null,
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null,
      SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? "[SET]" : null,
      SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID || null,
      NODE_ENV: process.env.NODE_ENV || null,
      VERCEL_ENV: process.env.VERCEL_ENV || null,
    };

    // Check if we're in a Vercel environment
    const isVercel = !!process.env.VERCEL;
    const vercelInfo = isVercel
      ? {
          VERCEL: process.env.VERCEL,
          VERCEL_ENV: process.env.VERCEL_ENV,
          VERCEL_URL: process.env.VERCEL_URL,
          VERCEL_REGION: process.env.VERCEL_REGION,
        }
      : null;

    return NextResponse.json({
      success: true,
      environment: {
        variables: {
          NEXT_PUBLIC_SUPABASE_URL: envVars.NEXT_PUBLIC_SUPABASE_URL
            ? "[SET]"
            : null,
          NEXT_PUBLIC_SUPABASE_ANON_KEY: envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? "[SET]"
            : null,
          SUPABASE_SERVICE_KEY: envVars.SUPABASE_SERVICE_KEY,
          SUPABASE_PROJECT_ID: envVars.SUPABASE_PROJECT_ID ? "[SET]" : null,
          NODE_ENV: envVars.NODE_ENV,
        },
        isVercel,
        vercelInfo: isVercel
          ? {
              environment: vercelInfo?.VERCEL_ENV,
              region: vercelInfo?.VERCEL_REGION,
            }
          : null,
      },
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        success: false,
        error: "Environment check failed",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
