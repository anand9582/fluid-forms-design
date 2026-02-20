import { useState } from "react";
import {
  Clock,
  Calendar as CalendarIcon,
  Lock,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Play,
  Pause,
  Square,
  Filter,
  Bookmark,
  Crop,
  MoreHorizontal,
  Download,
  ChevronDown,
  Scissors,
  Mountain,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
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
  isSynced: boolean;
  onToggleSync: (synced: boolean) => void;
  isTimelineExpanded: boolean;
  onToggleTimeline: () => void;
  onDateChange?: (date: Date) => void;
}

export function PlaybackTimelineBar({
  isPlaying,
  onTogglePlay,
  onStop,
  onRewind,
  onFastForward,
  onSkipBack,
  onSkipForward,
  speed,
  isSynced,
  onToggleSync,
  isTimelineExpanded,
  onToggleTimeline,
  onDateChange,
}: PlaybackTimelineBarProps) {

  // --- Default: selected date & time (current time) ---
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [selectedHour, setSelectedHour] = useState<number>(now.getHours());
  const [selectedMinute, setSelectedMinute] = useState<number>(now.getMinutes());
  const [popoverOpen, setPopoverOpen] = useState(false);

  // --- Update combined date/time ---
  const updateDateTime = (date?: Date, hour?: number, minute?: number) => {
    const newDate = new Date(date || selectedDate);
    newDate.setHours(hour ?? selectedHour);
    newDate.setMinutes(minute ?? selectedMinute);
    setSelectedDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 border-t border-border bg-background flex-shrink-0 overflow-hidden">
      
      {/* TIMELINES label */}
      <div className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[11px] font-bold uppercase tracking-wider">Timelines</span>
      </div>

      {/* Date & Time popover (icon + timestamp clickable) */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted/60 rounded ml-1 cursor-pointer">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] whitespace-nowrap font-mono font-medium tabular-nums">
              {formatPlaybackTimestamp(selectedDate)}
            </span>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex flex-col gap-2">
            {/* Time selection */}
            <div className="flex items-center justify-end gap-1">
              {/* Hour */}
              <Select
                value={String(selectedHour)}
                onValueChange={(val) => {
                  const hour = parseInt(val, 10);
                  setSelectedHour(hour);
                  updateDateTime(undefined, hour);
                }}
              >
                <SelectTrigger className="w-14 h-8 text-xs">
                  <SelectValue placeholder="HH" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {i.toString().padStart(2,"0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <span className="text-xs">:</span>

              {/* Minute */}
              <Select
                value={String(selectedMinute)}
                onValueChange={(val) => {
                  const minute = parseInt(val, 10);
                  setSelectedMinute(minute);
                  updateDateTime(undefined, undefined, minute);
                }}
              >
                <SelectTrigger className="w-14 h-8 text-xs">
                  <SelectValue placeholder="MM" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {Array.from({ length: 60 }, (_, i) => (
                    <SelectItem key={i} value={String(i)}>
                      {i.toString().padStart(2,"0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Calendar */}
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (!date) return;
                updateDateTime(date);
                setPopoverOpen(false);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Lock */}
      <Button variant="ghost" size="icon" className="h-6 w-6">
        <Lock className="h-3 w-3 text-muted-foreground" />
      </Button>

      {/* Synced toggle */}
      <div className="flex items-center gap-1.5 ml-1">
        <Switch
          checked={isSynced}
          onCheckedChange={onToggleSync}
          className="h-4 w-7 data-[state=checked]:bg-primary"
        />
        <span className="text-[11px] font-medium">Synced</span>
      </div>

      <div className="flex-1" />

      {/* Speed */}
      {speed !== "1x" && (
        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-bold">
          {speed}
        </Badge>
      )}

      {/* Zoom controls */}
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Mountain className="h-3 w-3 text-muted-foreground" />
        </Button>
        <div className="w-12 h-[3px] bg-muted rounded-full relative">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-foreground/30 rounded-full" />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-foreground/60 rounded-full border border-background"
            style={{ left: "calc(50% - 4px)" }}
          />
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <Mountain className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>

      {/* Transport Controls */}
      <div className="flex items-center gap-0 ml-1">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRewind}>
          <Rewind className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onSkipBack}>
          <SkipBack className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onStop}>
          <Square className="h-3 w-3" />
        </Button>
        <Button
          size="icon"
          className="h-6 w-6 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onTogglePlay}
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onSkipForward}>
          <SkipForward className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onFastForward}>
          <FastForward className="h-3 w-3" />
        </Button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0 ml-1">
        <Button variant="ghost" size="icon" className="h-6 w-6"><Filter className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6"><Bookmark className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6"><Crop className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6"><Scissors className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3" /></Button>
      </div>

      {/* Export */}
      <Button
        size="sm"
        className="bg-destructive hover:bg-destructive/90 gap-1 h-6 px-2.5 text-[11px] ml-1"
      >
        <Download className="h-3 w-3" />
        Export
      </Button>

      {/* Expand / Collapse */}
      <Button
        size="icon"
        className="h-6 w-6 bg-primary hover:bg-primary/90 ml-1"
        onClick={onToggleTimeline}
      >
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", isTimelineExpanded && "rotate-180")}
        />
      </Button>

    </div>
  );
}