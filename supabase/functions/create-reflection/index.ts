import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Get the reflection data from the request
    const { title, content, cycle_phase, domain, system_id, insights, tags } =
      await req.json();

    if (!title || !content || !cycle_phase || !domain) {
      return new Response(
        JSON.stringify({
          error: "Title, content, cycle phase, and domain are required",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Create the reflection
    const { data: reflection, error: reflectionError } = await supabaseClient
      .from("reflections")
      .insert({
        user_id: user.id,
        system_id,
        title,
        content,
        cycle_phase,
        domain,
      })
      .select()
      .single();

    if (reflectionError) {
      return new Response(JSON.stringify({ error: reflectionError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Add insights if provided
    if (insights && Array.isArray(insights) && insights.length > 0) {
      const insightInserts = insights.map((content) => ({
        reflection_id: reflection.id,
        content,
      }));

      const { error: insightsError } = await supabaseClient
        .from("reflection_insights")
        .insert(insightInserts);

      if (insightsError) {
        console.error("Error adding insights:", insightsError);
      }
    }

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagInserts = tags.map((tag) => ({
        reflection_id: reflection.id,
        tag,
      }));

      const { error: tagsError } = await supabaseClient
        .from("reflection_tags")
        .insert(tagInserts);

      if (tagsError) {
        console.error("Error adding tags:", tagsError);
      }
    }

    // Create an activity for the new reflection
    await supabaseClient.from("growth_activities").insert({
      user_id: user.id,
      action: "Created reflection",
      item: title,
      system_id: system_id || null,
    });

    return new Response(JSON.stringify({ success: true, data: reflection }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating reflection:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
