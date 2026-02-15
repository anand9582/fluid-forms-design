// ======================================================================
// Author: Anand Singh
// Date: 11/21/2025
// File: useGridController.ts
// Description:
// Zustand version of LiveView grid controller
// - Grid layout (rows x cols) changes
// - Slot assignments for cameras
// - WebRTC connections via usePlayCamera
// - Fullscreen toggle
// - Snapshot capture
// - Debug logging
// ======================================================================

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { usePlayCamera } from "@/hooks/PlayCamera";
import useGridStore from "@/Store/UseGridStore";

export const useGridController = () => {
  // Zustand store for layout
  const { layout, setLayout } = useGridStore();

  // ----------------------------------------------------------------------
  // Slot & Camera State
  // ----------------------------------------------------------------------
  const [slotAssignments, setSlotAssignments] = useState<(string | null)[]>([]);
  const [playingCameraIds, setPlayingCameraIds] = useState<Set<string>>(new Set());
  const [isFullScreen, setIsFullScreen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------------------------
  // Debug logger
  // ----------------------------------------------------------------------
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const addDebugLog = useCallback((msg: string) => {
    const ts = new Date().toLocaleTimeString();
    const log = `[${ts}] ${msg}`;
    console.log(log);
    setDebugLogs(prev => [...prev.slice(-9), log]); 
  }, []);

  // ----------------------------------------------------------------------
  // WebRTC Controls
  // ----------------------------------------------------------------------
  const { play, closeConnection, closeSlotConnections, getActiveConnectionCount } = usePlayCamera(addDebugLog);
    
  // ----------------------------------------------------------------------
  // Grid helpers
  // ----------------------------------------------------------------------
  const getTotalCamerasForLayout = useCallback(() => layout.rows * layout.cols, [layout]);
  const getGridClass = useCallback(() => `grid-cols-${layout.cols}`, [layout]);

  // ----------------------------------------------------------------------
  // Grid Layout Change
  // ----------------------------------------------------------------------
  const handleGridLayoutChange = useCallback((layoutStr: string) => {
    const [rows, cols] = layoutStr.split("x").map(Number);
    setLayout(rows, cols);

    const totalSlots = rows * cols;
    setSlotAssignments(prev => {
      const updated = [...prev];
      if (updated.length > totalSlots) return updated.slice(0, totalSlots);
      while (updated.length < totalSlots) updated.push(null);
      addDebugLog(`🔹 Grid changed to ${rows}x${cols}, total slots: ${totalSlots}`);
      return updated;
    });
  }, [setLayout, addDebugLog]);

  // ----------------------------------------------------------------------
  // Fullscreen
  // ----------------------------------------------------------------------
  const handleFullScreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      gridRef.current?.requestFullscreen();
      setIsFullScreen(true);
      addDebugLog("🖥️ Entered fullscreen");
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
      addDebugLog("🖥️ Exited fullscreen");
    }
  }, [addDebugLog]);

  useEffect(() => {
    const handleExit = () => setIsFullScreen(false);
    document.addEventListener("fullscreenchange", handleExit);
    return () => document.removeEventListener("fullscreenchange", handleExit);
  }, []);

  // ----------------------------------------------------------------------
  // Snapshot
  // ----------------------------------------------------------------------
  const handleSnapshot = useCallback((slotIndex: number) => {
    const video = document.querySelector(`#video-slot-${slotIndex}`) as HTMLVideoElement | null;
    if (!video) {
      toast({ title: "No video found", variant: "destructive" });
      addDebugLog(`⚠ Snapshot failed: video not found at slot ${slotIndex}`);
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `snapshot-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      addDebugLog(`📸 Snapshot saved from slot ${slotIndex}`);
    });
  }, [addDebugLog]);

  // ----------------------------------------------------------------------
  // Assign recording to slot
  // ----------------------------------------------------------------------
  const assignRecordingToSlot = useCallback((slotIndex: number, recordingUrl: string) => {
    setSlotAssignments(prev => {
      const updated = [...prev];
      updated[slotIndex] = recordingUrl;
      addDebugLog(`🎬 Recording assigned to slot ${slotIndex}`);
      return updated;
    });
  }, [addDebugLog]);

  // ----------------------------------------------------------------------
  // Return hook object
  // ----------------------------------------------------------------------
  return {
    // state
    layout,
    gridRef,
    slotAssignments,
    setSlotAssignments,
    playingCameraIds,
    setPlayingCameraIds,
    isFullScreen,
    debugLogs,

    // handlers
    handleGridLayoutChange,
    getTotalCamerasForLayout,
    getGridClass,
    handleFullScreenToggle,
    handleSnapshot,

    // WebRTC
    play,
    assignRecordingToSlot,
    closeConnection,
    closeSlotConnections,
    getActiveConnectionCount,
    addDebugLog,
  };
};
