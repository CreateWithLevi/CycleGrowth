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

    // Get the knowledge item data from the request
    const { title, content, tags, connections, source } = await req.json();

    if (!title || !content) {
      return new Response(
        JSON.stringify({ error: "Title and content are required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Create the knowledge item
    const { data: knowledgeItem, error: knowledgeError } = await supabaseClient
      .from("knowledge_items")
      .insert({
        user_id: user.id,
        title,
        content,
        source,
      })
      .select()
      .single();

    if (knowledgeError) {
      return new Response(JSON.stringify({ error: knowledgeError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagInserts = tags.map((tag) => ({
        knowledge_id: knowledgeItem.id,
        tag,
      }));

      const { error: tagsError } = await supabaseClient
        .from("knowledge_tags")
        .insert(tagInserts);

      if (tagsError) {
        console.error("Error adding tags:", tagsError);
      }
    }

    // Add connections if provided
    if (connections && Array.isArray(connections) && connections.length > 0) {
      const connectionInserts = connections.map((targetId) => ({
        source_id: knowledgeItem.id,
        target_id: targetId,
      }));

      const { error: connectionsError } = await supabaseClient
        .from("knowledge_connections")
        .insert(connectionInserts);

      if (connectionsError) {
        console.error("Error adding connections:", connectionsError);
      }
    }

    // Create an activity for the new knowledge item
    await supabaseClient.from("growth_activities").insert({
      user_id: user.id,
      action: "Created knowledge item",
      item: title,
      system_id: null,
    });

    return new Response(
      JSON.stringify({ success: true, data: knowledgeItem }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error creating knowledge item:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
