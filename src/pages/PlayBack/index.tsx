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