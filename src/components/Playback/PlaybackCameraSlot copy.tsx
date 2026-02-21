import React from "react";
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
  onVideoPlaying: (cameraId: string) => void;
  onVideoWaiting: (cameraId: string) => void;
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
  const videoRef = useHls(src);

  return (
    <div
      ref={dropRef}
      onClick={onSelect}
      className={cn(
        "relative w-full h-full overflow-hidden border",
        selected && "ring-2 ring-primary",
        isOver && "border-primary"
      )}
    >
      {/* VIDEO */}
      {cameraId && (
        <video
          ref={videoRef}
          muted
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          onPlaying={() => onVideoPlaying(cameraId)}
          onWaiting={() => onVideoWaiting(cameraId)}
        />
      )}

      {/* EMPTY SLOT */}
      {!cameraId && !errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center gap-3 text-gray-400">
          <Devices className="h-4 w-4" />
          <span className="text-sm font-medium">Drop Camera</span>
        </div>
      )}

      {/* ERROR */}
      {errorMessage && (
        <div className="absolute inset-0 flex items-center justify-center text-red-400 text-sm px-3 text-center">
          {errorMessage}
        </div>
      )}

      {/* LOADING */}
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