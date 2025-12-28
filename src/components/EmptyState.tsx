import { MessageSquare, Sparkles, Code, Pen } from "lucide-react";

interface EmptyStateProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  { icon: Sparkles, text: "Explain quantum computing", color: "text-primary" },
  { icon: Pen, text: "Write a poem", color: "text-accent" },
  { icon: Code, text: "Help me code", color: "text-green-500" },
];

export function EmptyState({ onSuggestionClick }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 animate-fade-in">
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20">
        <MessageSquare className="h-10 w-10 text-primary" />
      </div>

      <h2 className="mb-3 text-2xl font-bold tracking-tight">Start a conversation!</h2>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        Ask me anything. I can help with explanations, creative writing, coding, and more.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.text}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="group flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10"
          >
            <suggestion.icon className={`h-4 w-4 ${suggestion.color}`} />
            <span>{suggestion.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
