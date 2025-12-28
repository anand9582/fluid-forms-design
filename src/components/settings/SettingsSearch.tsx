import { useState } from "react";
import { Search, Clock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchResult {
  category: string;
  setting: string;
  path: string;
}

const mockResults: SearchResult[] = [
    { category: "Devices", setting: "Camera Recording Quality", path: "/settings/devices" },
    { category: "Storage", setting: "Retention Period", path: "/settings/storage" },
    { category: "Network", setting: "Bandwidth Limit", path: "/settings/network" },
    { category: "Users", setting: "Password Policy", path: "/settings/users" },
];

interface SettingsSearchProps {
  className?: string;
}

export function SettingsSearch({ className }: SettingsSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredResults = query
    ? mockResults.filter(
        (r) =>
          r.setting.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search settings..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 pr-10 bg-card border-border/50 focus-visible:ring-1 focus-visible:ring-primary"
        />
        {query && (
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">
            ESC
          </kbd>
        )}
      </div>

      {isFocused && (query || true) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-xl border border-border shadow-lg z-50 overflow-hidden animate-fade-in">
          {query && filteredResults.length > 0 ? (
            <div className="py-2">
              <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Search Results
              </p>
              {filteredResults.map((result, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-accent transition-colors text-left group"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{result.setting}</p>
                    <p className="text-xs text-muted-foreground">{result.category}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No settings found</p>
            </div>
          ) : (
            <div className="py-2">
              <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Recent Searches
              </p>
              {["Camera recording", "Password policy", "Storage cleanup"].map((item, idx) => (
                <button
                  key={idx}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent transition-colors text-left"
                  onClick={() => setQuery(item)}
                >
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-foreground">{item}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
