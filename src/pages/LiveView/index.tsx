import { useState, useMemo,useRef, useCallback, useEffect } from "react";
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
  const instanceRef = useRef<Record<number, string | null>>({}); 
  const instanceMeta = useRef<Record<string, { type: "main" | "sub"; cameraId: string }>>({});
  const cameras = SidebarCameraStore((state) => state.cameras);

  const {
    layout,
    slotAssignments,
    assignCameraToSlot,
    clearSlot,
    resizeSlots,
  } = useGridStore();

  const { play,handleSnapshot,handleRefresh,closeConnection} = useGridController();

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
const toggleMainSub = (slotIndex: number, cameraId: string) => {
  if (!cameraId) return;

  const streams = useStreamStore.getState().streams;

  const currentType: "main" | "sub" = mainSubMap[slotIndex] ?? "sub";
  const nextType: "main" | "sub" = currentType === "sub" ? "main" : "sub";

  console.log(`Toggle ${cameraId} → ${nextType.toUpperCase()} (Slot ${slotIndex})`);

  // 1. Close old stream in this slot
  const oldStream = streams.find(s => s.slotId === slotIndex);
  if (oldStream) {
    console.log(`Closing ${oldStream.streamType.toUpperCase()} in slot ${slotIndex}`);
    oldStream.pc.close();
    useStreamStore.getState().removeStreamByInstanceId(oldStream.instanceId);
  }

  // 2. Remove leftover SUB stream if same camera has any in other slots
  const leftoverSub = streams.find(
    s => s.cameraId === cameraId && s.streamType === "sub" && s.slotId !== slotIndex
  );
  if (leftoverSub) {
    console.log(`Closing leftover SUB for ${cameraId} (instance ${leftoverSub.instanceId})`);
    leftoverSub.pc.close();
    useStreamStore.getState().removeStreamByInstanceId(leftoverSub.instanceId);
  }

  // 3. Play new stream
  const videoEl = document.querySelector<HTMLVideoElement>(`#video-slot-${slotIndex}`);
  if (!videoEl) return;

  const pc = play(cameraId, videoEl, nextType, slotIndex); // play() should return RTCPeerConnection

  // 4. Add new stream to Zustand store
  const newInstanceId = crypto.randomUUID();
  useStreamStore.getState().addStream({
    instanceId: newInstanceId,
    cameraId,
    pc,
    streamType: nextType,
    slotId: slotIndex,
  });

  // 5. Update mainSubMap using React state
  setMainSubMap(prev => ({
    ...prev,
    [slotIndex]: nextType,
  }));

  console.log(`Started ${nextType.toUpperCase()} for ${cameraId} in Slot ${slotIndex}`);
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
        gridStore={useGridStore()}
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

       <AISurveillanceSidebar
          selectedCamera={getSelectedCamera()}
          selectedSlotIndex={selectedSlotIndex}
          mainSubMap={mainSubMap}
          toggleMainSub={toggleMainSub}
        />
      </div>

      <div className="h-[53px] shrink-0">
         <LiveAlertsBar />
      </div>
    </div>
  );
}
