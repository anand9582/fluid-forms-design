// ======================================================================
// CameraGrid.tsx
// LiveView Video Grid with drag & drop, play, fullscreen, main/sub toggle
// ======================================================================

import { useState, useRef, useEffect, useMemo } from "react";
import { useDrop } from "react-dnd";
import { Pin, PinOff, Camera, X } from "lucide-react";
import useGridStore from "@/Store/UseGridStore";
import { cn } from "@/lib/utils";

export interface CameraSlot {
  id: string;
  name: string;
  location: string;
  hasCamera?: boolean;
}

interface CameraGridProps {
  cameraSlots: (CameraSlot | null)[];
  selectedSlotIndex: number | null;
  onSlotSelect: (index: number | null) => void;
  play: (cameraId: string, videoEl: HTMLVideoElement) => void;
  pinnedSlots?: Set<number>;
  clearSlot?: (slotIndex: number) => void;
  handleSnapshot?: (slotIndex: number) => void;
}

export function CameraGrid({
  cameraSlots,
  selectedSlotIndex,
  onSlotSelect,
  play,
  pinnedSlots = new Set(),
  clearSlot,
  handleSnapshot,
}: CameraGridProps) {
  const { layout } = useGridStore();
  const rows = layout.rows || 2;
  const cols = layout.cols || 2;
  const totalSlots = rows * cols;

  const [fullscreenSlot, setFullscreenSlot] = useState<number | null>(null);
  const [mainSubMap, setMainSubMap] = useState<Record<number, "main" | "sub">>(
    {}
  );

  const toggleMainSub = (index: number) => {
    setMainSubMap(prev => ({
      ...prev,
      [index]: prev[index] === "main" ? "sub" : "main",
    }));
  };

  const displaySlots = useMemo(() => {
    const slots: (CameraSlot | null)[] = [];
    for (let i = 0; i < totalSlots; i++) {
      slots.push(cameraSlots[i] || null);
    }
    return slots;
  }, [cameraSlots, totalSlots]);

  return (
    <div className="flex-1 h-full p-2">
      <div
        className="grid gap-2 h-full w-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {displaySlots.map((slot, index) => (
          <CameraGridSlot
            key={index}
            index={index}
            slot={slot}
            isSelected={selectedSlotIndex === index}
            isFullscreen={fullscreenSlot === index}
            pinned={pinnedSlots.has(index)}
            onSelect={onSlotSelect}
            toggleMainSub={() => toggleMainSub(index)}
            isMainView={mainSubMap[index] !== "sub"}
            onDoubleClick={() =>
              setFullscreenSlot(fullscreenSlot === index ? null : index)
            }
            play={play}
            handleSnapshot={handleSnapshot}
            clearSlot={clearSlot}
          />
        ))}
      </div>
    </div>
  );
}

/* ===================================================================== */
/* CameraGridSlot */
function CameraGridSlot({
  index,
  slot,
  isSelected,
  isFullscreen,
  pinned,
  onSelect,
  toggleMainSub,
  isMainView,
  onDoubleClick,
  play,
  handleSnapshot,
  clearSlot,
}: {
  index: number;
  slot: CameraSlot | null;
  isSelected: boolean;
  isFullscreen: boolean;
  pinned: boolean;
  onSelect: (i: number | null) => void;
  toggleMainSub: () => void;
  isMainView: boolean;
  onDoubleClick?: () => void;
  play: (cameraId: string, videoEl: HTMLVideoElement) => void;
  handleSnapshot?: (slotIndex: number) => void;
  clearSlot?: (slotIndex: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const assignCameraToSlot = useGridStore(
    
    (state) => state.assignCameraToSlot
  );

  // ✅ DROP FROM SIDEBAR (EMPTY SLOT INCLUDED)
  const [{ isOver }, dropRef] = useDrop({
    accept: "SIDEBAR_CAMERA",
    drop: (item: { cameraId: string }) => {
      assignCameraToSlot(index, item.cameraId);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (!slot || !videoRef.current) return;

    const cameraId = slot.id;
    const currentCamera = (videoRef.current as any).__cameraId;

    if (currentCamera !== cameraId) {
      play(cameraId, videoRef.current);
      (videoRef.current as any).__cameraId = cameraId;
    }
  }, [slot, play]);

  return (
    <div
      ref={dropRef}
      onClick={() => onSelect(index)}
      onDoubleClick={onDoubleClick}
      className={cn(
        "relative w-full h-full cursor-pointer border group",
        isSelected && "ring-2 ring-blue-400",
        isFullscreen && "fixed inset-0 z-50 bg-black",
        isOver && "ring-2 ring-green-400"
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

          {/* Pin */}
          <button
            onClick={e => e.stopPropagation()}
            className="absolute top-2 left-2 z-10 p-1.5 bg-black rounded-full"
          >
            {pinned ? (
              <Pin className="w-4 h-4 text-blue-300" />
            ) : (
              <PinOff className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Main / Sub */}
          {/* <button
            onClick={e => {
              e.stopPropagation();
              toggleMainSub();
            }}
            className="absolute top-2 right-2 z-10 p-1.5 bg-black rounded-full"
          >
            <span className="text-xs text-white">
              {isMainView ? "Main" : "Sub"}
            </span>
          </button> */}

          {/* Bottom Bar */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between px-2 py-1 bg-black/40 text-white text-xs rounded">
            <span>{slot.name}</span>
            <div className="flex gap-1">
              {handleSnapshot && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleSnapshot(index);
                  }}
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
              {clearSlot && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    clearSlot(index);
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center text-slate-500 h-full w-full">
          Drop Camera
        </div>
      )}
    </div>
  );
}
