// PlaybackTimelineMulti.tsx
import React, { useRef, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface SegmentHour {
  start: number;
  end: number;
  type: "recording" | "gap";
}

interface Props {
  playheadPosition: number;
  isExpanded: boolean;
  onSeek: (absHour: number) => void;
  zoomLevel: number;
  segmentsPerSlot: Record<number, SegmentHour[]>;
  slotCount: number;
  cameraNames: Record<number, string>;
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

/* ========================================================= */

export function PlaybackTimeline({
  playheadPosition,
  isExpanded,
  onSeek,
  zoomLevel,
  segmentsPerSlot,
  slotCount,
  cameraNames,
}: Props) {

  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const { labels, viewStart, visibleHours } = useMemo(
    () => generateTimeLabels(zoomLevel, playheadPosition),
    [zoomLevel, playheadPosition]
  );

  /* ---------------- CONVERSIONS ---------------- */

  const toViewport = (absHour: number) =>
    ((absHour - viewStart) / visibleHours) * 100;

  const viewportToAbs = (vp: number) =>
    viewStart + (vp / 100) * visibleHours;

  const getVpFromX = (x: number) => {
    if (!trackRef.current) return null;

    const r = trackRef.current.getBoundingClientRect();
    return ((x - r.left) / r.width) * 100;
  };

  /* ---------------- SEEK ---------------- */

  const seekAtViewport = (vp: number) => {
    const abs = viewportToAbs(vp);
    onSeek(abs);
  };

  /* ---------------- MOUSE HANDLING ---------------- */

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;

    const move = (me: MouseEvent) => {
      requestAnimationFrame(() => {
        if (!dragging.current) return;

        const vp = getVpFromX(me.clientX);
        if (vp !== null) seekAtViewport(vp);
      });
    };

    const up = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    const vp = getVpFromX(e.clientX);
    if (vp !== null) seekAtViewport(vp);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  /* ---------------- PLAYHEAD ---------------- */

  const playheadVp = toViewport(playheadPosition);

  const nonEmptySlots = Object.entries(segmentsPerSlot)
    .filter(([_, segs]) => segs.length > 0)
    .map(([slotIndex]) => Number(slotIndex));

  const hasSegments = nonEmptySlots.length > 0;

  return (
    <div
      className="border-t overflow-hidden"
      style={{
        maxHeight: isExpanded ? slotCount * 26 + 50 : 0,
      }}
    >
      {/* ================= TRACK ================= */}

      <div className="flex border-b items-center">

        {/* CAMERA COLUMN */}

        <div
  style={{ width: CAMERA_COL_WIDTH }}
>
  <TooltipProvider>
    {nonEmptySlots.map((slotIndex, index) => {

      const name =
        cameraNames?.[slotIndex] ?? `Camera ${slotIndex + 1}`;

      return (
        <Tooltip key={slotIndex}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "mb-2 text-xs font-roboto font-medium text-slate-600 px-2 flex items-center cursor-pointer",
                index === 0 && "pt-2"
              )}
            >
              <span className="truncate block w-full">
                {name}
              </span>
            </div>
          </TooltipTrigger>

         <TooltipContent className="bg-blue-700 text-white text-[10px] px-2 py-1 rounded">
             {name}
          </TooltipContent>
        </Tooltip>
      );
    })}
  </TooltipProvider>
</div>

        {/* TIMELINE COLUMN */}

        <div
          ref={trackRef}
          onMouseDown={onMouseDown}
          className="flex-1 relative bg-muted/20 cursor-pointer flex flex-col py-1 pt-3"
        >
          {nonEmptySlots.map((slotIndex) => {

            const segments = segmentsPerSlot[slotIndex]!;

            return (
              <div key={slotIndex} className="relative h-[14px] mb-2">

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
                      className={cn(
                        "absolute top-0 h-full rounded-sm",
                        s.type === "recording"
                          ? "bg-blue-400"
                          : "bg-slate-400"
                      )}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                      }}
                    />
                  );
                })}

              </div>
            );
          })}

          {/* PLAYHEAD */}

          {hasSegments && playheadVp >= 0 && playheadVp <= 100 && (
            <>
              <div
                className="absolute w-[1px] bg-primary top-0"
                style={{
                  left: `${playheadVp}%`,
                  height: "100%",
                }}
              />

              <div
                className="absolute w-[7px] h-2 bg-blue-600 rounded-full shadow-lg -translate-x-1/2 -translate-y-1/2 top-0"
                style={{
                  left: `${playheadVp}%`,
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* ================= LABELS ================= */}

      <div className="flex h-[22px] border-t">

        <div
          style={{ width: CAMERA_COL_WIDTH }}
          className="px-2 flex items-center gap-2 text-xs font-medium text-slate-600 bg-neutral-100"
        >
          TIME INTERVAL

          <Badge
            variant="secondary"
            className="text-black font-medium"
          >
            {visibleHours >= 1
              ? `${Math.round(visibleHours)}H`
              : `${Math.round(visibleHours * 60)}M`}
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