// Playback Timeline Tracks Component
// Displays recording/alert segments with playhead and time scale

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { timelineTracks, timeLabels } from "./data";

interface PlaybackTimelineProps {
  playheadPosition: number;
  isExpanded: boolean;
}

export function PlaybackTimeline({ playheadPosition, isExpanded }: PlaybackTimelineProps) {
  return (
    <div className={cn(
      "border-t border-border bg-background overflow-hidden transition-all duration-300 flex-shrink-0",
      isExpanded ? "max-h-[200px]" : "max-h-0 border-t-0"
    )}>
      {timelineTracks.map((track, idx) => (
        <div key={idx} className="flex items-center h-5 border-b border-border/50 last:border-b-0">
          <div className={cn(
            "w-40 px-3 text-[11px] truncate flex-shrink-0 border-r border-border h-full flex items-center bg-background",
            track.selected ? "text-primary font-medium underline" : "text-foreground"
          )}>
            {track.name}
          </div>
          <div className="flex-1 h-full relative bg-white dark:bg-slate-100">
            {track.segments.map((segment, sIdx) => (
              <div
                key={sIdx}
                className={cn(
                  "absolute top-0.5 bottom-0.5 rounded-sm",
                  segment.type === "recording" ? "bg-blue-400" : "bg-red-400"
                )}
                style={{
                  left: `${segment.start}%`,
                  width: `${segment.end - segment.start}%`,
                }}
              />
            ))}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-indigo-600 z-10"
              style={{ left: `${playheadPosition}%` }}
            />
          </div>
        </div>
      ))}

      {/* Time Scale */}
      <div className="flex items-center h-5 border-t border-border bg-background">
        <div className="w-40 px-2 text-[10px] text-muted-foreground flex-shrink-0 border-r border-border flex items-center gap-1.5 bg-background">
          <span className="font-medium">TIME INTERVAL</span>
          <Badge variant="secondary" className="text-[9px] h-3.5 px-1">6H</Badge>
        </div>
        <div className="flex-1 flex items-center px-1 overflow-hidden bg-white dark:bg-slate-100">
          {timeLabels.map((label, idx) => (
            <span key={idx} className="text-[9px] text-slate-500 flex-shrink-0 min-w-[52px]">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
