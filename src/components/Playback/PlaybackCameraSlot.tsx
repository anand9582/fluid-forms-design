import React, { useEffect } from "react";
import { useDrop } from "react-dnd";
import { Devices } from "@/components/Icons/Svg/liveViewIcons";
import { cn } from "@/lib/utils";
import { useHls } from "@/components/Playback/HlsVideo";
import type { PlaybackState } from "@/hooks/use-playback";

interface Props {
  index: number;
  cameraId: string | null;
  selected: boolean;
  onSelect: () => void;
  onCameraDrop: (cameraId: string, slotIndex: number) => void;
  getVideoSrc: (cameraId: string) => string;
  isCameraLoading: (cameraId: string) => boolean;
  errorMessage?: string;
  onVideoError?: (cameraId: string, message: string) => void;
  onVideoPlaying?: (cameraId: string) => void;
  onVideoWaiting?: (cameraId: string) => void;
  playback: PlaybackState;
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
  onVideoError,
  onVideoPlaying,
  onVideoWaiting,
  playback,
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
  const videoRef = useHls(src, true, playback.isPlaying);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !cameraId) return;

    const handleError = () => {
      onVideoError?.(cameraId, "Stream error");
    };
    const handlePlaying = () => {
      onVideoPlaying?.(cameraId);
    };
    const handleWaiting = () => {
      onVideoWaiting?.(cameraId);
    };

    video.addEventListener("error", handleError);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("waiting", handleWaiting);

    return () => {
      video.removeEventListener("error", handleError);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("waiting", handleWaiting);
    };
  }, [cameraId, onVideoError, onVideoPlaying, onVideoWaiting, videoRef]);

  return (
    <div
      ref={dropRef as unknown as React.Ref<HTMLDivElement>}
      onClick={onSelect}
      className={cn(
        "relative w-full h-full overflow-hidden border cursor-pointer",
        selected && "ring-2 ring-primary",
        isOver && "border-primary"
      )}
    >
      {cameraId && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover bg-black"
          muted
          playsInline
          preload="auto"
        />
      )}

      {!cameraId && !errorMessage && (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <Devices className="h-8 w-8 opacity-50" />
          <span className="text-xs opacity-70">Drop Camera</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center justify-center h-full text-destructive text-xs p-2 text-center">
          {errorMessage}
        </div>
      )}

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
