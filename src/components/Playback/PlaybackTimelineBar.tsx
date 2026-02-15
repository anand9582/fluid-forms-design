// Playback Timeline Controls Bar
// Transport controls, sync toggle, zoom, and export - compact single row

import {
  Clock, Calendar, Lock, SkipBack, SkipForward, Rewind, FastForward,
  Play, Pause, StopCircle, Filter, Bookmark, Crop, MoreHorizontal,
  Download, ChevronDown, ChevronUp, Scissors,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface PlaybackTimelineBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  isSynced: boolean;
  onToggleSync: (synced: boolean) => void;
  isTimelineExpanded: boolean;
  onToggleTimeline: () => void;
}

export function PlaybackTimelineBar({
  isPlaying, onTogglePlay, isSynced, onToggleSync,
  isTimelineExpanded, onToggleTimeline,
}: PlaybackTimelineBarProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border-t border-border bg-background flex-shrink-0">
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Timelines</span>
      </div>

      <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded">
        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-foreground whitespace-nowrap">23 DEC 2025 10:21:57 AM</span>
      </div>

      <Button variant="ghost" size="icon" className="h-7 w-7">
        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
      </Button>

      <div className="flex items-center gap-1.5">
        <Switch checked={isSynced} onCheckedChange={onToggleSync} className="data-[state=checked]:bg-primary h-4 w-8" />
        <span className="text-xs text-foreground">Synced</span>
      </div>

      <div className="flex-1" />

      {/* Zoom controls */}
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 20 L10 10 L14 16 L20 8" />
          </svg>
        </Button>
        <div className="w-14 h-1 bg-muted rounded-full mx-0.5 relative">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-foreground/40 rounded-full" />
          <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-foreground rounded-full border-2 border-background" style={{ left: 'calc(50% - 5px)' }} />
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 20 L8 14 L12 18 L16 10 L20 6" />
          </svg>
        </Button>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-0">
        <Button variant="ghost" size="icon" className="h-7 w-7"><Rewind className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><SkipBack className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><StopCircle className="h-3.5 w-3.5" /></Button>
        <Button
          variant="ghost" size="icon"
          className="h-7 w-7 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onTogglePlay}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><SkipForward className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><FastForward className="h-3.5 w-3.5" /></Button>
      </div>

      <div className="w-px h-5 bg-border" />

      {/* Additional buttons */}
      <div className="flex items-center gap-0">
        <Button variant="ghost" size="icon" className="h-7 w-7"><Filter className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><Bookmark className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><Crop className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><Scissors className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
      </div>

      <Button size="sm" className="bg-destructive hover:bg-destructive/90 gap-1.5 h-7 px-3 text-xs">
        <Download className="h-3.5 w-3.5" />
        Export
      </Button>

      <Button
        variant="outline" size="icon" className="h-7 w-7"
        onClick={onToggleTimeline}
      >
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isTimelineExpanded && "rotate-180")} />
      </Button>
    </div>
  );
}
