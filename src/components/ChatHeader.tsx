import { Moon, Sun, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onClearHistory: () => void;
  isLoading: boolean;
}

export function ChatHeader({ isDark, onToggleTheme, onClearHistory, isLoading }: ChatHeaderProps) {
  return (
    <header className="glass sticky top-0 z-10 px-4 py-3 md:px-6">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Chat AI</h1>
            <p className="text-xs text-muted-foreground">Powered by Subfeed</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearHistory}
            disabled={isLoading}
            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
            title="Clear chat history"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
