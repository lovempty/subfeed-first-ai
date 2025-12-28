import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatHeader } from "@/components/ChatHeader";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { EmptyState } from "@/components/EmptyState";
import { TypingIndicator } from "@/components/TypingIndicator";
import { sendMessage, clearHistory, type ChatMessage as ChatMessageType } from "@/lib/subfeed";

const Index = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [failedMessageId, setFailedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setMessages([]);
    setFailedMessageId(null);
    toast({
      title: "Chat cleared",
      description: "Your conversation history has been cleared.",
    });
  };

  const handleSend = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setFailedMessageId(null);

    try {
      const response = await sendMessage(content);
      
      const assistantMessage: ChatMessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setFailedMessageId(userMessage.id);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = (messageContent: string) => {
    // Remove the failed message and retry
    setMessages((prev) => prev.filter((m) => m.id !== failedMessageId));
    setFailedMessageId(null);
    handleSend(messageContent);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <ChatHeader
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onClearHistory={handleClearHistory}
        isLoading={isLoading}
      />

      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {messages.length === 0 ? (
          <EmptyState onSuggestionClick={handleSend} />
        ) : (
          <div className="mx-auto max-w-4xl pb-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                hasError={message.id === failedMessageId}
                onRetry={
                  message.id === failedMessageId
                    ? () => handleRetry(message.content)
                    : undefined
                }
              />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
};

export default Index;
