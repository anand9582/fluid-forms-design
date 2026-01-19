// Camera Grid Component
// Displays camera feeds in a configurable grid layout with drag-and-drop support

import { useState, useMemo } from "react";
import { Camera, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { gridLayouts, baseCameraFeeds } from "@/components/LiveView/data";
import type { CameraSlot } from "@/components/LiveView/types";

interface CameraGridProps {
  selectedLayout: string;
  autoSequence: boolean;
}

export function CameraGrid({ selectedLayout, autoSequence }: CameraGridProps) {
  const [cameraSlots, setCameraSlots] = useState<CameraSlot[]>(baseCameraFeeds);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Get current layout configuration
  const currentLayout = gridLayouts.find(l => l.value === selectedLayout) || gridLayouts[5];
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

  return (
    <div className="flex-1 flex flex-col bg-muted/30 overflow-hidden">
      {/* Grid Container */}
      <div className="flex-1 p-2 overflow-auto">
        <div 
          className="grid gap-0.5 h-full"
          style={{ 
            gridTemplateColumns: `repeat(${currentLayout.cols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${currentLayout.rows}, minmax(0, 1fr))`
          }}
        >
          {displaySlots.map((slot, index) => (
            <div 
              key={index}
              draggable={!!slot}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={cn(
                "relative bg-muted rounded-sm overflow-hidden flex items-center justify-center min-h-[40px] transition-all duration-200",
                slot && "cursor-grab active:cursor-grabbing",
                draggedIndex === index && "opacity-50 scale-95",
                dragOverIndex === index && "ring-2 ring-primary ring-inset bg-primary/10",
                !slot && dragOverIndex === index && "bg-primary/20"
              )}
            >
              {slot ? (
                <>
                  {/* Camera Feed Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                  {/* Camera Name Label */}
                  <div className="absolute top-1 left-1 z-10">
                    <span className="text-[8px] sm:text-[10px] font-medium text-white bg-black/60 px-1 sm:px-1.5 py-0.5 rounded truncate max-w-[80%]">
                      {slot.name}
                    </span>
                  </div>
                  {/* Live Indicator */}
                  <div className="absolute bottom-1 right-1 z-10">
                    <span className="text-[6px] sm:text-[8px] text-white/80 bg-black/60 px-1 py-0.5 rounded">
                      LIVE
                    </span>
                  </div>
                  <Video className="h-4 w-4 sm:h-6 sm:w-6 text-white/20" />
                </>
              ) : (
                // Empty Slot Placeholder
                <div className="flex flex-col items-center justify-center text-muted-foreground/30">
                  <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Layout Status Bar */}
      <div className="flex items-center justify-center gap-4 py-2 bg-card/90 backdrop-blur border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Layout:</span>
          <span className="text-xs font-medium text-primary">{currentLayout.label}</span>
        </div>
        <div className="w-px h-3 bg-border" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Auto-Sequence:</span>
          <span className={cn("text-xs font-medium", autoSequence ? "text-primary" : "text-muted-foreground")}>
            {autoSequence ? "ON" : "OFF"}
          </span>
        </div>
        <div className="w-px h-3 bg-border" />
      </div>
    </div>
  );
}
