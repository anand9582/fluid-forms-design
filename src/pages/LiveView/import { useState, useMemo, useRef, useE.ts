import { useState, useMemo, useRef, useEffect } from "react";
import { Camera, X, Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import useGridStore from "@/Store/UseGridStore";
import { useDrag, useDrop } from "react-dnd";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";

// Camera slot type
export interface CameraSlot {
  id: number;
  name: string;
  location: string;
  hasCamera: boolean;
}

// Props for the grid
interface CameraGridProps {
  autoSequence: boolean;
  selectedSlotIndex: number | null;
  onSlotSelect: (index: number | null) => void;
  onCameraDrop?: (camera: CameraSlot, slotIndex: number) => void;
  pinnedSlots?: Set<number>;
  handleSnapshot?: (slotIndex: number) => void;
  clearSlot?: (slotIndex: number) => void;
  cameraSlots: (CameraSlot | null)[];
  play: (cameraId: string, videoEl: HTMLVideoElement) => void;
}

export function CameraGrid({
  autoSequence,
  selectedSlotIndex,
  onSlotSelect,
  onCameraDrop,
  cameraSlots,
  pinnedSlots = new Set(),
  handleSnapshot,
  clearSlot,
  play
}: CameraGridProps) {
  const { layout } = useGridStore();
  const totalSlots = layout.rows * layout.cols;

  const [fullscreenSlot, setFullscreenSlot] = useState<number | null>(null);
  const [mainSubState, setMainSubState] = useState<Record<number, "main" | "sub">>({});

  const toggleMainSub = (index: number) => {
    setMainSubState((prev) => ({
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
  }, [totalSlots, cameraSlots]);

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
              isFullscreen={fullscreenSlot === index}
              pinned={pinnedSlots.has(index)}
              onSelect={onSlotSelect}
              toggleMainSub={() => toggleMainSub(index)}
              isMainView={mainSubState[index] !== "sub"}
              onDoubleClick={() =>
                setFullscreenSlot(fullscreenSlot === index ? null : index)
              }
              play={play}
              onCameraDrop={onCameraDrop}
              handleSnapshot={handleSnapshot}
              clearSlot={clearSlot}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* SLOT COMPONENT */
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
  onCameraDrop,
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
  onCameraDrop?: (camera: CameraSlot, slotIndex: number) => void;
  handleSnapshot?: (slotIndex: number) => void;
  clearSlot?: (slotIndex: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [{ isDragging }, dragRef] = useDrag({
    type: "SLOT",
    item: { from: index, cameraId: slot?.id },
    canDrag: !!slot && !pinned,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: ["SLOT", "SIDEBAR_CAMERA"],
    drop: (item: any) => {
      if (item.type === "SIDEBAR_CAMERA") {
        if (onCameraDrop) onCameraDrop(item.camera, index);
        return;
      }
      if (item.from === index) return;
      console.log(`Swapped camera ${item.cameraId} with slot ${index}`);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const setRefs = (el: HTMLDivElement | null) => {
    dragRef(el);
    dropRef(el);
    ref.current = el;
  };


useEffect(() => {
  if (!slot || !videoRef.current) return;

  const cameraId = String(slot.id);
  const currentCamera = (videoRef.current as any).__cameraId;

  if (currentCamera === cameraId) return;

  play(cameraId, videoRef.current);
  (videoRef.current as any).__cameraId = cameraId;
}, [slot, play]);





  return (
    <div
      ref={setRefs}
      onClick={() => onSelect(index)}
      onDoubleClick={onDoubleClick ?? handleFullscreen}
      className={cn(
        "relative w-full h-full cursor-pointer border group",
        isSelected ? "ring-1 ring-primary" : "",
        isFullscreen ? "fixed inset-0 z-50 bg-black" : "",
        isDragging ? "opacity-50" : "",
        isOver ? "ring-2 ring-blue-400" : ""
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
          {/* Top left pin button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log(pinned ? "Unpin slot" : "Pin slot");
            }}
            className="absolute top-2 left-2 z-10 p-1.5 bg-black rounded-full"
          >
            {pinned ? <Pin className="w-4 h-4 text-blue-300" /> : <PinOff className="w-4 h-4 text-white" />}
          </button>

          {/* Top right Main/Sub toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMainSub();
            }}
            className="absolute top-2 right-2 z-10 p-1.5 bg-black rounded-full"
          >
            <span className="text-xs text-white">{isMainView ? "Main" : "Sub"}</span>
          </button>

          {/* Bottom info + controls */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 bg-black/30 text-white text-xs rounded">
            <span>{slot.name}</span>
            <div className="flex items-center gap-1">
              {handleSnapshot && (
                <button onClick={(e) => { e.stopPropagation(); handleSnapshot(index); }}>
                  <Camera className="w-4 h-4" />
                </button>
              )}
              {clearSlot && (
                <button onClick={(e) => { e.stopPropagation(); clearSlot(index); }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center text-slate-500 hover:bg-slate-700/20 h-full w-full">
          <Devices className="h-6 w-6 mr-1" />
          <span>Drop Camera</span>
        </div>
      )}
    </div>
  );
}
