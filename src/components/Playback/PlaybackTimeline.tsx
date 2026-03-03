// PlaybackTimelineMulti.tsx
import React, { useRef, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
}

/* ---------------- TIME LABELS ---------------- */
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
    const h = Math.floor(t);
    const min = Math.floor((t - h) * 60);
    const h12 = h % 12 || 12;
    labels.push(`${h12}:${String(min).padStart(2, "0")}`);
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

  /* ---------------- SEEK (DUMB) ---------------- */
  const seekAtViewport = (vp: number) => {
   
    const abs = viewportToAbs(vp);
     console.log("andnd",abs)
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
      className={cn(
        "border-t",
        isExpanded ? `max-h-[${slotCount * 24 + 50}px]` : "max-h-0 overflow-hidden"
      )}
    >
      {/* ================= TRACKS ================= */}
      <div className="flex h-auto border-b">
        <div className="w-[160px] px-3 text-xs font-semibold">Timeline</div>

        <div
          ref={trackRef}
          onMouseDown={onMouseDown}
          className="flex-1 relative bg-muted/20 cursor-pointer flex flex-col py-1"
        >
          {nonEmptySlots.map((slotIndex) => {
            const segments = segmentsPerSlot[slotIndex]!;
            return (
              <div key={slotIndex} className="relative h-[20px] mb-1">
                {segments.map((s, i) => {
                  const left = Math.max(0, toViewport(s.start));
                  const width = Math.min(100, toViewport(s.end)) - left;
                  if (width <= 0) return null;

                  return (
                    <div
                      key={i}
                      className={cn(
                        "absolute top-0 h-full rounded-sm",
                        s.type === "recording"
                          ? "bg-blue-400"
                          : "bg-gray-400"
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

          {/* ================= PLAYHEAD ================= */}
          {hasSegments && playheadVp >= 0 && playheadVp <= 100 && (
            <div
              className="absolute w-[2px] bg-primary top-0"
              style={{
                left: `${playheadVp}%`,
                height: `${trackRef.current?.offsetHeight || 0}px`,
              }}
            />
          )}
        </div>
      </div>

      {/* ================= LABELS ================= */}
      <div className="flex h-[22px] border-t">
        <div className="w-[160px] px-2 text-[10px] flex items-center gap-2">
          Interval
          <Badge variant="secondary">
            {visibleHours >= 1
              ? `${Math.round(visibleHours)}H`
              : `${Math.round(visibleHours * 60)}M`}
          </Badge>
        </div>

        <div className="flex-1 flex justify-between px-2 text-[9px]">
          {labels.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}