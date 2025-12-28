import { useState } from "react";
import { Copy, Check, User, Bot, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/lib/subfeed";

interface ChatMessageProps {
  message: ChatMessageType;
  onRetry?: () => void;
  hasError?: boolean;
}

export function ChatMessage({ message, onRetry, hasError }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Simple markdown rendering for code blocks
  const renderContent = (content: string | undefined) => {
    if (!content) return '';
    
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <span key={lastIndex}>{content.slice(lastIndex, match.index)}</span>
        );
      }

      // Add code block
      const language = match[1] || 'code';
      const code = match[2];
      parts.push(
        <CodeBlock key={match.index} language={language} code={code} />
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(<span key={lastIndex}>{content.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : content;
  };

  return (
    <div
      className={cn(
        "message-enter group flex gap-3 px-4 py-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser ? "bg-primary" : "bg-secondary"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <Bot className="h-4 w-4 text-secondary-foreground" />
        )}
      </div>

      <div
        className={cn(
          "relative max-w-[80%] rounded-2xl px-4 py-3 md:max-w-[70%]",
          isUser
            ? "bg-chat-user text-chat-user-foreground"
            : "bg-chat-assistant text-chat-assistant-foreground",
          hasError && "border-2 border-destructive"
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {renderContent(message.content)}
        </div>

        <div
          className={cn(
            "mt-2 flex items-center gap-2 text-xs opacity-0 transition-opacity group-hover:opacity-100",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          <span className={cn(isUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
            {formatTime(message.timestamp)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={cn(
              "h-6 w-6",
              isUser
                ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
          {hasError && onRetry && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRetry}
              className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 overflow-hidden rounded-lg bg-background/50 border border-border">
      <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
        <span className="text-xs font-medium text-muted-foreground">{language}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-6 w-6 text-muted-foreground hover:text-foreground"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="overflow-x-auto p-3">
        <code className="font-mono text-xs text-foreground">{code.trim()}</code>
      </pre>
    </div>
  );
}
