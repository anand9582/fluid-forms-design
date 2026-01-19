// Live View Page
// Main page component that composes all Live View components together

import { useState } from "react";
import {
  CameraTreeSidebar,
  LiveViewToolbar,
  CameraGrid,
  AISurveillanceSidebar,
  LiveAlertsBar,
  gridLayouts,
  savedViewsData,
} from "@/components/LiveView/PagesInclude";


export default function LiveView() {  
  const [showCameraList, setShowCameraList] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState("8x8");
  const [autoSequence, setAutoSequence] = useState(true);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-fade-in">
      {/* Top Toolbar */}
      <LiveViewToolbar
        showCameraList={showCameraList}
        onToggleCameraList={() => setShowCameraList(!showCameraList)}
        selectedLayout={selectedLayout}
        onLayoutChange={setSelectedLayout}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Camera Tree */}
        <CameraTreeSidebar isVisible={showCameraList} />

        {/* Center - Camera Grid */}
        <CameraGrid 
          selectedLayout={selectedLayout} 
          autoSequence={autoSequence} 
        />

        {/* Right Sidebar - AI Surveillance */}
        <AISurveillanceSidebar />
      </div>

      {/* Bottom - Live Alerts Bar */}
      <LiveAlertsBar />
    </div>
  );
}
