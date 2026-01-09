import { ArrowLeft, Settings } from "lucide-react";

interface SettingsHeaderProps {
  title?: string;
  breadcrumb?: string;
  onBack?: () => void;
}

export function SettingsHeader({
  title = "Settings",
  breadcrumb = "Manage Users",
  onBack,
}: SettingsHeaderProps) {
  return (
    <header className="bg-card border-b border-border px-4 py-2">
      
      {/* ROW 1 */}
      <div className="flex items-center gap-3 h-10">
        <button
          onClick={onBack}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
        >
          <ArrowLeft size={18} className="text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2">
          <Settings size={18} className="text-muted-foreground" />
          <span className="font-semibold text-foreground">{title}</span>
        </div>
      </div>

      {/* ROW 2 (Breadcrumb) */}
      <div className="flex items-center text-sm text-muted-foreground pl-9">
        <span>{title}</span>
        <span className="mx-2">›</span>
        <span className="text-foreground font-roboto font-medium">{breadcrumb}</span>
      </div>
    </header>
  );
}
