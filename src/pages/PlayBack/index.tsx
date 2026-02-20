// Playback Page
// Fully functional playback with sidebar, toolbar, grid, timeline
// NO vertical scroll – fits exactly in viewport

import { useState } from "react";
import {
  CameraTreeSidebar,
  LiveViewToolbar,
} from "@/components/LiveView/PagesInclude";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  PlaybackCameraGrid,
  PlaybackTimelineBar,
  PlaybackTimeline,
  PlaybackAlertsBar,
} from "@/components/Playback/PagesInclude";

import { usePlayback } from "@/hooks/use-playback";

export default function Playback() {
  const [showCameraList, setShowCameraList] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState("2x2");
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const playback = usePlayback();

    const handleCameraClick = (cameraId: string) => {
           console.log(cameraId);
      };

  return (
    /* ROOT – takes full available height from AppLayout */
    <div className="flex flex-col h-full min-h-0 bg-background overflow-hidden">
       {/* Sidebar (left fixed) */}
      <Sidebar />
      {/* TOP TOOLBAR (fixed height) */}

     
      <div className="shrink-0  ml-[80px]">
        <LiveViewToolbar
          showCameraList={showCameraList}
          onToggleCameraList={() => setShowCameraList(!showCameraList)}
          selectedLayout={selectedLayout}
          onLayoutChange={setSelectedLayout}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 min-h-0 overflow-hidden gap-3  ml-[80px] py-3 px-3">
        {/* CAMERA TREE */}
        <CameraTreeSidebar
          isVisible={showCameraList}
           onCameraClick={handleCameraClick}
          onClose={() => setShowCameraList(false)}
        />

        {/* CAMERA GRID */}
          <PlaybackCameraGrid
            selectedLayout={selectedLayout}
            playheadPosition={playback.playheadPosition}
            currentTimestamp={playback.currentTimestamp}
            isPlaying={playback.isPlaying}
            selectedSlot={selectedSlot}
            onSlotSelect={setSelectedSlot}
          />
      </div>

      {/* TIMELINE (fixed height – always visible) */}
      <div className="shrink-0 z-50">
        <PlaybackTimelineBar
          isPlaying={playback.isPlaying}
          onTogglePlay={playback.togglePlay}
          onStop={playback.stop}
          onRewind={playback.rewind}
          onFastForward={playback.fastForward}
          onSkipBack={playback.skipBack}
          onSkipForward={playback.skipForward}
          speed={playback.speed}
          currentTimestamp={playback.currentTimestamp}
          isSynced={playback.isSynced}
          onToggleSync={playback.setIsSynced}
          isTimelineExpanded={isTimelineExpanded}
          onToggleTimeline={() =>
            setIsTimelineExpanded(!isTimelineExpanded)
          }
        />

        <PlaybackTimeline
          playheadPosition={playback.playheadPosition}
          isExpanded={isTimelineExpanded}
          onSeek={playback.seekTo}
        />

        <PlaybackAlertsBar />
      </div>
       </div>
  );
}
