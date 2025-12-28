import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Cog,
  Camera,
  HardDrive,
  Network,
  ShieldAlert,
  Users,
  Activity,
  Puzzle,
  ChevronRight,
} from "lucide-react";

const settingsSubNav = [
  { icon: Cog, label: "System", path: "/settings/system" },
  { icon: Camera, label: "Devices", path: "/settings/devices" },
  { icon: HardDrive, label: "Storage & Retention", path: "/settings/storage" },
  { icon: Network, label: "Network", path: "/settings/network" },
  { icon: ShieldAlert, label: "Alerts & Notifications", path: "/settings/alerts" },
  { icon: Users, label: "Users & Roles", path: "/settings/users" },
  { icon: Activity, label: "System Health", path: "/settings/diagnostics" },
  { icon: Puzzle, label: "Integrations", path: "/settings/integrations" },
];

interface SettingsSubNavProps {
  variant: "desktop" | "mobile";
  onItemClick?: () => void;
  hoveredItem?: string | null;
  setHoveredItem?: (item: string | null) => void;
}

export function SettingsSubNav({
  variant,
  onItemClick,
  hoveredItem,
  setHoveredItem,
}: SettingsSubNavProps) {
  const location = useLocation();

  if (variant === "mobile") {
    return (
      <>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-6">
          Settings
        </p>
        {settingsSubNav.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/settings/system" && location.pathname === "/settings");
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </>
    );
  }

  // Desktop variant
  return (
    <div className="w-56 bg-card border-r border-border py-6 animate-fade-in">
        <div className="px-4 mb-4">
          <h2 className="text-sm font-semibold text-foreground">Settings</h2>
          <p className="text-xs text-muted-foreground mt-1">Configure your system</p>
        </div>
        <nav className="px-2 space-y-1">
          {settingsSubNav.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/settings/system" && location.pathname === "/settings");
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onMouseEnter={() => setHoveredItem?.(item.path)}
                onMouseLeave={() => setHoveredItem?.(null)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-opacity duration-200",
                    isActive || hoveredItem === item.path ? "opacity-100" : "opacity-0"
                  )}
                />
              </NavLink>
            );
          })}
        </nav>
    </div>
  );
}
