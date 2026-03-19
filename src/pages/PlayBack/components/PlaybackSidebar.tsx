/**
 * Playback Page Sidebar Component
 * Displays main navigation sidebar
 */

import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export const PlaybackSidebar = React.memo(() => {
  return <Sidebar />;
});

PlaybackSidebar.displayName = "PlaybackSidebar";
