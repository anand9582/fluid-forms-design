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
  segments: SegmentHour[];
}

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

export function PlaybackTimeline({
  playheadPosition,
  isExpanded,
  onSeek,
  zoomLevel,
  segments,
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const [, force] = useState(0);

  const { labels, viewStart, visibleHours } = useMemo(
    () => generateTimeLabels(zoomLevel, playheadPosition),
    [zoomLevel, playheadPosition]
  );

  const toViewport = (absHour: number) => ((absHour - viewStart) / visibleHours) * 100;
  const viewportToAbs = (vp: number) => viewStart + (vp / 100) * visibleHours;

  const getVpFromX = (x: number) => {
    if (!trackRef.current) return null;
    const r = trackRef.current.getBoundingClientRect();
    return ((x - r.left) / r.width) * 100;
  };

  const seekSafe = (vp: number) => {
    const abs = viewportToAbs(vp);
    const seg =
      segments.find((s) => abs >= s.start && abs <= s.end) ||
      segments.find((s) => abs < s.start);
    if (!seg) return;

    const safe = abs < seg.start ? seg.start : abs;
    onSeek(safe);

    // 🔹 play all video elements instantly
    setTimeout(() => {
      const videos = document.querySelectorAll<HTMLVideoElement>("video");
      videos.forEach((v) => v.play().catch(() => {}));
    }, 10);

    force((n) => n + 1);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;

    const move = (me: MouseEvent) => {
      requestAnimationFrame(() => {
        if (!dragging.current) return;
        const vp = getVpFromX(me.clientX);
        if (vp !== null) seekSafe(vp);
      });
    };

    const up = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    const vp = getVpFromX(e.clientX);
    if (vp !== null) seekSafe(vp);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const playheadVp = toViewport(playheadPosition);

  return (
    <div className={cn("border-t", isExpanded ? "max-h-[220px]" : "max-h-0 overflow-hidden")}>
      <div className="flex h-[24px] border-b">
        <div className="w-[160px] px-3 text-xs font-semibold">Timeline</div>
        <div ref={trackRef} onMouseDown={onMouseDown} className="flex-1 relative bg-muted/20 cursor-pointer">
          {segments.map((s, i) => {
            const l = Math.max(0, toViewport(s.start));
            const r = Math.min(100, toViewport(s.end));
            if (r - l <= 0) return null;
            return (
              <div
                key={i}
                className={cn("absolute top-[4px] bottom-[4px]", s.type === "recording" ? "bg-blue-400" : "bg-slate-400")}
                style={{ left: `${l}%`, width: `${r - l}%` }}
              />
            );
          })}
          {playheadVp >= 0 && playheadVp <= 100 && (
            <div className="absolute top-0 bottom-0 w-[2px] bg-primary" style={{ left: `${playheadVp}%` }} />
          )}
        </div>
      </div>

      <div className="flex h-[22px] border-t">
        <div className="w-[160px] px-2 text-[10px] flex items-center gap-2">
          Interval
          <Badge variant="secondary">
            {visibleHours >= 1 ? `${Math.round(visibleHours)}H` : `${Math.round(visibleHours * 60)}M`}
          </Badge>
        </div>
        <div className="flex-1 flex justify-between px-2 text-[9px]">
            {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      </div>
    </div>
  );
}