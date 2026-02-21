// Playback.tsx
import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CameraTreeSidebar, LiveViewToolbar } from "@/components/LiveView/PagesInclude";
import { PlaybackCameraGrid, PlaybackTimelineBar, PlaybackTimeline, PlaybackAlertsBar } from "@/components/Playback/PagesInclude";
import { usePlayback } from "@/hooks/use-playback";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";

const BASE_URL = "http://192.168.11.131:8081"; // change if needed

interface Player {
  cameraId: string;
  blobUrl: string;
  sessionId: string;
  date: Date; // store which date this player is for
}

export default function Playback() {
  const playback = usePlayback();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(() => new Set());
  const [cameraErrors, setCameraErrors] = useState<Record<string, string>>({});

  const { assignCameraToSlot } = usePlaybackGridStore();

  /** ---------------- START CAMERA ---------------- */
const startCamera = async (cameraId: string, date?: Date) => {
  // Default = today
  const now = new Date();
  const targetDate = date || now;

  // Start = 12:00 AM of targetDate
  const start = new Date(targetDate);
  start.setHours(0, 0, 0, 0); // 00:00:00

  // End = 11:59:59 PM of targetDate (full day)
  const end = new Date(targetDate);
  end.setHours(23, 59, 59, 999); // 23:59:59

  const startISO = start.toISOString(); // "2026-02-19T00:00:00.000Z"
  const endISO = end.toISOString();     // "2026-02-19T23:59:59.999Z"

  const apiUrl = `${BASE_URL}/api/playback/hls/playlist/${cameraId}?start=${startISO}&end=${endISO}`;
  console.log("API CALL URL:", apiUrl);

  try {
    const res = await fetch(apiUrl);
    const contentType = res.headers.get("content-type") || "";
    let json: any = null;

    if (contentType.includes("application/json")) {
      json = await res.json();
    } else {
      const text = await res.text();
      throw new Error(`API did not return JSON: ${text}`);
    }

    if (!res.ok || !json?.data?.playlist) {
      throw new Error(json?.message || "No recordings found for selected time");
    }

    const blob = new Blob([json.data.playlist], { type: "application/vnd.apple.mpegurl" });
    const blobUrl = URL.createObjectURL(blob);

    setPlayers((prev) => [
      ...prev,
      { cameraId, blobUrl, sessionId: json.data.sessionId, date: targetDate },
    ]);
  } catch (err: any) {
    console.error(err);
    setCameraErrors((prev) => ({ ...prev, [cameraId]: err.message }));
  }
};
  /** ---------------- GET VIDEO SRC ---------------- */
  const getVideoSrc = (cameraId: string) =>
    players.find((p) => p.cameraId === cameraId && p.date.toDateString() === selectedDate.toDateString())?.blobUrl ?? "";

  /** ---------------- HANDLE DROP ---------------- */
  const handleCameraDrop = (cameraId: string, slotIndex: number) => {
    assignCameraToSlot(slotIndex, cameraId);
    setSelectedSlot(slotIndex);

    // Default start = 12:00 AM of selectedDate
    const defaultDate = new Date(selectedDate);
    defaultDate.setHours(0, 0, 0, 0);

    startCamera(cameraId, defaultDate);
  };

  /** ---------------- HANDLE DATE CHANGE ---------------- */
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);

    if (selectedSlot === null) return;
    const slotCameraId = usePlaybackGridStore.getState().slotAssignments[selectedSlot];
    if (slotCameraId) {
      // Always start from 12:00 AM of selected date
      const defaultDate = new Date(date);
      defaultDate.setHours(0, 0, 0, 0);
      startCamera(slotCameraId, defaultDate);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <Sidebar />

      <div className="ml-[80px] shrink-0">
        <LiveViewToolbar
          showCameraList
          selectedLayout="2x2"
          onLayoutChange={() => {}}
          onToggleCameraList={() => {}}
           gridStore={usePlaybackGridStore()}
          showCustomGridBuilder={false} 
          gridStore={usePlaybackGridStore()} 
        />
      </div>

      <div className="flex flex-1 ml-[80px] gap-3 p-3 overflow-hidden">
        <CameraTreeSidebar isVisible onCameraClick={startCamera} />

        <PlaybackCameraGrid
          selectedSlot={selectedSlot}
          onSlotSelect={setSelectedSlot}
          getVideoSrc={getVideoSrc}
          onCameraDrop={handleCameraDrop}
          isCameraLoading={(id: string) => loadingCameraIds.has(id)}
          cameraErrors={cameraErrors}
          onVideoPlaying={(id: string) => setLoadingCameraIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          })}
          onVideoWaiting={(id: string) => setLoadingCameraIds((prev) => new Set(prev).add(id))}
        />
      </div>

      <div className="shrink-0 z-50">
        <PlaybackTimelineBar
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          isPlaying={playback.isPlaying}
          onTogglePlay={playback.togglePlay}
          onStop={playback.stop}
          onRewind={playback.rewind}
          onFastForward={playback.fastForward}
          onSkipBack={playback.skipBack}
          onSkipForward={playback.skipForward}
          speed={playback.speed}
          isSynced={playback.isSynced}
          onToggleSync={playback.setIsSynced}
          isTimelineExpanded={isTimelineExpanded}
          onToggleTimeline={() => setIsTimelineExpanded((v) => !v)}
        />

        <PlaybackTimeline
          playheadPosition={playback.playheadPosition}
          isExpanded={isTimelineExpanded}
          onSeek={playback.seekTo}
        />

        <PlaybackAlertsBar />
      </div>
    </div>
  );
}