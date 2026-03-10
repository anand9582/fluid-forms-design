import React, { useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { usePlaybackStore } from "@/Store/playbackStore";

export interface SegmentHour {
  start: number;
  end: number;
  type: "recording" | "gap";
}

interface Props {
  segmentsPerSlot: Record<number, SegmentHour[]>;
  cameraNames: Record<number, string>;
  zoomLevel: number;
  onSeek: (hour: number, slotIndex?: number) => void;
}

const CAMERA_COL_WIDTH = 160;

/* ---------------- TIME LABELS ---------------- */
function generateTimeLabels(zoomLevel: number, playheadHour: number) {
  const totalHours = 24;
  const visibleHours = totalHours / zoomLevel;

  let viewStart = playheadHour - visibleHours / 2;
  viewStart = Math.max(0, Math.min(totalHours - visibleHours, viewStart));

  const step =
    visibleHours <= 1
      ? 0.0833
      : visibleHours <= 2
      ? 0.1667
      : visibleHours <= 4
      ? 0.25
      : visibleHours <= 8
      ? 0.5
      : 1;

  const labels: string[] = [];
  for (let t = viewStart; t <= viewStart + visibleHours; t += step) {
    const h = Math.floor(t);
    const min = Math.floor((t - h) * 60);
    const h12 = h % 12 || 12;
    const period = h < 12 ? "AM" : "PM";
    labels.push(`${h12}:${String(min).padStart(2, "0")} ${period}`);
  }

  return { labels, viewStart, visibleHours };
}

/* ---------------- SEEK LOGIC ---------------- */
export const handleSeek = (
  absHour: number,
  segmentsPerSlot: Record<number, SegmentHour[]>,
  selectedDate: Date,
  playback: ReturnType<typeof usePlaybackStore>,
  slotIndex?: number
) => {
  if (playback.isSync) {
    // sync mode, global seek
    const seekDate = new Date(selectedDate);
    seekDate.setHours(Math.floor(absHour));
    seekDate.setMinutes(Math.floor((absHour % 1) * 60));
    seekDate.setSeconds(Math.floor((absHour * 3600) % 60));
    playback.seekTo(seekDate);
    return;
  }

  // individual mode, independent slot
  const targetSlot = slotIndex;
  if (targetSlot === undefined || targetSlot === null) return;

  const slotSegments = segmentsPerSlot[targetSlot] || [];
  const recordings = slotSegments.filter((s) => s.type === "recording");
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

  playback.seekTo(seekDate, targetSlot);
};

/* ========================================================= */

export function PlaybackTimeline({
  segmentsPerSlot,
  cameraNames,
  zoomLevel,
}: Props) {
  const playback = usePlaybackStore();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const playheadHour =
    playback.isSync
      ? playback.globalTime.getHours() +
        playback.globalTime.getMinutes() / 60 +
        playback.globalTime.getSeconds() / 3600
      : 0; // individual slots handle their own playhead

  const { labels, viewStart, visibleHours } = useMemo(
    () => generateTimeLabels(zoomLevel, playheadHour),
    [zoomLevel, playheadHour]
  );

  const toViewport = (absHour: number) => ((absHour - viewStart) / visibleHours) * 100;
  const viewportToAbs = (vp: number) => viewStart + (vp / 100) * visibleHours;

  /* ---------------- MOUSE SEEK ---------------- */
  const onMouseDown = (e: React.MouseEvent, slotIndex: number | null) => {
    dragging.current = true;

    const move = (me: MouseEvent) => {
      requestAnimationFrame(() => {
        if (!dragging.current || !trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();
        const vp = ((me.clientX - rect.left) / rect.width) * 100;
        if (vp < 0 || vp > 100) return;
        const absHour = viewportToAbs(vp);
        handleSeek(absHour, segmentsPerSlot, new Date(), playback, slotIndex ?? undefined);
      });
    };

    const up = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const vp = ((e.clientX - rect.left) / rect.width) * 100;
      const absHour = viewportToAbs(vp);
      handleSeek(absHour, segmentsPerSlot, new Date(), playback, slotIndex ?? undefined);
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const nonEmptySlots = Object.entries(segmentsPerSlot)
    .filter(([_, segs]) => segs.length > 0)
    .map(([slotIndex]) => Number(slotIndex));

  const hasSegments = nonEmptySlots.length > 0;

  return (
    <div className="border-t overflow-hidden">
      <div className="flex border-b items-center">
        {/* Camera column */}
        <div style={{ width: CAMERA_COL_WIDTH }}>
          {nonEmptySlots.map((slotIndex, idx) => (
            <div
              key={slotIndex}
              className={cn("mb-2 text-xs font-medium text-slate-600 px-2 flex items-center", idx === 0 && "pt-2")}
            >
              {cameraNames[slotIndex] ?? `Camera ${slotIndex + 1}`}
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div ref={trackRef} className="flex-1 relative bg-muted/20 flex flex-col py-1 pt-3">
          {nonEmptySlots.map((slotIndex) => {
            const segments = segmentsPerSlot[slotIndex]!;

            return (
              <div
                key={slotIndex}
                className="relative h-[14px] mb-2 cursor-pointer"
                onMouseDown={(e) => onMouseDown(e, slotIndex)}
              >
                {segments.map((s, i) => {
                  const startVp = toViewport(s.start);
                  const endVp = toViewport(s.end);
                  if (endVp < 0 || startVp > 100) return null;
                  const left = Math.max(0, startVp);
                  const right = Math.min(100, endVp);
                  const width = right - left;
                  if (width <= 0) return null;

                  return (
                    <div
                      key={i}
                      className={cn("absolute top-0 h-full rounded-sm", s.type === "recording" ? "bg-blue-400" : "bg-slate-400")}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                  );
                })}

{/* Individual camera playhead */}
{!playback.isSync && (() => {
  const camTime = playback.cameraTimes[slotIndex];
  if (!camTime) return null;

  const camHour =
    camTime.getHours() +
    camTime.getMinutes() / 60 +
    camTime.getSeconds() / 3600;
  const camVp = toViewport(camHour);
  if (camVp < 0 || camVp > 100) return null;

  const topOffset = -4; // negative so line goes a bit above timeline
  const lineHeight = 18; // total length of line
  const circleSize = 7; // diameter of circle

  return (
    <>
      {/* vertical line starting slightly above the timeline */}
      <div
        className="absolute w-[1px] bg-primary rounded"
        style={{
          left: `${camVp}%`,
          top: `${topOffset}px`,
          height: `${lineHeight}px`,
        }}
      />
      {/* circle on top of line */}
      <div
        className="absolute bg-blue-600 rounded-full shadow-lg"
            style={{
              width: `${circleSize}px`,
              height: `${circleSize}px`,
              left: `${camVp}%`,
              top: `${topOffset}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        </>
      );
    })()}
              </div>
            );
          })}

          {/* Global playhead (sync mode) */}
          {playback.isSync &&
            hasSegments &&
            playheadHour >= 0 &&
            playheadHour <= 100 && (
              <>
                <div className="absolute w-[1px] bg-primary top-0" style={{ left: `${toViewport(playheadHour)}%`, height: "100%" }} />
                <div className="absolute w-[7px] h-2 bg-blue-600 rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2 top-0" style={{ left: `${toViewport(playheadHour)}%` }} />
              </>
            )}
        </div>
      </div>

      {/* Labels */}
      <div className="flex h-[22px] border-t">
        <div style={{ width: CAMERA_COL_WIDTH }} className="px-2 flex items-center gap-2 text-xs font-medium text-slate-600 bg-neutral-100">
          TIME INTERVAL
          <Badge variant="secondary" className="text-black font-medium">
            {visibleHours >= 1 ? `${Math.round(visibleHours)}H` : `${Math.round(visibleHours * 60)}M`}
          </Badge>
        </div>

        <div className="flex-1 flex justify-between items-center text-[10px] text-slate-500 bg-neutral-100 px-1">
          {labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}