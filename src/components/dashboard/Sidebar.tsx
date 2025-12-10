import {
  LayoutGrid,
  MonitorPlay,
  CirclePlay,
  Bell,
  User,
  Activity,
  Sparkles,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutGrid, label: "Dashboard", active: true },
  { icon: MonitorPlay, label: "Live view" },
  { icon: CirclePlay, label: "Playback" },
  { icon: Bell, label: "Alerts" },
  { icon: User, label: "Emap" },
  { icon: Activity, label: "Health" },
];

const bottomItems = [
  { icon: Sparkles, label: "Light" },
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Help" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-14 z-40 h-[calc(100vh-56px)] w-[72px] bg-[#0a1628] flex-col">
        {/* Logo */}
        <div className="flex items-center justify-center py-4">
          <div className="w-7 h-7 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-white/80" strokeWidth={1.5} />
          </div>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 py-2">
          <ul className="flex flex-col items-center space-y-1">
            {menuItems.map((item) => (
              <li key={item.label} className="w-full">
                <button
                  className={cn(
                    "w-full flex flex-col items-center gap-1.5 py-3 transition-colors",
                    item.active
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  )}
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-[10px] font-normal tracking-wide">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="py-4">
          <ul className="flex flex-col items-center space-y-1">
            {bottomItems.map((item) => (
              <li key={item.label} className="w-full">
                <button className="w-full flex flex-col items-center gap-1.5 py-3 text-white/50 hover:text-white/80 transition-colors">
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-[10px] font-normal tracking-wide">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a1628] safe-area-bottom">
        <ul className="flex items-center justify-around py-3">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                className={cn(
                  "flex flex-col items-center gap-1.5 px-2 py-1 transition-colors",
                  item.active
                    ? "text-white"
                    : "text-white/50 hover:text-white/80"
                )}
              >
                <item.icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[10px] font-normal tracking-wide">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
