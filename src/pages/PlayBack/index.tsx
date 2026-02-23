// PlaybackDummy.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  CameraTreeSidebar,
  LiveViewToolbar,
} from "@/components/LiveView/PagesInclude";
import {
  PlaybackCameraGrid,
  PlaybackTimelineBar,
  PlaybackTimeline,
  PlaybackAlertsBar,
} from "@/components/Playback/PagesInclude";
import { usePlaybackStore } from "@/Store/playbackStore";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";

interface Player {
  cameraId: string;
  blobUrl: string;
  sessionId: string;
  date: Date;
}

export default function PlaybackDummy() {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date("2026-02-23"));
  const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(new Set());
  const [cameraErrors, setCameraErrors] = useState<Record<string, string>>({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const playback = usePlaybackStore();
  const { layout, slotAssignments, assignCameraToSlot, clearAllSlots, resizeSlots } = usePlaybackGridStore();

  const BASE_URL = "http://192.168.11.59:8085";

  const toISTString = (date: Date) => {
        const pad = (n: number) => n.toString().padStart(2, "0");
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };



  /* ---------------- TIMELINE DATA ---------------- */
  const DAY_START = new Date(selectedDate);
  DAY_START.setHours(0, 0, 0, 0);
  const DAY_END = new Date(selectedDate);
  DAY_END.setHours(23, 59, 59, 999);

  const dateToPct = (d: Date) =>
    ((d.getTime() - DAY_START.getTime()) / (DAY_END.getTime() - DAY_START.getTime())) * 100;

  const pctToDate = (pct: number) =>
    new Date(DAY_START.getTime() + (pct / 100) * (DAY_END.getTime() - DAY_START.getTime()));

  const [segments, setSegments] = useState<any[]>([]);

  /* ---------------- FETCH TIMELINE ---------------- */
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/api/playback/hls/timeline?cameraId=2&fromDate=${toISTString(DAY_START)}&toDate=${toISTString(DAY_END)}`
        );
        const json = await res.json();

        const segs: any[] = [];
        let cursor = DAY_START;

        json.data.forEach((s: any) => {
          const st = new Date(s.startTime);
          const et = new Date(s.endTime);

          if (st > cursor) {
            segs.push({ start: dateToPct(cursor), end: dateToPct(st), type: "gap" });
          }
          segs.push({ start: dateToPct(st), end: dateToPct(et), type: "recording" });
          cursor = et;
        });

        if (cursor < DAY_END) {
          segs.push({ start: dateToPct(cursor), end: 100, type: "gap" });
        }

        setSegments(segs);
      } catch (err) {
        console.error("Timeline fetch error:", err);
      }
    };

    fetchTimeline();
  }, [selectedDate]);

  /* ---------------- CAMERA START (DYNAMIC TIME RANGE) ---------------- */
  const startCamera = async (
    cameraId: string,
    date: Date,
    timeRange?: { start: Date; end: Date } 
  ): Promise<string | null> => {
    const start = timeRange?.start ? toISTString(timeRange.start) : toISTString(DAY_START);
    const end = timeRange?.end ? toISTString(timeRange.end) : toISTString(DAY_END);

    const apiUrl = `${BASE_URL}/api/playback/hls/playlist/2?start=${start}&end=${end}`;

    setLoadingCameraIds((prev) => new Set(prev).add(cameraId));
    try {
      const res = await fetch(apiUrl);
      const json = await res.json();

      if (!res.ok || !json?.data?.playlist) throw new Error("No recordings");

      const blob = new Blob([json.data.playlist], { type: "application/vnd.apple.mpegurl" });
      const blobUrl = URL.createObjectURL(blob);

      setPlayers((prev) => [
        ...prev.filter(
          (p) => !(p.cameraId === cameraId && p.date.toDateString() === date.toDateString())
        ),
        { cameraId, blobUrl, sessionId: json.data.sessionId, date },
      ]);

      return blobUrl;
    } catch (err: any) {
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

  const getVideoSrc = (cameraId: string) =>
    players.find((p) => p.cameraId === cameraId && p.date.toDateString() === selectedDate.toDateString())
      ?.blobUrl ?? "";

  /* ---------------- CAMERA DROP ---------------- */
  const handleCameraDrop = async (
    cameraId: string,
    slotIndex: number,
    selectedTimeRange?: { start: Date; end: Date } // timeline selected window
  ) => {
    assignCameraToSlot(slotIndex, cameraId);
    setSelectedSlotIndex(slotIndex);

    const existingPlayer = players.find((p) => p.cameraId === cameraId);
    if (!existingPlayer) {
      await startCamera(cameraId, selectedDate, selectedTimeRange);

      const player = players.find(
        (p) => p.cameraId === cameraId && p.date.toDateString() === selectedDate.toDateString()
      );
      if (player) {
        playback.load(player.blobUrl);
        playback.play();
      }
    }
  };

  /* ---------------- SEEK HANDLER ---------------- */
  const handleSeekToDate = async (date: Date) => {
    setSelectedDate(date);
    playback.seekToDate(date);

    const slotCameraIds = slotAssignments.filter(Boolean) as string[];
    for (const cameraId of slotCameraIds) {
      await startCamera(cameraId, date, { start: date, end: new Date(date.getTime() + 2 * 60 * 60 * 1000) });
    }
  };

  /* ---------------- STOP ---------------- */
  const handleStop = () => {
    playback.pause();
    playback.seekToDate(DAY_START);
    clearAllSlots();
    setPlayers([]);
  };

  /* ---------------- SLOT SELECT ---------------- */
  const handleSelectSlot = (slotIndex: number) => {
    setSelectedSlotIndex(slotIndex);
    setIsTimelineExpanded(true);
  };

  /* ---------------- GRID RESIZE ---------------- */
  useEffect(() => {
    resizeSlots();
  }, [layout.rows, layout.cols, resizeSlots]);

  /* ---------------- CAMERA SLOTS ---------------- */
  const cameraSlots = useMemo(() => {
    return slotAssignments.map((cameraId) => {
      if (!cameraId) return null;
      const player = players.find((p) => p.cameraId === cameraId);
      return player ? { cameraId: player.cameraId, blobUrl: player.blobUrl } : null;
    });
  }, [slotAssignments, players]);

  /* ---------------- UI ---------------- */
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
        <CameraTreeSidebar isVisible />
        <PlaybackCameraGrid
          selectedSlotIndex={selectedSlotIndex}
          cameraSlots={cameraSlots}
          getVideoSrc={getVideoSrc}
          onCameraDrop={handleCameraDrop}
          onSlotSelect={handleSelectSlot}
          isCameraLoading={(id) => loadingCameraIds.has(id)}
          cameraErrors={cameraErrors}
          playback={playback}
        />
      </div>

      <div className="shrink-0 z-50">
        <PlaybackTimelineBar
          isPlaying={playback.isPlaying}
          onTogglePlay={() => playback.togglePlay()}
          onStop={handleStop}
          speed={playback.speed}
          currentTimestamp={playback.currentTimestamp}
          isTimelineExpanded={isTimelineExpanded}
          onToggleTimeline={() => setIsTimelineExpanded(!isTimelineExpanded)}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onSeekToDate={handleSeekToDate}
        />

        <PlaybackTimeline
          playheadPosition={playback.playheadPosition}
          isExpanded={isTimelineExpanded}
         onSeek={(pct) => {
  const date = pctToDate(pct);

  console.log("🧭 Timeline click", {
    pct,
    iso: date.toISOString(),
    local: date.toString(),
  });

  handleSeekToDate(date);
}}
          zoomLevel={zoomLevel}
          segments={segments}
        />

        <PlaybackAlertsBar />
      </div>
    </div>
  );
}