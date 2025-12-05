import { Search, Wifi, FileText, Globe, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search Cameras, event, location or device IDs..."
            className="pl-10 bg-background border-border h-10"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Device Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
          <Wifi className="w-4 h-4 text-success" />
          <span className="text-sm font-medium">138 / 142 device online</span>
        </div>

        {/* AI Report Button */}
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">AI Report</span>
        </Button>

        {/* Language */}
        <button className="hidden lg:flex items-center gap-1 px-2 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <Globe className="w-4 h-4" />
          <span>ENG</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium">Kate Russell</p>
            <p className="text-xs text-muted-foreground">Project Manager</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">KR</span>
          </div>
        </div>
      </div>
    </header>
  );
}
