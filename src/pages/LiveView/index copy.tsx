// // Live View Page
// // Main page component that composes all Live View components together

// import { useState } from "react";
// // import { useCameraTree } from "@/components/LiveView";
// import { useCameraTree } from "@/hooks/TreeSidebar";
// import { dummyCameraData } from "@/components/LiveView/DummyTreeData";
// import {
//   CameraTreeSidebar,
//   LiveViewToolbar,
//   CameraGrid,
//   AISurveillanceSidebar,
//   LiveAlertsBar,
// } from "@/components/LiveView/PagesInclude";


// export default function LiveView() {
//   const [showCameraList, setShowCameraList] = useState(true);
//   const [selectedLayout, setSelectedLayout] = useState("2x2");
//   const [autoSequence, setAutoSequence] = useState(true);
//  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);

//    const hook = useCameraTree(dummyCameraData);
//    // Initialize grid slots with null
//   const [cameraSlots, setCameraSlots] = useState<(CameraStatus | null)[]>([
//     null, null, null, null
//   ]);


//   // Camera data matching the grid
//   const cameraData = [
//     { name: "Lobby Entrance main", location: "Building A > Floor 1 > Lobby", bitrate: "4896" },
//     { name: "Hall Entrance main", location: "Building A > Floor 1 > Lobby", bitrate: "4896" },
//     { name: "Gym area", location: "Building B > Ground Floor", bitrate: "3200" },
//     { name: "Fifth floor", location: "Building A > Floor 5", bitrate: "4200" },
//   ];

//   // Handle sidebar camera click → assign to selected slot
//   const handleCameraClick = (camera: CameraStatus) => {
//     const targetIndex = selectedSlotIndex ?? cameraSlots.findIndex((slot) => slot === null);
//     if (targetIndex === -1) return; // No empty slot

//     setCameraSlots((prev) => {
//       const updated = [...prev];
//       updated[targetIndex] = camera;
//       return updated;
//     });

//     setSelectedSlotIndex(targetIndex); // Focus slot
//   };

  
//   // Get selected camera info based on slot index
//   const getSelectedCamera = () => {
//     if (selectedSlotIndex === null) return null;
//     return cameraData[selectedSlotIndex] || null;
//   };

//   return (
//     <div className="flex flex-col h-[calc(100vh-4rem)]">
//       {/* Top Toolbar */}
//       <LiveViewToolbar
//         showCameraList={showCameraList}
//         onToggleCameraList={() => setShowCameraList(!showCameraList)}
//         selectedLayout={selectedLayout}
//         onLayoutChange={setSelectedLayout}
//       />

//       {/* Main Content Area */}
//     <div className="flex flex-1 overflow-hidden gap-3">
//       <div className="flex gap-3 p-3 flex-1">
//            <CameraTreeSidebar
//             isVisible={showCameraList}
//             data={dummyCameraData}
//             hook={hook}
//             onCameraClick={handleCameraClick} 
//           />

//           <CameraGrid
//             cameraSlots={cameraSlots}            
//             selectedSlotIndex={selectedSlotIndex}  
//             onSlotSelect={setSelectedSlotIndex}   
//             autoSequence={autoSequence}
   
//           />
//       </div>

//         {/* Right Sidebar - Controls Panel */}
//         <AISurveillanceSidebar selectedCamera={getSelectedCamera()} />
//       </div>


//    {/* Bottom - Live Alerts Bar */}
//         <div className="h-[53px] shrink-0">
//           <LiveAlertsBar />
//         </div>
//     </div>
//   );
// }



// Live View Page
// index.tsx style, but fully functional camera grid with slot selection

import { useState, useMemo, useCallback } from "react";
import { CameraTreeSidebar, LiveViewToolbar, CameraGrid, AISurveillanceSidebar, LiveAlertsBar } from "@/components/LiveView/PagesInclude";
import { useCameraTree } from "@/hooks/TreeSidebar";
import { dummyCameraData } from "@/components/LiveView/DummyTreeData";
import { useGridController } from "@/hooks/useGridController";

// Define type for camera slot
export interface CameraStatus {
  id: string;
  name: string;
  location: string;
  bitrate: string;
  hasCamera?: boolean;
}

export default function LiveView() {
  // ------------------- State Hooks -------------------
  const [showCameraList, setShowCameraList] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState("2x2");
  const [autoSequence, setAutoSequence] = useState(true);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);

  // Initialize camera slots for the grid
  const totalSlots = selectedLayout.split("x").reduce((a, b) => Number(a) * Number(b), 1);
  const [cameraSlots, setCameraSlots] = useState<(CameraStatus | null)[]>(Array(totalSlots).fill(null));

  const hook = useCameraTree(dummyCameraData);

 const {
    layout,
    slotAssignments,
    setSlotAssignments,
    play,
    gridRef,
    handleFullScreenToggle,
    debugLogs,
  } = useGridController();

  // ------------------- Handlers -------------------
  // Assign camera to selected slot or first empty slot
  const handleCameraClick = useCallback((camera: CameraStatus) => {
    const targetIndex = selectedSlotIndex ?? cameraSlots.findIndex((slot) => slot === null);
    if (targetIndex === -1) return; 

    setCameraSlots((prev) => {
      const updated = [...prev];
      updated[targetIndex] = camera;
      return updated;
    });

    setSelectedSlotIndex(targetIndex);
  }, [cameraSlots, selectedSlotIndex]);

  // Get selected camera info for AISidebar
  const getSelectedCamera = useCallback(() => {
    if (selectedSlotIndex === null) return null;
    return cameraSlots[selectedSlotIndex] || null;
  }, [selectedSlotIndex, cameraSlots]);

  // ------------------- Render -------------------
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top Toolbar */}
      <LiveViewToolbar
        showCameraList={showCameraList}
        onToggleCameraList={() => setShowCameraList(!showCameraList)}
        selectedLayout={selectedLayout}
        onLayoutChange={(layout) => {
          setSelectedLayout(layout);
          const total = layout.split("x").reduce((a, b) => Number(a) * Number(b), 1);
          setCameraSlots((prev) => [...prev.slice(0, total), ...Array(Math.max(0, total - prev.length)).fill(null)]);
        }}
      />

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden gap-3">
        {/* Left Sidebar */}
        <div className="flex gap-3 p-3 flex-1">
          <CameraTreeSidebar
            isVisible={showCameraList}
            data={dummyCameraData}
            hook={hook}
            onCameraClick={handleCameraClick}
          />

          {/* Center Grid */}
          <CameraGrid
            cameraSlots={setSlotAssignments}
            selectedSlotIndex={selectedSlotIndex}
            onSlotSelect={setSelectedSlotIndex}
            autoSequence={autoSequence}
             play={play} 
          />
        </div>

        {/* Right Sidebar / Controls */}
        <AISurveillanceSidebar selectedCamera={getSelectedCamera()} />
      </div>

      {/* Bottom Alerts Bar */}
      <div className="h-[53px] shrink-0">
        <LiveAlertsBar />
      </div>
    </div>
  );
}
