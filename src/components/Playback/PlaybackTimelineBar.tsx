// components/Playback/PlaybackTimelineBar.tsx
import { useState } from "react";
import { usePlaybackStore } from "@/Store/playbackStore";
import {
  Clock, Calendar as CalendarIcon, Lock, SkipBack, SkipForward, Rewind, FastForward,
  Play, Pause, Square, Filter, Bookmark, Scissors, MoreHorizontal,
  Download, ChevronDown, Mountain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatPlaybackTimestamp } from "@/hooks/use-playback";

interface PlaybackTimelineBarProps {
  isTimelineExpanded: boolean;
  onToggleTimeline: () => void;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onFastForward: () => void;
  speed: string;
  onRewind: () => void;
  onSkipBack: () => void;
  onStop: () => void;
  onSeekToDate: (date: Date) => void; 
}

export function PlaybackTimelineBar({ isTimelineExpanded, onToggleTimeline, zoomLevel, onZoomChange,onFastForward,speed,onRewind,onSeekToDate ,onSkipBack,onStop,onSkipForward  }: PlaybackTimelineBarProps) {
  // Zustand store
  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const togglePlay = usePlaybackStore((s) => s.togglePlay);
  const playheadPosition = usePlaybackStore((s) => s.playheadPosition);
  const currentTimestamp = usePlaybackStore((s) => s.currentTimestamp);
  const seekToDate = usePlaybackStore((s) => s.seekToDate);

  const zoomPercent = ((zoomLevel - 1) / 9) * 100;

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(currentTimestamp);
  const [timeHour, setTimeHour] = useState(String(currentTimestamp.getHours() % 12 || 12));
  const [timeMinute, setTimeMinute] = useState(String(currentTimestamp.getMinutes()).padStart(2, "0"));
  const [timeSecond, setTimeSecond] = useState(String(currentTimestamp.getSeconds()).padStart(2, "0"));
  const [ampm, setAmpm] = useState<"AM" | "PM">(currentTimestamp.getHours() >= 12 ? "PM" : "AM");

  const handlePickerOpen = (open: boolean) => {
    if (open) {
      setSelectedDate(currentTimestamp);
      const h = currentTimestamp.getHours();
      setTimeHour(String(h % 12 || 12));
      setTimeMinute(String(currentTimestamp.getMinutes()).padStart(2, "0"));
      setTimeSecond(String(currentTimestamp.getSeconds()).padStart(2, "0"));
      setAmpm(h >= 12 ? "PM" : "AM");
    }
    setPickerOpen(open);
  };

const handleApply = () => {
    const d = new Date(selectedDate);
    let h = parseInt(timeHour) || 0;
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    d.setHours(h, parseInt(timeMinute) || 0, parseInt(timeSecond) || 0, 0);

    console.log("📅 Picker applied date:", d);

    onSeekToDate(d); 

    setPickerOpen(false);
};

  return (
    <div className="flex items-center gap-1.5 px-3 py-1 border-t border-border bg-background flex-shrink-0">
      {/* TIMELINES label */}
      <div className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[12px]  font-roboto font-medium text-foreground uppercase  text-slate-500">Timelines</span>
      </div>

      {/* Live Date/Time — clickable popover */}
      <Popover open={pickerOpen} onOpenChange={handlePickerOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1.5 px-2 py-0.5 bg-muted/60 rounded ml-1 hover:bg-muted transition-colors cursor-pointer border-0 outline-none">
            <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground " />
            <span className="text-[11px] text-foreground whitespace-nowrap font-mono font-medium tabular-nums">
               {formatPlaybackTimestamp(currentTimestamp)}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" side="top">
          <div className="p-3 space-y-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              className={cn("p-0 pointer-events-auto")}
            />
            <div className="flex items-center gap-1.5 px-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={timeHour}
                onChange={(e) => setTimeHour(e.target.value.replace(/\D/g, "").slice(0, 2))}
                className="w-10 h-7 text-center text-xs px-1"
                placeholder="HH"
              />
              <span className="text-xs text-muted-foreground font-bold">:</span>
              <Input
                value={timeMinute}
                onChange={(e) => setTimeMinute(e.target.value.replace(/\D/g, "").slice(0, 2))}
                className="w-10 h-7 text-center text-xs px-1"
                placeholder="MM"
              />
              <span className="text-xs text-muted-foreground font-bold">:</span>
              <Input
                value={timeSecond}
                onChange={(e) => setTimeSecond(e.target.value.replace(/\D/g, "").slice(0, 2))}
                className="w-10 h-7 text-center text-xs px-1"
                placeholder="SS"
              />
              <Button variant={ampm === "AM" ? "default" : "outline"} size="sm" className="h-7 px-2 text-[10px]" onClick={() => setAmpm("AM")}>AM</Button>
              <Button variant={ampm === "PM" ? "default" : "outline"} size="sm" className="h-7 px-2 text-[10px]" onClick={() => setAmpm("PM")}>PM</Button>
            </div>
            <Button size="sm" className="w-full h-7 text-xs" onClick={handleApply}>
              Go to Date & Time
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Lock */}
      <Button variant="ghost" size="icon" className="h-6 w-6 bg-timelinebg rounded">
         <Lock className="h-3 w-3 text-muted-foreground" />
      </Button>



  <div className="flex-1" />

      {/* Speed indicator */}
      {speed !== "1x" && (
        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-bold">
          {speed}
        </Badge>
      )}

      {/* Zoom controls */}
      <div className="flex items-center gap-0.5 bg-timelinebg rounded">
        <Button
          variant="ghost" size="icon" className="h-6 w-6"
          onClick={() => onZoomChange(Math.max(1, zoomLevel - 1))}
          disabled={zoomLevel <= 1}
          title="Zoom Out"
        >
          <Mountain className="h-3 w-3 text-muted-foreground" />
        </Button>
        <div
          className="w-16 h-[3px] bg-muted rounded-full mx-0.5 relative cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            onZoomChange(Math.round(1 + pct * 9));
          }}
        >
          <div
            className="absolute left-0 top-0 h-full bg-primary rounded-full"
            style={{ width: `${zoomPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full border border-background"
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
      <div className="flex items-center gap-2 ml-1">
        <Button variant="ghost" size="icon" className="h-6 w-6 bg-timelinebg rounded text-slate-600" onClick={onRewind} title="Rewind">
           <Rewind className="h-2 w-2" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 bg-timelinebg rounded text-slate-600" onClick={onSkipBack} title="Skip Back">
          <SkipBack className="h-3 w-3" />
        </Button>
          {/* Play / Pause */}
        <Button
          variant="ghost" size="icon"
          className={cn(
            "h-6 w-6 rounded",
            isPlaying
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={togglePlay}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>

          <Button variant="ghost" size="icon" className="h-6 w-6 bg-timelinebg rounded text-slate-600" onClick={onStop} title="Stop">
          <Square className="h-3 w-3" />
        </Button>

        <Button variant="ghost" size="icon" className="h-6 w-6 bg-timelinebg rounded text-slate-600" onClick={onSkipForward} title="Skip Forward">
          <SkipForward className="h-3 w-3" />
        </Button>
          <Button
            variant="ghost" size="icon"
            className={cn(
              "h-6 w-6 rounded bg-timelinebg rounded text-slate-600",
              speed !== "1x" && !speed.startsWith("-")
                ? "bg-primary text-primary-foreground hover:bg-primary/90 "
                : ""
            )}
            onClick={onFastForward}
            title="Fast Forward"
          >
            <FastForward className="h-3 w-3" />
          </Button>
        </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 ml-1">
        <Button variant="ghost" size="icon" className="h-6 w-6 bg-timelinebg rounded text-slate-600"><Filter className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 bg-timelinebg rounded text-slate-600"><Bookmark className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 bg-timelinebg rounded text-slate-600"><Scissors className="h-3 w-3" /></Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 bg-timelinebg rounded text-slate-600"><MoreHorizontal className="h-3 w-3" /></Button>
      </div>

      {/* Export */}
      <Button size="sm" className="bg-primary rounded hover:bg-destructive/90 gap-1 h-6 px-2.5 text-[11px] ml-1">
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