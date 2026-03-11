import React, { useMemo } from "react";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";
import { PlaybackCameraSlot } from "./PlaybackCameraSlot";

interface RawSegment {
  startTime: Date;
  endTime: Date;
}

interface Props {
  selectedSlot: number | null;
  onSlotSelect: (i: number | null) => void;
  getVideoSrc: (slotIndex: number) => string;
  onCameraDrop: (cameraId: string, slotIndex: number) => void;
  isCameraLoading: (cameraId: string) => boolean;
  rawSegmentsPerSlot: Record<number, RawSegment[]>;
  slotErrors?: Record<number, string>; 
}

export function PlaybackCameraGrid({
  selectedSlot,
  onSlotSelect,
  getVideoSrc,
  onCameraDrop,
  isCameraLoading,
  rawSegmentsPerSlot,
  slotErrors = {},
}: Props) {
  const { layout, slotAssignments } = usePlaybackGridStore();
  const totalSlots = layout.rows * layout.cols;

  const displaySlots = useMemo(
    () => Array.from({ length: totalSlots }, (_, i) => slotAssignments[i] || null),
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
            onSelect={() => onSlotSelect(selectedSlot === index ? null : index)}
            onCameraDrop={onCameraDrop}
            getVideoSrc={() => getVideoSrc(index)}
            isCameraLoading={isCameraLoading}
            rawSegmentsPerSlot={rawSegmentsPerSlot}
            errorMessage={slotErrors[index]} 
          />
        ))}
      </div>
    </div>
  );
}