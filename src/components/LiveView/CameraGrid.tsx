import { useState, useRef, useEffect, useMemo } from "react";
import { useDrop, useDrag } from "react-dnd";
import { Camera, X } from "lucide-react";
import useGridStore from "@/Store/UseGridStore";
import { cn } from "@/lib/utils";
import {
  Devices,
  RefershIcons,
  Minimize,
  VioceIcons,
} from "@/components/Icons/Svg/liveViewIcons";

export interface CameraSlot {
  id: string;
  name: string;
  location: string;
}

interface CameraGridProps {
  cameraSlots: (CameraSlot | null)[];
  selectedSlotIndex: number | null;
  onSlotSelect: (index: number | null) => void;
  play: (cameraId: string, videoEl: HTMLVideoElement) => void;
  clearSlot?: (slotIndex: number) => void;
  handleSnapshot?: (slotIndex: number) => void;
  handleRefresh?: (slotIndex: number) => void;
  toggleMainSub?: (slotIndex: number, cameraId: string, nextType: "main" | "sub") => void;
  mainSubMap?: Record<number, "main" | "sub">;
}

export function CameraGrid({
  cameraSlots,
  selectedSlotIndex,
  onSlotSelect,
  play,
  clearSlot,
  handleSnapshot,
  handleRefresh
}: CameraGridProps) {
  const { layout } = useGridStore();
  const totalSlots = layout.rows * layout.cols;

  const displaySlots = useMemo(() => {
    const slots: (CameraSlot | null)[] = [];
    for (let i = 0; i < totalSlots; i++) {
      slots.push(cameraSlots[i] || null);
    }
    return slots;
  }, [cameraSlots, totalSlots]);

  return (
    <div className="flex-1 flex flex-col bg-muted/20">
      <div className="flex-1">
        <div
          className="grid h-full"
          style={{
            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
            gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
          }}
        >
          {displaySlots.map((slot, index) => (
            <CameraGridSlot
              key={index}
              index={index}
              slot={slot}
              isSelected={selectedSlotIndex === index}
              onSelect={onSlotSelect}
              play={play}
              clearSlot={clearSlot}
              handleSnapshot={handleSnapshot}
              handleRefresh={handleRefresh}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= SLOT ================= */

function CameraGridSlot({
  index,
  slot,
  isSelected,
  onSelect,
  play,
  clearSlot,
  handleSnapshot,
  handleRefresh,
}: {
  index: number;
  slot: CameraSlot | null;
  isSelected: boolean;
  onSelect: (i: number | null) => void;
  play: (cameraId: string, videoEl: HTMLVideoElement) => void;
  clearSlot?: (slotIndex: number) => void;
  handleSnapshot?: (slotIndex: number) => void;
  handleRefresh?: (slotIndex: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const assignCameraToSlot = useGridStore((s) => s.assignCameraToSlot);
  const swapSlots = useGridStore((s) => s.swapSlots);

  /* DRAG FROM GRID */
  const [{ isDragging }, dragRef] = useDrag({
    type: "GRID_SLOT",
    item: { fromIndex: index },
    canDrag: !!slot,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });


  /* DROP (SIDEBAR + GRID) */
  const [{ isOver }, dropRef] = useDrop({
    accept: ["SIDEBAR_CAMERA", "GRID_SLOT"],
    drop: (item: any) => {
      if (item.cameraId) {
        assignCameraToSlot(index, item.cameraId);
      }

      if (typeof item.fromIndex === "number" && item.fromIndex !== index) {
        swapSlots(item.fromIndex, index);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });
  // 🔹 connect drag + drop to containerRef
  useEffect(() => {
    if (!containerRef.current) return;
    dragRef(containerRef.current);
    dropRef(containerRef.current);
  }, [dragRef, dropRef]);

  useEffect(() => {
    if (!slot || !videoRef.current) return;
    const cameraId = slot.id;
    const currentCamera = (videoRef.current as any).__cameraId;
    if (currentCamera !== cameraId) {
      play(cameraId, videoRef.current);
      (videoRef.current as any).__cameraId = cameraId;
    }
  }, [slot, play]);

  /* ---------------- FULLSCREEN ---------------- */
  const handleFullscreenToggle = () => {
    const element = containerRef.current;
    if (!element) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      element.requestFullscreen().catch((err) => {
        console.error("Failed to enter fullscreen:", err);
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onDoubleClick={handleFullscreenToggle}
      onClick={() => onSelect(index)}
      className={cn(
        "group  relative border w-full h-full cursor-pointer",
        isSelected && "ring-2 ring-blue-400",
        isOver && "ring-2 ring-green-400",
        isDragging && "opacity-40"
      )}
    >
      {slot ? (
        <>
          <video
            ref={videoRef}
            id={`video-slot-${index}`}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />

          <div className="absolute top-1  left-1 flex justify-between  text-white text-xs px-2">
            <span>{slot.name}</span>
          </div>
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
            <button className="p-1 bg-black rounded text-white/90" title="Refresh Stream"
              onClick={(e) => {
                e.stopPropagation();
                handleRefresh(index, slot.id);
              }}
            >
              <RefershIcons size={12} />
            </button>
            <button className="p-1 bg-black rounded text-white/90">
              <VioceIcons size={12} />
            </button>
            <button className="p-1 bg-black rounded text-white/90"
              onClick={(e) => {
                e.stopPropagation();
                handleSnapshot?.(index);
              }}>
              <Camera size={16} />
            </button>
            <button className="p-1 bg-black rounded text-white/90" onClick={handleFullscreenToggle}>
              <Minimize size={14} />
            </button>
            <button className="p-1 bg-black rounded text-white/90"
              onClick={(e) => {
                e.stopPropagation();
                clearSlot(index);
              }}>
              <X size={16} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400 gap-2 text-muted-foreground">
          <Devices className="h-4 w-4" />
          <span className="text-sm font-medium">Drop Camera</span>
        </div>
      )}
    </div>
  );
}
