// PlaybackDummy.tsx
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CameraTreeSidebar, LiveViewToolbar } from "@/components/LiveView/PagesInclude";
import { PlaybackCameraGrid, PlaybackTimelineBar, PlaybackTimeline, PlaybackAlertsBar } from "@/components/Playback/PagesInclude";
import { usePlaybackStore } from "@/Store/playbackStore";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";

// Global players map for caching blobUrls
const playersMap: Map<string, { blobUrl: string; sessionId: string; date: Date }> = new Map();

// Helper to format dates
const normalizeDateKey = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}`;

const toISTString = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const BASE_URL = "http://192.168.11.131:8081";

export default function PlaybackDummy() {
  const playback = usePlaybackStore();
  const gridStore = usePlaybackGridStore();
  const { layout, slotAssignments, assignCameraToSlot, clearAllSlots, resizeSlots } = gridStore;

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(new Set());
  const [cameraErrors, setCameraErrors] = useState<Record<string, string>>({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);
  const [segments, setSegments] = useState<any[]>([]);

  const DAY_START = new Date(selectedDate);
  DAY_START.setHours(0, 0, 0, 0);
  const DAY_END = new Date(selectedDate);
  DAY_END.setHours(23, 59, 59, 999);

  const dateToPct = (d: Date) =>
    ((d.getTime() - DAY_START.getTime()) / (DAY_END.getTime() - DAY_START.getTime())) * 100;

  /* ---------------- Fetch Timeline ---------------- */
  useEffect(() => {
    const fetchTimeline = async () => {
      const cameraId =
        slotAssignments[selectedSlotIndex ?? 0] || slotAssignments.find(Boolean);
      if (!cameraId) return;

      try {
        const res = await fetch(
          `${BASE_URL}/api/playback/hls/timeline?cameraId=6&fromDate=${toISTString(
            DAY_START
          )}&toDate=${toISTString(DAY_END)}`
        );
        const json = await res.json();

        const uiSegs: any[] = [];
        let cursor = DAY_START;

        const storeSegs = json.data.map((s: any) => ({
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime),
        }));

        json.data.forEach((s: any) => {
          const st = new Date(s.startTime);
          const et = new Date(s.endTime);

          if (st > cursor) uiSegs.push({ start: dateToPct(cursor), end: dateToPct(st), type: "gap" });
          uiSegs.push({ start: dateToPct(st), end: dateToPct(et), type: "recording" });
          cursor = et;
        });

        if (cursor < DAY_END) uiSegs.push({ start: dateToPct(cursor), end: 100, type: "gap" });

        setSegments(uiSegs);
        usePlaybackStore.getState().setSegments(storeSegs);
      } catch (err) {
        console.error("Timeline fetch error", err);
      }
    };

    fetchTimeline();
  }, [selectedDate, selectedSlotIndex, slotAssignments]);

  /* ---------------- Start Camera ---------------- */
  const startCamera = async (cameraId: string, date: Date) => {
    const apiUrl = `${BASE_URL}/api/playback/hls/playlist/6?start=${toISTString(
      DAY_START
    )}&end=${toISTString(DAY_END)}`;

    setLoadingCameraIds((prev) => new Set(prev).add(cameraId));

    try {
      const res = await fetch(apiUrl);
      const json = await res.json();
      if (!json?.data?.playlist) throw new Error("No recording");

      const blob = new Blob([json.data.playlist], { type: "application/vnd.apple.mpegurl" });
      const blobUrl = URL.createObjectURL(blob);

      const key = `${cameraId}-${normalizeDateKey(date)}`;
      playersMap.set(key, { blobUrl, sessionId: json.data.sessionId, date });

      return blobUrl;
    } catch (err: any) {
      setCameraErrors((prev) => ({ ...prev, [cameraId]: err.message }));
      return null;
    } finally {
      setLoadingCameraIds((prev) => {
        const n = new Set(prev);
        n.delete(cameraId);
        return n;
      });
    }
  };

  /* ---------------- Preload Cameras ---------------- */
  const preloadCamerasForDate = async (date: Date) => {
    const cams = slotAssignments.filter(Boolean) as string[];
    for (const cam of cams) {
      const key = `${cam}-${normalizeDateKey(date)}`;
      if (!playersMap.has(key)) await startCamera(cam, date);
    }
  };

  useEffect(() => {
    if (slotAssignments.some(Boolean)) preloadCamerasForDate(selectedDate);
  }, [selectedDate, slotAssignments]);

  /* ---------------- Get Video Src ---------------- */
  const getVideoSrc = (cameraId: string) => {
    const key = `${cameraId}-${normalizeDateKey(selectedDate)}`;
    return playersMap.get(key)?.blobUrl ?? "";
  };

  /* ---------------- Handle Camera Drop ---------------- */
  const handleCameraDrop = async (cameraId: string, slotIndex: number) => {
    assignCameraToSlot(slotIndex, cameraId);
    setSelectedSlotIndex(slotIndex);

    let blobUrl = getVideoSrc(cameraId);
    if (!blobUrl) blobUrl = await startCamera(cameraId, selectedDate);

    if (blobUrl) {
      const store = usePlaybackStore.getState();
      if (store.segments.length) store.seekToDate(store.segments[0].startTime);
      store.setIsPlaying(true);
    }
  };

  /* ---------------- Seek ---------------- */
  const handleSeekToDate = (date: Date) => {
    usePlaybackStore.getState().seekToDate(date);
  };

  /* ---------------- Resize Slots ---------------- */
  useEffect(() => resizeSlots(), [layout.rows, layout.cols]);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <Sidebar />
      <div className="ml-[80px] shrink-0">
        <LiveViewToolbar
          showCameraList
          selectedLayout="2x2"
          gridStore={gridStore}
          showCustomGridBuilder={false}
          onToggleCameraList={() => {}}
          onLayoutChange={() => {}}
        />
      </div>

      <div className="flex flex-1 ml-[80px] gap-3 p-3 overflow-hidden">
        <CameraTreeSidebar isVisible />
        <PlaybackCameraGrid
          selectedSlotIndex={selectedSlotIndex}
          cameraSlots={slotAssignments}
          getVideoSrc={getVideoSrc}
          onCameraDrop={handleCameraDrop}
          onSlotSelect={(i) => {
            setSelectedSlotIndex(i);
            setIsTimelineExpanded(true);
          }}
          isCameraLoading={(id) => loadingCameraIds.has(id)}
          cameraErrors={cameraErrors}
          playback={playback}
        />
      </div>

      <div className="shrink-0 z-50">
        <PlaybackTimelineBar
          isPlaying={playback.isPlaying}
          speed={playback.speed}
          currentTimestamp={playback.currentTimestamp}
          playheadPosition={playback.playheadPosition}
          isTimelineExpanded={isTimelineExpanded}
          onToggleTimeline={() => setIsTimelineExpanded((p) => !p)}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onSeekToDate={handleSeekToDate}
          onStop={() => {
            clearAllSlots();
            playersMap.clear();
          }}
          onRewind={() => {}}
          onFastForward={() => {}}
          onSkipBack={() => {}}
          onSkipForward={() => {}}
          isSynced={true}
          onToggleSync={() => {}}
        />

        <PlaybackTimeline
          playheadPosition={playback.playheadPosition}
          isExpanded={isTimelineExpanded}
          onSeek={(pct) => {
            const dayStart = new Date(selectedDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(selectedDate);
            dayEnd.setHours(23, 59, 59, 999);
            const targetTime = new Date(dayStart.getTime() + (pct / 100) * (dayEnd.getTime() - dayStart.getTime()));
            handleSeekToDate(targetTime);
          }}
          zoomLevel={zoomLevel}
          segments={segments}
        />

        <PlaybackAlertsBar />
      </div>
    </div>
  );
}