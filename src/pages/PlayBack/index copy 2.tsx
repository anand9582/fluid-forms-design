// import React, { useState, useEffect } from "react";
// import { Sidebar } from "@/components/dashboard/Sidebar";
// import { CameraTreeSidebar, LiveViewToolbar } from "@/components/LiveView/PagesInclude";
// import { PlaybackCameraGrid, PlaybackTimelineBar, PlaybackTimeline, PlaybackAlertsBar } from "@/components/Playback/PagesInclude";
// import { usePlaybackStore } from "@/Store/playbackStore";
// import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";
// import { useHlsWithStore } from "@/hooks/useHlsWithStore";

// import { TEST_MODE } from "@/components/Config/api"; // ✅ test mode flag

// // Global players cache (for real API)
// const playersMap: Map<string, { blobUrl: string; sessionId: string; date: Date }> = new Map();

// // Helpers
// const normalizeDateKey = (date: Date) =>
//   `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2,"0")}-${date.getDate().toString().padStart(2,"0")}`;

// const toISTString = (date: Date) => {
//   const pad = (n: number) => n.toString().padStart(2,"0");
//   return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
// };

// const BASE_URL = "http://192.168.11.131:8081"; // real API base

// export default function PlaybackDummy() {
//   const playback = usePlaybackStore();
//   const gridStore = usePlaybackGridStore();
//   const { layout, slotAssignments, assignCameraToSlot, clearAllSlots, resizeSlots } = gridStore;

//   const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
//   const [selectedDate, setSelectedDate] = useState<Date>(() => {
//     const today = new Date(); today.setHours(0,0,0,0); return today;
//   });
//   const [loadingCameraIds, setLoadingCameraIds] = useState<Set<string>>(new Set());
//   const [cameraErrors, setCameraErrors] = useState<Record<string,string>>({});
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);
//   const [segments, setSegments] = useState<any[]>([]);

//   const DAY_START = new Date(selectedDate); DAY_START.setHours(0,0,0,0);
//   const DAY_END = new Date(selectedDate); DAY_END.setHours(23,59,59,999);

//   const dateToPct = (d: Date) => ((d.getTime()-DAY_START.getTime())/(DAY_END.getTime()-DAY_START.getTime()))*100;

//   /* ------------------- TEST MODE / FAKE SEGMENTS ------------------- */
//   useEffect(() => {
//     if (!TEST_MODE) return;

//     const seg1Start = new Date(DAY_START.getTime() + 10 * 60 * 60 * 1000); // 10:00
//     const seg1End   = new Date(seg1Start.getTime() + 15 * 60 * 1000);     // 10:15

//     const seg2Start = new Date(DAY_START.getTime() + 11 * 60 * 60 * 1000); // 11:00
//     const seg2End   = new Date(seg2Start.getTime() + 30 * 60 * 1000);     // 11:30

//     const storeSegs = [
//       { startTime: seg1Start, endTime: seg1End },
//       { startTime: seg2Start, endTime: seg2End },
//     ];

//     usePlaybackStore.getState().setSegments(storeSegs);

//     setSegments([
//       { start: dateToPct(seg1Start), end: dateToPct(seg1End), type: "recording" },
//       { start: dateToPct(seg1End), end: dateToPct(seg2Start), type: "gap" },
//       { start: dateToPct(seg2Start), end: dateToPct(seg2End), type: "recording" },
//     ]);

//     // auto seek to first segment
//     usePlaybackStore.getState().seekToDate(seg1Start);
//   }, [selectedDate]);

//   /* ------------------- VIDEO SRC ------------------- */
//   const getVideoSrc = (cameraId: string) => {
//     if (TEST_MODE) return "/test.mp4"; // public/test.mp4 sample video
//     const key = `${cameraId}-${normalizeDateKey(selectedDate)}`;
//     return playersMap.get(key)?.blobUrl ?? "";
//   };

//   /* ------------------- HANDLE CAMERA DROP ------------------- */
//   const handleCameraDrop = async (cameraId: string, slotIndex: number) => {
//     setSelectedSlotIndex(slotIndex);
//     assignCameraToSlot(slotIndex, cameraId);

//     const store = usePlaybackStore.getState();
//     if (store.segments.length) {
//       store.seekToDate(store.segments[0].startTime);
//     }

//     store.setIsPlaying(true);
//   };

//   /* ------------------- SEEK TO DATE ------------------- */
//   const handleSeekToDate = (date: Date) => {
//     const store = usePlaybackStore.getState();
//     const segs = store.segments;

//     if (!segs.length) return;

//     const active =
//       segs.find(s => date >= s.startTime && date <= s.endTime) ||
//       segs.find(s => date < s.startTime);

//     if (!active) {
//       store.setIsPlaying(false);
//       store.setHasVideo(false);
//       return;
//     }

//     store.seekToDate(date < active.startTime ? active.startTime : date);
//   };

//   /* ------------------- RESIZE SLOTS ------------------- */
//   useEffect(() => resizeSlots(), [layout.rows, layout.cols]);

//   return (
//     <div className="flex flex-col h-full bg-background overflow-hidden">
//       <Sidebar />
//       <div className="ml-[80px] shrink-0">
//         <LiveViewToolbar
//           showCameraList
//           selectedLayout="2x2"
//           gridStore={gridStore}
//           showCustomGridBuilder={false}
//         />
//       </div>

//       <div className="flex flex-1 ml-[80px] gap-3 p-3 overflow-hidden">
//         <CameraTreeSidebar isVisible />
//         <PlaybackCameraGrid
//           selectedSlotIndex={selectedSlotIndex}
//           cameraSlots={slotAssignments}
//           getVideoSrc={getVideoSrc}
//           onCameraDrop={handleCameraDrop}
//           onSlotSelect={(i) => { setSelectedSlotIndex(i); setIsTimelineExpanded(true); }}
//           isCameraLoading={(id) => loadingCameraIds.has(id)}
//           cameraErrors={cameraErrors}
//           playback={playback}
//         />
//       </div>

//       <div className="shrink-0 z-50">
//         <PlaybackTimelineBar
//           isPlaying={playback.isPlaying}
//           speed={playback.speed}
//           currentTimestamp={playback.currentTimestamp}
//           playheadPosition={playback.playheadPosition}
//           isTimelineExpanded={isTimelineExpanded}
//           onToggleTimeline={() => setIsTimelineExpanded(p => !p)}
//           zoomLevel={zoomLevel}
//           onZoomChange={setZoomLevel}
//           onSeekToDate={handleSeekToDate}
//           onStop={() => { clearAllSlots(); playersMap.clear(); }}
//           isSynced={true}
//         />

//         <PlaybackTimeline
//           playheadPosition={playback.playheadPosition}
//           isExpanded={isTimelineExpanded}
//           onSeek={(pct) => {
//             const targetTime = new Date(DAY_START.getTime() + (pct/100)*(DAY_END.getTime()-DAY_START.getTime()));
//             handleSeekToDate(targetTime);
//           }}
//           zoomLevel={zoomLevel}
//           segments={segments}
//         />

//         <PlaybackAlertsBar />
//       </div>

//       {/* TEST MODE INDICATOR */}
//       {TEST_MODE && (
//         <div className="fixed top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
//           TEST MODE
//         </div>
//       )}
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CameraTreeSidebar, LiveViewToolbar } from "@/components/LiveView/PagesInclude";
import { PlaybackCameraGrid, PlaybackTimelineBar, PlaybackTimeline, PlaybackAlertsBar } from "@/components/Playback/PagesInclude";
import { usePlaybackStore } from "@/Store/playbackStore";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";
import { useHlsWithStore } from "@/hooks/useHlsWithStore";

/* ---------- Dummy Video / Timeline ---------- */
const DUMMY_VIDEO = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
const NUM_CAMERAS = 4;

export default function PlaybackDummy() {
  const playback = usePlaybackStore();
  const gridStore = usePlaybackGridStore();
  const { layout, slotAssignments, assignCameraToSlot, clearAllSlots, resizeSlots } = gridStore;

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);

  /* ---------- Dummy timeline segments (0-24H) ---------- */
  const [segments, setSegments] = useState<any[]>([]);

  useEffect(() => {
    // Example: 4 random recording segments
    const dummySegs = [];
    let cursor = 0;
    for (let i = 0; i < 4; i++) {
      const startPct = cursor + Math.random() * 10;
      const endPct = startPct + Math.random() * 15;
      if (startPct > 100) break;
      dummySegs.push({ start: startPct, end: Math.min(endPct, 100), type: "recording" });
      cursor = endPct + 5;
    }

    // add gaps automatically
    const uiSegs: any[] = [];
    let prev = 0;
    dummySegs.forEach(s => {
      if (s.start > prev) uiSegs.push({ start: prev, end: s.start, type: "gap" });
      uiSegs.push(s);
      prev = s.end;
    });
    if (prev < 100) uiSegs.push({ start: prev, end: 100, type: "gap" });

    setSegments(uiSegs);

    // Also update playback store segments
    const storeSegs = dummySegs.map(s => {
      const now = new Date();
      const startTime = new Date(now.getTime() + s.start*60*60*24*1000/100);
      const endTime = new Date(now.getTime() + s.end*60*60*24*1000/100);
      return { startTime, endTime };
    });
    usePlaybackStore.getState().setSegments(storeSegs);
  }, []);

  /* ---------- Handle Camera Drop (Dummy) ---------- */
  const handleCameraDrop = (cameraId: string, slotIndex: number) => {
    setSelectedSlotIndex(slotIndex);
    assignCameraToSlot(slotIndex, cameraId);

    const store = usePlaybackStore.getState();
    if (store.segments.length) store.seekToDate(store.segments[0].startTime);
    store.setIsPlaying(true);
  };

  /* ---------- Resize Slots on Layout Change ---------- */
  useEffect(() => resizeSlots(), [layout.rows, layout.cols]);

  /* ---------- Get Video Src for Slot (Dummy Test) ---------- */
  const getVideoSrc = (_cameraId: string) => DUMMY_VIDEO;

  /* ---------- Hook for HLS / Dummy Video ---------- */
  const { videoRef } = useHlsWithStore({
    src: DUMMY_VIDEO,
    cameraId: slotAssignments[selectedSlotIndex] ?? null,
    segments: usePlaybackStore.getState().segments,
    testModeSrc: DUMMY_VIDEO, // force test mode
    disableAutoSync: true,
  });

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <Sidebar />
      <div className="ml-[80px] shrink-0">
        <LiveViewToolbar
          showCameraList
          selectedLayout="2x2"
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
          onSlotSelect={(i) => { setSelectedSlotIndex(i); setIsTimelineExpanded(true); }}
          isCameraLoading={() => false}
          cameraErrors={{}}
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
          onToggleTimeline={() => setIsTimelineExpanded(p => !p)}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onSeekToDate={(d) => usePlaybackStore.getState().seekToDate(d)}
          onStop={() => { clearAllSlots(); }}
          isSynced={true}
        />

        <PlaybackTimeline
          playheadPosition={playback.playheadPosition}
          isExpanded={isTimelineExpanded}
          onSeek={(pct) => {
            const start = new Date(); // today
            const end = new Date();
            end.setHours(23,59,59,999);
            const targetTime = new Date(start.getTime() + (pct/100)*(end.getTime()-start.getTime()));
            usePlaybackStore.getState().seekToDate(targetTime);
          }}
          zoomLevel={zoomLevel}
          segments={segments}
        />

        <PlaybackAlertsBar />
      </div>
    </div>
  );
}