// FullPlayback.tsx
import React, { useEffect, useState } from "react";
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

export default function FullPlayback() {
  const playback = usePlaybackStore();
  const gridStore = usePlaybackGridStore();
  const { layout, slotAssignments, assignCameraToSlot, clearAllSlots, resizeSlots } = gridStore;

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(new Set());
  const [cameraErrors, setCameraErrors] = useState<Record<string, string>>({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);
  const [segments, setSegments] = useState<any[]>([]);

  const BASE_URL = "http://192.168.10.190:8090";

  /* ---------------- TIME HELPERS ---------------- */
  const toISTString = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const DAY_START = new Date(selectedDate);
  DAY_START.setHours(0, 0, 0, 0);
  const DAY_END = new Date(selectedDate);
  DAY_END.setHours(23, 59, 59, 999);

  /* ---------------- CONVERT DATE → 0-24 HOUR ---------------- */
  const dateToHour = (d: Date) => ((d.getTime() - DAY_START.getTime()) / (DAY_END.getTime() - DAY_START.getTime())) * 24;

  /* ---------------- FETCH TIMELINE ---------------- */
  useEffect(() => {
    const fetchTimeline = async () => {
      const cameraId = slotAssignments[selectedSlotIndex] || slotAssignments.find(Boolean);
      if (!cameraId) return;

      try {
        const res = await fetch(
          `${BASE_URL}/api/playback/hls/timeline?cameraId=${cameraId}&fromDate=${toISTString(
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

          if (st > cursor) uiSegs.push({ start: dateToHour(cursor), end: dateToHour(st), type: "gap" });
          uiSegs.push({ start: dateToHour(st), end: dateToHour(et), type: "recording" });
          cursor = et;
        });

        if (cursor < DAY_END) uiSegs.push({ start: dateToHour(cursor), end: 24, type: "gap" });

        setSegments(uiSegs);
        usePlaybackStore.getState().setSegments(storeSegs);
      } catch (err) {
        console.error("Timeline fetch error", err);
      }
    };

    fetchTimeline();
  }, [selectedDate, selectedSlotIndex, slotAssignments]);




  /* ---------------- CAMERA START FUNCTION ---------------- */
  const startCamera = async (
    cameraId: string,
    date: Date,
    range?: { start: Date; end: Date }
  ): Promise<string | null> => {
    const start = range?.start ? toISTString(range.start) : toISTString(DAY_START);
    const end = range?.end ? toISTString(range.end) : toISTString(DAY_END);

    const apiUrl = `${BASE_URL}/api/playback/hls/playlist/${cameraId}?start=${start}&end=${end}`;

    setLoadingCameraIds((p) => new Set(p).add(cameraId));
    try {
      const res = await fetch(apiUrl);
      const json = await res.json();
      if (!json?.data?.playlist) throw new Error("No recording found");

      const blob = new Blob([json.data.playlist], { type: "application/vnd.apple.mpegurl" });
      const blobUrl = URL.createObjectURL(blob);

      setPlayers((prev) => [
        ...prev.filter((p) => !(p.cameraId === cameraId && p.date.toDateString() === date.toDateString())),
        { cameraId, blobUrl, sessionId: json.data.sessionId, date },
      ]);

      return blobUrl;
    } catch (err: any) {
      setCameraErrors((p) => ({ ...p, [cameraId]: err.message }));
      return null;
    } finally {
      setLoadingCameraIds((p) => {
        const n = new Set(p);
        n.delete(cameraId);
        return n;
      });
    }
  };

  /* ---------------- GET VIDEO SRC ---------------- */
  const getVideoSrc = (cameraId: string) =>
    players.find((p) => p.cameraId === cameraId && p.date.toDateString() === selectedDate.toDateString())
      ?.blobUrl || "";

  /* ---------------- HANDLE CAMERA DROP ---------------- */
  const handleCameraDrop = async (
    cameraId: string,
    slotIndex: number,
  ) => {
    assignCameraToSlot(slotIndex, cameraId);
    setSelectedSlotIndex(slotIndex);

    const existing = players.find(
      (p) => p.cameraId === cameraId && p.date.toDateString() === selectedDate.toDateString()
    );

    // 🔹 Pehla segment dhundo
    const cameraSegments = usePlaybackStore.getState().segments;
    const firstSeg = cameraSegments.length ? cameraSegments[0] : null;

    if (!existing?.blobUrl) {
      const blobUrl = await startCamera(cameraId, selectedDate);
   console.log("testing", blobUrl);
      if (blobUrl) {
        const playbackStore = usePlaybackStore.getState();

        playbackStore.play(); // Master clock start
        if (firstSeg) playbackStore.seekTo(firstSeg.startTime); 
      }
    } else {
      const playbackStore = usePlaybackStore.getState();
      playbackStore.play();
      if (firstSeg) playbackStore.seekTo(firstSeg.startTime);
    }
  };

  /* ---------------- HANDLE TIMELINE SEEK ---------------- */
  const handleSeekToDate = async (date: Date) => {
    setSelectedDate(date);

    const slotCameraIds = slotAssignments.filter(Boolean) as string[];
    const segmentsStore = usePlaybackStore.getState().segments;
    if (!segmentsStore.length) return;

    for (const cameraId of slotCameraIds) {
      const existingPlayer = players.find(
        (p) => p.cameraId === cameraId && p.date.toDateString() === date.toDateString()
      );
      if (!existingPlayer) {
        // nearest segment dhundo
        const seg =
          segmentsStore.find((s) => date >= s.startTime && date <= s.endTime) ||
          segmentsStore.find((s) => date < s.startTime);

        if (!seg) return;

        await startCamera(cameraId, date, { start: seg.startTime, end: seg.endTime });
      }
    }

    // Master clock seek
    const nearestSeg =
      segmentsStore.find((s) => date >= s.startTime && date <= s.endTime) ||
      segmentsStore.find((s) => date < s.startTime);
    if (nearestSeg) usePlaybackStore.getState().seekTo(nearestSeg.startTime);
  };

  /* ---------------- RESIZE GRID ---------------- */
  useEffect(() => {
    resizeSlots();
  }, [layout.rows, layout.cols]);

  /* ---------------- PLAYHEAD POSITION ---------------- */
  const playheadHour = dateToHour(playback.globalTime);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <Sidebar />
      <div className="ml-[80px] shrink-0">
        <LiveViewToolbar
          showCameraList
          selectedLayout="2x2"
          onLayoutChange={() => {}}
          onToggleCameraList={() => {}}
          gridStore={gridStore}
          showCustomGridBuilder={false}
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
          onStop={() => {
            clearAllSlots();
            setPlayers([]);
          }}
          isTimelineExpanded={isTimelineExpanded}
          onToggleTimeline={() => setIsTimelineExpanded((p) => !p)}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onSeekToDate={handleSeekToDate}
        />

        <PlaybackTimeline
          isExpanded={isTimelineExpanded}
          zoomLevel={zoomLevel}
          segments={segments}
          playheadPosition={playheadHour}
          onSeek={(hour) =>
            playback.seekTo(new Date(DAY_START.getTime() + (hour / 24) * (DAY_END.getTime() - DAY_START.getTime())))
          }
        />

        <PlaybackAlertsBar />
      </div>
    </div>
  );
}