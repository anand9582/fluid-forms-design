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
      <aside className="hidden md:flex fixed left-0 top-14 z-40 h-[calc(100vh-56px)] w-20 bg-white border-r border-gray-100 flex-col shadow-sm">
        {/* Logo */}
        <div className="flex items-center justify-center py-5">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 py-2">
          <ul className="flex flex-col items-center space-y-1">
            {menuItems.map((item) => (
              <li key={item.label} className="w-full relative">
                {item.active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                )}
                <button
                  className={cn(
                    "w-full flex flex-col items-center gap-1.5 py-3 transition-colors",
                    item.active
                      ? "text-blue-500"
                      : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
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
                <button className="w-full flex flex-col items-center gap-1.5 py-3 text-gray-400 hover:text-gray-600 transition-colors">
                  <item.icon className="w-5 h-5" strokeWidth={1.5} />
                  <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-bottom shadow-lg">
        <ul className="flex items-center justify-around py-3">
          {menuItems.map((item) => (
            <li key={item.label} className="relative">
              {item.active && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-b-full" />
              )}
              <button
                className={cn(
                  "flex flex-col items-center gap-1.5 px-2 py-1 transition-colors",
                  item.active
                    ? "text-blue-500"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                <item.icon className="w-5 h-5" strokeWidth={1.5} />
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
