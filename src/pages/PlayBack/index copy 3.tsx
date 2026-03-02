import React, { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  CameraTreeSidebar,
  LiveViewToolbar,
} from "@/components/LiveView/PagesInclude";
import {
  PlaybackCameraGrid,
  PlaybackTimeline,
  PlaybackTimelineBar,
  PlaybackAlertsBar,
} from "@/components/Playback/PagesInclude";
import { usePlaybackStore } from "@/Store/playbackStore";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";

/* ---------------- HELPERS ---------------- */
const normalizeDateKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

const DUMMY_VIDEO_SRC =
  "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";

/* ---------------- DUMMY SEGMENTS ---------------- */
const getDummySegments = (dayStart: Date) => [
  {
    startTime: new Date(dayStart.getTime() + 10 * 60 * 1000),
    endTime: new Date(dayStart.getTime() + 40 * 60 * 1000),
  },
  {
    startTime: new Date(dayStart.getTime() + 90 * 60 * 1000),
    endTime: new Date(dayStart.getTime() + 120 * 60 * 1000),
  },
  {
    startTime: new Date(dayStart.getTime() + 4 * 60 * 60 * 1000),
    endTime: new Date(dayStart.getTime() + 5 * 60 * 60 * 1000),
  },
];

/* ---------------- GLOBAL CACHE ---------------- */
const playersMap = new Map<string, { blobUrl: string }>();

/* ================== COMPONENT ================== */
export default function PlaybackDummy() {
  const playback = usePlaybackStore();
  const gridStore = usePlaybackGridStore();
  const { slotAssignments, assignCameraToSlot, clearAllSlots, resizeSlots, layout } =
    gridStore;

  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [segmentsUI, setSegmentsUI] = useState<any[]>([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);

  /* ---------------- DATE ---------------- */
  const selectedDate = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const DAY_START = selectedDate;
  const DAY_END = useMemo(
    () => new Date(DAY_START.getTime() + 24 * 60 * 60 * 1000),
    [DAY_START]
  );
  const DAY_DURATION = DAY_END.getTime() - DAY_START.getTime();

  /* ---------------- PLAYHEAD ---------------- */
  const playheadTime = playback.playheadTime;

  const playheadPosition = useMemo(() => {
    return (
      ((playheadTime.getTime() - DAY_START.getTime()) / DAY_DURATION) * 100
    );
  }, [playheadTime, DAY_START, DAY_DURATION]);

  /* ---------------- GENERATE SEGMENTS UI ---------------- */
  useEffect(() => {
    const segs = getDummySegments(DAY_START);
    playback.setSegments(segs);

    let cursor = DAY_START;
    const ui: any[] = [];

    segs.forEach((s) => {
      if (s.startTime > cursor) {
        ui.push({
          start:
            ((cursor.getTime() - DAY_START.getTime()) / DAY_DURATION) * 100,
          end:
            ((s.startTime.getTime() - DAY_START.getTime()) / DAY_DURATION) *
            100,
          type: "gap",
        });
      }

      ui.push({
        start:
          ((s.startTime.getTime() - DAY_START.getTime()) / DAY_DURATION) *
          100,
        end:
          ((s.endTime.getTime() - DAY_START.getTime()) / DAY_DURATION) * 100,
        type: "recording",
      });

      cursor = s.endTime;
    });

    if (cursor < DAY_END) {
      ui.push({
        start:
          ((cursor.getTime() - DAY_START.getTime()) / DAY_DURATION) * 100,
        end: 100,
        type: "gap",
      });
    }

    setSegmentsUI(ui);
  }, [DAY_START, DAY_DURATION]);

  /* ---------------- CAMERA ---------------- */
  const startCamera = async (cameraId: string) => {
    const key = `${cameraId}-${normalizeDateKey(selectedDate)}`;
    if (playersMap.has(key)) return;
    playersMap.set(key, { blobUrl: DUMMY_VIDEO_SRC });
  };

  const getVideoSrc = (cameraId: string) => {
    const key = `${cameraId}-${normalizeDateKey(selectedDate)}`;
    return playersMap.get(key)?.blobUrl ?? "";
  };

  /* ---------------- DROP ---------------- */
  const handleCameraDrop = async (cameraId: string, slotIndex: number) => {
    setSelectedSlotIndex(slotIndex);
    await startCamera(cameraId);
    assignCameraToSlot(slotIndex, cameraId);

    const first = playback.segments[0];
    if (first) {
      playback.seekTo(first.startTime);
      playback.play();
    }
  };

  /* ---------------- SEEK (ABS % → DATE) ---------------- */
  const handleSeekPct = (absPct: number) => {
    const date = new Date(
      DAY_START.getTime() + (absPct / 100) * DAY_DURATION
    );

    const segs = playback.segments;
    if (!segs.length) return;

    const active =
      segs.find((s) => date >= s.startTime && date <= s.endTime) ||
      segs.find((s) => date < s.startTime);

    if (!active) return;

    const safe = date < active.startTime ? active.startTime : date;
    playback.seekTo(safe);
  };

  /* ---------------- GRID ---------------- */
  useEffect(() => {
    resizeSlots();
  }, [layout.rows, layout.cols]);

  /* ================== UI ================== */
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Sidebar />

      <div className="ml-[80px]">
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
          onSlotSelect={setSelectedSlotIndex}
          playback={playback}
        />
      </div>

      <div className="shrink-0 z-50">
        <PlaybackTimelineBar
          isPlaying={playback.isPlaying}
          speed={playback.speed}
          currentTimestamp={playheadTime}
          playheadPosition={playheadPosition}
          isTimelineExpanded={isTimelineExpanded}
          onToggleTimeline={() => setIsTimelineExpanded((p) => !p)}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          onStop={() => {
            clearAllSlots();
            playersMap.clear();
          }}
          isSynced
        />

        <PlaybackTimeline
          playheadPosition={playheadPosition}
          isExpanded={isTimelineExpanded}
          zoomLevel={zoomLevel}
          segments={segmentsUI}
          onSeek={handleSeekPct}
        />

        <PlaybackAlertsBar />
      </div>
    </div>
  );
}