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
  const playback = usePlaybackStore();
  const gridStore = usePlaybackGridStore();

  const {
    layout,
    slotAssignments,
    assignCameraToSlot,
    clearAllSlots,
    resizeSlots,
  } = gridStore;

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(0);
 const [selectedDate, setSelectedDate] = useState<Date>(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  return today;
});
  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(
    new Set()
  );
  const [cameraErrors, setCameraErrors] = useState<Record<string, string>>({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);
  const [segments, setSegments] = useState<any[]>([]);

  const BASE_URL = "http://192.168.10.190:8090";

  /* ---------------- TIME HELPERS ---------------- */
  const toISTString = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  };

  const DAY_START = new Date(selectedDate);
  DAY_START.setHours(0, 0, 0, 0);

  const DAY_END = new Date(selectedDate);
  DAY_END.setHours(23, 59, 59, 999);

  const dateToPct = (d: Date) =>
    ((d.getTime() - DAY_START.getTime()) /
      (DAY_END.getTime() - DAY_START.getTime())) *
    100;

  /* ---------------- FETCH TIMELINE ---------------- */
useEffect(() => {
  const fetchTimeline = async () => {
    // Get the camera in the currently selected slot
    const cameraId =
      slotAssignments[selectedSlotIndex ?? 0] || slotAssignments.find(Boolean);

    if (!cameraId) return; // no camera, nothing to fetch

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
          uiSegs.push({
            start: dateToPct(cursor),
            end: dateToPct(st),
            type: "gap",
          });
        }

        uiSegs.push({
          start: dateToPct(st),
          end: dateToPct(et),
          type: "recording",
        });

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

  /* ---------------- CAMERA START ---------------- */
  const startCamera = async (
    cameraId: string,
    date: Date,
    range?: { start: Date; end: Date }
  ): Promise<string | null> => {
    const start = range?.start
      ? toISTString(range.start)
      : toISTString(DAY_START);
    const end = range?.end
      ? toISTString(range.end)
      : toISTString(DAY_END);

    const apiUrl = `${BASE_URL}/api/playback/hls/playlist/${cameraId}?start=${start}&end=${end}`;

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
          date,
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
    )?.blobUrl ?? "";

//      const handleCameraDrop = async (
//   cameraId: string,
//   slotIndex: number,
//   selectedTimeRange?: { start: Date; end: Date }
// ) => {
//   assignCameraToSlot(slotIndex, cameraId);
//   setSelectedSlotIndex(slotIndex);

//   //  STEP 1: Always jump to TODAY when camera is dropped
//   const now = new Date();
//   console.log("Camera dropped → jumping to TODAY:", now);

//   // STEP 2: Update playback store timestamp
//   usePlaybackStore.getState().seekToDate(now);
//   usePlaybackStore.getState().setIsPlaying(true);

//   //  STEP 3: Start camera stream
//   const existingPlayer = players.find((p) => p.cameraId === cameraId);

//   if (!existingPlayer) {
//     await startCamera(cameraId, now, selectedTimeRange);

//     const player = players.find(
//       (p) =>
//         p.cameraId === cameraId &&
//         p.date.toDateString() === now.toDateString()
//     );

//     if (player?.blobUrl) {
//       console.log(" Loading playback blob:", player.blobUrl);
//       playback.load(player.blobUrl);
//       playback.play();
//     }
//   }
// };

  /* ---------------- CAMERA DROP ---------------- */
  const handleCameraDrop = async (
    cameraId: string,
    slotIndex: number,
    range?: { start: Date; end: Date }
  ) => {
    assignCameraToSlot(slotIndex, cameraId);
    setSelectedSlotIndex(slotIndex);

    const existing = players.find(
      (p) =>
        p.cameraId === cameraId &&
        p.date.toDateString() === selectedDate.toDateString()
    );

    let blobUrl = existing?.blobUrl;

    if (!blobUrl) {
      blobUrl = await startCamera(cameraId, selectedDate, range);
    }

      if (blobUrl) {
        const store = usePlaybackStore.getState();

        if (store.segments.length) {
          store.seekToDate(store.segments[0].startTime);
        }

        store.setIsPlaying(true);
      }
  };


 
  /* ---------------- DATE SEEK ---------------- */
const handleSeekToDate = async (date: Date) => {
  console.log("🟢 handleSeekToDate called with:", date);

  setSelectedDate(date);

  console.log("🟡 Calling store.seekToDate");
  usePlaybackStore.getState().seekToDate(date);

  const slotCameraIds = slotAssignments.filter(Boolean) as string[];
  console.log("📸 slotCameraIds:", slotCameraIds);

  for (const cameraId of slotCameraIds) {
    console.log("➡️ Processing camera:", cameraId);

    const existingPlayer = players.find(
      (p) =>
        p.cameraId === cameraId &&
        p.date.toDateString() === date.toDateString()
    );

    console.log(
      "🎥 existingPlayer:",
      existingPlayer ? "FOUND" : "NOT FOUND"
    );

    if (!existingPlayer) {
      const segments = usePlaybackStore.getState().segments;
      console.log("📦 segments from store:", segments);

      if (!segments.length) {
        console.warn("⛔ No segments available, aborting");
        return;
      }

      const seg =
        segments.find(
          (s) => date >= s.startTime && date <= s.endTime
        ) || segments.find((s) => date < s.startTime);

      console.log("🧩 resolved segment:", seg);

      if (!seg) {
        console.warn("⛔ No valid segment for date:", date);
        return;
      }

      console.log("🚀 startCamera called", {
        cameraId,
        start: seg.startTime,
        end: seg.endTime,
      });

      await startCamera(cameraId, date, {
        start: seg.startTime,
        end: seg.endTime,
      });
    }
  }

  console.log("✅ handleSeekToDate finished");
};

  /*  DATE CHANGE → RELOAD CAMERAS (MAIN FIX) */
 useEffect(() => {
  const reload = async () => {
    const cams = slotAssignments.filter(Boolean) as string[];

    usePlaybackStore.getState().seekToDate(selectedDate);

    for (const cam of cams) {
      await startCamera(cam, selectedDate);
    }
  };

  if (slotAssignments.some(Boolean)) reload();
}, [selectedDate]);

  /* ---------------- GRID ---------------- */
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
            setPlayers([]);
          }}
          speed={playback.speed}
          currentTimestamp={playback.currentTimestamp}
          isTimelineExpanded={isTimelineExpanded}
          onToggleTimeline={() =>
            setIsTimelineExpanded((p) => !p)
          }
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onSeekToDate={handleSeekToDate}
        />

        <PlaybackTimeline
          playheadPosition={playback.playheadPosition}
          isExpanded={isTimelineExpanded}
          onSeek={(pct) => {
            const date = new Date(
              DAY_START.getTime() +
                (pct / 100) *
                  (DAY_END.getTime() - DAY_START.getTime())
            );
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