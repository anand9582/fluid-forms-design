// ======================================================================
// Author: Anand Singh
// Date: 11/21/2025
// File: VideoGrid.tsx
// Description:
// This component renders the video grid for live camera streams.
// It supports:
// - Dynamic slot assignment
// - Fullscreen per slot
// - Drag & drop camera rearrangement
// - Pin/Unpin cameras
// - Snapshot and clear actions
// - Main/Sub toggle for camera views
// ======================================================================

import React, { useState, useRef, useEffect } from "react";
import { Cctv, Camera, Video, Pin, PinOff, X} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDrag, useDrop } from "react-dnd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGridController } from "@/hooks/useGridController";

// ======================================================================
// Author: Anand Singh
// Date: 11/21/2025
// Props Interface
// Defines all props passed to VideoGrid component
// ======================================================================
interface VideoGridProps {
  cameraOrder: number[];
  pinnedCameras: Set<number>;
  slotAssignments: (string | null)[];
  streamStatus: "idle" | "loading" | "active" | "error";
  cameraById: Map<string, { name: string }>;
  addDebugLog: (msg: string) => void;
  setSlotAssignments: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  setPlayingCameraIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  playingCameraIds: Set<string>;
  setSelectedSlot: (slot: number) => void;
  setShowCameraModal: (open: boolean) => void;
  togglePinCamera: (cameraIndex: number) => void;
  handleSnapshot: (cameraIndex: number) => void;
  play: (cameraId: string, videoEl: HTMLVideoElement) => void;
  isSelectAll: boolean;
  setSelectedCameras: (slots: number[]) => void;
  onSlotClick: (slotIndex: number) => void;
  getGridClass?: () => string;
  getTotalCamerasForLayout,
  toggleMainSub: (slotIndex: number) => void;
  isMainViewForSlot: (slotIndex: number) => boolean;
  clearSlot: (slotIndex: number, cameraId: string | null) => void;
}


// ======================================================================
// Author: Anand Singh
// Date: 11/21/2025
// Component: VideoGrid
// Renders the main video grid layout with all slots
// ======================================================================
export const VideoGrid: React.FC<VideoGridProps & { isNewTab?: boolean }> = ({
  pinnedCameras,
  slotAssignments,
  cameraById,
  addDebugLog,
  setSlotAssignments,
  setPlayingCameraIds,
  playingCameraIds,
  setSelectedSlot,
  setShowCameraModal,
  togglePinCamera,
  handleSnapshot,
  play,
  isSelectAll,
  onSlotClick,
  isNewTab = false,
  toggleMainSub,     
  isMainViewForSlot,
  clearSlot
}) => {
  const gridLayout = useSelector((state: RootState) => state.layout.gridLayout);
  const { getGridClass, getTotalCamerasForLayout } = useGridController();
  const totalSlots = getTotalCamerasForLayout(gridLayout);
  const slots = Array.from({ length: totalSlots }, (_, i) => i);
  const [fullscreenSlot, setFullscreenSlot] = useState<number | null>(null);
  const { t } = useTranslation();
  const {closeSlotConnections,} = useGridController();


  return (
  <div
  className={`w-full ${isNewTab ? "h-screen" : "h-[calc(100vh-60px)]"} overflow-hidden flex items-center justify-center`}
  style={{
    backgroundImage: `radial-gradient(circle, rgba(59, 130, 246, 0.08) 1px, transparent 1px)`,
  }}
>
      <div
        className={`grid ${getGridClass()} w-full h-full`}
         style={{ gridAutoRows: "1fr", gridAutoColumns: "1fr" }}
      >
        {slots.map((slotIndex) => (
          <VideoGridSlot
            key={slotIndex}
            slotIndex={slotIndex}
            pinned={pinnedCameras.has(slotIndex)}
            slotAssignments={slotAssignments}
            setSlotAssignments={setSlotAssignments}
            setPlayingCameraIds={setPlayingCameraIds}
            playingCameraIds={playingCameraIds}
            setSelectedSlot={setSelectedSlot}
            setShowCameraModal={setShowCameraModal}
            cameraById={cameraById}
            togglePinCamera={togglePinCamera}
            handleSnapshot={handleSnapshot}
            addDebugLog={addDebugLog}
            isSelectAll={isSelectAll}
            onClick={() => onSlotClick(slotIndex)}
            play={play}
            isFullscreen={fullscreenSlot === slotIndex}
            onDoubleClick={() =>
              setFullscreenSlot(
                fullscreenSlot === slotIndex ? null : slotIndex
              )
            }
            toggleMainSub={toggleMainSub}          
           isMainViewForSlot={isMainViewForSlot} 
           closeSlotConnections={closeSlotConnections}
           clearSlot={clearSlot}
          />
        ))}
      </div>
    </div>
  );
};

const VideoGridSlot: React.FC<{
slotIndex: number;
  pinned: boolean;
  streamStatus?: "idle" | "loading" | "error";
  slotAssignments: (string | null)[];
  setSlotAssignments: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  setPlayingCameraIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  playingCameraIds: Set<string>;
  setSelectedSlot: (slot: number) => void;
  setShowCameraModal: (open: boolean) => void;
  cameraById: Map<string, { name: string }>;
  togglePinCamera: (cameraIndex: number) => void;
  handleSnapshot: (cameraIndex: number) => void;
  addDebugLog: (msg: string) => void;
  isSelectAll: boolean;
  isFullscreen?: boolean;
  onDoubleClick?: () => void;
 play: (cameraId: string, videoEl: HTMLVideoElement, type?: "main" | "sub", slotId?: number) => { instanceId: string } | undefined;
  closeSlotConnections: (slotId: number) => string[];
  onClick?: () => void;
  toggleMainSub: (slotIndex: number) => void;
  isMainViewForSlot: (slotIndex: number) => boolean;
  clearSlot: (slotIndex: number, cameraId: string | null) => void;
}> = ({
  slotIndex,
  pinned,
  streamStatus,
  slotAssignments,
  setSlotAssignments,
  playingCameraIds,
  cameraById,
  togglePinCamera,
  handleSnapshot,
  addDebugLog,
  isSelectAll,
  isFullscreen = false,
  onClick,
  play,
  toggleMainSub,
  isMainViewForSlot,
  clearSlot 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const cameraId = slotAssignments[slotIndex];
  const cameraName = cameraById.get(cameraId ?? "")?.name ?? "";
  
// Replace currentCameraRef with per-video element ref (optional)
   const currentCamera = (videoRef.current as any)?.__currentCameraRef__ || null;
  
useEffect(() => {
  if (cameraId && videoRef.current && currentCamera !== cameraId) {
    play(cameraId, videoRef.current, "sub", slotIndex);
    (videoRef.current as any).__currentCameraRef__ = cameraId;
  }
}, [cameraId, play, slotIndex]);



// Anand Singh — 11/21/2025
// Handles all drag events & movement logic for the panel UI.
// Ensures smooth dragging, boundary checks, and updated position state.
  const [{ isDragging }, dragRef] = useDrag({
    type: "SLOT",
    item: { cameraId, from: slotIndex },
    canDrag: !!cameraId && !pinned,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [{ isOver }, dropRef] = useDrop({
    accept: ["CAMERA", "SLOT"],
    drop: (item: { id?: string; from?: number; cameraId?: string }) => {
      const newCameraId = item.id ?? item.cameraId ?? null;
      if (!newCameraId) return;
      setSlotAssignments((prev) => {
        const updated = [...prev];
        if (item.from !== undefined && item.from !== slotIndex) {
          const temp = updated[slotIndex];
          updated[slotIndex] = updated[item.from];
          updated[item.from] = temp;
          addDebugLog(`🔁 Swapped cameras between slot ${item.from} ↔ ${slotIndex}`);
        } else if (item.id) {
          updated[slotIndex] = newCameraId;
          addDebugLog(`🎥 Placed camera ${newCameraId} in slot ${slotIndex}`);
        }

     if (updated[slotIndex] && videoRef.current) {
          play(updated[slotIndex]!, videoRef.current, "sub", slotIndex);
          (videoRef.current as any).__currentCameraRef__ = updated[slotIndex];   
        }

        return updated;
      });
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  const setRefs = (el: HTMLDivElement | null) => {
    dropRef(el);
    dragRef(el);
    containerRef.current = el;
  };


  // 
  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        addDebugLog(`❌ Fullscreen error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div
      ref={setRefs}
      onDoubleClick={handleFullscreenToggle}
      onClick={onClick}
      className={`relative border flex items-center justify-center overflow-hidden group transition-all duration-200
        ${isOver ? "ring-2 ring-blue-400" : ""}
        ${isSelectAll && cameraId && playingCameraIds.has(cameraId) ? "border-2 border-blue-400" : "bg-slate-800 border-gray-600"}
        ${isFullscreen ? "fixed top-0 left-0 w-screen h-screen z-50" : ""}
        ${isDragging ? "opacity-50" : ""}`}
    >
      {cameraId ? (
        <>
          <video
            ref={videoRef}
            id={`video-slot-${slotIndex}`}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30 group-hover:opacity-40 transition-opacity duration-300"></div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                togglePinCamera(slotIndex);
              }}
              className={`absolute top-2 left-2 z-10 ${pinned ? "" : "opacity-0 group-hover:opacity-100"}`}
            >
              <span
                className={`inline-flex items-center  justify-center w-6 h-6 rounded-full ${
                  pinned
                    ? "bg-black text-blue-300 border border-blue-400/30"
                    : "bg-black text-white/80 border border-white/20"
                }`}
              >
                {pinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
              </span>
            </button>

       {/* Main/Sub Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMainSub(slotIndex);
              }}
              className="absolute top-2 right-[105px]  z-10 opacity-0 group-hover:opacity-100"
            >
                <span
                    className={`inline-flex items-center justify-center w-12  h-6 rounded-full ${
                      isMainViewForSlot(slotIndex)
                        ? "bg-blue-500  text-white font-medium text-[0.8rem] text-white  border-blue-300"
                        : "bg-[#009688] text-white font-medium text-[0.8rem] border-green-400/30 "
                    }`}
                  >
                  {isMainViewForSlot(slotIndex) ? "Main" : "Sub"}
                </span>
          </button>


          <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 px-2 py-1 rounded-md bg-black/20 text-white text-[10px] backdrop-blur-sm">
              <Cctv className="w-3 h-3" />
              <span className="truncate">{cameraName ?? cameraId}</span>
          </div>

          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSnapshot(slotIndex);
                    }}
                    className="p-1.5 rounded-full bg-[#131920] text-white hover:bg-black/60 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{t("Snapshot")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-full bg-[#131920] text-white hover:bg-black/60 transition-colors">
                    <Video className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{t("Record")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSlot(slotIndex, cameraId);
                    }}
                    className="p-1.5 rounded-full bg-[#131920] text-white hover:bg-black/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{t("Clear")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-700/20 transition-colors">
          <div className="text-center">
            <Cctv className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p className="text-sm">{t("No Camera Assigned")}</p>
          </div>
       
        </div>
      )}

      {streamStatus === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-sm text-slate-400">
              {t("Loading Camera")} {slotIndex + 1}...
            </span>
          </div>
        </div>
      )}

      {streamStatus === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <div className="flex flex-col items-center gap-3 text-center p-4">
            <div className="p-3 bg-red-500/20 rounded-full">
              <Video className="h-6 w-6 text-red-400" />
            </div>
            <span className="text-sm text-slate-400">
              {t("Camera Offline")} {slotIndex + 1}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
