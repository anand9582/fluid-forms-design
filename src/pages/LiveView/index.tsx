import { useState, useMemo, useRef, useCallback, useEffect } from "react";
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
import { useStreamStore } from "@/Store/useStreamStore";
import { PanelRightClose } from "lucide-react";

export interface CameraStatus {
  id: string;
  name: string;
  location: string;
  bitrate: string;
  hasCamera?: boolean;
}

export default function LiveView() {
  const [showCameraList, setShowCameraList] = useState(true);
  const [showAISidebar, setShowAISidebar] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);
  const [selectedLayout, setSelectedLayout] = useState<string>("grid"); 
  const [mainSubMap, setMainSubMap] = useState<Record<number, "main" | "sub">>(
    {}
  );

  const cameras = SidebarCameraStore((state) => state.cameras);

  const { layout, slotAssignments, assignCameraToSlot, clearSlot, resizeSlots } =
    useGridStore();

  const { play, handleSnapshot, handleRefresh } = useGridController();

  useEffect(() => {
    resizeSlots();
  }, [layout.rows, layout.cols, resizeSlots]);

  // Camera mapping
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

  const handleCameraClick = (cameraId: string) => {
    const freeIndex = slotAssignments.findIndex((s) => s === null);
    if (freeIndex === -1) return;

    assignCameraToSlot(freeIndex, cameraId);

    setMainSubMap((prev) => ({
      ...prev,
      [freeIndex]: "sub",
    }));
  };

  const toggleMainSub = (
    slotIndex: number,
    cameraId: string,
    nextType: "main" | "sub"
  ) => {
    if (!cameraId) return;

    const streams = useStreamStore.getState().streams;

    const oldStream = streams.find((s) => s.slotId === slotIndex);
    if (oldStream) {
      try {
        oldStream.pc.close();
      } catch {}
      useStreamStore.getState().removeStreamByInstanceId(oldStream.instanceId);
    }

    const videoEl = document.querySelector<HTMLVideoElement>(
      `#video-slot-${slotIndex}`
    );
    if (!videoEl) return;

    const { pc: newPc, instanceId } = play(
      cameraId,
      videoEl,
      nextType,
      slotIndex
    );

    useStreamStore.getState().addStream({
      instanceId,
      cameraId,
      pc: newPc,
      streamType: nextType,
      slotId: slotIndex,
    });

    setMainSubMap((prev) => ({
      ...prev,
      [slotIndex]: nextType,
    }));
  };

  const getSelectedCamera = useCallback(() => {
    if (selectedSlotIndex === null) return null;
    return cameraSlots[selectedSlotIndex];
  }, [selectedSlotIndex, cameraSlots]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <LiveViewToolbar
        showCameraList={showCameraList}
        onToggleCameraList={() => setShowCameraList(!showCameraList)}
        gridStore={useGridStore()}
        selectedLayout={selectedLayout}
        onLayoutChange={(layout) => setSelectedLayout(layout)}
      />

      <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
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

   {/* RIGHT AI SIDEBAR */}
        <div className="relative flex">
          {!showAISidebar && (
            <button
              onClick={() => setShowAISidebar(true)}
              className="w-10 bg-background border-l border-border flex items-start pt-3 justify-center hover:bg-muted transition-colors"
            >
              <PanelRightClose size={18} className="text-muted-foreground" />
            </button>
          )}

          {showAISidebar && (
            <AISurveillanceSidebar
              selectedCamera={getSelectedCamera()}
              selectedSlotIndex={selectedSlotIndex}
              mainSubMap={mainSubMap}
              toggleMainSub={toggleMainSub}
              onCollapse={() => setShowAISidebar(false)}
            />
          )}
        </div>
      </div>

      <div className="h-[53px] shrink-0">
        <LiveAlertsBar />
      </div>
    </div>
  );
}