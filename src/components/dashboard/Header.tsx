import { Search, Wifi, FileText, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { isAltTheme, toggleTheme } = useTheme();

  const headerBg = isAltTheme ? "bg-gradient-to-r from-purple-900 to-indigo-900" : "bg-[#0a1628]";
  const primaryColor = isAltTheme ? "bg-purple-500" : "bg-primary";

  return (
    <header className={`h-14 ${headerBg} flex items-center justify-between px-3 md:px-4 lg:px-6 relative sticky top-0 z-50 transition-colors duration-300`}>
      {/* Logo - Clickable to toggle theme */}
      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-white font-semibold text-base md:text-lg">CamPulse</span>
          <span className={`text-white text-[10px] md:text-xs font-bold ${isAltTheme ? "bg-purple-500/30" : "bg-primary/20"} px-1.5 py-0.5 rounded`}>TAi</span>
        </button>
      </div>

      {/* Search - Desktop */}
      <div className="hidden md:flex flex-1 max-w-lg mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search Cameras, event, location or device IDs..."
            className="pl-10 bg-[#1a2a42] border-[#2a3a52] text-white placeholder:text-gray-400 h-9 rounded-full w-full"
          />
        </div>
      </div>

      {/* Mobile Search Button */}
      <button 
        onClick={() => setSearchOpen(!searchOpen)}
        className="md:hidden p-2 text-white/70"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 ${headerBg} p-3 border-b border-white/10 z-50`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-[#1a2a42] border-[#2a3a52] text-white placeholder:text-gray-400 h-9 rounded-full w-full"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Right Side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Device Status */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-[#1a2a42] rounded-full">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-white">138 / 142 device online</span>
        </div>

        {/* AI Report Button */}
        <Button className={`${primaryColor} hover:opacity-90 text-white gap-2 h-8 rounded-md px-2 md:px-3 transition-colors duration-300`}>
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">AI Report</span>
        </Button>

        {/* Language */}
        <button className="hidden lg:flex items-center gap-1 px-2 py-1 text-sm text-white/70 hover:text-white transition-colors">
          <Globe className="w-4 h-4" />
          <span>ENG</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-4 border-l border-white/10">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-white">Kate Russell</p>
            <p className="text-xs text-white/50">Project Manager</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center overflow-hidden">
            <span className="text-sm font-semibold text-white">KR</span>
          </div>
        </div>
      </div>
    </header>
  );
}
