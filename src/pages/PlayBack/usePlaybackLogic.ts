import { useState, useEffect, useCallback, useMemo } from "react";
import { usePlaybackStore } from "@/Store/playbackStore";
import usePlaybackGridStore from "@/Store/UsePlaybackGridStore";
import { SidebarCameraStore } from "@/Store/SidebarCameraStore";
import axios from "axios";
import { toISTISOString } from "@/components/Utils/Time";
import {
  Player,
  RawSegment,
  SegmentHour,
  PlaybackBookmark,
  PlaybackState,
} from "./types";
import { APISERVERURL } from "@/components/Config/api";

const BOOKMARK_API = `${APISERVERURL}api/bookmarks`;
const PLAYBACK_API = `${APISERVERURL}api/playback`;

export function usePlaybackLogic(
  getAuthHeaders: () => Record<string, string>
) {
  const playback = usePlaybackStore();
  const gridStore = usePlaybackGridStore();
  const { slotAssignments } = gridStore;
  const cameras = SidebarCameraStore((s) => s.cameras);

  // State
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
  const [segmentsPerSlot, setSegmentsPerSlot] = useState<
    Record<number, SegmentHour[]>
  >({});
  const [bookmarksPerSlot, setBookmarksPerSlot] = useState<
    Record<number, PlaybackBookmark[]>
  >({});
  const [rawSegmentsPerSlot, setRawSegmentsPerSlot] = useState<
    Record<number, RawSegment[]>
  >({});
  const [showCameraList, setShowCameraList] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState<string>("grid");

  // Day range helpers
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

  const toISTString = useCallback(
    (date: Date) => {
      const pad = (n: number) => n.toString().padStart(2, "0");
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds()
      )}`;
    },
    []
  );

  const dateToHour = useCallback(
    (d: Date) =>
      ((d.getTime() - DAY_START.getTime()) /
        (DAY_END.getTime() - DAY_START.getTime())) *
      24,
    [DAY_START, DAY_END]
  );

  // Fetch bookmarks for a slot
  const fetchBookmarksForSlot = useCallback(
    async (slotIndex: number) => {
      const cameraId = slotAssignments[slotIndex];

      if (!cameraId) {
        console.warn(`No camera assigned to slot ${slotIndex}`);
        return;
      }

      const fromDate = toISTISOString(DAY_START);
      const toDate = toISTISOString(DAY_END);

      try {
        const res = await axios.get(
          `${BOOKMARK_API}/bookmarkList`,
          {
            params: { cameraId, fromDate, toDate },
            headers: getAuthHeaders(),
          }
        );

        console.log("✅ API response received for bookmarks:", res.data);

        const rawList = res.data?.data || res.data || [];
        const normalized: PlaybackBookmark[] = (Array.isArray(rawList)
          ? rawList
          : []
        ).map((b: any) => ({
          ...b,
          position: b.position ??
            (b.bookmarkTime ? new Date(b.bookmarkTime).getTime() : undefined),
        }));
        setBookmarksPerSlot((prev) => ({
          ...prev,
          [slotIndex]: normalized,
        }));
      } catch (err: any) {
        console.error("❌ Failed to fetch bookmarks");
      }
    },
    [slotAssignments, DAY_START, DAY_END, toISTISOString, getAuthHeaders]
  );

  // Fetch timeline for a slot
  const fetchTimelineForSlot = useCallback(
    async (slotIndex: number, cameraId: string) => {
      setLoadingSlots((prev) => new Set(prev).add(slotIndex));
      setSlotErrors((prev) => ({ ...prev, [slotIndex]: "" }));

      try {
        const res = await fetch(
          `${PLAYBACK_API}/hls/timeline?cameraId=${cameraId}&fromDate=${toISTString(
            DAY_START
          )}&toDate=${toISTString(DAY_END)}`
        );
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();

        let cursor = DAY_START;
        const uiSegments: SegmentHour[] = [];
        const rawSegments: RawSegment[] = [];

        json.data.forEach((s: any) => {
          const st = new Date(
            Math.max(new Date(s.startTime).getTime(), DAY_START.getTime())
          );
          const et = new Date(
            Math.min(new Date(s.endTime).getTime(), DAY_END.getTime())
          );
          if (et <= st) return;

          rawSegments.push({
            startTime: st,
            endTime: et,
            type: s.type || "recording",
          });

          if (st > cursor)
            uiSegments.push({
              start: dateToHour(cursor),
              end: dateToHour(st),
              type: "gap",
            });
          uiSegments.push({
            start: dateToHour(st),
            end: dateToHour(et),
            type: "recording",
          });

          cursor = et;
        });

        if (cursor < DAY_END)
          uiSegments.push({
            start: dateToHour(cursor),
            end: 24,
            type: "gap",
          });

        setSegmentsPerSlot((prev) => ({ ...prev, [slotIndex]: uiSegments }));
        setRawSegmentsPerSlot((prev) => ({ ...prev, [slotIndex]: rawSegments }));

        return uiSegments;
      } catch (err: any) {
        setSlotErrors((prev) => ({
          ...prev,
          [slotIndex]: err.message || "Timeline fetch error",
        }));
        return [];
      } finally {
        setLoadingSlots((prev) => {
          const copy = new Set(prev);
          copy.delete(slotIndex);
          return copy;
        });
      }
    },
    [DAY_START, DAY_END, toISTString, dateToHour]
  );

  // Start camera for a slot
  const startCamera = useCallback(
    async (cameraId: string, slotIndex: number): Promise<{ blobUrl: string; sessionId: string } | null> => {
      setLoadingSlots((prev) => new Set(prev).add(slotIndex));
      setSlotErrors((prev) => ({ ...prev, [slotIndex]: "" }));

      try {
        const res = await fetch(
          `${PLAYBACK_API}/hls/playlist/${cameraId}?start=${toISTString(
            DAY_START
          )}&end=${toISTString(DAY_END)}`
        );
        if (!res.ok) {
          const errJson = await res.json().catch(() => null);
          throw new Error(errJson?.message || `HTTP error ${res.status}`);
        }

        const json = await res.json();
        if (!json?.data?.playlist) throw new Error("No recording available");

        const blob = new Blob([json.data.playlist], {
          type: "application/vnd.apple.mpegurl",
        });
        const blobUrl = URL.createObjectURL(blob);

        setPlayers((prev) => [
          ...prev.filter((p) => p.slotIndex !== slotIndex),
          {
            slotIndex,
            cameraId,
            blobUrl,
            sessionId: json.data.sessionId,
            date: selectedDate,
          },
        ]);

        return { blobUrl, sessionId: json.data.sessionId };
      } catch (err: any) {
        setSlotErrors((prev) => ({
          ...prev,
          [slotIndex]: err.message || "Camera start error",
        }));
        return null;
      } finally {
        setLoadingSlots((prev) => {
          const copy = new Set(prev);
          copy.delete(slotIndex);
          return copy;
        });
      }
    },
    [DAY_START, DAY_END, toISTString, selectedDate]
  );

  // Get video source
  const getVideoSrc = useCallback(
    (slotIndex: number) =>
      players.find(
        (p) =>
          p.slotIndex === slotIndex &&
          p.date.toDateString() === selectedDate.toDateString()
      )?.blobUrl || "",
    [players, selectedDate]
  );

  // Handle camera drop
  const handleCameraDrop = async (cameraId: string, slotIndex: number) => {
    gridStore.assignCameraToSlot(slotIndex, cameraId);
    setSelectedSlot(slotIndex);

    const segments = await fetchTimelineForSlot(slotIndex, cameraId);

    const cameraStartResult = await startCamera(cameraId, slotIndex);
    if (!cameraStartResult) return;

    // Check if there are already other playing cameras
    const isFirstCamera = players.length === 0;

    // Actually, startCamera already sets the player state, so we don't strictly 
    // need this setPlayers call, but if we want to ensure it's in sync we use the returned values.
    setPlayers((prev) => [
      ...prev.filter((p) => p.slotIndex !== slotIndex),
      {
        slotIndex,
        cameraId,
        blobUrl: cameraStartResult.blobUrl,
        sessionId: cameraStartResult.sessionId,
        date: selectedDate,
      },
    ]);

    const firstRecording = segments?.find((s) => s.type === "recording");
    if (firstRecording) {
      if (isFirstCamera || !playback.isSync) {
        const seekDate = new Date(selectedDate);
        const hour = Math.floor(firstRecording.start);
        const minutes = Math.floor((firstRecording.start % 1) * 60);

        seekDate.setHours(hour);
        seekDate.setMinutes(minutes);
        seekDate.setSeconds(0);

        playback.seekTo(seekDate, slotIndex);
      }
    }

    if (!playback.isPlaying || (!playback.isSync && !playback.slotPlaying?.[slotIndex])) {
      playback.play(slotIndex);
    }
  };

  // Handle camera click (double click)
  const handleCameraClick = async (cameraId: string) => {
    const freeIndex = slotAssignments.findIndex((s) => s === null);
    if (freeIndex === -1) return;
    await handleCameraDrop(cameraId, freeIndex);
  };

  // Handle seek
  const handleSeek = useCallback(
    (absHour: number, slotIndex?: number) => {
      if (slotIndex === undefined) return;
      const slotSegments = segmentsPerSlot[slotIndex] || [];
      const recordings = slotSegments.filter((s) => s.type === "recording");
      if (!recordings.length) return;

      let nearest = recordings[0];
      let minDist = Math.min(
        Math.abs(absHour - nearest.start),
        Math.abs(absHour - nearest.end)
      );

      for (const s of recordings) {
        const dist = Math.min(
          Math.abs(absHour - s.start),
          Math.abs(absHour - s.end)
        );
        if (dist < minDist) {
          nearest = s;
          minDist = dist;
        }
      }

      const clampedHour = Math.max(
        nearest.start,
        Math.min(absHour, nearest.end)
      );
      const seekDate = new Date(selectedDate);
      seekDate.setHours(Math.floor(clampedHour));
      seekDate.setMinutes(Math.floor((clampedHour % 1) * 60));
      seekDate.setSeconds(Math.floor((clampedHour * 3600) % 60));

      playback.seekTo(seekDate, slotIndex);
    },
    [segmentsPerSlot, selectedDate, playback]
  );

  // Handle seek to date
  const handleSeekToDate = useCallback(
    (date: Date) => {
      const isSameDay = selectedDate.toDateString() === date.toDateString();

      if (!isSameDay) {
        setSelectedDate(date);
      }

      playback.seekTo(date, selectedSlot ?? undefined);
    },
    [selectedDate, selectedSlot, playback]
  );

  // Stop playback session API
  const stopPlaybackSession = useCallback(
    async (slotIndex?: number) => {
      const targets = slotIndex !== undefined ? players.filter(p => p.slotIndex === slotIndex) : players;

      for (const p of targets) {
        if (p.sessionId) {
          try {
            await fetch(`${PLAYBACK_API}/hls/stop/${p.sessionId}`, {
              method: "POST",
            });
          } catch (err) {
            console.error("Failed to stop playback session", err);
          }
        }
      }
    },
    [players]
  );

  // Handle clear slot
  const handleClearSlot = useCallback(
    async (slotIndex: number) => {
      await stopPlaybackSession(slotIndex);
      gridStore.clearSlot(slotIndex);

      // Optionally remove from players state directly so it doesn't linger
      setPlayers((prev) => prev.filter((p) => p.slotIndex !== slotIndex));
    },
    [stopPlaybackSession, gridStore]
  );

  // Handle jump to bookmark
  const handleJumpToBookmark = useCallback(
    (position: number) => {
      const date = new Date(position);
      playback.seekTo(date, selectedSlot ?? undefined);
      playback.play();
    },
    [selectedSlot, playback]
  );

  // Playback controls
  const handleFastForward = useCallback(() => {
    const speeds = [1, 2, 4, 8, 16, 36];
    const idx = speeds.indexOf(playback.playbackSpeed);
    playback.setSpeed(speeds[idx + 1] ?? 36);
  }, [playback]);

  const handleRewind = useCallback(() => {
    playback.seekBySeconds(-5);
  }, [playback]);

  const handleSkipBack = useCallback(() => {
    playback.seekBySeconds(-10);
  }, [playback]);

  const handleSkipForward = useCallback(() => {
    playback.seekBySeconds(10);
  }, [playback]);

  // Handle timeline add bookmark
  const handleTimelineAddBookmark = useCallback(
    async (slotIndex: number, position: number) => {
      const camId = slotAssignments[slotIndex];
      if (!camId) return;

      const name = `Bookmark ${new Date(position).toLocaleTimeString()}`;
      const bookmarkTime = toISTISOString(new Date(position));

      try {
        const res = await axios.post(
          `${BOOKMARK_API}/addBookmark`,
          {
            cameraId: camId,
            bookmarkTime,
            title: name,
            note: "Auto bookmark",
            createdBy: 101,
          },
          { headers: getAuthHeaders() }
        );

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

        setBookmarksPerSlot((prev) => ({
          ...prev,
          [slotIndex]: [...(prev[slotIndex] || []), newBookmark],
        }));
      } catch (err) {
        console.error("Failed to add bookmark", err);
      }
    },
    [slotAssignments, toISTISOString, getAuthHeaders]
  );

  // Handle timeline remove bookmark
  const handleTimelineRemoveBookmark = useCallback(
    async (id: string, camId: string) => {
      if (selectedSlot === null) return;

      try {
        await axios.delete(`${BOOKMARK_API}/deleteBookmark/${id}`, {
          headers: getAuthHeaders(),
        });

        setBookmarksPerSlot((prev) => ({
          ...prev,
          [selectedSlot]: (prev[selectedSlot] || []).filter(
            (b) => b.id.toString() !== id.toString()
          ),
        }));
      } catch (err) {
        console.error("Failed to remove bookmark", err);
      }
    },
    [selectedSlot, getAuthHeaders]
  );

  // Cleanup on unmount
  const resetGrid = usePlaybackGridStore((s) => s.reset);
  const resetPlayback = usePlaybackStore((s) => s.stop);

  useEffect(() => {
    return () => {
      resetGrid();
      resetPlayback();
    };
  }, [resetGrid, resetPlayback]);

  const [loadedDay, setLoadedDay] = useState<number>(DAY_START.getTime());

  useEffect(() => {
    if (DAY_START.getTime() === loadedDay) return;

    const reloadAllSlots = async () => {
      if (slotAssignments.filter(Boolean).length === 0) {
        setLoadedDay(DAY_START.getTime());
        return;
      }

      const newPlayers: Player[] = [];

      for (let slotIndex = 0; slotIndex < slotAssignments.length; slotIndex++) {
        const cameraId = slotAssignments[slotIndex];
        if (!cameraId) continue;

        console.log("🔄 Reloading slot", slotIndex, "for date", selectedDate);

        const segments = await fetchTimelineForSlot(slotIndex, cameraId);
        const cameraStartResult = await startCamera(cameraId, slotIndex);
        if (!cameraStartResult) continue;

        // No need to seek to firstRecording. The store's globalTime / cameraTime 
        // is already updated by handleSeekToDate, so useHlsWithStore will automatically sync to it!

        newPlayers.push({
          slotIndex,
          cameraId,
          blobUrl: cameraStartResult.blobUrl,
          sessionId: cameraStartResult.sessionId,
          date: new Date(selectedDate),
        });
      }

      setPlayers(newPlayers);
      setLoadedDay(DAY_START.getTime());

      if (!playback.isPlaying) {
        playback.play();
      }
    };

    reloadAllSlots();
  }, [DAY_START.getTime(), loadedDay, slotAssignments, fetchTimelineForSlot, startCamera, playback, selectedDate]);

  // Fetch bookmarks when slot changes
  useEffect(() => {
    if (selectedSlot !== null) {
      fetchBookmarksForSlot(selectedSlot);
    }
  }, [selectedSlot, selectedDate, slotAssignments, fetchBookmarksForSlot]);

  // Handle grid resize
  useEffect(() => {
    gridStore.resizeSlots();
    const totalSlots = gridStore.layout.rows * gridStore.layout.cols;

    setSegmentsPerSlot((prev) => {
      const cleaned: typeof prev = {};
      Object.entries(prev).forEach(([slot, seg]) => {
        if (Number(slot) < totalSlots) cleaned[Number(slot)] = seg;
      });
      return cleaned;
    });

    setRawSegmentsPerSlot((prev) => {
      const cleaned: typeof prev = {};
      Object.entries(prev).forEach(([slot, seg]) => {
        if (Number(slot) < totalSlots) cleaned[Number(slot)] = seg;
      });
      return cleaned;
    });

    setSlotErrors((prev) => {
      const cleaned: typeof prev = {};
      Object.entries(prev).forEach(([slot, err]) => {
        if (Number(slot) < totalSlots) cleaned[Number(slot)] = err;
      });
      return cleaned;
    });

    setLoadingSlots((prev) => {
      const cleaned = new Set<number>();
      prev.forEach((slot) => {
        if (slot < totalSlots) cleaned.add(slot);
      });
      return cleaned;
    });
  }, [gridStore.layout.rows, gridStore.layout.cols]);

  // Camera names
  const cameraNames = useMemo(() => {
    const map: Record<number, string> = {};
    slotAssignments.forEach((cameraId, slotIndex) => {
      if (!cameraId) return;
      const camera = cameras.find((c) => c.cameraId === cameraId);
      map[slotIndex] = camera ? camera.name : cameraId;
    });
    return map;
  }, [slotAssignments, cameras]);

  // State object
  const state: PlaybackState = {
    selectedDate,
    segmentsPerSlot,
    rawSegmentsPerSlot,
    bookmarksPerSlot,
    selectedSlot,
    zoomLevel,
    isTimelineExpanded,
    showCameraList,
    selectedLayout,
    loadingSlots,
    slotErrors,
    players,
  };

  return {
    // State
    state,

    // Setters
    setSelectedDate,
    setSelectedSlot,
    setZoomLevel,
    setTimelineExpanded: setIsTimelineExpanded,

    // Handlers
    handleCameraDrop,
    handleCameraClick,
    handleSeek,
    handleSeekToDate,
    handleJumpToBookmark,
    handleFastForward,
    handleRewind,
    handleSkipBack,
    handleSkipForward,
    handleTimelineAddBookmark,
    handleTimelineRemoveBookmark,
    handleLayoutChange: setSelectedLayout,
    handleToggleCameraList: () => setShowCameraList((prev) => !prev),
    handleClearSlot,
    stopPlaybackSession,

    // Helpers
    getVideoSrc,
    cameraNames,
    DAY_START,
    DAY_END,
  };
}
