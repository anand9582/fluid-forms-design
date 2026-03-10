  import React, { useEffect, useState, useMemo } from "react";
  import { Sidebar } from "@/components/dashboard/Sidebar";
  import { CameraTreeSidebar, LiveViewToolbar } from "@/components/LiveView/PagesInclude";
  import { PlaybackCameraGrid, PlaybackTimelineBar, PlaybackAlertsBar } from "@/components/Playback/PagesInclude";
  import { usePlaybackStore } from "@/Store/playbackStore";
  import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";
  import { PlaybackTimeline, SegmentHour } from "@/components/Playback/PlaybackTimeline";
  import { SidebarCameraStore } from "@/Store/SidebarCameraStore";

  /* =========================================================
    TYPES
  ========================================================= */
  interface Player {
    slotIndex: number;
    cameraId: string;
    blobUrl: string;
    sessionId: string;
    date: Date;
  }

  interface RawSegment {
    startTime: Date;
    endTime: Date;
    type?: "recording" | "motion" | "alarm";
  }

  /* =========================================================
    COMPONENT
  ========================================================= */
  export default function Index() {
    const playback = usePlaybackStore();
    const gridStore = usePlaybackGridStore();
    const { layout, slotAssignments, assignCameraToSlot, clearAllSlots, resizeSlots } = gridStore;
    const cameras = SidebarCameraStore((s) => s.cameras);
    const BASE_URL = "http://192.168.10.190:8090";

    /* ---------------- LOCAL STATE ---------------- */
    const [selectedSlot, setSelectedSlot] = useState<number | null>(0);
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

    /* =========================================================
      DAY RANGE HELPERS
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
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
        date.getHours()
      )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    };

    const dateToHour = (d: Date) =>
      ((d.getTime() - DAY_START.getTime()) / (DAY_END.getTime() - DAY_START.getTime())) * 24;

    /* =========================================================
      FETCH TIMELINE
    ========================================================= */
    const fetchTimelineForSlot = async (slotIndex: number, cameraId: string) => {
      try {
        setLoadingCameraIds((p) => new Set(p.add(cameraId)));
        const res = await fetch(
          `${BASE_URL}/api/playback/hls/timeline?cameraId=${cameraId}&fromDate=${toISTString(
            DAY_START
          )}&toDate=${toISTString(DAY_END)}`
        );
        const json = await res.json();

        let cursor = DAY_START;
        const uiSegments: SegmentHour[] = [];
        const rawSegments: RawSegment[] = [];

        json.data.forEach((s: any) => {
          const st = new Date(Math.max(new Date(s.startTime).getTime(), DAY_START.getTime()));
          const et = new Date(Math.min(new Date(s.endTime).getTime(), DAY_END.getTime()));
          if (et <= st) return;

          rawSegments.push({ startTime: st, endTime: et, type: s.type || "recording" });

          if (st > cursor) uiSegments.push({ start: dateToHour(cursor), end: dateToHour(st), type: "gap" });

          uiSegments.push({ start: dateToHour(st), end: dateToHour(et), type: "recording" });

          cursor = et;
        });

        if (cursor < DAY_END) uiSegments.push({ start: dateToHour(cursor), end: 24, type: "gap" });

        setSegmentsPerSlot((p) => ({ ...p, [slotIndex]: uiSegments }));
        setRawSegmentsPerSlot((p) => ({ ...p, [slotIndex]: rawSegments }));

        return uiSegments;
      } catch (e: any) {
        console.error("Timeline fetch error", e);
        setCameraErrors((p) => ({ ...p, [cameraId]: e.message }));
        return [];
      } finally {
        setLoadingCameraIds((p) => {
          const setCopy = new Set(p);
          setCopy.delete(cameraId);
          return setCopy;
        });
      }
    };

    /* =========================================================
      START CAMERA (HLS)
    ========================================================= */
    const startCamera = async (cameraId: string, slotIndex: number): Promise<string | null> => {
      const apiUrl = `${BASE_URL}/api/playback/hls/playlist/${cameraId}?start=${toISTString(
        DAY_START
      )}&end=${toISTString(DAY_END)}`;
      try {
        const res = await fetch(apiUrl);
        const json = await res.json();
        if (!json?.data?.playlist) throw new Error("No recording");

        const blob = new Blob([json.data.playlist], { type: "application/vnd.apple.mpegurl" });
        const blobUrl = URL.createObjectURL(blob);

        setPlayers((prev) => [
          ...prev.filter((p) => p.slotIndex !== slotIndex),
          { slotIndex, cameraId, blobUrl, sessionId: json.data.sessionId, date: selectedDate },
        ]);

        return blobUrl;
      } catch (err: any) {
        setCameraErrors((p) => ({ ...p, [cameraId]: err.message }));
        return null;
      }
    };

    const getVideoSrc = (slotIndex: number) =>
      players.find(
        (p) =>
          p.slotIndex === slotIndex &&
          p.date.toDateString() === selectedDate.toDateString()
      )?.blobUrl || "";

    /* =========================================================
      CAMERA DROP
    ========================================================= */
    const handleCameraDrop = async (cameraId: string, slotIndex: number) => {
      assignCameraToSlot(slotIndex, cameraId);
      setSelectedSlot(slotIndex);

      const segments = await fetchTimelineForSlot(slotIndex, cameraId);
      const blobUrl = await startCamera(cameraId, slotIndex);
      if (!blobUrl) return;

      // 🔥 first recording segment
      const firstRecording = segments?.find((s: any) => s.type === "recording");
      if (firstRecording) {
        const seekDate = new Date(selectedDate);
        const hour = Math.floor(firstRecording.start);
        const minutes = Math.floor((firstRecording.start % 1) * 60);
        seekDate.setHours(hour, minutes, 0, 0);
        playback.seekTo(seekDate);
      }
      playback.play();
    };

    /* =========================================================
      SEEK HANDLER
    ========================================================= */
  const handleSeek = (absHour: number, slotIndex?: number) => {
    if (!playback.isSync && slotIndex === undefined) return;

    const seekSlot = slotIndex ?? selectedSlot;

    if (!playback.isSync && seekSlot !== undefined) {
      const slotSegments = segmentsPerSlot[seekSlot] || [];
      const recordings = slotSegments.filter((s) => s.type === "recording");
      if (!recordings.length) return;

      // nearest recording find
      let nearest = recordings[0];
      let minDist = Math.min(Math.abs(absHour - nearest.start), Math.abs(absHour - nearest.end));

      for (const s of recordings) {
        const dist = Math.min(Math.abs(absHour - s.start), Math.abs(absHour - s.end));
        if (dist < minDist) {
          nearest = s;
          minDist = dist;
        }
      }

      const clampedHour = Math.max(nearest.start, Math.min(absHour, nearest.end));
      const seekDate = new Date(selectedDate);
      seekDate.setHours(Math.floor(clampedHour));
      seekDate.setMinutes(Math.floor((clampedHour % 1) * 60));
      seekDate.setSeconds(Math.floor((clampedHour * 3600) % 60));

      playback.seekTo(seekDate, seekSlot); // ✅ important
      return;
    }

    // Sync mode
    const seekDate = new Date(selectedDate);
    const clampedHour = Math.max(0, Math.min(absHour, 24));
    seekDate.setHours(Math.floor(clampedHour));
    seekDate.setMinutes(Math.floor((clampedHour % 1) * 60));
    seekDate.setSeconds(Math.floor((clampedHour * 3600) % 60));
    playback.seekTo(seekDate);
  };

  const playheadHour = useMemo(() => {
    if (playback.isSync) return dateToHour(playback.globalTime);

    if (selectedSlot !== null) {
      const t =
        playback.cameraTimes[selectedSlot] || playback.globalTime;
      return dateToHour(t);
    }

    return dateToHour(playback.globalTime);
  }, [playback.globalTime, playback.cameraTimes, playback.isSync, selectedSlot]);

    /* =========================================================
      INITIALIZE ALL ASSIGNED CAMERAS
    ========================================================= */
    useEffect(() => {
      slotAssignments.forEach(async (cameraId, slotIndex) => {
        if (!cameraId) return;
        const segments = await fetchTimelineForSlot(slotIndex, cameraId);
        const blobUrl = await startCamera(cameraId, slotIndex);
        if (blobUrl && slotIndex === selectedSlot) playback.play();
      });
    }, [selectedDate]);

    /* =========================================================
      CAMERA NAMES
    ========================================================= */
    const cameraNames = useMemo(() => {
      const map: Record<number, string> = {};
      slotAssignments.forEach((cameraId, slotIndex) => {
        if (!cameraId) return;
        const camera = cameras.find((c) => c.cameraId === cameraId);
        map[slotIndex] = camera ? camera.name : cameraId;
      });
      return map;
    }, [slotAssignments, cameras]);

    /* =========================================================
      PLAYBACK CONTROLS
    ========================================================= */
    const handleFastForward = () => {
      const speeds = [1, 2, 4, 8, 16, 36];
      const idx = speeds.indexOf(playback.playbackSpeed);
      playback.setSpeed(speeds[idx + 1] ?? 36);
    };

    const handleRewind = () => playback.seekBySeconds(-5);
    const handleSkipBack = () => playback.seekBySeconds(-10);
    const handleSkipForward = () => playback.seekBySeconds(10);

    /* =========================================================
      GRID RESIZE
    ========================================================= */
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
          selectedSlot={selectedSlot}
            onSlotSelect={setSelectedSlot}
            getVideoSrc={getVideoSrc}
            onCameraDrop={handleCameraDrop}
            isCameraLoading={(id) => loadingCameraIds.has(id)}
            rawSegmentsPerSlot={rawSegmentsPerSlot}
          />
        </div>

        <div className="shrink-0 z-50 bg-white">
          <PlaybackTimelineBar
            isTimelineExpanded={isTimelineExpanded}
            onToggleTimeline={() => setIsTimelineExpanded((p) => !p)}
            zoomLevel={zoomLevel}
            onFastForward={handleFastForward}
            onRewind={handleRewind}
            onSkipBack={handleSkipBack}
            onSkipForward={handleSkipForward}
            onZoomChange={setZoomLevel}
            onSeekToDate={(d) => setSelectedDate(d)}
          />

          <PlaybackTimeline
            isExpanded={isTimelineExpanded}
            zoomLevel={zoomLevel}
            playheadPosition={playheadHour}
            segmentsPerSlot={segmentsPerSlot}
            slotCount={slotAssignments.length}
            onSeek={handleSeek}
            cameraNames={cameraNames}
          />

          <PlaybackAlertsBar />
        </div>
      </div>
    );
  }