import { ArrowLeft, Settings } from "lucide-react";

export function SettingsHeader() {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-4">
      <button className="p-1.5 hover:bg-muted rounded-md transition-colors">
        <ArrowLeft size={18} className="text-muted-foreground" />
      </button>
      <div className="flex items-center gap-2">
        <Settings size={18} className="text-muted-foreground" />
        <span className="font-semibold text-foreground">Settings</span>
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <span className="mx-2">›</span>
        <span>Manage Users</span>
      </div>
    </header>
  );
}
