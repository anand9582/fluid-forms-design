// LiveView.tsx
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  CameraTreeSidebar,
  LiveViewToolbar,
  CameraGrid,
  AISurveillanceSidebar,
  LiveAlertsBar,
} from "@/components/LiveView/PagesInclude";
import { useGridController } from "@/hooks/useGridController";

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
  const [mainSubMap, setMainSubMap] = useState<Record<number, "main" | "sub">>({});

  const {
    layout,
    slotAssignments,
    setSlotAssignments,
    play,
    setPlayingCameraIds,
  } = useGridController();

  // initialize grid
  useEffect(() => {
    if (slotAssignments.length === 0) {
      setSlotAssignments(Array(layout.rows * layout.cols).fill(null));
    }
  }, [slotAssignments, layout, setSlotAssignments]);

  // ✅ Grid slots only know cameraId
  const cameraSlots: (CameraStatus | null)[] = useMemo(() => {
    return slotAssignments.map((cameraId) =>
      cameraId
        ? {
            id: cameraId,
            name: `Camera ${cameraId}`, 
            location: "—",
            bitrate: "0 kbps",
            hasCamera: true,
          }
        : null
    );
  }, [slotAssignments]);

  // ✅ MAIN REQUIREMENT: menu se aaya cameraId
  const handleCameraClick = (cameraId: string) => {
    const freeIndex = slotAssignments.findIndex((s) => s === null);
    if (freeIndex === -1) return;

    setSlotAssignments((prev) => {
      const copy = [...prev];
      copy[freeIndex] = cameraId;
      return copy;
    });

    setMainSubMap((prev) => ({ ...prev, [freeIndex]: "sub" }));
    setPlayingCameraIds((prev) => new Set([...prev, cameraId]));
    setSelectedSlotIndex(freeIndex);
  };

  const toggleMainSub = (slotIndex: number) => {
    setMainSubMap((prev) => ({
      ...prev,
      [slotIndex]: prev[slotIndex] === "main" ? "sub" : "main",
    }));
  };

  const clearSlot = (slotIndex: number) => {
    setSlotAssignments((prev) => {
      const copy = [...prev];
      copy[slotIndex] = null;
      return copy;
    });
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
        selectedLayout={`${layout.rows}x${layout.cols}`}
      />

      <div className="flex flex-1 overflow-hidden gap-3">
        <div className="flex gap-3 p-3 flex-1">
          <CameraTreeSidebar
            isVisible={showCameraList}
            onCameraClick={handleCameraClick}
          />

          <CameraGrid
            cameraSlots={cameraSlots}
            selectedSlotIndex={selectedSlotIndex}
            onSlotSelect={setSelectedSlotIndex}
            autoSequence
            play={play}
            toggleMainSub={toggleMainSub}
            mainSubMap={mainSubMap}
            clearSlot={clearSlot}
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
