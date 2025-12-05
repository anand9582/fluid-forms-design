import { Plus, LayoutGrid, Headphones } from "lucide-react";

const actions = [
  { icon: Plus, label: "Add Device" },
  { icon: LayoutGrid, label: "Add Widget" },
  { icon: Headphones, label: "Support" },
];

export function QuickActions() {
  return (
    <div className="dashboard-card p-4 animate-fade-in" style={{ animationDelay: "0.15s" }}>
      <h3 className="font-semibold text-foreground mb-4">QUICK ACTION</h3>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <button
            key={action.label}
            className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted hover:border-primary/30 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-border group-hover:border-primary/50 flex items-center justify-center transition-colors">
              <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
