import { Search, Wifi, FileText, Globe, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="h-14 bg-[#0a1628] flex items-center justify-between px-4 lg:px-6">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-lg">CamPulse</span>
          <span className="text-primary text-xs font-bold bg-primary/20 px-1.5 py-0.5 rounded">TAi</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-lg mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search  Cameras, event, location or device IDs..."
            className="pl-10 bg-[#1a2a42] border-[#2a3a52] text-white placeholder:text-gray-400 h-9 rounded-full"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Device Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#1a2a42] rounded-full">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-white">138 / 142 device online</span>
        </div>

        {/* AI Report Button */}
        <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-8 rounded-md">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">AI Report</span>
        </Button>

        {/* Language */}
        <button className="hidden lg:flex items-center gap-1 px-2 py-1 text-sm text-white/70 hover:text-white transition-colors">
          <Globe className="w-4 h-4" />
          <span>ENG</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="hidden sm:block text-right">
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
