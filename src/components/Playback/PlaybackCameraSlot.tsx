import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";
import { cn } from "@/lib/utils";
import { useHlsWithStore } from "@/hooks/useHlsWithStore";
import { usePlaybackStore } from "@/Store/playbackStore";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";
import { RefershIcons, VioceIcons } from "@/components/Icons/Svg/liveViewIcons";
import { Volume2, VolumeX, Camera, X } from "lucide-react";

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
  getVideoSrc: (slotIndex: number) => string; // ✅ FIXED
  isCameraLoading: (slotIndex: number) => boolean;
  rawSegmentsPerSlot: Record<number, RawSegment[]>;
  errorMessage?: string;
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
  const clearSlot = usePlaybackGridStore((s) => s.clearSlot);
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const segments = rawSegmentsPerSlot[index] || [];

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRefreshKey((prev) => prev + 1);
    
    // Seek to first recording segment start time
    const firstSegment = segments.find((s: any) => s.type === "recording") || segments[0];
    if (firstSegment) {
       playback.seekTo(new Date(firstSegment.startTime), index);
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => !prev);
  };

  const handleSnapshot = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use the DOM element from the videoRef in useHlsWithStore
    const vp = document.querySelector(`#playback-video-${index}`) as HTMLVideoElement;
    if (!vp) return;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = vp.videoWidth;
      canvas.height = vp.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(vp, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg");
        const link = document.createElement("a");
        link.href = dataUri;
        link.download = `playback_snapshot_${cameraId}_${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Failed to take snapshot", err);
    }
  };

  const handleClearSlot = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearSlot(index);
  };

  /* ---------------- DROP ---------------- */
  const [{ isOver }, dropRef] = useDrop({
    accept: "SIDEBAR_CAMERA",
    drop: (item: { cameraId: string }) =>
      onCameraDrop(item.cameraId, index),
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  dropRef(containerRef);

  /* ---------------- DATA ---------------- */
  const src = cameraId ? getVideoSrc(index) : "";

  /* ---------------- HLS ---------------- */
  const { videoRef, isVideoReady } = useHlsWithStore({
    src,
    cameraId,
    segments,
    slotIndex: index,
    isMaster: true, 
    refreshKey,
  });

  /* ---------------- FULLSCREEN ---------------- */
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen().catch(() => {});
    }
  };

  /* ---------------- LOADING ---------------- */
  const slotSeeking = playback.slotSeeking[index] ?? false;

  const showLoader =
    !!cameraId &&
    !errorMessage &&
    (!isVideoReady ||
      isCameraLoading(index) ||
      slotSeeking);

  /* ---------------- UI ---------------- */
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
          id={`playback-video-${index}`}
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted={isMuted}
          playsInline
          preload="auto"
          autoPlay
        />
      )}

      {/* LOADER */}
      {showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full border-2 border-white/20" />
              <div className="absolute inset-0 rounded-full border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            </div>
            <span className="text-[10px] text-white/80 font-medium">
              Connecting
            </span>
          </div>
        </div>
      )}

      {/* EMPTY SLOT */}
      {!cameraId && !errorMessage && (
        <div className="flex items-center justify-center h-full text-gray-400 gap-2">
          <Devices className="h-4 w-4" />
          <span className="text-sm font-medium">
            Drop Camera
          </span>
        </div>
      )}

      {/* ERROR */}
      {errorMessage && (
        <div className="flex items-center justify-center h-full text-red-500 text-xs p-2 text-center">
          {errorMessage}
        </div>
      )}

      {/* CONTROLS */}
      {cameraId && !errorMessage && (
        <div
          className={cn(
            "absolute bottom-2 left-1/2 -translate-x-1/2 z-10 px-2 py-1 flex gap-2",
            "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0",
            "transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto"
          )}
        >
          <button
            className="p-1.5 bg-black/70 hover:bg-black rounded text-white/90 transition-colors"
            title="Refresh Stream"
            onClick={handleRefresh}
          >
            <RefershIcons size={12} />
          </button>

          <button
            className="p-1.5 bg-black/70 hover:bg-black rounded text-white/90 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
            onClick={handleMuteToggle}
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>

          <button
            className="p-1.5 bg-black/70 hover:bg-black rounded text-white/90 transition-colors"
            title="Snapshot"
            onClick={handleSnapshot}
          >
            <Camera size={12} />
          </button>

          <button
            className="p-1.5 bg-black/70 hover:bg-black rounded text-white/90 transition-colors"
            title="Close Slot"
            onClick={handleClearSlot}
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}