import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUBFEED_API_KEY = Deno.env.get('SUBFEED_API_KEY');
    const SUBFEED_ENTITY_ID = Deno.env.get('SUBFEED_ENTITY_ID');

    if (!SUBFEED_API_KEY || !SUBFEED_ENTITY_ID) {
      console.error('Missing Subfeed configuration');
      throw new Error('Subfeed API not configured');
    }

    const { message, session_id, action } = await req.json();
    console.log('Received request:', { message, session_id, action });

    // Handle clear history action
    if (action === 'clear') {
      console.log('Clearing session');
      return new Response(
        JSON.stringify({ success: true, message: 'Session cleared' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!message) {
      throw new Error('Message is required');
    }

    const API_URL = `https://api.subfeed.app/v1/entity/${SUBFEED_ENTITY_ID}/chat`;
    console.log('Calling Subfeed API:', API_URL);

    const body: Record<string, string> = { message };
    if (session_id) {
      body.session_id = session_id;
    }

    // Helper function to call Subfeed API
    const callSubfeed = async () => {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SUBFEED_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('Subfeed API response status:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Subfeed API error:', response.status, errorText);
        throw new Error(`Subfeed API Error: ${response.status}`);
      }

      return response.json();
    };

    const data = await callSubfeed();
    console.log('NEW Subfeed API response:', data);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Chat function error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
