// Playback Timeline Tracks Component
// Interactive timeline with zoom: drag anywhere to seek, zoom to focus on time range

import { useRef, useCallback, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { timelineTracks } from "./data";

interface PlaybackTimelineProps {
  playheadPosition: number;
  isExpanded: boolean;
  onSeek: (position: number) => void;
  zoomLevel: number; // 1-10
}

// Generate time labels based on zoom
function generateTimeLabels(zoomLevel: number, playheadPosition: number) {
  const totalHours = 24;
  const visibleHours = totalHours / zoomLevel;
  const startHour = 0; // 12 AM

  // Center the view around the playhead
  const playheadHourOffset = (playheadPosition / 100) * totalHours;
  let viewStart = playheadHourOffset - visibleHours / 2;
  viewStart = Math.max(0, Math.min(totalHours - visibleHours, viewStart));

  const labels: string[] = [];
  const step = visibleHours <= 1 ? 5 : visibleHours <= 2 ? 10 : visibleHours <= 4 ? 15 : visibleHours <= 8 ? 30 : 60; // minutes
  const totalMinutes = visibleHours * 60;

  for (let m = 0; m <= totalMinutes; m += step) {
    const absMinutes = (viewStart * 60) + m;
    const hour = Math.floor(startHour + absMinutes / 60);
    const min = Math.floor(absMinutes % 60);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    labels.push(`${h12}:${String(min).padStart(2, "0")} ${ampm}`);
  }
  return { labels, viewStart, visibleHours };
}

export function PlaybackTimeline({ playheadPosition, isExpanded, onSeek, zoomLevel }: PlaybackTimelineProps) {
  const [dragging, setDragging] = useState(false);
  const isDragging = useRef(false);
  const trackAreaRef = useRef<HTMLDivElement | null>(null);

  // Compute visible window based on zoom
  const { labels: zoomLabels, viewStart, visibleHours } = useMemo(
    () => generateTimeLabels(zoomLevel, playheadPosition),
    [zoomLevel, playheadPosition]
  );

  const totalHours = 24;
  // viewStart/visibleHours in hour-offsets (0-6), convert to percentage range
  const viewStartPct = (viewStart / totalHours) * 100;
  const viewEndPct = ((viewStart + visibleHours) / totalHours) * 100;
  const viewWidthPct = viewEndPct - viewStartPct;

  // Map an absolute 0-100% position to the visible viewport 0-100%
  const toViewport = useCallback((absPct: number) => {
    return ((absPct - viewStartPct) / viewWidthPct) * 100;
  }, [viewStartPct, viewWidthPct]);

  // Map viewport x-position back to absolute 0-100%
  const viewportToAbs = useCallback((vpPct: number) => {
    return viewStartPct + (vpPct / 100) * viewWidthPct;
  }, [viewStartPct, viewWidthPct]);

  const getPosFromX = useCallback((clientX: number) => {
    const el = trackAreaRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const vpPct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    return viewportToAbs(vpPct);
  }, [viewportToAbs]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    setDragging(true);

    const pos = getPosFromX(e.clientX);
    if (pos !== null) onSeek(pos);

    const onMove = (me: MouseEvent) => {
      if (!isDragging.current) return;
      const p = getPosFromX(me.clientX);
      if (p !== null) onSeek(p);
    };

    const onUp = () => {
      isDragging.current = false;
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [getPosFromX, onSeek]);

  const playheadViewport = toViewport(playheadPosition);

  const intervalLabel = visibleHours >= 1
    ? `${Math.round(visibleHours)}H`
    : `${Math.round(visibleHours * 60)}M`;

  return (
    <div className={cn(
      "border-t border-border/50 bg-background overflow-hidden transition-all duration-300 flex-shrink-0 select-none",
      isExpanded ? "max-h-[250px]" : "max-h-0 border-t-0"
    )}>
      <div className="flex flex-col">
        {timelineTracks.map((track, idx) => (
          <div key={idx} className="flex items-center h-[22px] border-b border-border/30 last:border-b-0">
            <div className={cn(
              "w-[160px] px-3 text-[11px] truncate flex-shrink-0 border-r border-border/40 h-full flex items-center",
              track.selected
                ? "text-primary font-semibold underline underline-offset-2 bg-primary/5"
                : "text-foreground/80"
            )}>
              {track.name}
            </div>

            <div
              ref={idx === 0 ? trackAreaRef : undefined}
              className={cn(
                "flex-1 h-full relative overflow-hidden bg-muted/20",
                dragging ? "cursor-grabbing" : "cursor-col-resize"
              )}
              onMouseDown={handleMouseDown}
            >
              {track.segments.map((segment, sIdx) => {
                const left = toViewport(segment.start);
                const right = toViewport(segment.end);
                // Skip segments entirely outside viewport
                if (right < 0 || left > 100) return null;
                return (
                  <div
                    key={sIdx}
                    className={cn(
                      "absolute top-[3px] bottom-[3px] rounded-[2px] pointer-events-none",
                      segment.type === "recording"
                        ? "bg-primary/60"
                        : "bg-destructive/70"
                    )}
                    style={{
                      left: `${Math.max(0, left)}%`,
                      width: `${Math.min(100, right) - Math.max(0, left)}%`,
                    }}
                  />
                );
              })}

              {/* Playhead */}
              {playheadViewport >= 0 && playheadViewport <= 100 && (
                <div
                  className={cn(
                    "absolute top-0 bottom-0 w-[2px] bg-primary z-10 pointer-events-none",
                    !dragging && "transition-[left] duration-75"
                  )}
                  style={{ left: `${playheadViewport}%` }}
                >
                  {idx === 0 && (
                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-primary rounded-sm rotate-45 shadow" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Time Scale */}
        <div className="flex items-center h-[22px] border-t border-border/40">
          <div className="w-[160px] px-2 text-[10px] text-muted-foreground flex-shrink-0 border-r border-border/40 flex items-center gap-1.5">
            <span className="font-semibold uppercase tracking-wide">Time Interval</span>
            <Badge variant="secondary" className="text-[9px] h-3.5 px-1 font-bold">{intervalLabel}</Badge>
          </div>
          <div
            className={cn(
              "flex-1 flex items-center justify-between px-1 overflow-hidden bg-muted/20",
              dragging ? "cursor-grabbing" : "cursor-col-resize"
            )}
            onMouseDown={handleMouseDown}
          >
            {zoomLabels.map((label, idx) => (
              <span key={idx} className="text-[9px] text-muted-foreground flex-shrink-0 pointer-events-none">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
