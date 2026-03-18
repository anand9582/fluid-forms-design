  // File: pages/playback/index.tsx
  import React, { useEffect, useState, useMemo } from "react";
  import { Sidebar } from "@/components/dashboard/Sidebar";
  import { CameraTreeSidebar, LiveViewToolbar } from "@/components/LiveView/PagesInclude";
  import { PlaybackCameraGrid, PlaybackTimelineBar, PlaybackAlertsBar } from "@/components/Playback/PagesInclude";
  import { usePlaybackStore } from "@/Store/playbackStore";
  import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";
  import { PlaybackTimeline, SegmentHour } from "@/components/Playback/PlaybackTimeline";
  import { SidebarCameraStore } from "@/Store/SidebarCameraStore";
  import axios from "axios";
  import { API_BASE_URL, getAuthHeaders } from "@/components/Config/api";
  import { PlaybackBookmark } from "@/components/Playback/PlaybackBookmarkPopover";
  import { toISTISOString } from "@/components/Utils/Time";

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
    const { layout, slotAssignments, assignCameraToSlot, resizeSlots } = gridStore;
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
    const [loadingSlots, setLoadingSlots] = useState<Set<number>>(new Set());
    const [slotErrors, setSlotErrors] = useState<Record<number, string>>({});
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isTimelineExpanded, setIsTimelineExpanded] = useState(true);
    const [segmentsPerSlot, setSegmentsPerSlot] = useState<Record<number, SegmentHour[]>>({});
    const [bookmarksPerSlot, setBookmarksPerSlot] = useState<Record<number, PlaybackBookmark[]>>({});
    const [rawSegmentsPerSlot, setRawSegmentsPerSlot] = useState<Record<number, RawSegment[]>>({});
    const [showCameraList, setShowCameraList] = useState(true);
    const [selectedLayout, setSelectedLayout] = useState<string>("grid"); 

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

  const fetchBookmarksForSlot = async (slotIndex: number) => {
    const cameraId = slotAssignments[slotIndex];

    if (!cameraId) {
      console.warn(`No camera assigned to slot ${slotIndex}`);
      return;
    }

      const from = new Date(selectedDate);
      from.setHours(0, 0, 0, 0);

      const to = new Date(selectedDate);
      to.setHours(23, 59, 59, 999);

      const fromDate = toISTISOString(from);
      const toDate = toISTISOString(to);


    try {
      const res = await axios.get(`http://192.168.10.190:8090/api/bookmarks/bookmarkList`, {
        params: { cameraId, fromDate, toDate },
        headers: getAuthHeaders(),
      });

      console.log("✅ API response received for bookmarks:", res.data);

      const rawList = res.data?.data || res.data || [];
      const normalized: PlaybackBookmark[] = (Array.isArray(rawList) ? rawList : []).map((b: any) => ({
        ...b,
        position: b.position ?? (b.bookmarkTime ? new Date(b.bookmarkTime).getTime() : undefined),
      }));
      setBookmarksPerSlot(prev => ({ ...prev, [slotIndex]: normalized }));
    } catch (err: any) {
      console.error("❌ Failed to fetch bookmarks");

      if (err.response) {
        // Server responded with an error
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      } else if (err.request) {
        // Request was made but no response received
        console.error("No response received. Request details:", err.request);
      } else {
        // Something else happened
        console.error("Error setting up request:", err.message);
      }
    }
  };

    const dateToHour = (d: Date) =>
      ((d.getTime() - DAY_START.getTime()) / (DAY_END.getTime() - DAY_START.getTime())) * 24;

    /* =========================================================
      FETCH TIMELINE PER SLOT
    ========================================================= */
    const fetchTimelineForSlot = async (slotIndex: number, cameraId: string) => {
      setLoadingSlots(prev => new Set(prev).add(slotIndex));
      setSlotErrors(prev => ({ ...prev, [slotIndex]: "" }));

      try {
        const res = await fetch(
          `${BASE_URL}/api/playback/hls/timeline?cameraId=${cameraId}&fromDate=${toISTString(DAY_START)}&toDate=${toISTString(DAY_END)}`
        );
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
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

        setSegmentsPerSlot(prev => ({ ...prev, [slotIndex]: uiSegments }));
        setRawSegmentsPerSlot(prev => ({ ...prev, [slotIndex]: rawSegments }));

        return uiSegments;
      } catch (err: any) {
        setSlotErrors(prev => ({ ...prev, [slotIndex]: err.message || "Timeline fetch error" }));
        return [];
      } finally {
        setLoadingSlots(prev => {
          const copy = new Set(prev);
          copy.delete(slotIndex);
          return copy;
        });
      }
    };

    /* =========================================================
      START CAMERA PER SLOT
    ========================================================= */
    const startCamera = async (cameraId: string, slotIndex: number): Promise<string | null> => {
      setLoadingSlots(prev => new Set(prev).add(slotIndex));
      setSlotErrors(prev => ({ ...prev, [slotIndex]: "" }));

      try {
        const res = await fetch(`${BASE_URL}/api/playback/hls/playlist/${cameraId}?start=${toISTString(DAY_START)}&end=${toISTString(DAY_END)}`);
        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.message || `HTTP error ${res.status}`);
        }

        const json = await res.json();
        if (!json?.data?.playlist) throw new Error("No recording available");

        const blob = new Blob([json.data.playlist], { type: "application/vnd.apple.mpegurl" });
        const blobUrl = URL.createObjectURL(blob);

        setPlayers(prev => [
          ...prev.filter(p => p.slotIndex !== slotIndex),
          { slotIndex, cameraId, blobUrl, sessionId: json.data.sessionId, date: selectedDate }
        ]);

        return blobUrl;
      } catch (err: any) {
        setSlotErrors(prev => ({ ...prev, [slotIndex]: err.message || "Camera start error" }));
        return null;
      } finally {
        setLoadingSlots(prev => {
          const copy = new Set(prev);
          copy.delete(slotIndex);
          return copy;
        });
      }
    };

    const getVideoSrc = (slotIndex: number) =>
      players.find(p => p.slotIndex === slotIndex && p.date.toDateString() === selectedDate.toDateString())?.blobUrl || "";

    /* =========================================================
      HANDLE CAMERA DROP
    ========================================================= */
    const handleCameraDrop = async (cameraId: string, slotIndex: number) => {
    console.log(`Dropping camera ${cameraId} into slot ${slotIndex}`);

    assignCameraToSlot(slotIndex, cameraId);
    console.log(`Camera ${cameraId} assigned to slot ${slotIndex}`);

    try {
      // Fetch timeline for this specific slot ONLY
      const segments = await fetchTimelineForSlot(slotIndex, cameraId);
      console.log(`Fetched timeline for slot ${slotIndex}:`, segments);

      if (!segments || segments.length === 0) {
        console.warn(`No recordings found for camera ${cameraId} in slot ${slotIndex}`);
        throw new Error("No recordings found");
      }

      // Start camera for this specific slot ONLY
      const blobUrl = await startCamera(cameraId, slotIndex);
      console.log(`Camera ${cameraId} started in slot ${slotIndex}, blobUrl:`, blobUrl);

      if (!blobUrl) return;

      // Find first recording and seek to it for this slot ONLY
      const firstRecording = segments.find(s => s.type === "recording");
      if (firstRecording) {
        const seekDate = new Date(selectedDate);
        const hour = Math.floor(firstRecording.start);
        const minutes = Math.floor((firstRecording.start % 1) * 60);
        seekDate.setHours(hour, minutes, 0, 0);
        console.log(`Seeking slot ${slotIndex} to`, seekDate);
        playback.seekTo(seekDate, slotIndex);
      }

      // Update selected slot ONLY after successful setup
      setSelectedSlot(slotIndex);
      console.log(`Selected slot set to ${slotIndex}`);

      // Fetch bookmarks for this slot
      await fetchBookmarksForSlot(slotIndex);
      console.log(`Fetched bookmarks for slot ${slotIndex}`);

      // Start playback automatically
      playback.play();
      console.log(`Playback started for slot ${slotIndex}`);

    } catch (err: any) {
      console.error(`Error in slot ${slotIndex}:`, err);
      setSlotErrors(prev => ({ ...prev, [slotIndex]: err.message || "Drop error" }));
    }
  };

    /* =========================================================
      SEEK HANDLER (PER SLOT)
    ========================================================= */
    const handleSeek = (absHour: number, slotIndex?: number) => {
      if (slotIndex === undefined) return;
      const slotSegments = segmentsPerSlot[slotIndex] || [];
      const recordings = slotSegments.filter(s => s.type === "recording");
      if (!recordings.length) return;

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

      playback.seekTo(seekDate, slotIndex);
    };

    const playheadHour = useMemo(() => {
      if (playback.isSync) return dateToHour(playback.globalTime);
      if (selectedSlot !== null) {
        const t = playback.cameraTimes[selectedSlot] || playback.globalTime;
        return dateToHour(t);
      }
      return dateToHour(playback.globalTime);
    }, [playback.globalTime, playback.cameraTimes, playback.isSync, selectedSlot]);

    useEffect(() => {
      if (selectedSlot !== null) {
        fetchBookmarksForSlot(selectedSlot);
      }
    }, [selectedSlot, selectedDate, slotAssignments]);

    /* =========================================================
      INITIALIZE ASSIGNED CAMERAS
    ========================================================= */
    useEffect(() => {
      slotAssignments.forEach(async (cameraId, slotIndex) => {
        if (!cameraId) return;
        await fetchTimelineForSlot(slotIndex, cameraId);
        await startCamera(cameraId, slotIndex);
      });
    }, [selectedDate, slotAssignments]);

    /* =========================================================
      CAMERA NAMES
    ========================================================= */
    const cameraNames = useMemo(() => {
      const map: Record<number, string> = {};
      slotAssignments.forEach((cameraId, slotIndex) => {
        if (!cameraId) return;
        const camera = cameras.find(c => c.cameraId === cameraId);
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
    const totalSlots = layout.rows * layout.cols;
    setSegmentsPerSlot(prev => {
      const cleaned: typeof prev = {};
      Object.entries(prev).forEach(([slot, seg]) => {
        if (Number(slot) < totalSlots) cleaned[Number(slot)] = seg;
      });
      return cleaned;
    });

    setRawSegmentsPerSlot(prev => {
      const cleaned: typeof prev = {};
      Object.entries(prev).forEach(([slot, seg]) => {
        if (Number(slot) < totalSlots) cleaned[Number(slot)] = seg;
      });
      return cleaned;
    });

    setSlotErrors(prev => {
      const cleaned: typeof prev = {};
      Object.entries(prev).forEach(([slot, err]) => {
        if (Number(slot) < totalSlots) cleaned[Number(slot)] = err;
      });
      return cleaned;
    });

    setLoadingSlots(prev => {
      const cleaned = new Set<number>();
      prev.forEach(slot => {
        if (slot < totalSlots) cleaned.add(slot);
      });
      return cleaned;
    });

  }, [layout.rows, layout.cols, resizeSlots]);


    const handleTimelineAddBookmark = async (slotIndex: number, position: number) => {
      const camId = slotAssignments[slotIndex];
      if (!camId) return;

      const name = `Bookmark ${new Date(position).toLocaleTimeString()}`;
      const bookmarkTime = toISTISOString(new Date(position));

      try {
        const res = await axios.post(`http://192.168.10.190:8090/api/bookmarks/addBookmark`, {
          cameraId: camId,
          bookmarkTime,
          title: name,
          note: "Auto bookmark",
          createdBy: 101,
        }, { headers: getAuthHeaders() });

        const newBookmark: PlaybackBookmark = {
          id: res.data?.id || res.data?.data?.id || Math.random().toString(),
          cameraId: camId,
          name,
          title: name,
          position,
          timestamp: bookmarkTime,
          bookmarkTime,
          createdAt: new Date(),
        };

        setBookmarksPerSlot(prev => ({
          ...prev,
          [slotIndex]: [...(prev[slotIndex] || []), newBookmark]
        }));
      } catch (err) {
        console.error("Failed to add bookmark", err);
      }
    };

    const handleTimelineRemoveBookmark = async (id: string, camId: string) => {
      if (selectedSlot === null) return;

      try {
        await axios.delete(`http://192.168.10.190:8090/api/bookmarks/deleteBookmark/${id}`, { headers: getAuthHeaders() });

        setBookmarksPerSlot(prev => ({
          ...prev,
          [selectedSlot]: (prev[selectedSlot] || []).filter(b => b.id.toString() !== id.toString())
        }));
      } catch (err) {
        console.error("Failed to remove bookmark", err);
      }
    };

  const handleSeekToDate = (date: Date) => {
    const isSameDay =
      selectedDate.toDateString() === date.toDateString();

    if (!isSameDay) {
      setSelectedDate(date);
    }

    playback.seekTo(date, selectedSlot ?? undefined);
  };

  const handleJumpToBookmark = (position: number) => {
    const date = new Date(position);
    playback.seekTo(date, selectedSlot ?? undefined);
    playback.play();
  };

    return (
      <div className="flex flex-col h-full bg-background overflow-hidden">
        <Sidebar />
        <div className="ml-[80px] shrink-0">
        
          <LiveViewToolbar
            showCameraList={showCameraList}
            onToggleCameraList={() => setShowCameraList(!showCameraList)}
            selectedLayout={selectedLayout}
            onLayoutChange={(layout) => setSelectedLayout(layout)}
            gridStore={gridStore}
            mode="playback"
          />
        </div>

        <div className="flex flex-1 ml-[80px] gap-3 p-3 overflow-hidden">
            <CameraTreeSidebar
              isVisible={showCameraList}
            />
          <PlaybackCameraGrid
            selectedSlot={selectedSlot}
            onSlotSelect={setSelectedSlot}
            getVideoSrc={getVideoSrc}
            onCameraDrop={handleCameraDrop}
            isCameraLoading={(slotIndex) => loadingSlots.has(slotIndex)}
            rawSegmentsPerSlot={rawSegmentsPerSlot}
            slotErrors={slotErrors}
          />
        </div>

        <div className="shrink-0 z-50 bg-white">
          <PlaybackTimelineBar
            cameraId={slotAssignments[selectedSlot!]}
            bookmarks={bookmarksPerSlot[selectedSlot!] || []}
            isTimelineExpanded={isTimelineExpanded}
            onToggleTimeline={() => setIsTimelineExpanded(p => !p)}
            zoomLevel={zoomLevel}
            onFastForward={handleFastForward}
            onRewind={handleRewind}
            onSkipBack={handleSkipBack}
            onSkipForward={handleSkipForward}
            onZoomChange={setZoomLevel}
            onSeekToDate={handleSeekToDate}
            onAddBookmark={(name, position, timestamp, camId) => {
              if (selectedSlot !== null) handleTimelineAddBookmark(selectedSlot, position);
            }}
            onRemoveBookmark={handleTimelineRemoveBookmark}
            onJumpToBookmark={handleJumpToBookmark}
          />

          <PlaybackTimeline
            isExpanded={isTimelineExpanded}
            zoomLevel={zoomLevel}
            segmentsPerSlot={segmentsPerSlot}
            slotCount={slotAssignments.length}
            onSeek={handleSeek}
            cameraNames={cameraNames}
            cameraIds={slotAssignments}
            bookmarksPerSlot={bookmarksPerSlot}
            timelineDate={selectedDate}
          />

          <PlaybackAlertsBar />
        </div>
      </div>
    );
  }