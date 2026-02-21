// Playback.tsx
import React, { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CameraTreeSidebar, LiveViewToolbar } from "@/components/LiveView/PagesInclude";
import { PlaybackCameraGrid, PlaybackTimelineBar, PlaybackTimeline, PlaybackAlertsBar } from "@/components/Playback/PagesInclude";
import { usePlayback } from "@/hooks/use-playback";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";

const BASE_URL = "http://192.168.11.131:8081";

interface Player {
  cameraId: string;
  blobUrl: string;
  sessionId: string;
  date: Date;
}

export default function Playback() {
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(() => new Set());
  const [cameraErrors, setCameraErrors] = useState<Record<string, string>>({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const playback = usePlayback();
  const { assignCameraToSlot } = usePlaybackGridStore();

  /** ---------------- START CAMERA (returns blobUrl for preloading) ---------------- */
  const startCamera = async (cameraId: string, date?: Date): Promise<string | null> => {
    const targetDate = date || new Date();

    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    const startISO = start.toISOString();
    const endISO = end.toISOString();

      const apiUrl = `${BASE_URL}/api/playback/hls/playlist/${cameraId}?start=${"2026-02-20T00:00:00"}&end=${"2026-02-20T23:59:59"}`;
    console.log("API CALL URL:", apiUrl);

    setLoadingCameraIds((prev) => new Set(prev).add(cameraId));

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
        ...prev.filter((p) => !(p.cameraId === cameraId && p.date.toDateString() === targetDate.toDateString())),
        { cameraId, blobUrl, sessionId: json.data.sessionId, date: targetDate },
      ]);

      return blobUrl;
    } catch (err: any) {
      console.error(err);
      setCameraErrors((prev) => ({ ...prev, [cameraId]: err.message }));
      return null;
    } finally {
      setLoadingCameraIds((prev) => {
        const next = new Set(prev);
        next.delete(cameraId);
        return next;
      });
    }
  };

  /** ---------------- GET VIDEO SRC ---------------- */
  const getVideoSrc = (cameraId: string) =>
    players.find((p) => p.cameraId === cameraId && p.date.toDateString() === selectedDate.toDateString())?.blobUrl ?? "";

  /** ---------------- HANDLE DROP ---------------- */
const handleCameraDrop = async (cameraId: string, slotIndex: number) => {
  assignCameraToSlot(slotIndex, cameraId);
  setSelectedSlot(slotIndex);

  // Start camera immediately for this slot
  if (!getVideoSrc(cameraId)) {
    await startCamera(cameraId, selectedDate);
  }
};

  /** ---------------- HANDLE PRELOAD ON CAMERA CLICK ---------------- */
  const handleCameraClick = (cameraId: string) => {
    startCamera(cameraId, selectedDate); 
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
        />
      </div>

      <div className="flex flex-1 ml-[80px] gap-3 p-3 overflow-hidden">
        <CameraTreeSidebar isVisible onCameraClick={handleCameraClick} />

        <PlaybackCameraGrid
          selectedSlot={selectedSlot}
          onSlotSelect={(slotIndex) => {
            setSelectedSlot(slotIndex);
            setIsTimelineExpanded(true);
          }}
          getVideoSrc={getVideoSrc}
          onCameraDrop={handleCameraDrop}
          isCameraLoading={(id: string) => loadingCameraIds.has(id)}
          cameraErrors={cameraErrors}
          onVideoPlaying={(id: string) =>
            setLoadingCameraIds((prev) => {
              const next = new Set(prev);
              next.delete(id);
              return next;
            })
          }
          onVideoWaiting={(id: string) =>
            setLoadingCameraIds((prev) => new Set(prev).add(id))
          }
          playback={playback}
        />
      </div>

      <div className="shrink-0 z-50">
        <PlaybackTimelineBar
            isPlaying={playback.isPlaying}
            onTogglePlay={playback.togglePlay}
            onStop={playback.stop}
            onRewind={playback.rewind}
            onFastForward={playback.fastForward}
            onSkipBack={playback.skipBack}
            onSkipForward={playback.skipForward}
            speed={playback.speed}
            currentTimestamp={playback.currentTimestamp}
            isSynced={playback.isSynced}
            onToggleSync={playback.setIsSynced}
            isTimelineExpanded={isTimelineExpanded}
            onToggleTimeline={() => setIsTimelineExpanded(!isTimelineExpanded)}
            zoomLevel={zoomLevel}
            onZoomChange={setZoomLevel}
          />

       <PlaybackTimeline
          playheadPosition={playback.playheadPosition}
          isExpanded={isTimelineExpanded}
          onSeek={playback.seekTo}
          zoomLevel={zoomLevel}
        />

        <PlaybackAlertsBar />
      </div>
    </div>
  );
}