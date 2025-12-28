import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  response: string;
  token_estimate?: number;
  session_id?: string;
  timestamp?: string;
}

let currentSessionId: string | null = null;

export async function sendMessage(message: string): Promise<ChatResponse> {
  const { data, error } = await supabase.functions.invoke('chat', {
    body: { 
      message, 
      session_id: currentSessionId 
    },
  });

  if (error) {
    console.error('Chat error:', error);
    throw new Error(error.message || 'Failed to send message');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  if (data.session_id) {
    currentSessionId = data.session_id;
  }

  return data;
}

export async function clearHistory(): Promise<void> {
  currentSessionId = null;
}

export function getCurrentSessionId(): string | null {
  return currentSessionId;
}
