// components/PlaybackCameraSlot.tsx
import React from "react";
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
  // React DnD drop
  const [{ isOver }, dropRef] = useDrop({
    accept: "SIDEBAR_CAMERA",
    drop: (item: { cameraId: string }, monitor) => {
      if (monitor.didDrop()) return;
      onCameraDrop(item.cameraId, index);
    },
    collect: (monitor) => ({ isOver: monitor.isOver({ shallow: true }) }),
  });

  // Playback segments from store
  const segments = usePlaybackStore((s) => s.segments);

  // Video source
  const src = cameraId ? getVideoSrc(cameraId) : "";

  // Hook for HLS + timeline + speed + play/pause
  const videoRef = useHlsWithStore({ src, cameraId: cameraId!, segments });

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      onClick={onSelect}
      className={cn(
        "relative w-full h-full overflow-hidden border cursor-pointer bg-black",
        selected && "ring-2 ring-primary",
        isOver && "border-primary"
      )}
    >
      {/* Video */}
      {cameraId && !errorMessage && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          controls
        />
      )}

      {/* Empty slot */}
      {!cameraId && !errorMessage && (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <Devices className="h-8 w-8 opacity-50" />
          <span className="text-xs opacity-70">Drop Camera</span>
        </div>
      )}

      {/* Error */}
      {errorMessage && (
        <div className="flex items-center justify-center h-full text-destructive text-xs p-2 text-center">
          {errorMessage}
        </div>
      )}

      {/* Loading overlay */}
      {cameraId && !errorMessage && isCameraLoading(cameraId) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading stream…</span>
          </div>
        </div>
      )}
    </div>
  );
}