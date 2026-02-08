// Live View Page
// Main page component that composes all Live View components together

import { useState } from "react";
// import { useCameraTree } from "@/components/LiveView";
import { useCameraTree } from "@/hooks/TreeSidebar";
import { dummyCameraData } from "@/components/LiveView/DummyTreeData";
import {
  CameraTreeSidebar,
  LiveViewToolbar,
  CameraGrid,
  AISurveillanceSidebar,
  LiveAlertsBar,
} from "@/components/LiveView/PagesInclude";


export default function LiveView() {
  const [showCameraList, setShowCameraList] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState("2x2");
  const [autoSequence, setAutoSequence] = useState(true);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
   const hook = useCameraTree(dummyCameraData);
  // Camera data matching the grid
  const cameraData = [
    { name: "Lobby Entrance main", location: "Building A > Floor 1 > Lobby", bitrate: "4896" },
    { name: "Hall Entrance main", location: "Building A > Floor 1 > Lobby", bitrate: "4896" },
    { name: "Gym area", location: "Building B > Ground Floor", bitrate: "3200" },
    { name: "Fifth floor", location: "Building A > Floor 5", bitrate: "4200" },
  ];

  // Get selected camera info based on slot index
  const getSelectedCamera = () => {
    if (selectedSlotIndex === null) return null;
    return cameraData[selectedSlotIndex] || null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top Toolbar */}
      <LiveViewToolbar
        showCameraList={showCameraList}
        onToggleCameraList={() => setShowCameraList(!showCameraList)}
        selectedLayout={selectedLayout}
        onLayoutChange={setSelectedLayout}
      />

      {/* Main Content Area */}
    <div className="flex flex-1 overflow-hidden gap-3">
      <div className="flex gap-3 p-3 flex-1">
          <CameraTreeSidebar
            isVisible={showCameraList}
            data={dummyCameraData}
            hook={hook}
            onCameraClick={camera => console.log("Clicked:", camera)}
          />

          <CameraGrid 
            selectedLayout={selectedLayout} 
            autoSequence={autoSequence}
            selectedSlotIndex={selectedSlotIndex}
            onSlotSelect={setSelectedSlotIndex}
          />
      </div>

        {/* Right Sidebar - Controls Panel */}
        <AISurveillanceSidebar selectedCamera={getSelectedCamera()} />
      </div>


   {/* Bottom - Live Alerts Bar */}
        <div className="h-[53px] shrink-0">
          <LiveAlertsBar />
        </div>
    </div>
  );
}


