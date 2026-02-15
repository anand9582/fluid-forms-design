// Playback Camera Grid Component
// Displays camera feeds in a grid with playhead overlay, timestamps, and slot selection

import { useMemo } from "react";
import { Camera, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { gridLayouts } from "@/components/LiveView/Data";
import type { PlaybackCameraSlot } from "./types";
import { playbackCameraFeeds } from "./data";

interface PlaybackCameraGridProps {
  selectedLayout: string;
  playheadPosition: number;
  selectedSlot: number | null;
  onSlotSelect: (index: number | null) => void;
}

export function PlaybackCameraGrid({ selectedLayout, playheadPosition, selectedSlot, onSlotSelect }: PlaybackCameraGridProps) {
  const currentLayout = gridLayouts.find(l => l.value === selectedLayout) || gridLayouts[2];
  const totalSlots = currentLayout.cols * currentLayout.rows;

  const displaySlots = useMemo(() => {
    const slots: PlaybackCameraSlot[] = [];
    for (let i = 0; i < totalSlots; i++) {
      slots.push(playbackCameraFeeds[i] || null);
    }
    return slots;
  }, [totalSlots]);

  return (
    <div className="flex-1 p-2 overflow-hidden">
      <div
        className="grid gap-1 h-full"
        style={{
          gridTemplateColumns: `repeat(${currentLayout.cols}, 1fr)`,
          gridTemplateRows: `repeat(${currentLayout.rows}, 1fr)`,
        }}
      >
        {displaySlots.map((slot, index) => (
          <div
            key={index}
            onClick={() => slot ? onSlotSelect(selectedSlot === index ? null : index) : undefined}
            className={cn(
              "relative rounded overflow-hidden transition-all duration-200",
              slot ? [
                "bg-slate-900 cursor-pointer",
                selectedSlot === index && "ring-2 ring-primary",
              ] : "bg-muted/50 border border-dashed border-border",
            )}
          >
            {slot ? (
              <>
                {/* Camera Name Overlay */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="text-white text-sm font-medium drop-shadow-lg">{slot.name}</span>
                </div>

                {/* Timestamp Overlay */}
                <div className="absolute bottom-2 right-2 z-10">
                  <span className="text-white text-xs font-mono bg-black/50 px-2 py-0.5 rounded">
                    DEC 18 23:45:03
                  </span>
                </div>

                {/* Vertical playhead line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-emerald-400/70 z-10"
                  style={{ left: `${playheadPosition}%` }}
                />

                {/* Camera Feed Placeholder */}
                <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-40" />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <Plus className="h-8 w-8 mx-auto mb-1 opacity-50" />
                  <span className="text-xs opacity-50">Empty slot</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
