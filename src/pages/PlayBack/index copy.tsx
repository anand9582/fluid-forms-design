// mutlipel slot

// import React, { useEffect, useState, useMemo } from "react";
// import { Sidebar } from "@/components/dashboard/Sidebar";
// import { CameraTreeSidebar, LiveViewToolbar } from "@/components/LiveView/PagesInclude";
// import { PlaybackCameraGrid, PlaybackTimelineBar, PlaybackAlertsBar } from "@/components/Playback/PagesInclude";
// import { usePlaybackStore } from "@/Store/playbackStore";
// import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";
// import { PlaybackTimeline, SegmentHour } from "@/components/Playback/PlaybackTimeline";
// import { SidebarCameraStore } from "@/Store/SidebarCameraStore";

// /* =========================================================
// TYPES
// ========================================================= */

// interface Player {
//   slotIndex: number;
//   cameraId: string;
//   blobUrl: string;
//   sessionId: string;
//   date: Date;
// }

// interface RawSegment {
//   startTime: Date;
//   endTime: Date;
// }

// /* =========================================================
// COMPONENT
// ========================================================= */

// export default function Index() {

//   const playback = usePlaybackStore();
//   const gridStore = usePlaybackGridStore();

//   const {
//     layout,
//     slotAssignments,
//     assignCameraToSlot,
//     clearAllSlots,
//     resizeSlots
//   } = gridStore;

//   const cameras = SidebarCameraStore((s) => s.cameras);

//   const BASE_URL = "http://192.168.10.190:8090";

//   /* =========================================================
//   LOCAL STATE
//   ========================================================= */

//   const [selectedSlot, setSelectedSlot] = useState<number | null>(0);

//   const [selectedDate, setSelectedDate] = useState(() => {
//     const d = new Date();
//     d.setHours(0, 0, 0, 0);
//     return d;
//   });

//   const [players, setPlayers] = useState<Player[]>([]);

//   const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(new Set());

//   const [cameraErrors, setCameraErrors] = useState<Record<string, string>>({});

//   const [zoomLevel, setZoomLevel] = useState(1);

//   const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);

//   const [segmentsPerSlot, setSegmentsPerSlot] = useState<Record<number, SegmentHour[]>>({});

//   const [rawSegmentsPerSlot, setRawSegmentsPerSlot] = useState<Record<number, RawSegment[]>>({});

//   /* =========================================================
//   DAY RANGE
//   ========================================================= */

//   const DAY_START = useMemo(() => {
//     const d = new Date(selectedDate);
//     d.setHours(0, 0, 0, 0);
//     return d;
//   }, [selectedDate]);

//   const DAY_END = useMemo(() => {
//     const d = new Date(selectedDate);
//     d.setHours(23, 59, 59, 999);
//     return d;
//   }, [selectedDate]);

//   const toISTString = (date: Date) => {

//     const pad = (n: number) => n.toString().padStart(2, "0");

//     return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
//       date.getHours()
//     )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
//   };

//   const dateToHour = (d: Date) =>
//     ((d.getTime() - DAY_START.getTime()) /
//       (DAY_END.getTime() - DAY_START.getTime())) * 24;

//   /* =========================================================
//   FETCH TIMELINE
//   ========================================================= */

//   const fetchTimelineForSlot = async (slotIndex: number, cameraId: string) => {

//     try {

//       const res = await fetch(
//         `${BASE_URL}/api/playback/hls/timeline?cameraId=${cameraId}&fromDate=${toISTString(
//           DAY_START
//         )}&toDate=${toISTString(DAY_END)}`
//       );

//       const json = await res.json();

//       let cursor = DAY_START;

//       const uiSegments: SegmentHour[] = [];
//       const rawSegments: RawSegment[] = [];

//       json.data.forEach((s: any) => {

//         const st = new Date(Math.max(new Date(s.startTime).getTime(), DAY_START.getTime()));

//         const et = new Date(Math.min(new Date(s.endTime).getTime(), DAY_END.getTime()));

//         if (et <= st) return;

//         rawSegments.push({ startTime: st, endTime: et });

//         if (st > cursor) {
//           uiSegments.push({
//             start: dateToHour(cursor),
//             end: dateToHour(st),
//             type: "gap"
//           });
//         }

//         uiSegments.push({
//           start: dateToHour(st),
//           end: dateToHour(et),
//           type: "recording"
//         });

//         cursor = et;
//       });

//       if (cursor < DAY_END) {

//         uiSegments.push({
//           start: dateToHour(cursor),
//           end: 24,
//           type: "gap"
//         });

//       }

//       setSegmentsPerSlot((p) => ({ ...p, [slotIndex]: uiSegments }));

//       setRawSegmentsPerSlot((p) => ({ ...p, [slotIndex]: rawSegments }));

//       return uiSegments;

//     } catch (e) {

//       console.error("Timeline fetch error", e);

//       return [];

//     }

//   };

//   /* =========================================================
//   START CAMERA
//   ========================================================= */

//   const startCamera = async (cameraId: string, slotIndex: number): Promise<string | null> => {

//     const apiUrl =
//       `${BASE_URL}/api/playback/hls/playlist/${cameraId}?start=${toISTString(
//         DAY_START
//       )}&end=${toISTString(DAY_END)}`;

//     try {

//       const res = await fetch(apiUrl);

//       const json = await res.json();

//       if (!json?.data?.playlist) throw new Error("No recording");

//       const blob = new Blob([json.data.playlist], {
//         type: "application/vnd.apple.mpegurl"
//       });

//       const blobUrl = URL.createObjectURL(blob);

//       setPlayers((prev) => [
//         ...prev.filter((p) => p.slotIndex !== slotIndex),
//         {
//           slotIndex,
//           cameraId,
//           blobUrl,
//           sessionId: json.data.sessionId,
//           date: selectedDate
//         }
//       ]);

//       return blobUrl;

//     } catch (err: any) {

//       setCameraErrors((p) => ({
//         ...p,
//         [cameraId]: err.message
//       }));

//       return null;

//     }

//   };

//   const getVideoSrc = (slotIndex: number) =>
//     players.find(
//       (p) =>
//         p.slotIndex === slotIndex &&
//         p.date.toDateString() === selectedDate.toDateString()
//     )?.blobUrl || "";

//   /* =========================================================
//   CAMERA DROP
//   ========================================================= */

//   const handleCameraDrop = async (cameraId: string, slotIndex: number) => {

//     assignCameraToSlot(slotIndex, cameraId);

//     setSelectedSlot(slotIndex);

//     const segments = await fetchTimelineForSlot(slotIndex, cameraId);

//     const blobUrl = await startCamera(cameraId, slotIndex);

//     if (!blobUrl) return;

//     const firstRecording = segments?.find((s) => s.type === "recording");

//     if (firstRecording) {

//       const seekDate = new Date(selectedDate);

//       const hour = Math.floor(firstRecording.start);

//       const minutes = Math.floor((firstRecording.start % 1) * 60);

//       seekDate.setHours(hour);
//       seekDate.setMinutes(minutes);
//       seekDate.setSeconds(0);

//       playback.seekTo(seekDate);

//     }

//     playback.play();

//   };

//   /* =========================================================
//   SEEK HANDLER
//   ========================================================= */

//   const handleSeek = (absHour: number, slotIndex?: number) => {

//     const seekDate = new Date(selectedDate);

//     seekDate.setHours(Math.floor(absHour));

//     seekDate.setMinutes(Math.floor((absHour % 1) * 60));

//     seekDate.setSeconds(Math.floor((absHour * 3600) % 60));

//     if (playback.isSync) {

//       playback.seekTo(seekDate);

//     } else {

//       if (slotIndex !== undefined) {
//         playback.seekTo(seekDate, slotIndex);
//       }

//     }

//   };

//   const playheadHour = dateToHour(playback.globalTime);

//   /* =========================================================
//   AUTO LOAD CAMERAS WHEN DATE CHANGE
//   ========================================================= */

//   useEffect(() => {

//     slotAssignments.forEach(async (cameraId, slotIndex) => {

//       if (!cameraId) return;

//       await fetchTimelineForSlot(slotIndex, cameraId);

//       await startCamera(cameraId, slotIndex);

//     });

//   }, [selectedDate]);

//   /* =========================================================
//   CAMERA NAMES
//   ========================================================= */

//   const cameraNames = useMemo(() => {

//     const map: Record<number, string> = {};

//     slotAssignments.forEach((cameraId, slotIndex) => {

//       if (!cameraId) return;

//       const camera = cameras.find((c) => c.cameraId === cameraId);

//       map[slotIndex] = camera ? camera.name : cameraId;

//     });

//     return map;

//   }, [slotAssignments, cameras]);

//   /* =========================================================
//   PLAYBACK CONTROLS
//   ========================================================= */

//   const handleFastForward = () => {

//     const speeds = [1, 2, 4, 8, 16, 36];

//     const idx = speeds.indexOf(playback.playbackSpeed);

//     playback.setSpeed(speeds[idx + 1] ?? 36);

//   };

//   const handleRewind = () => playback.seekBySeconds(-5);

//   const handleSkipBack = () => playback.seekBySeconds(-10);

//   const handleSkipForward = () => playback.seekBySeconds(10);

//   /* =========================================================
//   GRID RESIZE
//   ========================================================= */

//   useEffect(() => {

//     resizeSlots();

//   }, [layout.rows, layout.cols]);

//   /* =========================================================
//   RENDER
//   ========================================================= */

//   return (
//     <div className="flex flex-col h-full bg-background overflow-hidden">

//       <Sidebar />

//       <div className="ml-[80px] shrink-0">
//         <LiveViewToolbar
//           showCameraList
//           selectedLayout="2x2"
//           onLayoutChange={() => {}}
//           onToggleCameraList={() => {}}
//           gridStore={gridStore}
//           showCustomGridBuilder={false}
//         />
//       </div>

//       <div className="flex flex-1 ml-[80px] gap-3 p-3 overflow-hidden">

//         <CameraTreeSidebar isVisible />

//         <PlaybackCameraGrid
//           selectedSlot={selectedSlot}
//           cameraSlots={slotAssignments}
//           getVideoSrc={getVideoSrc}
//           rawSegmentsPerSlot={rawSegmentsPerSlot}
//           onCameraDrop={handleCameraDrop}
//           onSlotSelect={setSelectedSlot}
//           isCameraLoading={(id) => loadingCameraIds.has(id)}
//           cameraErrors={cameraErrors}
//           playback={playback}
//         />

//       </div>

//       <div className="shrink-0 z-50 bg-white">

//         <PlaybackTimelineBar
//           isPlaying={playback.isPlaying}
//           onStop={() => {
//             clearAllSlots();
//             setPlayers([]);
//             setSegmentsPerSlot({});
//             setRawSegmentsPerSlot({});
//           }}
//           isTimelineExpanded={isTimelineExpanded}
//           onToggleTimeline={() => setIsTimelineExpanded((p) => !p)}
//           zoomLevel={zoomLevel}
//           onFastForward={handleFastForward}
//           onRewind={handleRewind}
//           onSkipBack={handleSkipBack}
//           onSkipForward={handleSkipForward}
//           onZoomChange={setZoomLevel}
//           onSeekToDate={(d) => setSelectedDate(d)}
//         />

//         <PlaybackTimeline
//           isExpanded={isTimelineExpanded}
//           zoomLevel={zoomLevel}
//           playheadPosition={playheadHour}
//           segmentsPerSlot={segmentsPerSlot}
//           slotCount={slotAssignments.length}
//           onSeek={handleSeek}
//           cameraNames={cameraNames}
//           isSync={playback.isSync}
//         />

//         <PlaybackAlertsBar />

//       </div>

//     </div>
//   );
// }


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
import { PlaybackTimeline, SegmentHour } from "@/components/Playback/PlaybackTimeline";
import { SidebarCameraStore } from "@/Store/SidebarCameraStore";

/* =========================================================
   TYPES
========================================================= */
interface Player {
  cameraId: string;
  src: string;
  date: Date;
}

interface RawSegment {
  startTime: Date;
  endTime: Date;
}

/* =========================================================
   COMPONENT
========================================================= */
export default function Index() {
  const playback = usePlaybackStore();
  const gridStore = usePlaybackGridStore();
  const { cameras } = SidebarCameraStore();
  console.log(cameras);
  const { layout, slotAssignments, assignCameraToSlot, clearAllSlots } =
    gridStore;
const [showCameraList, setShowCameraList] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(0);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [segmentsPerSlot, setSegmentsPerSlot] = useState<
    Record<number, SegmentHour[]>
  >({});
 
const cameraNameMap = useMemo(() => {
  const map: Record<string, string> = {};
  cameras.forEach((c) => {
    map[c.id] = c.name;
  });
  return map;
}, [cameras]);

useEffect(() => {
  console.log("Camera Name Map:", cameraNameMap);
}, [cameraNameMap]);

  const [rawSegmentsPerSlot, setRawSegmentsPerSlot] = useState<
    Record<number, RawSegment[]>
  >({});

  const [zoomLevel, setZoomLevel] = useState(1);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);

  /* =========================================================
     DUMMY SEGMENTS (9 AM – 9:30 PM)
  ========================================================= */
  const buildDummySegments = (): RawSegment[] => {
    const base = new Date(selectedDate);
    const segs: RawSegment[] = [];

    for (let h = 9; h < 21; h += 2) {
      const st = new Date(base);
      st.setHours(h, 0, 0, 0);

      const et = new Date(base);
      et.setHours(h + 1, 30, 0, 0);

      segs.push({ startTime: st, endTime: et });
    }
    return segs;
  };

  const dateToHour = (d: Date) =>
    ((d.getHours() * 3600 + d.getMinutes() * 60 + d.getSeconds()) / 86400) * 24;

  /* =========================================================
     SET DUMMY TIMELINE
  ========================================================= */
  const loadDummyTimeline = (slotIndex: number) => {
    const raw = buildDummySegments();
    const ui: SegmentHour[] = [];

    let cursor = 0;

    raw.forEach((s) => {
      const st = dateToHour(s.startTime);
      const et = dateToHour(s.endTime);

      if (st > cursor) {
        ui.push({ start: cursor, end: st, type: "gap" });
      }

      ui.push({ start: st, end: et, type: "recording" });
      cursor = et;
    });

    if (cursor < 24) {
      ui.push({ start: cursor, end: 24, type: "gap" });
    }

    setRawSegmentsPerSlot((p) => ({ ...p, [slotIndex]: raw }));
    setSegmentsPerSlot((p) => ({ ...p, [slotIndex]: ui }));
  };

  /* =========================================================
     CAMERA DROP (DUMMY)
  ========================================================= */
  const handleCameraDrop = async (cameraId: string, slotIndex: number) => {
    assignCameraToSlot(slotIndex, cameraId);
    setSelectedSlot(slotIndex);

    loadDummyTimeline(slotIndex);

    setPlayers((p) => [
      ...p.filter((x) => x.cameraId !== cameraId),
      {
        cameraId,
        src: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // 🔥 DUMMY VIDEO
        date: selectedDate,
      },
    ]);

    playback.play();
  };

  const getVideoSrc = (cameraId: string) =>
    players.find((p) => p.cameraId === cameraId)?.src || "";

  /* =========================================================
     SEEK FROM TIMELINE
  ========================================================= */
  const handleSeek = (absHour: number) => {
    const d = new Date(selectedDate);
    d.setSeconds(absHour * 3600);
    playback.seekTo(d);
  };

  /* =========================================================
     TRANSPORT
  ========================================================= */
  const handleFastForward = () => {
    const speeds = [1, 2, 4, 8, 16, 36];
    const idx = speeds.indexOf(playback.playbackSpeed);
    playback.setSpeed(speeds[idx + 1] ?? 36);
  };

  const handleRewind = () => playback.seekBySeconds(-5);
  const handleSkipBack = () => playback.seekBySeconds(-10);
const handleSkipForward = () => {
  playback.seekBySeconds(10);
};

  const playheadHour = dateToHour(playback.globalTime);

  
  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div className="flex flex-col h-full">
      <Sidebar />

      <div className="ml-[80px]">
        <LiveViewToolbar
           showCameraList={showCameraList}
          selectedLayout="2x2"
          onLayoutChange={() => {}}
          onToggleCameraList={() => {}}
          gridStore={gridStore}
          showCustomGridBuilder={false}
        />
      </div>

      <div className="flex flex-1 ml-[80px] gap-3 p-3">
        <CameraTreeSidebar isVisible />

        <PlaybackCameraGrid
          selectedSlot={selectedSlot}
          onSlotSelect={setSelectedSlot}
          getVideoSrc={getVideoSrc}
          onCameraDrop={handleCameraDrop}
          rawSegmentsPerSlot={rawSegmentsPerSlot}
          isCameraLoading={() => false}
        />
      </div>
   <div className="shrink-0 z-50 bg-white">
      <PlaybackTimelineBar
        isTimelineExpanded={isTimelineExpanded}
        onToggleTimeline={() => setIsTimelineExpanded((p) => !p)}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        onFastForward={handleFastForward}
        onRewind={handleRewind}
        onSkipBack={handleSkipBack}
        onSkipForward={handleSkipForward}
        onStop={() => {
          clearAllSlots();
          setPlayers([]);
          setSegmentsPerSlot({});
        }}
        onSeekToDate={(d) => playback.seekTo(d)}
      />

      <PlaybackTimeline
        isExpanded={isTimelineExpanded}
        zoomLevel={zoomLevel}
        playheadPosition={playheadHour}
        segmentsPerSlot={segmentsPerSlot}
        slotCount={slotAssignments.length}
        cameraNameMap={cameraNameMap}
        onSeek={handleSeek}
      />

      <PlaybackAlertsBar />
      </div>
    </div>
  );
}