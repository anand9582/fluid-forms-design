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
  const [{ isOver }, dropRef] = useDrop({
    accept: "SIDEBAR_CAMERA",
    drop: (item: { cameraId: string }) => {
      onCameraDrop(item.cameraId, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const segments = usePlaybackStore((s) => s.segments);

  const src = cameraId ? getVideoSrc(cameraId) : "";

  const videoRef = useHlsWithStore({  
    src,
    cameraId,
    segments,
  });
console.log("🧩 Slot", {
  index,
  cameraId,
  src,
});
  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      onClick={onSelect}
      className={cn(
        "relative w-full h-full overflow-hidden border bg-black cursor-pointer",
        selected && "ring-2 ring-primary",
        isOver && "border-primary"
      )}
    >
      {/* VIDEO */}
      {cameraId && !errorMessage && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        />
      )}

      {/* EMPTY SLOT */}
      {!cameraId && !errorMessage && (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <Devices className="h-8 w-8 opacity-50" />
          <span className="text-xs opacity-70">Drop Camera</span>
        </div>
      )}

      {/* ERROR */}
      {errorMessage && (
        <div className="flex items-center justify-center h-full text-destructive text-xs p-2 text-center">
          {errorMessage}
        </div>
      )}

      {/* LOADING */}
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