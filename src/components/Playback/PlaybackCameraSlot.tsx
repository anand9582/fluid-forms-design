import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";
import { cn } from "@/lib/utils";
import { useHlsWithStore } from "@/hooks/useHlsWithStore";
import { usePlaybackStore } from "@/Store/playbackStore";

interface RawSegment {
  startTime: Date;
  endTime: Date;
}

interface Props {
  index: number;
  cameraId: string | null;
  selected: boolean;
  onSelect: () => void;
  onCameraDrop: (cameraId: string, slotIndex: number) => void;
  getVideoSrc: (cameraId: string) => string;
  isCameraLoading: (slotIndex: number) => boolean;
  rawSegmentsPerSlot: Record<number, RawSegment[]>;
  errorMessage?: string; // slot error
}

export function PlaybackCameraSlot({
  index,
  cameraId,
  selected,
  onSelect,
  onCameraDrop,
  getVideoSrc,
  isCameraLoading,
  rawSegmentsPerSlot = {},
  errorMessage,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playback = usePlaybackStore();

  const [{ isOver }, dropRef] = useDrop({
    accept: "SIDEBAR_CAMERA",
    drop: (item: { cameraId: string }) => onCameraDrop(item.cameraId, index),
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  });
  dropRef(containerRef);

  const segments = rawSegmentsPerSlot[index] || [];
  const src = cameraId ? getVideoSrc(index) : "";

  const { videoRef, isVideoReady } = useHlsWithStore({
    src,
    cameraId,
    segments,
    slotIndex: index,
    isMaster: true,
  });

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen().catch(() => {});
  };

  const slotSeeking = playback.slotSeeking[index] ?? false;
  const showLoader = !!cameraId && !errorMessage && (!isVideoReady || isCameraLoading(index) || slotSeeking);

  return (
     <div
      ref={containerRef}
      onClick={onSelect}
      onDoubleClick={toggleFullscreen}
      className={cn(
        "group relative w-full h-full cursor-pointer overflow-hidden",
        "border-2", 
        selected && "border-blue-400", 
        isOver && "border-green-400"
      )}
    >
      {/* VIDEO */}
      {cameraId && src && !errorMessage && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          autoPlay
          playsInline
          preload="auto"
        />
      )}

      {/* LOADING SPINNER */}
      {showLoader && (
       <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] transition-opacity duration-200">
      <div className="flex flex-col items-center gap-1.5">
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-full border-2 border-white/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>
        <span className="text-[10px] text-white/80 font-medium tracking-wide">
          Connecting
        </span>
      </div>
    </div>
      )}

      {/* DROP PLACEHOLDER */}
      {!cameraId && !errorMessage && (
        <div className="flex items-center justify-center h-full text-gray-400 gap-2 text-muted-foreground">
           <Devices className="h-4 w-4" />
            <span className="text-sm font-medium">Drop Camera</span>
        </div>
      )}

      {/* ERROR */}
      {errorMessage && (
        <div className="flex items-center justify-center h-full text-destructive text-xs p-2 text-center">
          {errorMessage}
        </div>
      )}
    </div>
  );
}