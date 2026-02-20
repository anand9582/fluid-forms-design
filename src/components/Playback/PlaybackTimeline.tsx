// Playback Timeline Tracks Component
// Interactive timeline with click-to-seek, playhead, recording/alert segments

import { useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { timelineTracks, timeLabels } from "./data";

interface PlaybackTimelineProps {
  playheadPosition: number;
  isExpanded: boolean;
  onSeek: (position: number) => void;
}

export function PlaybackTimeline({ playheadPosition, isExpanded, onSeek }: PlaybackTimelineProps) {
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    onSeek(Math.max(0, Math.min(100, percentage)));
  }, [onSeek]);

  return (
    <div className={cn(
      "border-t border-border/50 bg-background overflow-hidden transition-all duration-300 flex-shrink-0",
      isExpanded ? "max-h-[250px]" : "max-h-0 border-t-0"
    )}>
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
            className="flex-1 h-full relative bg-slate-50 dark:bg-slate-100 cursor-pointer"
            onClick={handleTrackClick}
          >
            {track.segments.map((segment, sIdx) => (
              <div
                key={sIdx}
                className={cn(
                  "absolute top-[3px] bottom-[3px] rounded-[2px]",
                  segment.type === "recording"
                    ? "bg-blue-400/80"
                    : "bg-red-400/90"
                )}
                style={{
                  left: `${segment.start}%`,
                  width: `${segment.end - segment.start}%`,
                }}
              />
            ))}
            {/* Playhead */}
            <div
              className="absolute top-0 bottom-0 w-[3px] bg-indigo-700 z-10 rounded-full transition-[left] duration-75"
              style={{ left: `${playheadPosition}%` }}
            >
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-700 rounded-sm rotate-45" />
            </div>
          </div>
        </div>
      ))}

      {/* Time Scale */}
      <div className="flex items-center h-[22px] border-t border-border/40">
        <div className="w-[160px] px-2 text-[10px] text-muted-foreground flex-shrink-0 border-r border-border/40 flex items-center gap-1.5">
          <span className="font-semibold uppercase tracking-wide">Time Interval</span>
          <Badge variant="secondary" className="text-[9px] h-3.5 px-1 font-bold">6H</Badge>
        </div>
        <div className="flex-1 flex items-center px-1 overflow-hidden bg-slate-50 dark:bg-slate-100">
          {timeLabels.map((label, idx) => (
            <span key={idx} className="text-[9px] text-muted-foreground flex-shrink-0 min-w-[52px]">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
