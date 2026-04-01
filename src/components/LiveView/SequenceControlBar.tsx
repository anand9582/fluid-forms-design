import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_VIVEK_URL } from "@/components/Config/api";
import {
    Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, Maximize, ExternalLink, X, ChevronUp
} from "lucide-react";
import { SidebarCameraStore } from "@/Store/SidebarCameraStore";
import useGridStore from "@/Store/UseGridStore";
import { useStreamStore } from "@/Store/useStreamStore";
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

    const [expandLevel, setExpandLevel] = useState<0 | 1 | 2>(2);
    const [sequenceType, setSequenceType] = useState<"OFF" | "CAMERA" | "VIEW">("OFF");
    const [availableSequences, setAvailableSequences] = useState<any[]>([]);
    const [selectedSequenceId, setSelectedSequenceId] = useState<string>("");

    // Engine State
    const [fetchedSequence, setFetchedSequence] = useState<any>(null);
    const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);
    const individualTimersRef = useRef<NodeJS.Timeout[]>([]);
    const pendingTimersRef = useRef<{ [key: string]: { durationMs: number; slotIndex: number, started: boolean, endTime?: number } }>({});

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

    const handleNextSequence = () => {
        if (!availableSequences || availableSequences.length === 0) return;
        const currentIndex = availableSequences.findIndex(s => s.sequenceId.toString() === selectedSequenceId);
        if (currentIndex === -1) return;
        const nextIndex = (currentIndex + 1) % availableSequences.length;
        handleSequenceSelect(availableSequences[nextIndex].sequenceId.toString());
    };

    const handlePreviousSequence = () => {
        if (!availableSequences || availableSequences.length === 0) return;
        const currentIndex = availableSequences.findIndex(s => s.sequenceId.toString() === selectedSequenceId);
        if (currentIndex === -1) return;
        const prevIndex = (currentIndex - 1 + availableSequences.length) % availableSequences.length;
        handleSequenceSelect(availableSequences[prevIndex].sequenceId.toString());
    };

    // Playback Engine
    useEffect(() => {
        let processedInstances = new Set<string>();

        const clearTimers = () => {
            if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
            individualTimersRef.current.forEach(clearTimeout);
            individualTimersRef.current = [];
        };

        if (!isSequencing || !fetchedSequence || sequenceType === "OFF") {
            clearTimers();
            return;
        }

        const playItem = (index: number) => {
            clearTimers();
            pendingTimersRef.current = {};

            const items = fetchedSequence.items || [];

            if (index >= items.length) {
                // Sequence finished, handle loop or next sequence
                if (fetchedSequence.repeatSequence) {
                    // Use a short delay before looping to avoid strict infinite recursion instantly
                    playbackTimerRef.current = setTimeout(() => playItem(0), 100);
                } else {
                    if (availableSequences && availableSequences.length > 0) {
                        const currentIndex = availableSequences.findIndex(s => s.sequenceId.toString() === selectedSequenceId);
                        if (currentIndex !== -1) {
                            if (currentIndex === availableSequences.length - 1) {
                                // Reached the last sequence, stop playing.
                                setIsSequencing(false);
                            } else {
                                // Auto-advance to the next sequence in the list
                                const nextIndex = currentIndex + 1;
                                handleSequenceSelect(availableSequences[nextIndex].sequenceId.toString());
                            }
                        } else {
                            setIsSequencing(false);
                        }
                    } else {
                        setIsSequencing(false);
                    }
                }
                return;
            }

            const item = items[index];
            const durationMs = item.duration * 1000;
            const isViewSequence = sequenceType === "VIEW" || fetchedSequence.sequenceType === "VIEW";

            if (isViewSequence) {
                let requiredCameras = 0;
                let mappedCams: any[] = [];
                
                if (item.cellMapping) {
                    const indices = Object.keys(item.cellMapping).map(Number);
                    const maxIndex = Math.max(...indices, -1);
                    let rows = 2, cols = 2;
                    if (maxIndex >= 16) { rows = 5; cols = 5; }
                    else if (maxIndex >= 9) { rows = 4; cols = 4; }
                    else if (maxIndex >= 4) { rows = 3; cols = 3; }
                    else if (maxIndex >= 1) { rows = 2; cols = 2; }
                    else { rows = 1; cols = 1; }

                    clearAllSlots();
                    useGridStore.getState().setLayout(rows, cols);

                    mappedCams = Object.entries(item.cellMapping).filter(([_, camId]) => camId !== null);
                    requiredCameras = mappedCams.length;

                    mappedCams.forEach(([slotIdx, camId]) => {
                        assignCameraToSlot(Number(slotIdx), String(camId));
                    });
                }

                if (requiredCameras === 0) {
                     const timer = setTimeout(() => {
                        clearAllSlots();
                        playItem(index + 1);
                     }, durationMs);
                     individualTimersRef.current.push(timer);
                     return;
                }

                const key = `view_step_${index}`;
                
                pendingTimersRef.current[key] = {
                    durationMs,
                    started: false,
                    isView: true,
                    itemIndex: index,
                    expectedCams: requiredCameras,
                    loadedCams: new Set()
                } as any;
                
                // Fallback timer for views
                const fallbackTimer = setTimeout(() => {
                    const currentObj = pendingTimersRef.current[key] as any;
                    if (currentObj && !currentObj.started) {
                        currentObj.started = true;
                        const timer = setTimeout(() => {
                            clearAllSlots();
                            playItem(index + 1);
                        }, durationMs);
                        individualTimersRef.current.push(timer);
                    }
                }, 15000);
                individualTimersRef.current.push(fallbackTimer);
                
                return;
            }

            const slotIndex = 0; // Drop camera in first cell only

            assignCameraToSlot(slotIndex, String(item.cameraId));

            const key = `${item.cameraId}-${slotIndex}`;

            pendingTimersRef.current[key] = {
                durationMs,
                slotIndex,
                started: false,
                isView: false,
                endTime: 0,
                itemIndex: index // Store index so we can play the next item
            } as any;

            // Fallback timer: if the stream takes longer than 15s to load, start its timer anyway
            const fallbackTimer = setTimeout(() => {
                const currentObj = pendingTimersRef.current[key] as any;
                if (currentObj && !currentObj.started) {
                    currentObj.started = true;

                    const timer = setTimeout(() => {
                        clearSlot(slotIndex);
                        playItem(index + 1);
                    }, durationMs);
                    individualTimersRef.current.push(timer);
                }
            }, 15000);
            individualTimersRef.current.push(fallbackTimer);
        };

        const unsubStreamStore = useStreamStore.subscribe((state) => {
            if (!isSequencing) return;

            state.streams.forEach(stream => {
                if (!processedInstances.has(stream.instanceId)) {
                    processedInstances.add(stream.instanceId);

                    const viewItemObj = Object.values(pendingTimersRef.current).find((p: any) => p.isView && !p.started) as any;
                    if (viewItemObj) {
                        viewItemObj.loadedCams.add(`${stream.cameraId}-${stream.slotId}`);
                        if (viewItemObj.loadedCams.size >= viewItemObj.expectedCams) {
                            viewItemObj.started = true;
                            const timer = setTimeout(() => {
                                clearAllSlots();
                                playItem(viewItemObj.itemIndex + 1);
                            }, viewItemObj.durationMs);
                            individualTimersRef.current.push(timer);
                        }
                    } else {
                        const key = `${stream.cameraId}-${stream.slotId}`;
                        const pending = pendingTimersRef.current[key] as any;

                        if (pending && !pending.started && !pending.isView) {
                            pending.started = true;

                            const timer = setTimeout(() => {
                                clearSlot(pending.slotIndex);
                                playItem(pending.itemIndex + 1);
                            }, pending.durationMs);

                            individualTimersRef.current.push(timer);
                        }
                    }
                }
            });
        });

        processedInstances = new Set<string>(); // Reset for new play
        playItem(0);

        return () => {
            clearTimers();
            if (typeof unsubStreamStore === "function") unsubStreamStore();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSequencing, fetchedSequence, assignCameraToSlot, clearSlot, availableSequences, selectedSequenceId]);

    // Hide if grid is 1:1
    if (layout.rows === 1 && layout.cols === 1) return null;

    if (expandLevel === 0) {
        return (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <button
                    onClick={() => setExpandLevel(2)}
                    className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 text-[#737373] hover:text-[#0A0A0A] hover:bg-slate-50 transition-all active:scale-95"
                    title="Show Control Bar"
                >
                    <ChevronUp size={20} strokeWidth={2.5} />
                </button>
            </div>
        );
    }

    return (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 p-1 h-[46px] transition-all duration-300">

                {/* Expand/Collapse Toggle */}
                <button
                    onClick={() => setExpandLevel(expandLevel === 2 ? 1 : 0)}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-[#737373] hover:text-[#0A0A0A] transition-all flex items-center justify-center"
                >
                    {expandLevel === 2 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>

                {expandLevel === 2 && (
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
                        <button
                            className="p-1 hover:bg-slate-100 rounded-lg text-[#A3A3A3] hover:text-[#0A0A0A] transition-all active:scale-90"
                            onClick={handlePreviousSequence}
                        >
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
                        <button
                            className="p-1 hover:bg-slate-100 rounded-lg text-[#A3A3A3] hover:text-[#0A0A0A] transition-all active:scale-90"
                            onClick={handleNextSequence}
                        >
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
