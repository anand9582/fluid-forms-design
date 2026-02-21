// Playback Timeline Controls Bar
// Full transport controls with live timestamp, speed indicator, and all actions

import {
  Clock, Calendar, Lock, SkipBack, SkipForward, Rewind, FastForward,
  Play, Pause, Square, Filter, Bookmark, Crop, MoreHorizontal,
  Download, ChevronDown, Scissors, Mountain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatPlaybackTimestamp } from "@/hooks/use-playback";

interface PlaybackTimelineBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
  onRewind: () => void;
  onFastForward: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  speed: string;
  currentTimestamp: Date;
  isSynced: boolean;
  onToggleSync: (synced: boolean) => void;
  isTimelineExpanded: boolean;
  onToggleTimeline: () => void;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
}

export function PlaybackTimelineBar({
  isPlaying, onTogglePlay, onStop, onRewind, onFastForward,
  onSkipBack, onSkipForward, speed, currentTimestamp,
  isSynced, onToggleSync, isTimelineExpanded, onToggleTimeline,
  zoomLevel, onZoomChange,
}: PlaybackTimelineBarProps) {
  const zoomPercent = ((zoomLevel - 1) / 9) * 100; // 1-10 mapped to 0-100%
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 border-t border-border bg-background flex-shrink-0">
      {/* TIMELINES label */}
      <div className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">Timelines</span>
      </div>

      {/* Live Date/Time */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted/60 rounded ml-1">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[11px] text-foreground whitespace-nowrap font-mono font-medium tabular-nums">
          {/* {formatPlaybackTimestamp(currentTimestamp)} */}
        </span>
      </div>

      {/* Lock */}
      <Button variant="ghost" size="icon" className="h-6 w-6">
        <Lock className="h-3 w-3 text-muted-foreground" />
      </Button>

      {/* Synced toggle */}
      <div className="flex items-center gap-1.5 ml-1">
        <Switch checked={isSynced} onCheckedChange={onToggleSync} className="data-[state=checked]:bg-primary h-4 w-7" />
        <span className="text-[11px] text-foreground font-medium">Synced</span>
      </div>

      <div className="flex-1" />

      {/* Speed indicator */}
      {speed !== "1x" && (
        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-bold">
          {speed}
        </Badge>
      )}

      {/* Zoom controls */}
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost" size="icon" className="h-6 w-6"
          onClick={() => onZoomChange(Math.max(1, zoomLevel - 1))}
          disabled={zoomLevel <= 1}
          title="Zoom Out"
        >
          <Mountain className="h-3 w-3 text-muted-foreground" />
        </Button>
        <div
          className="w-12 h-[3px] bg-muted rounded-full mx-0.5 relative cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            onZoomChange(Math.round(1 + pct * 9));
          }}
        >
          <div
            className="absolute left-0 top-0 h-full bg-foreground/30 rounded-full"
            style={{ width: `${zoomPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-foreground/60 rounded-full border border-background"
            style={{ left: `calc(${zoomPercent}% - 4px)` }}
          />
        </div>
        <Button
          variant="ghost" size="icon" className="h-6 w-6"
          onClick={() => onZoomChange(Math.min(10, zoomLevel + 1))}
          disabled={zoomLevel >= 10}
          title="Zoom In"
        >
          <Mountain className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>

      {/* Transport Controls */}
      <div className="flex items-center gap-0 ml-1">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRewind} title="Rewind">
          <Rewind className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onSkipBack} title="Skip Back">
          <SkipBack className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onStop} title="Stop">
          <Square className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost" size="icon"
          className={cn(
            "h-6 w-6 rounded",
            isPlaying
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={onTogglePlay}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onSkipForward} title="Skip Forward">
          <SkipForward className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost" size="icon"
          className={cn(
            "h-6 w-6 rounded",
            speed !== "1x" && !speed.startsWith("-")
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : ""
          )}
          onClick={onFastForward}
          title="Fast Forward"
        >
          <FastForward className="h-3 w-3" />
        </Button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-0 ml-1">
        <Button variant="ghost" size="icon" className="h-6 w-6"><Filter className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6"><Bookmark className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6"><Crop className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6"><Scissors className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3" /></Button>
      </div>

      {/* Export */}
      <Button size="sm" className="bg-destructive hover:bg-destructive/90 gap-1 h-6 px-2.5 text-[11px] ml-1">
        <Download className="h-3 w-3" />
        Export
      </Button>

      {/* Expand/Collapse */}
      <Button
        variant="default" size="icon"
        className="h-6 w-6 rounded bg-primary hover:bg-primary/90 ml-1"
        onClick={onToggleTimeline}
      >
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isTimelineExpanded && "rotate-180")} />
      </Button>
    </div>
  );
}
