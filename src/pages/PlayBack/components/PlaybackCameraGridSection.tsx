
import React from "react";
import { CameraTreeSidebar } from "@/components/LiveView/PagesInclude";
import { PlaybackCameraGrid } from "@/components/Playback/PlaybackCameraGrid";
import { RawSegment } from "../types";

interface PlaybackCameraGridSectionProps {
  selectedSlot: number | null;
  onSlotSelect: (slot: number | null) => void;
  getVideoSrc: (slotIndex: number) => string;
  onCameraDrop: (cameraId: string, slotIndex: number) => Promise<void>;
  onCameraClick: (cameraId: string) => Promise<void>;
  isCameraLoading: (slotIndex: number) => boolean;
  rawSegmentsPerSlot: Record<number, RawSegment[]>;
  slotErrors: Record<number, string>;
  showCameraList: boolean;
}

export const PlaybackCameraGridSection = React.memo(
  ({
    selectedSlot,
    onSlotSelect,
    getVideoSrc,
    onCameraDrop,
    onCameraClick,
    isCameraLoading,
    rawSegmentsPerSlot,
    slotErrors,
    showCameraList,
  }: PlaybackCameraGridSectionProps) => {
    return (
      <div className="flex flex-1 ml-[80px] gap-3 p-3 overflow-hidden">
        <CameraTreeSidebar isVisible={showCameraList} onCameraClick={onCameraClick} />
        <PlaybackCameraGrid
          selectedSlot={selectedSlot}
          onSlotSelect={onSlotSelect}
          getVideoSrc={getVideoSrc}
          onCameraDrop={onCameraDrop}
          isCameraLoading={isCameraLoading}
          rawSegmentsPerSlot={rawSegmentsPerSlot}
          slotErrors={slotErrors}
        />
      </div>
    );
  }
);

PlaybackCameraGridSection.displayName = "PlaybackCameraGridSection";
