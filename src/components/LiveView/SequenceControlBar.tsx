import { Play, Pause, SkipBack, SkipForward, ChevronDown } from "lucide-react";
import { SidebarCameraStore } from "@/Store/SidebarCameraStore";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function SequenceControlBar() {
    const { isSequencing, setIsSequencing, sequencingPlaylist } = SidebarCameraStore();

    if (sequencingPlaylist?.length === 0) return null;

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 px-1 py-1 h-[46px] min-w-[320px]">
                {/* Sequence Toggle */}
                <div className="flex items-center px-3 border-r border-slate-100/80 h-full">
                    <Select
                        value={isSequencing ? "on" : "off"}
                        onValueChange={(val) => setIsSequencing(val === "on")}
                    >
                        <SelectTrigger className="border-none shadow-none focus:ring-0 h-8 gap-2 bg-slate-50 rounded-full px-3 text-[13px] font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                            <span className="whitespace-nowrap">Sequence: <span className={cn("font-bold", isSequencing ? "text-blue-600" : "text-slate-400")}>{isSequencing ? "On" : "Off"}</span></span>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-slate-100">
                            <SelectItem value="on" className="text-sm font-medium">On</SelectItem>
                            <SelectItem value="off" className="text-sm font-medium">Off</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Global Interval */}
                <div className="flex items-center px-4 border-r border-slate-100/80 h-full">
                    <Select defaultValue="10s">
                        <SelectTrigger className="border-none shadow-none focus:ring-0 h-8 w-20 bg-slate-50 rounded-full px-3 text-[13px] font-bold text-slate-700 hover:bg-slate-100 transition-colors">
                            <SelectValue placeholder="10s" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl border-slate-100">
                            <SelectItem value="5s" className="text-sm font-bold">5s</SelectItem>
                            <SelectItem value="10s" className="text-sm font-bold">10s</SelectItem>
                            <SelectItem value="15s" className="text-sm font-bold">15s</SelectItem>
                            <SelectItem value="30s" className="text-sm font-bold">30s</SelectItem>
                            <SelectItem value="1m" className="text-sm font-bold">1m</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-1 px-4 ml-auto">
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all active:scale-90">
                        <SkipBack size={18} fill="currentColor" className="opacity-60" />
                    </button>
                    <button className="p-2 hover:bg-blue-50 rounded-full text-blue-600 hover:text-blue-700 transition-all active:scale-95">
                        {isSequencing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-all active:scale-90">
                        <SkipForward size={18} fill="currentColor" className="opacity-60" />
                    </button>
                </div>
            </div>
        </div>
    );
}
