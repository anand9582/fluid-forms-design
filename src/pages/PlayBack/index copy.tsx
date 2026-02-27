// Playback.tsx
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
  /* ---------------- STATE ---------------- */
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedDate] = useState<Date>(new Date("2026-02-05"));
  const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(
    () => new Set()
  );
  const [cameraErrors, setCameraErrors] = useState<Record<string, string>>({});
  const [zoomLevel, setZoomLevel] = useState(1);

  const playback = usePlayback();

  /* ---------------- GRID STORE ---------------- */
  const { assignCameraToSlot, slotAssignments } = usePlaybackGridStore();

  const activeCameraId = useMemo(() => {
    if (selectedSlot === null) return null;
    return slotAssignments[selectedSlot] ?? null;
  }, [selectedSlot, slotAssignments]);

  /* ---------------- TIMELINE DATA ---------------- */
  const DAY_START = new Date("2026-02-05T00:00:00");
  const DAY_END = new Date("2026-02-05T23:59:59");

  const dateToPct = (d: Date) =>
    ((d.getTime() - DAY_START.getTime()) /
      (DAY_END.getTime() - DAY_START.getTime())) *
    100;

  const pctToDate = (pct: number) =>
    new Date(
      DAY_START.getTime() +
        (pct / 100) * (DAY_END.getTime() - DAY_START.getTime())
    );

  const [segments, setSegments] = useState<any[]>([]);

useEffect(() => {
  fetch(
    `${BASE_URL}/api/playback/hls/timeline?cameraId=6&fromDate=2026-02-05T00:00:00&toDate=2026-02-05T23:59:59`
  )
    .then((r) => {
      console.log("Raw response:", r); 
      return r.json();
    })
    .then((res) => {
      console.log("Parsed JSON:", res);

      const segs: any[] = [];
      let cursor = DAY_START;

      res.data.forEach((s: any) => {
        const st = new Date(s.startTime);
        const et = new Date(s.endTime);

        if (st > cursor) {
          segs.push({
            start: dateToPct(cursor),
            end: dateToPct(st),
            type: "gap",
          });
        }

        segs.push({
          start: dateToPct(st),
          end: dateToPct(et),
          type: "recording",
        });

        cursor = et;
      });

      if (cursor < DAY_END) {
        segs.push({
          start: dateToPct(cursor),
          end: 100,
          type: "gap",
        });
      }

      console.log("Final segments:", segs); 
      setSegments(segs);
    })
    .catch((err) => {
      console.error("API error:", err);
    });
}, []);

  /* ---------------- CAMERA START ---------------- */
  const startCamera = async (
    cameraId: string,
    date: Date
  ): Promise<string | null> => {
    const startISO = new Date(date.setHours(0, 0, 0, 0)).toISOString();
    const endISO = new Date(date.setHours(23, 59, 59, 999)).toISOString();

    const apiUrl = `${BASE_URL}/api/playback/hls/playlist/${cameraId}?start=${startISO}&end=${endISO}`;

    setLoadingCameraIds((prev) => new Set(prev).add(cameraId));

    try {
      const res = await fetch(apiUrl);
      const json = await res.json();

      if (!res.ok || !json?.data?.playlist) {
        throw new Error("No recordings");
      }

      const blob = new Blob([json.data.playlist], {
        type: "application/vnd.apple.mpegurl",
      });
      const blobUrl = URL.createObjectURL(blob);

      setPlayers((prev) => [
        ...prev.filter(
          (p) =>
            !(
              p.cameraId === cameraId &&
              p.date.toDateString() === date.toDateString()
            )
        ),
        {
          cameraId,
          blobUrl,
          sessionId: json.data.sessionId,
          date: new Date(date),
        },
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
    players.find(
      (p) =>
        p.cameraId === cameraId &&
        p.date.toDateString() === selectedDate.toDateString()
    )?.blobUrl ?? "";

  /* ---------------- EVENTS ---------------- */
  const handleCameraDrop = async (cameraId: string, slotIndex: number) => {
    assignCameraToSlot(slotIndex, cameraId);
    setSelectedSlot(slotIndex);

    if (!getVideoSrc(cameraId)) {
      await startCamera(cameraId, new Date(selectedDate));
    }
  };

  const handleCameraClick = (cameraId: string) => {
    startCamera(cameraId, new Date(selectedDate));
  };

  const handleTimelineSeek = async (pct: number) => {
    if (!activeCameraId) return;

    playback.seekTo(pct);
    const seekTime = pctToDate(pct);

    await startCamera(activeCameraId, seekTime);
  };

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
        <CameraTreeSidebar isVisible onCameraClick={handleCameraClick} />

        <PlaybackCameraGrid
          selectedSlot={selectedSlot}
          onSlotSelect={(i) => {
            setSelectedSlot(i);
            setIsTimelineExpanded(true);
          }}
          getVideoSrc={getVideoSrc}
          onCameraDrop={handleCameraDrop}
          isCameraLoading={(id) => loadingCameraIds.has(id)}
          cameraErrors={cameraErrors}
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
          onToggleTimeline={() =>
            setIsTimelineExpanded(!isTimelineExpanded)
          }
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
        />

        <PlaybackTimeline
          playheadPosition={playback.playheadPosition}
          isExpanded={isTimelineExpanded}
          onSeek={handleTimelineSeek}
          zoomLevel={zoomLevel}
          segments={segments}
        />

        <PlaybackAlertsBar />
      </div>
    </div>
  );
}


// ne code below


// PlaybackDummyOptimized.tsx
import React, { useEffect, useState, useRef } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CameraTreeSidebar, LiveViewToolbar } from "@/components/LiveView/PagesInclude";
import { PlaybackCameraGrid, PlaybackTimelineBar, PlaybackTimeline, PlaybackAlertsBar } from "@/components/Playback/PagesInclude";
import { usePlaybackStore } from "@/Store/playbackStore";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";

interface Player {
  cameraId: string;
  blobUrl: string;
  sessionId: string;
  date: string; // normalized YYYY-MM-DD string for easier lookup
}

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

  const [playersMap, setPlayersMap] = useState<Map<string, Player>>(new Map());
  const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(new Set());
  const [cameraErrors, setCameraErrors] = useState<Record<string, string>>({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  const abortControllers = useRef<Map<string, AbortController>>(new Map());

  const BASE_URL = "http://192.168.10.190:8090";

  /* ---------------- TIME HELPERS ---------------- */
  const toISTString = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const normalizeDateKey = (date: Date) => date.toISOString().split("T")[0]; // YYYY-MM-DD

  const DAY_START = new Date(selectedDate);
  DAY_START.setHours(0, 0, 0, 0);

  const DAY_END = new Date(selectedDate);
  DAY_END.setHours(23, 59, 59, 999);

  const dateToPct = (d: Date) =>
    ((d.getTime() - DAY_START.getTime()) / (DAY_END.getTime() - DAY_START.getTime())) * 100;

  /* ---------------- FETCH TIMELINE ---------------- */
  useEffect(() => {
    const fetchTimeline = async () => {
      const cameraId =
        slotAssignments[selectedSlotIndex ?? 0] || slotAssignments.find(Boolean);
      if (!cameraId) return;

      const controller = new AbortController();
      abortControllers.current.set(`timeline-${cameraId}`, controller);

      try {
        const res = await fetch(
          `${BASE_URL}/api/playback/hls/timeline?cameraId=${cameraId}&fromDate=${toISTString(
            DAY_START
          )}&toDate=${toISTString(DAY_END)}`,
          { signal: controller.signal }
        );
        const json = await res.json();
        const storeSegs = json.data.map((s: any) => ({
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime),
        }));

        const uiSegs: any[] = [];
        let cursor = DAY_START;

        json.data.forEach((s: any) => {
          const st = new Date(s.startTime);
          const et = new Date(s.endTime);

          if (st > cursor) uiSegs.push({ start: dateToPct(cursor), end: dateToPct(st), type: "gap" });
          uiSegs.push({ start: dateToPct(st), end: dateToPct(et), type: "recording" });
          cursor = et;
        });

        if (cursor < DAY_END) uiSegs.push({ start: dateToPct(cursor), end: 100, type: "gap" });

        usePlaybackStore.getState().setSegments(storeSegs);
      } catch (err: any) {
        if (err.name !== "AbortError") console.error("Timeline fetch error", err);
      } finally {
        abortControllers.current.delete(`timeline-${cameraId}`);
      }
    };

    fetchTimeline();

    return () => {
      // cleanup abort on unmount / dependency change
      abortControllers.current.forEach(ctrl => ctrl.abort());
      abortControllers.current.clear();
    };
  }, [selectedDate, selectedSlotIndex, slotAssignments]);

  /* ---------------- CAMERA START ---------------- */
  const startCamera = async (
    cameraId: string,
    date: Date,
    range?: { start: Date; end: Date }
  ): Promise<string | null> => {
    const start = range?.start ? toISTString(range.start) : toISTString(DAY_START);
    const end = range?.end ? toISTString(range.end) : toISTString(DAY_END);

    const apiUrl = `${BASE_URL}/api/playback/hls/playlist/${cameraId}?start=${start}&end=${end}`;
    setLoadingCameraIds(prev => new Set(prev).add(cameraId));

    // abort controller
    const controller = new AbortController();
    abortControllers.current.set(`camera-${cameraId}`, controller);

    try {
      const res = await fetch(apiUrl, { signal: controller.signal });
      const json = await res.json();
      if (!json?.data?.playlist) throw new Error("No recording");

      const blob = new Blob([json.data.playlist], { type: "application/vnd.apple.mpegurl" });
      const blobUrl = URL.createObjectURL(blob);

      // Cleanup previous URL if exists
      const key = `${cameraId}-${normalizeDateKey(date)}`;
      const prev = playersMap.get(key);
      if (prev) URL.revokeObjectURL(prev.blobUrl);

      setPlayersMap(prev => new Map(prev).set(key, { cameraId, blobUrl, sessionId: json.data.sessionId, date: normalizeDateKey(date) }));

      return blobUrl;
    } catch (err: any) {
      setCameraErrors(prev => ({ ...prev, [cameraId]: err.message }));
      return null;
    } finally {
      setLoadingCameraIds(prev => { const n = new Set(prev); n.delete(cameraId); return n; });
      abortControllers.current.delete(`camera-${cameraId}`);
    }
  };

  const getVideoSrc = (cameraId: string) => {
    const key = `${cameraId}-${normalizeDateKey(selectedDate)}`;
    return playersMap.get(key)?.blobUrl ?? "";
  };

  /* ---------------- CAMERA DROP ---------------- */
  const handleCameraDrop = async (
    cameraId: string,
    slotIndex: number,
    range?: { start: Date; end: Date }
  ) => {
    assignCameraToSlot(slotIndex, cameraId);
    setSelectedSlotIndex(slotIndex);

    let blobUrl = getVideoSrc(cameraId);

    if (!blobUrl) {
      blobUrl = await startCamera(cameraId, selectedDate, range);
    }

    if (blobUrl) {
      const store = usePlaybackStore.getState();
      if (store.segments.length) store.seekToDate(store.segments[0].startTime);
      store.setIsPlaying(true);
    }
  };

  /* ---------------- DATE SEEK ---------------- */
  const handleSeekToDate = (date: Date) => {
    usePlaybackStore.getState().seekToDate(date);
  };

  /* ---------------- GRID RESIZE ---------------- */
  useEffect(() => {
    resizeSlots();
  }, [layout.rows, layout.cols]);

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
          onSlotSelect={i => { setSelectedSlotIndex(i); setIsTimelineExpanded(true); }}
          isCameraLoading={id => loadingCameraIds.has(id)}
          cameraErrors={cameraErrors}
          playback={playback}
        />
      </div>
      <div className="shrink-0 z-50">
        <PlaybackTimelineBar
          isPlaying={playback.isPlaying}
          onTogglePlay={playback.togglePlay}
          onStop={() => {
            clearAllSlots();
            // cleanup all blob URLs
            playersMap.forEach(p => URL.revokeObjectURL(p.blobUrl));
            setPlayersMap(new Map());
          }}
          speed={playback.speed}
          currentTimestamp={playback.currentTimestamp}
          isTimelineExpanded={isTimelineExpanded}
          onToggleTimeline={() => setIsTimelineExpanded(p => !p)}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onSeekToDate={handleSeekToDate}
        />
        <PlaybackTimeline
          playheadPosition={playback.playheadPosition}
          isExpanded={isTimelineExpanded}
          onSeek={() => handleSeekToDate(playback.currentTimestamp)}
          zoomLevel={zoomLevel}
          segments={usePlaybackStore.getState().segments}
        />
        <PlaybackAlertsBar />
      </div>
    </div>
  );
}

// odl new typ


// PlaybackDummy.tsx
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

// --- Types ---
interface Player {
  cameraId: string;
  blobUrl: string;
  sessionId: string;
  date: Date;
}

// --- Global players Map for fast lookup ---
const playersMap: Map<string, Player> = new Map();

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
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [segments, setSegments] = useState<any[]>([]);

  const BASE_URL = "http://192.168.10.190:8090";

  // --- Helper to format date key ---
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

  const DAY_START = new Date(selectedDate);
  DAY_START.setHours(0, 0, 0, 0);
  const DAY_END = new Date(selectedDate);
  DAY_END.setHours(23, 59, 59, 999);

  const dateToPct = (d: Date) =>
    ((d.getTime() - DAY_START.getTime()) / (DAY_END.getTime() - DAY_START.getTime())) * 100;

  // --- Fetch timeline ---
  useEffect(() => {
    const fetchTimeline = async () => {
      const cameraId =
        slotAssignments[selectedSlotIndex ?? 0] || slotAssignments.find(Boolean);
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

          if (st > cursor) {
            uiSegs.push({ start: dateToPct(cursor), end: dateToPct(st), type: "gap" });
          }

          uiSegs.push({ start: dateToPct(st), end: dateToPct(et), type: "recording" });
          cursor = et;
        });

        if (cursor < DAY_END) {
          uiSegs.push({ start: dateToPct(cursor), end: 100, type: "gap" });
        }

        setSegments(uiSegs);
        usePlaybackStore.getState().setSegments(storeSegs);
      } catch (err) {
        console.error("Timeline fetch error", err);
      }
    };

    fetchTimeline();
  }, [selectedDate, selectedSlotIndex, slotAssignments]);

  // --- Start camera and return blobUrl ---
  const startCamera = async (cameraId: string, date: Date) => {
    const start = toISTString(DAY_START);
    const end = toISTString(DAY_END);
    const apiUrl = `${BASE_URL}/api/playback/hls/playlist/${cameraId}?start=${start}&end=${end}`;

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

  // --- Preload assigned cameras for selected date ---
  const preloadCamerasForDate = async (date: Date) => {
    const cams = slotAssignments.filter(Boolean) as string[];
    for (const cam of cams) {
      const key = `${cam}-${normalizeDateKey(date)}`;
      if (!playersMap.has(key)) {
        await startCamera(cam, date);
      }
    }
  };

  useEffect(() => {
    if (slotAssignments.some(Boolean)) {
      preloadCamerasForDate(selectedDate);
    }
  }, [selectedDate, slotAssignments]);

  // --- Get video src from map ---
  const getVideoSrc = (cameraId: string) => {
    const key = `${cameraId}-${normalizeDateKey(selectedDate)}`;
    return playersMap.get(key)?.blobUrl ?? "";
  };

  // --- Camera drop ---
  const handleCameraDrop = async (
    cameraId: string,
    slotIndex: number
  ) => {
    assignCameraToSlot(slotIndex, cameraId);
    setSelectedSlotIndex(slotIndex);

    let blobUrl = getVideoSrc(cameraId);
    if (!blobUrl) {
      blobUrl = await startCamera(cameraId, selectedDate);
    }

    if (blobUrl) {
      const store = usePlaybackStore.getState();
      if (store.segments.length) store.seekToDate(store.segments[0].startTime);
      store.setIsPlaying(true);
    }
  };

  // --- Seek ---
  const handleSeekToDate = (date: Date) => {
    usePlaybackStore.getState().seekToDate(new Date(date));
  };

  // --- Grid resize ---
  useEffect(() => {
    resizeSlots();
  }, [layout.rows, layout.cols]);

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
          onTogglePlay={playback.togglePlay}
          onStop={() => {
            clearAllSlots();
            playersMap.clear();
          }}
          speed={playback.speed}
          currentTimestamp={playback.currentTimestamp}
          isTimelineExpanded={isTimelineExpanded}
          onToggleTimeline={() => setIsTimelineExpanded((p) => !p)}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onSeekToDate={handleSeekToDate}
        />

        <PlaybackTimeline
          playheadPosition={playback.playheadPosition}
          isExpanded={isTimelineExpanded}
          onSeek={() => handleSeekToDate(playback.currentTimestamp)}
          zoomLevel={zoomLevel}
          segments={segments}
        />

        <PlaybackAlertsBar />
      </div>
    </div>
  );
}