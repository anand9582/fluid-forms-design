/**
 * Playback Toolbar Component
 * Displays layout controls and camera list toggle
 */

import React from "react";
import { LiveViewToolbar } from "@/components/LiveView/PagesInclude";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";

interface PlaybackToolbarProps {
  showCameraList: boolean;
  onToggleCameraList: () => void;
  selectedLayout: string;
  onLayoutChange: (layout: string) => void;
}

export const PlaybackToolbar = React.memo(
  ({
    showCameraList,
    onToggleCameraList,
    selectedLayout,
    onLayoutChange,
  }: PlaybackToolbarProps) => {
    const gridStore = usePlaybackGridStore();

    return (
      <div className="ml-[80px] shrink-0">
        <LiveViewToolbar
          showCameraList={showCameraList}
          onToggleCameraList={onToggleCameraList}
          selectedLayout={selectedLayout}
          onLayoutChange={onLayoutChange}
          gridStore={gridStore}
          mode="playback"
        />
      </div>
    );
  }
);

PlaybackToolbar.displayName = "PlaybackToolbar";
