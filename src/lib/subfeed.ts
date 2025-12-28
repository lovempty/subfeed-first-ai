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
  const { data, error } = await supabase.functions.invoke("chat", {
    body: {
      message,
      session_id: currentSessionId,
    },
  });

  if (error) {
    console.error("Chat error:", error);
    throw new Error(error.message || "Failed to send message");
  }

  if (!data) {
    throw new Error("Empty response from chat service");
  }

  // The backend function returns Subfeed's raw response:
  // { success, data: { response, usage, session_id? }, error }
  if (typeof (data as any).error === "string" && (data as any).error) {
    throw new Error((data as any).error);
  }

  const inner = (data as any).data ?? data;
  const responseText: string = inner?.response ?? "";
  const sessionFromResponse: string | undefined = inner?.session_id ?? (data as any).session_id;

  if (sessionFromResponse) {
    currentSessionId = sessionFromResponse;
  }

  return {
    response: responseText,
    session_id: sessionFromResponse,
    timestamp: inner?.timestamp,
    token_estimate: inner?.token_estimate,
  };
}

export async function clearHistory(): Promise<void> {
  currentSessionId = null;
}

export function getCurrentSessionId(): string | null {
  return currentSessionId;
}
