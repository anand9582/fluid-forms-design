import { useState, useMemo, useRef, useEffect } from "react";
import { Camera, X, Cctv, Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import useGridStore from "@/Store/UseGridStore";
import { useDrag, useDrop } from "react-dnd";

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

  // 🔹 VideoGrid-style slot state
  const [cameraSlots, setCameraSlots] = useState<(CameraSlot | null)[]>([
    { id: 1, name: "Lobby", location: "A-1", hasCamera: true },
    { id: 2, name: "Hall", location: "A-2", hasCamera: true },
    { id: 3, name: "Gym", location: "B-1", hasCamera: true },
    { id: 4, name: "Floor 5", location: "A-5", hasCamera: true },
  ]);

  const [fullscreenSlot, setFullscreenSlot] = useState<number | null>(null);

  // Store main/sub state per slot
  const [mainSubState, setMainSubState] = useState<Record<number, "main" | "sub">>({});

  const totalSlots = layout.rows * layout.cols;

  const displaySlots = useMemo(() => {
    const slots: (CameraSlot | null)[] = [];
    for (let i = 0; i < totalSlots; i++) {
      slots.push(cameraSlots[i] || null);
    }
    return slots;
  }, [totalSlots, cameraSlots]);

  // 🔹 Clear slot
  const clearSlot = (index: number) => {
    setCameraSlots((prev) => {
      const updated = [...prev];
      updated[index] = null;
      return updated;
    });

    if (selectedSlotIndex === index) {
      onSlotSelect(null);
    }
  };

  // 🔹 Toggle main/sub
  const toggleMainSub = (index: number) => {
    setMainSubState((prev) => ({
      ...prev,
      [index]: prev[index] === "main" ? "sub" : "main",
    }));
  };

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
              onSelect={onSlotSelect}
              onFullscreenToggle={() =>
                setFullscreenSlot(fullscreenSlot === index ? null : index)
              }
              clearSlot={clearSlot}
              setCameraSlots={setCameraSlots}
              toggleMainSub={toggleMainSub}
              isMainView={mainSubState[index] !== "sub"}
              play={(cameraId: string, videoEl: HTMLVideoElement) => {
                console.log("Play camera", cameraId);
              }}
              togglePinCamera={() => {}}
              pinned={false}
              handleSnapshot={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* SLOT COMPONENT – VideoGrid style logic with Main/Sub toggle */
/* ===================================================================== */

function CameraGridSlot({
  index,
  slot,
  isSelected,
  isFullscreen,
  onSelect,
  onFullscreenToggle,
  clearSlot,
  setCameraSlots,
  play,
  togglePinCamera,
  pinned,
  toggleMainSub,
  isMainView,
  handleSnapshot,
}: {
  index: number;
  slot: CameraSlot | null;
  isSelected: boolean;
  isFullscreen: boolean;
  onSelect: (i: number | null) => void;
  onFullscreenToggle: () => void;
  clearSlot: (i: number) => void;
  setCameraSlots: React.Dispatch<React.SetStateAction<(CameraSlot | null)[]>>;
  play: (cameraId: string, videoEl: HTMLVideoElement) => void;
  togglePinCamera: (slotIndex: number) => void;
  pinned: boolean;
  toggleMainSub: (slotIndex: number) => void;
  isMainView: boolean;
  handleSnapshot: (slotIndex: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ================= Drag ================= */
  const [{ isDragging }, dragRef] = useDrag({
    type: "SLOT",
    item: { from: index, cameraId: slot?.id },
    canDrag: !!slot,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  /* ================= Drop ================= */
  const [{ isOver }, dropRef] = useDrop({
    accept: "SLOT",
    drop: (item: { from: number; cameraId: number }) => {
      if (item.from === index) return;
      setCameraSlots((prev) => {
        const updated = [...prev];
        const temp = updated[index];
        updated[index] = updated[item.from];
        updated[item.from] = temp;
        if (updated[index] && videoRef.current)
          play(updated[index]!.id.toString(), videoRef.current);
        return updated;
      });
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const setRefs = (el: HTMLDivElement | null) => {
    dragRef(el);
    dropRef(el);
    ref.current = el;
  };

  /* ================= Video Playback ================= */
  useEffect(() => {
    if (slot && videoRef.current) {
      play(slot.id.toString(), videoRef.current);
    }
  }, [slot]);

  return (
    <div
      ref={setRefs}
      onClick={() => onSelect(isSelected ? null : index)}
      onDoubleClick={onFullscreenToggle}
      className={cn(
        "relative w-full h-full cursor-pointer border group",
        isSelected ? "ring-2 ring-primary" : "border-gray-600",
        isFullscreen ? "fixed inset-0 z-50 bg-black" : "",
        isDragging ? "opacity-50" : "",
        isOver ? "ring-2 ring-blue-400" : ""
      )}
    >
      {slot ? (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30 group-hover:opacity-40 transition-opacity"></div>

          {/* Pin */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePinCamera(index);
            }}
            className={`absolute top-2 left-2 z-10 ${pinned ? "" : "opacity-0 group-hover:opacity-100"}`}
          >
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                pinned ? "bg-black text-blue-300 border border-blue-400/30" : "bg-black text-white/80 border border-white/20"
              }`}
            >
              {pinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
            </span>
          </button>

          {/* Main/Sub Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMainSub(index);
            }}
            className="absolute top-2 right-[105px] z-10 opacity-0 group-hover:opacity-100"
          >
            <span
              className={`inline-flex items-center justify-center w-12 h-6 rounded-full ${
                isMainView ? "bg-blue-500 text-white border-blue-300" : "bg-[#009688] text-white border-green-400/30"
              }`}
            >
              {isMainView ? "Main" : "Sub"}
            </span>
          </button>

          {/* Bottom Camera Info */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 px-2 py-1 rounded-md bg-black/20 text-white text-[10px] backdrop-blur-sm">
            <Cctv className="w-3 h-3" />
            <span className="truncate">{slot.name}</span>
          </div>

          {/* Hover Buttons */}
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSnapshot(index);
              }}
              className="p-1.5 rounded-full bg-[#131920] text-white hover:bg-black/60"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearSlot(index);
              }}
              className="p-1.5 rounded-full bg-[#131920] text-white hover:bg-black/60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center text-slate-500 hover:bg-slate-700/20 transition-colors h-full w-full">
          <Devices className="h-6 w-6 mr-1" />
          <span>Drop Camera</span>
        </div>
      )}
    </div>
  );
}
