import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_VIVEK_URL } from "@/components/Config/api";
import {
    Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, Maximize, ExternalLink, X
} from "lucide-react";
import { SidebarCameraStore } from "@/Store/SidebarCameraStore";
import useGridStore from "@/Store/UseGridStore";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export function SequenceControlBar() {
    const { isSequencing, setIsSequencing } = SidebarCameraStore();

    // Explicitly bind to grid store functions and state to avoid unnecessary re-renders
    const layout = useGridStore((state) => state.layout);
    const assignCameraToSlot = useGridStore((state) => state.assignCameraToSlot);
    const clearSlot = useGridStore((state) => state.clearSlot);
    const clearAllSlots = useGridStore((state) => state.clearAllSlots);

    const [isExpanded, setIsExpanded] = useState(true);
    const [sequenceType, setSequenceType] = useState<"OFF" | "CAMERA" | "VIEW">("OFF");
    const [availableSequences, setAvailableSequences] = useState<any[]>([]);
    const [selectedSequenceId, setSelectedSequenceId] = useState<string>("");

    // Engine State
    const [fetchedSequence, setFetchedSequence] = useState<any>(null);
    const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
    const individualTimersRef = useRef<NodeJS.Timeout[]>([]);

    // Sync external sequencing state with local sequenceType if it's turned off externally
    useEffect(() => {
        if (!isSequencing && sequenceType !== "OFF") {
            // Keep the selected sequence but pause playback
        }
    }, [isSequencing]);

    // Fullscreen toggle logic
    const toggleFullScreen = () => {
        const el = document.getElementById("live-view-grid-container");
        if (!el) return;

        if (!document.fullscreenElement) {
            el.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Clear grid logic
    const handleClearGrid = () => {
        clearAllSlots();
        setIsSequencing(false);
        setSequenceType("OFF");
        setSelectedSequenceId("");
    };

    // Fetch sequences when type changes
    useEffect(() => {
        if (sequenceType === "OFF") {
            setIsSequencing(false);
            setAvailableSequences([]);
            setSelectedSequenceId("");
            setFetchedSequence(null);
            return;
        }

        const fetchSequences = async () => {
            try {
                const res = await axios.get(`${API_VIVEK_URL}/api/getAllSequencesBySequenceType/${sequenceType}`);
                if (res.data?.success) {
                    const seqs = res.data.data || [];
                    setAvailableSequences(seqs);
                    if (seqs.length > 0) {
                        handleSequenceSelect(seqs[0].sequenceId.toString());
                    } else {
                        setSelectedSequenceId("");
                        setFetchedSequence(null);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch sequences for control bar:", error);
                toast({
                    title: "Error",
                    description: "Failed to load sequences",
                    variant: "destructive"
                });
            }
        };

        fetchSequences();
    }, [sequenceType]);

    // Handle sequence selection and fetch specific ID
    const handleSequenceSelect = async (val: string) => {
        setSelectedSequenceId(val);
        setIsSequencing(false); // Pause while loading

        try {
            const res = await axios.get(`${API_VIVEK_URL}/api/getSequenceById/${val}`);
            if (res.data?.success && res.data?.data) {
                setFetchedSequence(res.data.data);
                setIsSequencing(true); // Auto-start the newly fetched sequence
            }
        } catch (error) {
            console.error("Failed to fetch sequence details:", error);
            toast({ title: "Error", description: "Failed to load sequence details", variant: "destructive" });
        }
    };

    // Playback Engine
    useEffect(() => {
        const clearTimers = () => {
            if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
            individualTimersRef.current.forEach(clearTimeout);
            individualTimersRef.current = [];
        };

        if (!isSequencing || !fetchedSequence || sequenceType === "OFF") {
            clearTimers();
            return;
        }

        const runSequenceCycle = () => {
            clearTimers();
            const items = fetchedSequence.items || [];
            let maxDuration = 0;

            items.forEach((item: any) => {
                const slotIndex = item.order - 1;

                // Map to grid if within bounds
                if (slotIndex >= 0 && slotIndex < layout.rows * layout.cols) {
                    assignCameraToSlot(slotIndex, String(item.cameraId));

                    const durationMs = item.duration * 1000;
                    if (durationMs > maxDuration) {
                        maxDuration = durationMs;
                    }

                    // Clear slot after its duration expires
                    const timer = setTimeout(() => {
                        clearSlot(slotIndex);
                    }, durationMs);

                    individualTimersRef.current.push(timer);
                }
            });

            // Handle repeating or single play after the overall duration finishes
            if (maxDuration > 0) {
                playbackTimerRef.current = setTimeout(() => {
                    if (fetchedSequence.repeatSequence) {
                        runSequenceCycle(); // Loop
                    } else {
                        setIsSequencing(false); // Stop sequence
                    }
                }, maxDuration);
            }
        };

        runSequenceCycle();

        return () => {
            clearTimers();
        };
    }, [isSequencing, fetchedSequence, layout, assignCameraToSlot, clearSlot]);

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-1 h-[46px] transition-all duration-300">

                {/* Expand/Collapse Toggle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-[#737373] hover:text-[#0A0A0A] transition-all flex items-center justify-center"
                >
                    {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>

                {isExpanded && (
                    <div className="flex items-center h-full ml-1">
                        {/* Primary Mode Dropdown */}
                        <div className="flex items-center px-1 border-l border-slate-100 h-full">
                            <Select
                                value={sequenceType}
                                onValueChange={(val: any) => setSequenceType(val)}
                            >
                                <SelectTrigger className="border-none shadow-none focus:ring-0 h-8 gap-2 bg-transparent hover:bg-slate-50 rounded-full px-2.5 text-[13px] font-medium text-[#404040] transition-colors">
                                    <span className="whitespace-nowrap">
                                        {sequenceType === "OFF" ? "Sequencing: Off" : sequenceType === "CAMERA" ? "Camera Sequence" : "View Sequence"}
                                    </span>
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-xl border-slate-100 min-w-[170px]">
                                    <SelectItem value="OFF" className="text-sm font-medium text-[#404040]">Sequencing: Off</SelectItem>
                                    <SelectItem value="CAMERA" className="text-sm font-medium text-[#404040]">Camera Sequencing</SelectItem>
                                    <SelectItem value="VIEW" className="text-sm font-medium text-[#404040]">View Sequencing</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Secondary Sequence Selection Dropdown */}
                        {sequenceType !== "OFF" && availableSequences.length > 0 && (
                            <div className="flex items-center px-1 border-l border-slate-100 h-full">
                                <Select
                                    value={selectedSequenceId}
                                    onValueChange={(val) => handleSequenceSelect(val)}
                                >
                                    <SelectTrigger className="border-none shadow-none focus:ring-0 h-8 gap-2 bg-transparent hover:bg-slate-50 rounded-full px-2.5 text-[13px] font-medium text-[#404040] transition-colors max-w-[180px]">
                                        <span className="truncate">
                                            {availableSequences.find(s => s.sequenceId.toString() === selectedSequenceId)?.sequenceName || "Select Sequence"}
                                        </span>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl shadow-xl border-slate-100">
                                        {availableSequences.map(seq => (
                                            <SelectItem key={seq.sequenceId} value={seq.sequenceId.toString()} className="text-sm font-medium text-[#404040]">
                                                {seq.sequenceName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* Global Interval */}
                        <div className="flex items-center px-1 border-l border-slate-100 h-full">
                            <Select defaultValue="10s">
                                <SelectTrigger className="border-none shadow-none focus:ring-0 h-8 w-[76px] bg-transparent hover:bg-slate-50 rounded-full px-2.5 text-[13px] font-medium text-[#404040] transition-colors">
                                    <SelectValue placeholder="10s" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl shadow-xl border-slate-100 min-w-[80px]">
                                    <SelectItem value="5s" className="text-sm font-medium text-[#404040]">5s</SelectItem>
                                    <SelectItem value="10s" className="text-sm font-medium text-[#404040]">10s</SelectItem>
                                    <SelectItem value="15s" className="text-sm font-medium text-[#404040]">15s</SelectItem>
                                    <SelectItem value="30s" className="text-sm font-medium text-[#404040]">30s</SelectItem>
                                    <SelectItem value="1m" className="text-sm font-medium text-[#404040]">1m</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                )}

                {/* Right Side Tools */}
                <div className="flex items-center px-2 border-l border-slate-100 h-full ml-1">
                    <div className="flex items-center gap-1">
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-[#A3A3A3] hover:text-[#0A0A0A] transition-all active:scale-90">
                            <SkipBack size={18} fill="currentColor" className="opacity-80" />
                        </button>
                        <button
                            className={cn(
                                "p-1 rounded-lg transition-all active:scale-95",
                                isSequencing ? "text-blue-600 hover:bg-blue-50" : "text-[#A3A3A3] hover:text-[#0A0A0A] hover:bg-slate-100"
                            )}
                            onClick={() => setIsSequencing(!isSequencing)}
                        >
                            {isSequencing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                        </button>
                        <button className="p-1 hover:bg-slate-100 rounded-lg text-[#A3A3A3] hover:text-[#0A0A0A] transition-all active:scale-90">
                            <SkipForward size={18} fill="currentColor" className="opacity-80" />
                        </button>
                    </div>

                    <div className="w-[1px] h-[20px] bg-slate-200 mx-2.5"></div>

                    <div className="flex items-center gap-0.5">
                        <button
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-[#737373] hover:text-[#0A0A0A] transition-all active:scale-90"
                            onClick={toggleFullScreen}
                            title="Fullscreen"
                        >
                            <Maximize size={18} strokeWidth={2} />
                        </button>
                        <button
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-[#737373] hover:text-[#0A0A0A] transition-all active:scale-90"
                            title="Popout"
                        >
                            <ExternalLink size={18} strokeWidth={2} />
                        </button>
                        <button
                            className="p-1.5 hover:bg-red-50 rounded-lg text-[#737373] hover:text-red-600 transition-all active:scale-90 ml-0.5"
                            onClick={handleClearGrid}
                            title="Clear Grid"
                        >
                            <X size={18} strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
