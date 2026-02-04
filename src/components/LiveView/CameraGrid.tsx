// Camera Grid Component
// Displays camera feeds in a configurable grid layout with drag-and-drop support

import { useState, useMemo } from "react";
import { Camera, Maximize2, Volume2, Settings, Video, X, RotateCcw, Expand } from "lucide-react";
import { cn } from "@/lib/utils";
import { gridLayouts } from "@/components/LiveView/Data";
import type { CameraSlot } from "./types";

interface CameraGridProps {
  selectedLayout: string;
  autoSequence: boolean;
  selectedSlotIndex: number | null;
  onSlotSelect: (index: number | null) => void;
}

export function CameraGrid({ selectedLayout, autoSequence, selectedSlotIndex, onSlotSelect }: CameraGridProps) {
  // Pre-populated camera slots with some assigned cameras
  const [cameraSlots, setCameraSlots] = useState<CameraSlot[]>([
    { id: 1, name: "Lobby Entrance main", location: "Building A > Floor 1 > Lobby", hasCamera: true },
    { id: 2, name: "Hall Entrance main", location: "Building A > Floor 1 > Lobby", hasCamera: true },
    { id: 3, name: "Gym area", location: "Building B > Ground Floor", hasCamera: true },
    { id: 4, name: "Fifth floor", location: "Building A > Floor 5", hasCamera: true },
  ]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Get current layout configuration
  const currentLayout = gridLayouts.find(l => l.value === selectedLayout) || gridLayouts[1];
  const totalSlots = currentLayout.cols * currentLayout.rows;

  // Generate display slots based on grid size
  const displaySlots = useMemo(() => {
    const slots: CameraSlot[] = [];
    for (let i = 0; i < totalSlots; i++) {
      slots.push(cameraSlots[i] || null);
    }
    return slots;
  }, [totalSlots, cameraSlots]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!displaySlots[index]) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndex = draggedIndex;
    
    if (sourceIndex === null || sourceIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    setCameraSlots(prev => {
      const newSlots = [...prev];
      while (newSlots.length <= Math.max(sourceIndex, targetIndex)) {
        newSlots.push(null);
      }
      // Swap slots
      const temp = newSlots[sourceIndex];
      newSlots[sourceIndex] = newSlots[targetIndex];
      newSlots[targetIndex] = temp;
      return newSlots;
    });

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSlotClick = (index: number) => {
    if (displaySlots[index]) {
      onSlotSelect(selectedSlotIndex === index ? null : index);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-muted/20 overflow-hidden">
      {/* Grid Container */}
      <div className="flex-1 p-3 overflow-auto">
        <div 
          className="grid h-full"
          style={{ 
            gridTemplateColumns: `repeat(${currentLayout.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${currentLayout.rows}, minmax(0, 1fr))`
          }}
        >
          {displaySlots.map((slot, index) => (
            <div 
              key={index}
              draggable={!!slot}
              onClick={() => handleSlotClick(index)}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "relative overflow-hidden flex items-center justify-center min-h-[180px] transition-all duration-200",
                slot ? [
                  "bg-slate-900 cursor-pointer",
                  draggedIndex === index && "opacity-50 scale-95",
                  selectedSlotIndex === index && "ring-2 ring-primary",
                ] : [
                  "bg-card border-2 border-dashed border-primary/40 hover:border-primary/60",
                  dragOverIndex === index && "border-primary bg-primary/5"
                ]
              )}
            >
              {slot ? (
                <>
                  {/* Camera Feed Background - simulated video feed */}
                  {/* <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900">
                    <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-60" />
                  </div> */}
                  
                    <div className="absolute inset-0 bg-white border">
                  </div>

                  {/* Camera Name Label - Top Left */}
                  {/* <div className="absolute top-2 left-2 z-10">
                    <span className="text-xs font-medium text-white bg-slate-800/80 px-2 py-1 rounded">
                      {slot.name}
                    </span>
                  </div> */}
                  
                  {/* Close Button - Top Right */}
                  {/* <div className="absolute top-2 right-2 z-10">
                    <button className="text-white/70 hover:text-white bg-black/40 p-1 rounded transition-colors">
                       <X className="h-4 w-4" />
                    </button>
                  </div> */}
                  
                  {/* Bottom Control Bar - Only visible on hover/selection */}
                  <div className={cn(
                    "absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-slate-800/90 rounded-lg px-2 py-1.5 flex items-center gap-1.5 transition-opacity",
                    selectedSlotIndex === index ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  )}>
                    <button className="text-white/70 hover:text-white transition-colors p-1">
                      <Expand className="h-4 w-4" />
                    </button>
                    <button className="text-white/70 hover:text-white transition-colors p-1">
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button className="text-white/70 hover:text-white transition-colors p-1">
                      <Video className="h-4 w-4" />
                    </button>
                    <button className="text-white/70 hover:text-white transition-colors p-1">
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <button className="text-white/70 hover:text-white transition-colors p-1">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                // Empty Slot Placeholder - Matching design reference
                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground/60">
                  <div className="p-3 rounded-full bg-muted/30">
                    <Video className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">Drop Camera here</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="flex items-center justify-center gap-4 py-2 border-t border-border bg-card">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Layout:</span>
          <span className="text-primary font-medium">{selectedLayout}</span>
        </div>
        <span className="text-muted-foreground">|</span>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Auto-Sequence:</span>
          <span className={cn(
            "font-medium",
            autoSequence ? "text-green-500" : "text-muted-foreground"
          )}>
            {autoSequence ? "ON" : "OFF"}
          </span>
        </div>
      </div>
    </div>
  );
}
