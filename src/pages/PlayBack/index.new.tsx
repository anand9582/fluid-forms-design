/**
 * PlayBack Page - Main Component
 * Modular page structure with clean separation of concerns
 */

import React, { useCallback } from "react";
import { getAuthHeaders } from "@/components/Config/api";
import { usePlaybackStore } from "@/Store/playbackStore";
import { usePlaybackLogic } from "./usePlaybackLogic";
import { PlaybackSidebar } from "./components/PlaybackSidebar";
import { PlaybackToolbar } from "./components/PlaybackToolbar";
import { PlaybackCameraGridSection } from "./components/PlaybackCameraGridSection";
import { PlaybackTimelineSection } from "./components/PlaybackTimelineSection";

/**
 * Main PlayBack Page Component
 * Orchestrates all sub-components and manages playback logic
 */
export default function Index() {
  const playback = usePlaybackStore();

  // Custom hook handles all playback logic
  const {
    state,
    setSelectedDate,
    setSelectedSlot,
    setZoomLevel,
    setTimelineExpanded,
    handleCameraDrop,
    handleSeek,
    handleSeekToDate,
    handleJumpToBookmark,
    handleFastForward,
    handleRewind,
    handleSkipBack,
    handleSkipForward,
    handleTimelineAddBookmark,
    handleTimelineRemoveBookmark,
    handleLayoutChange,
    handleToggleCameraList,
    getVideoSrc,
    cameraNames,
  } = usePlaybackLogic(getAuthHeaders);

  // Memoized stop handler
  const handleStop = useCallback(() => {
    playback.stop();
  }, [playback]);

  // Memoized bookmark add handler
  const handleBookmarkAdd = useCallback(
    (name: string, position: number, timestamp: string, camId: string) => {
      if (state.selectedSlot !== null) {
        handleTimelineAddBookmark(state.selectedSlot, position);
      }
    },
    [state.selectedSlot, handleTimelineAddBookmark]
  );

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Navigation Sidebar */}
      <PlaybackSidebar />

      {/* Toolbar */}
      <PlaybackToolbar
        showCameraList={state.showCameraList}
        onToggleCameraList={handleToggleCameraList}
        selectedLayout={state.selectedLayout}
        onLayoutChange={handleLayoutChange}
      />

      {/* Main Content Area */}
      <PlaybackCameraGridSection
        selectedSlot={state.selectedSlot}
        onSlotSelect={setSelectedSlot}
        getVideoSrc={getVideoSrc}
        onCameraDrop={handleCameraDrop}
        isCameraLoading={(slotIndex) => state.loadingSlots.has(slotIndex)}
        rawSegmentsPerSlot={state.rawSegmentsPerSlot}
        slotErrors={state.slotErrors}
        showCameraList={state.showCameraList}
      />

      {/* Timeline & Controls */}
      <PlaybackTimelineSection
        cameraId={state.players.find(
          (p) =>
            p.slotIndex === state.selectedSlot &&
            p.date.toDateString() === state.selectedDate.toDateString()
        )?.cameraId}
        bookmarks={state.bookmarksPerSlot[state.selectedSlot!] || []}
        isTimelineExpanded={state.isTimelineExpanded}
        onToggleTimeline={() => setTimelineExpanded(!state.isTimelineExpanded)}
        zoomLevel={state.zoomLevel}
        onZoomChange={setZoomLevel}
        onFastForward={handleFastForward}
        onRewind={handleRewind}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
        onStop={handleStop}
        onSeekToDate={handleSeekToDate}
        onAddBookmark={handleBookmarkAdd}
        onRemoveBookmark={handleTimelineRemoveBookmark}
        onJumpToBookmark={handleJumpToBookmark}
        segmentsPerSlot={state.segmentsPerSlot}
        slotCount={state.players.length}
        onSeek={handleSeek}
        cameraNames={cameraNames}
        cameraIds={Object.values(state.players).map((p) => p.cameraId) || []}
        timelineDate={state.selectedDate}
      />
    </div>
  );
}
