import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Video,
  PlayCircle,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Alerts,
  Emap,
  Health,
  lighticons,
  helpCircle,
} from "@/components/ui/icons";

import { useTheme } from "@/context/ThemeContext";
import { SettingsSubNav } from "@/./components/layout/SettingsSubNav";


const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Video, label: "Live view", path: "/live" },
  { icon: PlayCircle, label: "Playback", path: "/playback" },
  // { icon: Alerts, label: "Alerts", path: "/alerts" },
  // { icon: Emap, label: "Emap", path: "/emap" },
  // { icon: Health, label: "Health", path: "/health" },
];

const bottomItems = [
  // { icon: lighticons, label: "Light", path: "/theme" },
  { icon: Settings, label: "Settings", path: "/settings" },
  // { icon: helpCircle, label: "Help", path: "/help" },
];

export function Sidebar() {
  const location = useLocation();
  const { isAltTheme } = useTheme();
 const isSettingsSection = location.pathname.startsWith("/settings");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  

  return (
    <>
      {/* ---------------- Desktop Sidebar ---------------- */}
      <aside className="hidden md:flex fixed left-0 top-14 z-40 h-[calc(100vh-56px)] w-[80px] bg-white border-r flex-col">

        {/* Main Menu */}
        <nav className="flex-1 py-3">
          <ul className="flex flex-col items-center gap-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path} className="w-full">
                  <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "w-full flex flex-col items-center gap-1 py-2 transition-colors",
                      isActive
                        ? "text-black"
                        : "text-black-500 hover:text-gray-700"
                    )
                  }
                >
                    <item.icon
                      className={cn(
                        "w-5 h-5  rounded",
                        isActive
                          ? "bg-slate-200 text-black w-7 h-7 p-1"
                          : "text-black-500"
                      )}
                      strokeWidth={1.5}
                    />
                    <span className="text-[12px] font-medium font-roboto">
                        {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Menu */}
        <div className="py-4">
          <ul className="flex flex-col items-center gap-1">
            {bottomItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <li key={item.path} className="w-full">
                  <NavLink
                    to={item.path}
                    className={cn(
                      "w-full flex flex-col items-center gap-1.5 py-3 transition-colors",
                      isActive
                        ? "text-black"
                        : "text-black-500 hover:text-gray-700"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5  rounded",
                        isActive
                          ? "bg-slate-200  text-black w-7 h-7 p-1"
                          : "text-black-500"
                      )} />
                    <span className="text-[12px] font-medium font-roboto">
                        {item.label}
                    </span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {/* ---------------- Mobile Bottom Navigation ---------------- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a1628] border-t border-white/10">
        <ul className="flex items-center justify-around py-2">
          {menuItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center gap-1 px-2 py-2",
                    isActive ? "text-white" : "text-white/50"
                  )}
                >
                  <item.icon className="w-7 h-7" strokeWidth={1.5} />
                    <span className="text-[9px]">{item.label}</span>
                </NavLink>
              </li>
            );
          })}

          <li>
            <NavLink
                to="/settings"
                className="flex flex-col items-center gap-1 px-3 py-2 text-white/50"
              >
              <Settings className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[9px]">More</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
