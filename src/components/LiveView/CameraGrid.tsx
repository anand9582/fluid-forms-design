import { useState, useMemo } from "react";
import { Video, Volume2, RotateCcw, Camera, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { gridLayouts } from "@/components/LiveView/Data";
import { Devices,RefershIcons,Minimize,VioceIcons } from "@/components/Icons/Svg/liveViewIcons";

export interface CameraSlot {
  id: number;
  name: string;
  location: string;
  hasCamera: boolean;
}

interface CameraGridProps {
  selectedLayout: string;
  autoSequence: boolean;
  selectedSlotIndex: number | null;
  onSlotSelect: (index: number | null) => void;
}

export function CameraGrid({
  selectedLayout,
  autoSequence,
  selectedSlotIndex,
  onSlotSelect,
}: CameraGridProps) {
  const [cameraSlots] = useState<(CameraSlot | null)[]>([
    { id: 1, name: "Lobby", location: "A-1", hasCamera: true },
    { id: 2, name: "Hall", location: "A-2", hasCamera: true },
    { id: 3, name: "Gym", location: "B-1", hasCamera: true },
    { id: 4, name: "Floor 5", location: "A-5", hasCamera: true },
  ]);

  const layout =
    gridLayouts.find((l) => l.value === selectedLayout) || gridLayouts[1];

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
      <div className="flex-1 pr-3 pt-3">
        <div
          className="grid h-full"
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
                onClick={() =>
                  onSlotSelect(isSelected ? null : index)
                }
                className={cn(
                  "group relative flex items-center justify-center min-h-[180px] transition-all cursor-pointer",
                  isSelected
                    ? "bg-slate-900 ring-2 ring-primary"
                    : "bg-card border border-border  hover:border-primary/60"
                )}
              >
                {/* 🔹 SELECTED CAMERA VIEW */}
                {isSelected ? (
                  <>
                    {/* Fake video background */}
                    <div className="absolute inset-0 bg-white border" />

                    {/* Bottom controls */}
                  <div
                      className={cn(
                        "absolute bottom-2 left-1/2 -translate-x-1/2 z-10",
                        " px-2 py-1 flex gap-1",
                        "opacity-0 translate-y-4",
                        "group-hover:opacity-100 group-hover:translate-y-0",
                        "transition-all duration-300 ease-out",
                        "pointer-events-none group-hover:pointer-events-auto"
                      )}
                    >

                     <button className="p-2 bg-black text-white/90 hover:text-white transition-colors rounded">
                    <RefershIcons size={16} />
                  </button>
                      <button className="p-2 bg-black text-white/90 hover:text-white transition-colors rounded">
                        <VioceIcons size={16} />
                      </button>
                      <button className="p-2 bg-black text-white/90 hover:text-white transition-colors rounded">
                        <Camera size={16} />
                      </button>
                      <button className="p-2 bg-black text-white/90 hover:text-white transition-colors rounded">
                        <Minimize size={16} />
                      </button>
                      <button className="p-2 bg-black text-white/90 hover:text-white transition-colors rounded">
                        <X size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  /* 🔹 DEFAULT (STARTING) DESIGN */
                  <div className="flex  items-center gap-2">
                      <Devices className="h-4 w-4" />
                    <span className="text-sm font-roboto font-medium">
                      Drop Camera here
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="flex justify-center gap-4 py-2 border-t bg-card text-sm">
        <span>
          Layout: <b className="text-primary">{selectedLayout}</b>
        </span>
        <span>|</span>
        <span>
          Auto-Sequence:{" "}
          <b className={autoSequence ? "text-green-500" : ""}>
            {autoSequence ? "ON" : "OFF"}
          </b>
        </span>
      </div>
    </div>
  );
}
