import { useRef, useCallback, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Segment {
  start: number; // 0-100
  end: number;   // 0-100
  type: "recording" | "gap";
}

interface PlaybackTimelineProps {
  playheadPosition: number; // 0-100
  isExpanded: boolean;
  onSeek: (pct: number) => void;
  zoomLevel: number;
  segments: Segment[];
}

/* ---------- TIME LABELS ---------- */
function generateTimeLabels(zoomLevel: number, playheadPosition: number) {
  const totalHours = 24;
  const visibleHours = totalHours / zoomLevel;

  const playheadHour = (playheadPosition / 100) * totalHours;
  let viewStart = playheadHour - visibleHours / 2;
  viewStart = Math.max(0, Math.min(totalHours - visibleHours, viewStart));

  const stepMin =
    visibleHours <= 1 ? 5 :
    visibleHours <= 2 ? 10 :
    visibleHours <= 4 ? 15 :
    visibleHours <= 8 ? 30 : 60;

  const labels: string[] = [];
  for (let m = 0; m <= visibleHours * 60; m += stepMin) {
    const totalMin = viewStart * 60 + m;
    const h = Math.floor(totalMin / 60);
    const min = Math.floor(totalMin % 60);
    const h12 = h % 12 || 12;
    const ampm = h >= 12 ? "PM" : "AM";
    labels.push(`${h12}:${String(min).padStart(2, "0")} ${ampm}`);
  }

  return { labels, viewStart, visibleHours };
}

export function PlaybackTimeline({
  playheadPosition,
  isExpanded,
  onSeek,
  zoomLevel,
  segments,
}: PlaybackTimelineProps) {
  const [dragging, setDragging] = useState(false);
  const isDragging = useRef(false);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const { labels, viewStart, visibleHours } = useMemo(
    () => generateTimeLabels(zoomLevel, playheadPosition),
    [zoomLevel, playheadPosition]
  );

  const totalHours = 24;
  const viewStartPct = (viewStart / totalHours) * 100;
  const viewWidthPct = (visibleHours / totalHours) * 100;

  const toViewport = useCallback(
    (abs: number) => ((abs - viewStartPct) / viewWidthPct) * 100,
    [viewStartPct, viewWidthPct]
  );

  const viewportToAbs = useCallback(
    (vp: number) => viewStartPct + (vp / 100) * viewWidthPct,
    [viewStartPct, viewWidthPct]
  );

  /* ---------- SAFE SEEK ---------- */
const onSeekSafe = useCallback(
  (pos: number) => {
    const absTime = viewportToAbs(pos);
    // nearest recording segment
    const recSegment =
      segments.find((s) => absTime >= s.start && absTime <= s.end) ||
      segments.find((s) => absTime < s.start);

    if (!recSegment) return;

    const safePos = absTime < recSegment.start ? recSegment.start : absTime;

    console.log(
      "🔹 onSeekSafe",
      { pos, absTime, recSegment, safePos }
    );

    onSeek(safePos);
  },
  [segments, onSeek, viewportToAbs]
);

  /* ---------- MOUSE / DRAG ---------- */
  const getPosFromX = useCallback(
    (x: number) => {
      if (!trackRef.current) return null;
      const r = trackRef.current.getBoundingClientRect();
      const vp = ((x - r.left) / r.width) * 100;
      return Math.max(0, Math.min(100, vp));
    },
    []
  );

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    setDragging(true);

    const pos = getPosFromX(e.clientX);
    if (pos !== null) onSeekSafe(pos);

    const move = (me: MouseEvent) => {
      if (!isDragging.current) return;
      const p = getPosFromX(me.clientX);
      if (p !== null) onSeekSafe(p); // ✅ real-time drag
    };

    const up = () => {
      isDragging.current = false;
      setDragging(false);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const playheadVp = toViewport(playheadPosition);

  return (
    <div
      className={cn(
        "border-t bg-background transition-all",
        isExpanded ? "max-h-[220px]" : "max-h-0 overflow-hidden"
      )}
    >
      {/* Timeline track */}
      <div className="flex h-[24px] border-b">
        <div className="w-[160px] px-3 text-xs font-semibold">Timeline</div>

        <div
          ref={trackRef}
          onMouseDown={onMouseDown}
          className={cn(
            "flex-1 relative bg-muted/20",
            dragging ? "cursor-grabbing" : "cursor-pointer"
          )}
        >
          {/* Segments */}
          {segments.map((s, i) => {
            const l = Math.max(0, toViewport(s.start));
            const r = Math.min(100, toViewport(s.end));
            if (r - l <= 0) return null;

            return (
              <div
                key={i}
                className={cn(
                  "absolute top-[4px] bottom-[4px]",
                  s.type === "recording" ? "bg-blue-300" : "bg-slate-400"
                )}
                style={{ left: `${l}%`, width: `${r - l}%` }}
              />
            );
          })}

          {/* Playhead */}
          {playheadVp >= 0 && playheadVp <= 100 && (
            <>
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-primary"
                style={{ left: `${playheadVp}%` }}
              />
              <div
                className="absolute -top-4 text-[10px] text-primary font-semibold"
                style={{ left: `${playheadVp}%`, transform: 'translateX(-50%)' }}
              >
              </div>
            </>
          )}
        </div>
      </div>

      {/* Time scale */}
      <div className="flex h-[22px] border-t">
        <div className="w-[160px] px-2 text-[10px] flex items-center gap-2">
          Interval
          <Badge variant="secondary">
            {visibleHours >= 1 ? `${Math.round(visibleHours)}H` : `${Math.round(visibleHours * 60)}M`}
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