// Playback Page
// Main page component that composes all Playback components together
// Layout: Toolbar > [Sidebar | Grid] > TimelineBar > Timeline (expandable) > AlertsBar

import { useState } from "react";
import { CameraTreeSidebar, LiveViewToolbar } from "@/components/LiveView";
import {
  PlaybackCameraGrid,
  PlaybackTimelineBar,
  PlaybackTimeline,
  PlaybackAlertsBar,
} from "@/components/playback";

export default function Playback() {
  const [showCameraList, setShowCameraList] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState("2x2");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynced, setIsSynced] = useState(true);
  const [playheadPosition] = useState(52);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  return (
    <div className="flex flex-col h-screen animate-fade-in">
      {/* Top Toolbar */}
      <LiveViewToolbar
        showCameraList={showCameraList}
        onToggleCameraList={() => setShowCameraList(!showCameraList)}
        selectedLayout={selectedLayout}
        onLayoutChange={setSelectedLayout}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Sidebar - Camera Tree */}
        <CameraTreeSidebar
          isVisible={showCameraList}
          onClose={() => setShowCameraList(false)}
        />

        {/* Center - Camera Grid */}
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/30">
          <PlaybackCameraGrid
            selectedLayout={selectedLayout}
            playheadPosition={playheadPosition}
            selectedSlot={selectedSlot}
            onSlotSelect={setSelectedSlot}
          />
        </div>
      </div>

      {/* Bottom stack: TimelineBar > Timeline Tracks > Alerts */}
      <PlaybackTimelineBar
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        isSynced={isSynced}
        onToggleSync={setIsSynced}
        isTimelineExpanded={isTimelineExpanded}
        onToggleTimeline={() => setIsTimelineExpanded(!isTimelineExpanded)}
      />

      <PlaybackTimeline
        playheadPosition={playheadPosition}
        isExpanded={isTimelineExpanded}
      />

      <PlaybackAlertsBar />
    </div>
  );
}
