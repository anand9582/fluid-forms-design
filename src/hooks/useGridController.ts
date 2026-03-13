import { useRef, useCallback, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { usePlayCamera } from "@/hooks/PlayCamera";
import useGridStore from "@/Store/UseGridStore";

export const useGridController = () => {
  const {
    layout,
    slotAssignments,
    resizeSlots,
  } = useGridStore();

  const gridRef = useRef<HTMLDivElement>(null);
  const { play, closeConnection, closeSlotConnections, getActiveConnectionCount } = usePlayCamera(console.log);


  useEffect(() => {
    resizeSlots();
  }, [layout.rows, layout.cols, resizeSlots]);

  // Fullscreen
  const handleFullScreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      gridRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

 const handleRefresh = useCallback(
  (slotIndex: number) => {
    const cameraId = slotAssignments[slotIndex] ?? null;
    if (!cameraId) return;

    const video = document.querySelector(
      `#video-slot-${slotIndex}`
    ) as HTMLVideoElement | null;

    if (!video) {
      toast({ title: "Video element not found", variant: "destructive" });
      return;
    }

    // Close existing streams of this slot
    closeSlotConnections(slotIndex);

    // Re-play same camera in same slot
    setTimeout(() => {
      play(cameraId, video, "sub", slotIndex);
    }, 100);
  },
  [play, closeSlotConnections, slotAssignments]
);


  // Snapshot
  const handleSnapshot = useCallback((slotIndex: number) => {
    console.log("alert");
    const video = document.querySelector(
      `#video-slot-${slotIndex}`
    ) as HTMLVideoElement | null;

    if (!video) {
      toast({ title: "No video found", variant: "destructive" });
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `snapshot-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, []);

  return {
    layout,
    gridRef,
    slotAssignments,
    play,
    handleSnapshot,
    handleFullScreenToggle,
    closeConnection,
    closeSlotConnections,
    getActiveConnectionCount,
    handleRefresh
  };
};
