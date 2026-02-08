import { useState, useMemo } from "react";
import { Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";
import useGridStore from "@/Store/UseGridStore";

import {
  Devices,
  RefershIcons,
  Minimize,
  VioceIcons,
} from "@/components/Icons/Svg/liveViewIcons";

export interface CameraSlot {
  id: number;
  name: string;
  location: string;
  hasCamera: boolean;
}

interface CameraGridProps {
  autoSequence: boolean;
  selectedSlotIndex: number | null;
  onSlotSelect: (index: number | null) => void;
}

export function CameraGrid({
  autoSequence,
  selectedSlotIndex,
  onSlotSelect,
}: CameraGridProps) {
  const { layout } = useGridStore();

  const [cameraSlots] = useState<(CameraSlot | null)[]>([
    { id: 1, name: "Lobby", location: "A-1", hasCamera: true },
    { id: 2, name: "Hall", location: "A-2", hasCamera: true },
    { id: 3, name: "Gym", location: "B-1", hasCamera: true },
    { id: 4, name: "Floor 5", location: "A-5", hasCamera: true },
  ]);

  const totalSlots = layout.rows * layout.cols;

  const displaySlots = useMemo(() => {
    const slots: (CameraSlot | null)[] = [];
    for (let i = 0; i < totalSlots; i++) {
      slots.push(cameraSlots[i] || null);
    }
    return slots;
  }, [totalSlots, cameraSlots]);

  return (
    <div className="flex-1 flex flex-col bg-muted/20">
      {/* GRID */}
      <div className="flex-1">
        <div
          className="grid h-full "
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
            gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
          }}
        >
          {displaySlots.map((slot, index) => {
            const isSelected = selectedSlotIndex === index;

            return (
           <div
  key={index}
  onClick={() => onSlotSelect(isSelected ? null : index)}
  className={cn(
    "relative w-full h-full cursor-pointer",
    isSelected && "p-[2px]"
  )}
>
  <div
    className={cn(
      "group relative flex items-center justify-center w-full h-full transition-all",
      isSelected
        ? "bg-slate-900 ring-1 ring-primary"
        : "bg-card border border-border hover:border-primary/60"
    )}
  >
    {isSelected ? (
      <>
        <div className="absolute inset-0 bg-white border" />

        <div
          className={cn(
            "absolute bottom-1 left-1/2 -translate-x-1/2 z-10",
            "px-2 py-1 flex gap-1",
            "opacity-0 translate-y-4",
            "group-hover:opacity-100 group-hover:translate-y-0",
            "transition-all duration-300 ease-out",
            "pointer-events-none group-hover:pointer-events-auto"
          )}
        >
          <button className="p-2 bg-black rounded text-white/90">
            <RefershIcons size={16} />
          </button>
          <button className="p-2 bg-black rounded text-white/90">
            <VioceIcons size={16} />
          </button>
          <button className="p-2 bg-black rounded text-white/90">
            <Camera size={16} />
          </button>
          <button className="p-2 bg-black rounded text-white/90">
            <Minimize size={16} />
          </button>
          <button className="p-2 bg-black rounded text-white/90">
            <X size={16} />
          </button>
        </div>
      </>
    ) : (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Devices className="h-4 w-4" />
        <span className="text-sm font-medium">Drop Camera</span>
      </div>
    )}
  </div>
</div>

            );
          })}
        </div>
      </div>
    
    </div>
  );
}
