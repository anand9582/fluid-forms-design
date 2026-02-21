import React, { useMemo } from "react";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";
import { PlaybackCameraSlot } from "./PlaybackCameraSlot";
import { PlaybackState } from "@/hooks/use-playback"; 

interface Props {
  selectedSlot: number | null;
  onSlotSelect: (i: number | null) => void;
  getVideoSrc: (cameraId: string) => string;
  onCameraDrop: (cameraId: string, slotIndex: number) => void;
  isCameraLoading: (cameraId: string) => boolean;
  cameraErrors: Record<string, string>;
  onVideoError: (cameraId: string, message: string) => void;
  onVideoPlaying: (cameraId: string) => void;
  onVideoWaiting: (cameraId: string) => void;
  playback: PlaybackState; 
}

export function PlaybackCameraGrid({
  selectedSlot,
  onSlotSelect,
  getVideoSrc,
  onCameraDrop,
  isCameraLoading,
  cameraErrors,
  onVideoError,
  onVideoPlaying,
  onVideoWaiting,
  playback, 
}: Props) {
  const { layout, slotAssignments } = usePlaybackGridStore();
  const totalSlots = layout.rows * layout.cols;

  const displaySlots = useMemo(
    () =>
      Array.from(
        { length: totalSlots },
        (_, i) => slotAssignments[i] || null
      ),
    [slotAssignments, totalSlots]
  );

  return (
    <div className="flex-1 min-h-0 overflow-hidden">
      <div
        className="grid h-full"
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
          gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
        }}
      >
        {displaySlots.map((cameraId, index) => (
          <PlaybackCameraSlot
            key={index}
            index={index}
            cameraId={cameraId}
            selected={selectedSlot === index}
            onSelect={() =>
              onSlotSelect(selectedSlot === index ? null : index)
            }
            onCameraDrop={onCameraDrop}
            getVideoSrc={getVideoSrc}
            isCameraLoading={isCameraLoading}
            errorMessage={cameraId ? cameraErrors[cameraId] : ""}
            onVideoError={onVideoError}
            onVideoPlaying={onVideoPlaying}
            onVideoWaiting={onVideoWaiting}
            playback={playback}
          />
        ))}
      </div>
    </div>
  );
}