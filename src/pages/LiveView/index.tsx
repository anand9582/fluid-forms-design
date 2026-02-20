import { useState, useMemo, useCallback, useEffect } from "react";
import {
  CameraTreeSidebar,
  LiveViewToolbar,
  CameraGrid,
  AISurveillanceSidebar,
  LiveAlertsBar,
} from "@/components/LiveView/PagesInclude";

import { useGridController } from "@/hooks/useGridController";
import { SidebarCameraStore } from "@/Store/SidebarCameraStore";
import useGridStore from "@/Store/UseGridStore";

export interface CameraStatus {
  id: string;
  name: string;
  location: string;
  bitrate: string;
  hasCamera?: boolean;
}

export default function LiveView() {
    const [showCameraList, setShowCameraList] = useState(true);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);
    const [mainSubMap, setMainSubMap] = useState<Record<number, "main" | "sub">>(
    {}
  );

  const cameras = SidebarCameraStore((state) => state.cameras);

  const {
    layout,
    slotAssignments,
    assignCameraToSlot,
    clearSlot,
    resizeSlots,
  } = useGridStore();

  const { play,handleSnapshot,handleRefresh} = useGridController();

//  Grid resize hone par slots auto adjust
  useEffect(() => {
    resizeSlots();
  }, [layout.rows, layout.cols, resizeSlots]);

//  lot  CameraStatus mapping
  const cameraSlots: (CameraStatus | null)[] = useMemo(() => {
    return slotAssignments.map((cameraId) => {
      if (!cameraId) return null;

      const camera = cameras.find((c) => c.cameraId === cameraId);

      return {
        id: cameraId,
        name: camera?.name || `Camera ${cameraId}`,
        location: camera?.groupName || "—",
        bitrate: "0 kbps",
        hasCamera: !!camera,
      };
    });
  }, [slotAssignments, cameras]);

  /* Sidebar se camera click */
  const handleCameraClick = (cameraId: string) => {
    const freeIndex = slotAssignments.findIndex((s) => s === null);
    if (freeIndex === -1) return;

    assignCameraToSlot(freeIndex, cameraId);

    setMainSubMap((prev) => ({
      ...prev,
      [freeIndex]: "sub",
    }));
  };

  /* Main / Sub toggle */
    const toggleMainSub = (slotIndex: number) => {
      setMainSubMap((prev) => ({
        ...prev,
        [slotIndex]: prev[slotIndex] === "main" ? "sub" : "main",
      }));
    };

//  Selected camera for sidebar
  const getSelectedCamera = useCallback(() => {
    if (selectedSlotIndex === null) return null;
    return cameraSlots[selectedSlotIndex];
  }, [selectedSlotIndex, cameraSlots]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <LiveViewToolbar
        showCameraList={showCameraList}
        onToggleCameraList={() => setShowCameraList(!showCameraList)}
      />

      <div className="flex flex-1  gap-3 min-h-0 overflow-hidden">
        <div className="flex gap-3 py-3 pl-3 flex-1">
          <CameraTreeSidebar
            isVisible={showCameraList}
            onCameraClick={handleCameraClick}
          />

          <CameraGrid
            cameraSlots={cameraSlots}
            selectedSlotIndex={selectedSlotIndex}
            onSlotSelect={setSelectedSlotIndex}
            play={play}
            toggleMainSub={toggleMainSub}
            mainSubMap={mainSubMap}
            clearSlot={clearSlot} 
            handleSnapshot={handleSnapshot}
            handleRefresh={handleRefresh}
          />
        </div>

        <AISurveillanceSidebar selectedCamera={getSelectedCamera()} />
      </div>

      <div className="h-[53px] shrink-0">
         <LiveAlertsBar />
      </div>
    </div>
  );
}
