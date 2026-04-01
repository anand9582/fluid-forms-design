import React, { useRef, useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { usePlaybackStore } from "@/Store/playbackStore";
import { AppTooltip } from "@/components/ui/AppTooltip";
import { Bookmark } from "lucide-react";
import { PlaybackBookmark } from "@/components/Playback/PlaybackBookmarkPopover";

export interface SegmentHour {
  start: number;
  end: number;
  type: "recording" | "gap";
}

interface Props {
  segmentsPerSlot: Record<number, SegmentHour[]>;
  cameraNames: Record<number, string>;
  zoomLevel: number;
  isExpanded: boolean;
  cameraIds?: Record<number, string>;
  bookmarksPerSlot: Record<number, PlaybackBookmark[]>;
  slotCount: number;
  timelineDate: Date;
}

const CAMERA_COL_WIDTH = 160;

/* ---------------- UTILS ---------------- */

const formatHour = (hour: number) => {
  const h = Math.floor(hour);
  const m = Math.floor((hour - h) * 60);
  const h12 = h % 12 || 12;
  const period = h < 12 ? "AM" : "PM";
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
};

const hourToViewport = (
  hour: number,
  viewStart: number,
  visibleHours: number
) => ((hour - viewStart) / visibleHours) * 100;

/* -------- SMART SNAP SYSTEM -------- */

const clampHourToRecordings = (
  absHour: number,
  slotSegments: SegmentHour[]
): number | null => {

  const recordings = slotSegments
    .filter((s) => s.type === "recording")
    .sort((a, b) => a.start - b.start);

  if (!recordings.length) return null;

  const first = recordings[0];
  const last = recordings[recordings.length - 1];

  /* before first recording */
  if (absHour <= first.start) return first.start;

  /* after last recording */
  if (absHour >= last.end) return last.end;

  /* inside recording */
  for (const rec of recordings) {
    if (absHour >= rec.start && absHour <= rec.end) {
      return absHour;
    }
  }

  /* inside gap → snap */
  let nearestEdge = first.start;
  let minDist = Math.abs(absHour - nearestEdge);

  for (const rec of recordings) {

    const startDist = Math.abs(absHour - rec.start);
    const endDist = Math.abs(absHour - rec.end);

    if (startDist < minDist) {
      minDist = startDist;
      nearestEdge = rec.start;
    }

    if (endDist < minDist) {
      minDist = endDist;
      nearestEdge = rec.end;
    }
  }

  return nearestEdge;
};

function generateTimeLabels(zoomLevel: number, playheadHour: number) {

  const totalHours = 24;
  const visibleHours = totalHours / zoomLevel;

  let viewStart = playheadHour - visibleHours / 2;
  viewStart = Math.max(0, Math.min(totalHours - visibleHours, viewStart));

  const step =
    visibleHours <= 1 ? 0.0833 :
      visibleHours <= 2 ? 0.1667 :
        visibleHours <= 4 ? 0.25 :
          visibleHours <= 8 ? 0.5 : 1;

  const labels: string[] = [];

  for (let t = viewStart; t <= viewStart + visibleHours; t += step) {
    labels.push(formatHour(t));
  }

  return { labels, viewStart, visibleHours };
}

/* ---------------- SEEK ---------------- */

const handleSeek = (
  absHour: number,
  segmentsPerSlot: Record<number, SegmentHour[]>,
  seekTo: (date: Date, slotIndex?: number) => void,
  isSync: boolean,
  currentTime: Date,
  slotIndex?: number,
  baseDate?: Date
) => {
  const seekDate = baseDate ? new Date(baseDate) : new Date(currentTime);

  if (isSync) {
    seekDate.setHours(Math.floor(absHour));
    seekDate.setMinutes(Math.floor((absHour % 1) * 60));
    seekDate.setSeconds(Math.floor((absHour * 3600) % 60));

    seekTo(seekDate);
    return;
  }

  if (slotIndex === undefined) return;

  const slotSegments = segmentsPerSlot[slotIndex] || [];

  const clamped = clampHourToRecordings(absHour, slotSegments);

  if (clamped === null) {
    console.warn("No recordings available");
    return;
  }

  seekDate.setHours(Math.floor(clamped));
  seekDate.setMinutes(Math.floor((clamped % 1) * 60));
  seekDate.setSeconds(Math.floor((clamped * 3600) % 60));

  seekTo(seekDate, slotIndex);
};

/* ---------------- COMPONENT ---------------- */

export function PlaybackTimeline({
  segmentsPerSlot,
  cameraNames,
  zoomLevel,
  isExpanded,
  slotCount,
  cameraIds,
  bookmarksPerSlot,
  timelineDate,
}: Props) {

  const isSync = usePlaybackStore((s) => s.isSync);
  const seekTo = usePlaybackStore((s) => s.seekTo);
  const globalTime = usePlaybackStore((s) => s.globalTime);
  const cameraTimes = usePlaybackStore((s) => s.cameraTimes);

  const dayStart = useMemo(() => {
    const d = new Date(timelineDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [timelineDate]);

  const dateToHour = React.useCallback(
    (date: Date, base: Date = dayStart) => {
      const hour = (date.getTime() - base.getTime()) / 3600000;
      return Math.max(0, Math.min(24, hour));
    },
    [dayStart]
  );

  const trackRef = useRef<HTMLDivElement | null>(null);

  const dragging = useRef(false);

  const [hoverHour, setHoverHour] = useState<number | null>(null);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipPos, setTooltipPos] = useState(0);

  const nonEmptySlots = useMemo(
    () =>
      Object.entries(segmentsPerSlot)
        .filter(([_, segs]) => segs.length > 0)
        .map(([slotIndex]) => Number(slotIndex)),
    [segmentsPerSlot]
  );

  const hasSegments = nonEmptySlots.length > 0;

  /* ---------------- AUTO SEEK FIRST RECORDING ---------------- */

  const playheadHour = useMemo(() => {
    if (isSync) {
      return dateToHour(globalTime);
    } else {
      const hours = nonEmptySlots.map((slotIndex) => {
        const t = cameraTimes[slotIndex] || globalTime;
        return dateToHour(t);
      });
      return hours[0] ?? 0;
    }
  }, [globalTime, cameraTimes, isSync, nonEmptySlots, dateToHour]);

  const { labels, viewStart, visibleHours } = useMemo(
    () => generateTimeLabels(zoomLevel, playheadHour),
    [zoomLevel, playheadHour]
  );

  const toViewport = (hour: number) =>
    hourToViewport(hour, viewStart, visibleHours);

  const viewportToAbs = (vp: number) =>
    viewStart + (vp / 100) * visibleHours;


  /* ---------------- DRAG ---------------- */

  const onMouseDown = (e: React.MouseEvent, slotIndex: number) => {
    dragging.current = true;

    const move = (me: MouseEvent) => {
      requestAnimationFrame(() => {
        if (!dragging.current || !trackRef.current) return;

        const rect = trackRef.current.getBoundingClientRect();
        const vp = ((me.clientX - rect.left) / rect.width) * 100;

        if (vp < 0 || vp > 100) return;

        let absHour = viewportToAbs(vp);
        const slotSegs = segmentsPerSlot[slotIndex] || [];

        // ✅ CHECK: only allow recording click
        const recordingSegment = slotSegs.find(
          (s) =>
            s.type === "recording" &&
            absHour >= s.start &&
            absHour <= s.end
        );

        // ❌ GAP CLICK → ignore
        if (!recordingSegment) {
          setTooltipText("No recording");
          setTooltipPos(vp);
          setHoverHour(null);
          return;
        }

        // ✅ VALID RECORDING
        setHoverHour(absHour);
        setTooltipText(formatHour(absHour));
        setTooltipPos(vp);

        handleSeek(
          absHour,
          segmentsPerSlot,
          seekTo,
          isSync,
          globalTime,
          slotIndex,
          timelineDate
        );
      });
    };

    const up = () => {
      dragging.current = false;
      setHoverHour(null);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);

    move({ clientX: e.clientX } as MouseEvent);
  };

  return (
    <div
      className="border-t"

    >
      {/* HEADER */}
      <div className="flex border-b items-center">
        <div style={{ width: CAMERA_COL_WIDTH }} className="mr-3 min-w-0">
          {nonEmptySlots.map((slotIndex, idx) => {
            const camName = cameraNames[slotIndex] ?? `Camera ${slotIndex + 1}`;
            return (
              <AppTooltip key={slotIndex} label={camName} side="top">
                <div
                  className={cn(
                    "mb-2 text-xs font-roboto font-medium text-slate-900 px-2 flex items-center truncate overflow-hidden whitespace-nowrap",
                    idx === 0 && "pt-2"
                  )}
                >
                  {camName}
                </div>
              </AppTooltip>
            );
          })}
        </div>
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
                  const left = Math.max(0, toViewport(s.start));
                  const right = Math.min(100, toViewport(s.end));
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

                {/* Bookmarks */}
                {bookmarksPerSlot[slotIndex]?.map((bookmark) => {
                  console.log(slotIndex);
                  const bookmarkTime = bookmark.bookmarkTime
                    ? new Date(bookmark.bookmarkTime)
                    : bookmark.position !== undefined
                      ? new Date(bookmark.position)
                      : null;

                  if (!bookmarkTime) return null;

                  const hour = dateToHour(bookmarkTime);
                  const x = toViewport(hour);
                  if (x < 0 || x > 100) return null;

                  return (
                    <AppTooltip
                      label={`${bookmark.title}`}
                      side="top"
                    >
                      <div
                        className="absolute z-[15] cursor-pointer"
                        style={{ left: `${x}%`, top: "-4px", bottom: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSeek(
                            hour,
                            segmentsPerSlot,
                            seekTo,
                            isSync,
                            globalTime,
                            slotIndex,
                            timelineDate
                          );
                        }}
                      >
                        {/* Vertical line */}
                        <div className="absolute top-0 bottom-0 w-[1.5px] bg-foreground/70 -translate-x-1/2" />

                        {/* Triangle */}
                        <div className="absolute -top-[1px] -translate-x-1/2 w-0 h-0 
                    border-l-[4px] border-r-[4px] border-t-[6px] 
                    border-l-transparent border-r-transparent border-t-foreground/80"
                        />
                      </div>
                    </AppTooltip>
                  );
                })}

                {/* Individual playhead */}
                {!isSync && (() => {
                  const camTime = cameraTimes[slotIndex];
                  if (!camTime) return null;
                  const camHour = camTime.getHours() + camTime.getMinutes() / 60 + camTime.getSeconds() / 3600;
                  const camVp = toViewport(camHour);
                  if (camVp < 0 || camVp > 100) return null;

                  return (
                    <>
                      <div className="absolute w-[1px] bg-primary rounded" style={{ left: `${camVp}%`, top: -4, height: 18 }} />
                      <div className="absolute bg-blue-600 rounded-full shadow-lg" style={{ width: 7, height: 7, left: `${camVp}%`, top: -4, transform: "translate(-50%, -50%)" }} />
                    </>
                  );
                })()}
              </div>
            );
          })}

          {/* Global playhead */}
          {isSync && hasSegments && (
            <>
              <div className="absolute w-[1px] bg-primary top-0" style={{ left: `${toViewport(playheadHour)}%`, height: "100%" }} />
              <div className="absolute w-[7px] h-2 bg-blue-600 rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2 top-0" style={{ left: `${toViewport(playheadHour)}%` }} />
            </>
          )}

          {/* Tooltip */}
          {hoverHour !== null && (
            <div className="absolute -top-6 px-2 py-1 bg-black text-white text-xs rounded shadow-lg pointer-events-none" style={{ left: `${tooltipPos}%`, transform: "translateX(-50%)" }}>
              {tooltipText}
            </div>
          )}
        </div>
      </div>

      {/* Labels */}
      <div className="flex h-[22px] border-t">
        <div style={{ width: CAMERA_COL_WIDTH }} className="px-2 flex items-center gap-2 font-roboto text-xs font-medium text-slate-600 bg-neutral-100">
          TIME INTERVAL
          <Badge variant="secondary" className="font-roboto text-black font-bold">
            {visibleHours >= 1 ? `${Math.round(visibleHours)}H` : `${Math.round(visibleHours * 60)}M`}
          </Badge>
        </div>
        <div className="flex-1 flex justify-between items-center text-[10px] font-roboto font-medium text-slate-500 bg-neutral-100 px-1">
          {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      </div>
    </div>
  );
}