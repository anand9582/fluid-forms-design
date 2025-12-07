import {
  LayoutDashboard,
  Video,
  PlayCircle,
  Bell,
  Map,
  Activity,
  Sun,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Video, label: "Live view" },
  { icon: PlayCircle, label: "Playback" },
  { icon: Bell, label: "Alerts" },
  { icon: Map, label: "Emap" },
  { icon: Activity, label: "Health" },
];

const bottomItems = [
  { icon: Sun, label: "Light" },
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-56"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-4 py-4 border-b border-sidebar-border">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <LayoutDashboard className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                className={cn(
                  "w-full flex flex-col items-center gap-1 px-2 py-3 rounded-lg transition-colors",
                  item.active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[10px] font-medium text-center leading-tight">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-sidebar-border py-4">
        <ul className="space-y-1 px-2">
          {bottomItems.map((item) => (
            <li key={item.label}>
              <button className="w-full flex flex-col items-center gap-1 px-2 py-3 rounded-lg text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors">
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[10px] font-medium text-center leading-tight">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
}
