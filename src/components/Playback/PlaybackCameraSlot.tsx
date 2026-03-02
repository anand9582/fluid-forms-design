import React, { useRef } from "react";
import { useDrop } from "react-dnd";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";
import { cn } from "@/lib/utils";
import { usePlaybackStore } from "@/Store/playbackStore";
import { useHlsWithStore } from "@/hooks/useHlsWithStore";

interface Props {
  index: number;
  cameraId: string | null;
  selected: boolean;
  onSelect: () => void;
  onCameraDrop: (cameraId: string, slotIndex: number) => void;
  getVideoSrc: (cameraId: string) => string;
  isCameraLoading: (cameraId: string) => boolean;
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
  errorMessage,
}: Props) {
  /* ---------------- DOM REF ---------------- */
  const containerRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- DND ---------------- */
  const [{ isOver }, dropRef] = useDrop({
    accept: "SIDEBAR_CAMERA",
    drop: (item: { cameraId: string }) => {
      onCameraDrop(item.cameraId, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  dropRef(containerRef);

  /* ---------------- PLAYBACK STORE ---------------- */
  const segments = usePlaybackStore((s) => s.segments);

  /* ---------------- VIDEO SRC ---------------- */
  const src = cameraId ? getVideoSrc(cameraId) : "";

  /* ---------------- HLS ---------------- */
  const { videoRef} = useHlsWithStore({
    src,
    cameraId,
    segments,
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

  return (
    <div
      ref={containerRef}
      onClick={onSelect}
      onDoubleClick={toggleFullscreen}
      className={cn(
        "relative w-full h-full overflow-hidden border cursor-pointer select-none",
        selected && "ring-2 ring-primary",
        isOver && "border-primary"
      )}
    >
      {/* ---------------- VIDEO ---------------- */}
      {cameraId && src && !errorMessage && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          controls
        />
      )}

      {/* ---------------- EMPTY SLOT ---------------- */}
      {!cameraId && !errorMessage && (
        <div className="flex items-center justify-center h-full text-muted-foreground gap-2">
          <Devices className="h-4 w-4" />
          <span className="text-sm">Drop Camera</span>
        </div>
      )}

      {/* ---------------- ERROR ---------------- */}
      {/* {errorMessage && (
        <div className="flex items-center justify-center h-full text-destructive text-xs p-2 text-center">
          {errorMessage}
        </div>
      )} */}

      {/* ---------------- LOADING ---------------- */}
      {/* {cameraId && (isCameraLoading(cameraId) || !ready) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading stream…</span>
          </div>
        </div>
      )} */}
    </div>
  );
}