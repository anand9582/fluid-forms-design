// FullPlaybackMulti.tsx

import React, { useEffect, useState, useMemo } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  CameraTreeSidebar,
  LiveViewToolbar,
} from "@/components/LiveView/PagesInclude";

import {
  PlaybackCameraGrid,
  PlaybackTimelineBar,
  PlaybackAlertsBar,
} from "@/components/Playback/PagesInclude";

import { usePlaybackStore } from "@/Store/playbackStore";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";
import {
  PlaybackTimeline,
  SegmentHour,
} from "@/components/Playback/PlaybackTimeline";

/* =========================================================
   TYPES
========================================================= */

interface Player {
  cameraId: string;
  blobUrl: string;
  sessionId: string;
  date: Date;
}

interface RawSegment {
  startTime: Date;
  endTime: Date;
}

/* =========================================================
   COMPONENT
========================================================= */

export default function FullPlaybackMulti() {
  const playback = usePlaybackStore();
  const gridStore = usePlaybackGridStore();

  const {
    layout,
    slotAssignments,
    assignCameraToSlot,
    clearAllSlots,
    resizeSlots,
  } = gridStore;

  /* ---------------- LOCAL STATE ---------------- */

  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(new Set());
  const [cameraErrors, setCameraErrors] = useState<Record<string, string>>({});

  const [zoomLevel, setZoomLevel] = useState(1);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);

  const [segmentsPerSlot, setSegmentsPerSlot] = useState<Record<number, SegmentHour[]>>({});
  const [rawSegmentsPerSlot, setRawSegmentsPerSlot] = useState<Record<number, RawSegment[]>>({});

  const BASE_URL = "http://192.168.10.190:8090";

  /* =========================================================
     DAY RANGE
  ========================================================= */

  const DAY_START = useMemo(() => {
    const d = new Date(selectedDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [selectedDate]);

  const DAY_END = useMemo(() => {
    const d = new Date(selectedDate);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [selectedDate]);

  const toISTString = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  };

  const dateToHour = (d: Date) => {
    const hour = ((d.getTime() - DAY_START.getTime()) / (DAY_END.getTime() - DAY_START.getTime())) * 24;
    return Math.max(0, Math.min(24, hour)); // clamp 0–24
  };

  /* =========================================================
     FETCH TIMELINE
  ========================================================= */

 const fetchTimelineForSlot = async (slotIndex: number, cameraId: string) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/playback/hls/timeline?cameraId=${cameraId}&fromDate=${toISTString(
        DAY_START
      )}&toDate=${toISTString(DAY_END)}`
    );

    const json = await res.json();
    console.log(`Timeline API response for slot ${slotIndex}, camera ${cameraId}:`, json);

    let cursor = DAY_START;
    const uiSegments: SegmentHour[] = [];
    const rawSegments: RawSegment[] = [];

    json.data.forEach((s: any, idx: number) => {
      // Clamp start/end to DAY_START/DAY_END
      const st = new Date(Math.max(new Date(s.startTime).getTime(), DAY_START.getTime()));
      const et = new Date(Math.min(new Date(s.endTime).getTime(), DAY_END.getTime()));

      if (et <= st) {
        console.warn(`Skipping invalid segment ${idx}: start ${st}, end ${et}`);
        return; // skip invalid
      }

      rawSegments.push({ startTime: st, endTime: et });

      if (st > cursor) {
        const gapSegment = {
          start: dateToHour(cursor),
          end: dateToHour(st),
          type: "gap",
        };
        console.log(`Added gap segment:`, gapSegment);
        uiSegments.push(gapSegment);
      }

      const recSegment = {
        start: dateToHour(st),
        end: dateToHour(et),
        type: "recording",
      };
      console.log(`Added recording segment:`, recSegment);
      uiSegments.push(recSegment);

      cursor = et;
    });

    if (cursor < DAY_END) {
      const finalGap = {
        start: dateToHour(cursor),
        end: 24,
        type: "gap",
      };
      console.log(`Added final gap:`, finalGap);
      uiSegments.push(finalGap);
    }

    console.log(`UI segments for slot ${slotIndex}:`, uiSegments);
    console.log(`Raw segments for slot ${slotIndex}:`, rawSegments);

    setSegmentsPerSlot((p) => ({ ...p, [slotIndex]: uiSegments }));
    setRawSegmentsPerSlot((p) => ({ ...p, [slotIndex]: rawSegments }));

    return uiSegments;
  } catch (e) {
    console.error("Timeline fetch error", e);
    return [];
  }
};

  /* =========================================================
     START CAMERA (HLS)
  ========================================================= */

  const startCamera = async (cameraId: string): Promise<string | null> => {
    const apiUrl = `${BASE_URL}/api/playback/hls/playlist/${cameraId}?start=${toISTString(
      DAY_START
    )}&end=${toISTString(DAY_END)}`;

    setLoadingCameraIds((p) => new Set(p).add(cameraId));

    try {
      const res = await fetch(apiUrl);
      const json = await res.json();

      if (!json?.data?.playlist) throw new Error("No recording");

      const blob = new Blob([json.data.playlist], {
        type: "application/vnd.apple.mpegurl",
      });

      const blobUrl = URL.createObjectURL(blob);

      setPlayers((prev) => [
        ...prev.filter((p) => p.cameraId !== cameraId),
        {
          cameraId,
          blobUrl,
          sessionId: json.data.sessionId,
          date: selectedDate,
        },
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

  const getVideoSrc = (cameraId: string) =>
    players.find(
      (p) =>
        p.cameraId === cameraId &&
        p.date.toDateString() === selectedDate.toDateString()
    )?.blobUrl || "";

  /* =========================================================
     CAMERA DROP
  ========================================================= */

  const handleCameraDrop = async (cameraId: string, slotIndex: number) => {
    assignCameraToSlot(slotIndex, cameraId);
    setSelectedSlotIndex(slotIndex);

    await fetchTimelineForSlot(slotIndex, cameraId);
    const blobUrl = await startCamera(cameraId);

    if (!blobUrl) return;

    playback.play();
  };

  /* =========================================================
     SEEK HANDLER
  ========================================================= */

  const handleSeekToDate = (date: Date) => {
    setSelectedDate(date);
    playback.seekTo(date);
  };

  /* =========================================================
     GRID RESIZE
  ========================================================= */

  useEffect(() => {
    resizeSlots();
  }, [layout.rows, layout.cols]);

  const playheadHour = dateToHour(playback.globalTime);

  /* =========================================================
     RENDER
  ========================================================= */

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
          rawSegmentsPerSlot={rawSegmentsPerSlot}
          onCameraDrop={handleCameraDrop}
          onSlotSelect={setSelectedSlotIndex}
          isCameraLoading={(id) => loadingCameraIds.has(id)}
          cameraErrors={cameraErrors}
          playback={playback}
          rawSegmentsPerSlot={rawSegmentsPerSlot}
        />
      </div>

      <div className="shrink-0 z-50">
        <PlaybackTimelineBar
          isPlaying={playback.isPlaying}
          onStop={() => {
            clearAllSlots();
            setPlayers([]);
            setSegmentsPerSlot({});
            setRawSegmentsPerSlot({});
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
          playheadPosition={playheadHour}
          segmentsPerSlot={segmentsPerSlot}
          slotCount={slotAssignments.length}
          onSeek={(absHour) => {
            const seekDate = new Date(
              DAY_START.getTime() + (absHour / 24) * (DAY_END.getTime() - DAY_START.getTime())
            );
            playback.seekTo(seekDate);
          }}
        />

        <PlaybackAlertsBar />
      </div>
    </div>
  );
}