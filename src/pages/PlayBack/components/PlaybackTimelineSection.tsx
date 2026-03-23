/**
 * Playback Timeline Section Component
 * Displays playback controls, timeline bar, timeline visualization, and alerts
 */

import React from "react";
import { PlaybackTimelineBar, PlaybackTimeline, PlaybackAlertsBar } from "@/components/Playback/PagesInclude";
import { SegmentHour, PlaybackBookmark } from "../types";

interface PlaybackTimelineSectionProps {
  cameraId: string | undefined;
  bookmarks: PlaybackBookmark[];
  isTimelineExpanded: boolean;
  onToggleTimeline: () => void;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onFastForward: () => void;
  onRewind: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onStop: () => void;
  onSeekToDate: (date: Date) => void;
  onAddBookmark: (
    name: string,
    position: number,
    timestamp: string,
    cameraId: string
  ) => void;
  onRemoveBookmark: (id: string, cameraId: string) => void;
  onJumpToBookmark: (position: number) => void;
  segmentsPerSlot: Record<number, SegmentHour[]>;
  slotCount: number;
  onSeek: (absHour: number, slotIndex?: number) => void;
  cameraNames: Record<number, string>;
  cameraIds: (string | null)[];
  timelineDate: Date;
}

export const PlaybackTimelineSection = React.memo(
  ({
    cameraId,
    bookmarks,
    isTimelineExpanded,
    onToggleTimeline,
    zoomLevel,
    onZoomChange,
    onFastForward,
    onRewind,
    onSkipBack,
    onSkipForward,
    onStop,
    onSeekToDate,
    onAddBookmark,
    onRemoveBookmark,
    onJumpToBookmark,
    segmentsPerSlot,
    slotCount,
    onSeek,
    cameraNames,
    cameraIds,
    timelineDate,
  }: PlaybackTimelineSectionProps) => {
    return (
      <div className="shrink-0 z-50 bg-white">
        <PlaybackTimelineBar
          cameraId={cameraId}
          bookmarks={bookmarks}
          isTimelineExpanded={isTimelineExpanded}
          onToggleTimeline={onToggleTimeline}
          zoomLevel={zoomLevel}
          onFastForward={onFastForward}
          onRewind={onRewind}
          onSkipBack={onSkipBack}
          onSkipForward={onSkipForward}
          onStop={onStop}
          onZoomChange={onZoomChange}
          onSeekToDate={onSeekToDate}
          onAddBookmark={onAddBookmark}
          onRemoveBookmark={onRemoveBookmark}
          onJumpToBookmark={onJumpToBookmark}
        />

        <PlaybackTimeline
          isExpanded={isTimelineExpanded}
          zoomLevel={zoomLevel}
          segmentsPerSlot={segmentsPerSlot}
          slotCount={slotCount}
          onSeek={onSeek}
          cameraNames={cameraNames}
          cameraIds={cameraIds}
          bookmarksPerSlot={{
            [slotCount > 0 ? slotCount - 1 : 0]: bookmarks || []
          }}
          timelineDate={timelineDate}
        />

        {/* <PlaybackAlertsBar /> */}
      </div>
    );
  }
);

PlaybackTimelineSection.displayName = "PlaybackTimelineSection";
