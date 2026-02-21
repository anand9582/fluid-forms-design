import React, { useEffect } from "react";
import { useDrop } from "react-dnd";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";
import { cn } from "@/lib/utils";
import { useHls } from "@/components/Playback/HlsVideo";
import { PlaybackState } from "@/hooks/use-playback";

interface Props {
  index: number;
  cameraId: string | null;
  selected: boolean;
  onSelect: () => void;
  onCameraDrop: (cameraId: string, slotIndex: number) => void;
  getVideoSrc: (cameraId: string) => string;
  isCameraLoading: (cameraId: string) => boolean;
  errorMessage?: string;
  playback: PlaybackState;
  onToggleTimeline: () => void;
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
  playback,
  onToggleTimeline,
}: Props) {
  const [{ isOver }, dropRef] = useDrop({
    accept: "SIDEBAR_CAMERA",
    drop: (item: { cameraId: string }, monitor) => {
      if (monitor.didDrop()) return;
      onCameraDrop(item.cameraId, index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
  });

  const src = cameraId ? getVideoSrc(cameraId) : "";
  const videoRef = useHls(src);

 // Sync video with playback state (instant play/pause)
useEffect(() => {
  const video = videoRef.current;
  if (!video || !cameraId) return;

  if (playback.isPlaying) {
    video.play().catch(err => {
      console.warn("Video play failed:", err);
    });
  } else {
    video.pause();
  }
}, [playback.isPlaying, cameraId]);

  return (
    <div
      ref={dropRef}
      onClick={() => {
        onSelect();
        onToggleTimeline();
      }}
      className={cn(
        "relative w-full h-full overflow-hidden border cursor-pointer",
        selected && "ring-2 ring-primary",
        isOver && "border-primary"
      )}
    >
      {cameraId && (
        <video
          ref={videoRef}
          muted
          loop
          className="w-full h-full object-cover"
        />
      )}

      {!cameraId && !errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center gap-3 text-gray-400">
          <Devices className="h-4 w-4" />
          <span className="text-sm font-medium">Drop Camera</span>
        </div>
      )}

      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm px-3 text-center">
          {errorMessage}
        </div>
      )}

      {cameraId && !errorMessage && isCameraLoading(cameraId) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span className="text-xs">Loading stream…</span>
          </div>
        </div>
      )}
    </div>
  );
}