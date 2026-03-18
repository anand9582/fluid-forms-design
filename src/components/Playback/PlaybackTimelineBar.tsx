import React, { useState, useMemo, useEffect, useRef } from "react";
import { usePlaybackStore } from "@/Store/playbackStore";

import {
  Clock,
  Calendar as CalendarIcon,
  Rewind,
  SkipBack,
  SkipForward,
  FastForward,
  Play,
  Pause,
  Square,
  ChevronDown,
  Mountain,
  Filter,
  Bookmark,
  Download,
  Scissors,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { AppTooltip } from "@/components/ui/AppTooltip";
import { PlaybackControlButton } from "@/components/Common/PlaybackControlButton";
import { cn } from "@/lib/utils";
import { formatIST,toISTISOString  } from "@/components/Utils/Time";
import { Slider } from "@/components/ui/slider";
import axios from "axios";
import { API_BASE_URL, API_URLS, getAuthHeaders } from "@/components/Config/api"; 
import { PlaybackBookmarkPopover, PlaybackBookmark } from "@/components/Playback/PlaybackBookmarkPopover";

interface Props {
  cameraId?: string;
  bookmarks: PlaybackBookmark[];
  isTimelineExpanded: boolean;
  onToggleTimeline: () => void;
  zoomLevel: number;
  onZoomChange: (level: number) => void;
  onFastForward: () => void;
  onRewind: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onStop: () => void;
  onSeekToDate: (date: Date) => void;
  onAddBookmark: (name: string, position: number, timestamp: string, cameraId: string) => void;
  onRemoveBookmark: (id: string, cameraId: string) => void;
  onJumpToBookmark: (position: number) => void;
}

export function PlaybackTimelineBar({
  cameraId,
  bookmarks,
  isTimelineExpanded,
  onToggleTimeline,
  zoomLevel,
  onZoomChange,
  onFastForward,
  onRewind,
  onSkipBack,
  onSkipForward,
  onStop,
  onSeekToDate,
  onAddBookmark,
  onRemoveBookmark,
  onJumpToBookmark,
}: Props) {
  const {
    globalTime,
    isPlaying,
    play,
    pause,
    playbackSpeed,
    setSpeed,
    isSync,
    setSynced,
    lastSeekTime
  } = usePlaybackStore();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(globalTime);
  const [lastAppliedTime, setLastAppliedTime] = useState<Date | null>(null);

  const [forwardSpeedOpen, setForwardSpeedOpen] = useState(false);
  const [reverseSpeedOpen, setReverseSpeedOpen] = useState(false);

  const [hour, setHour] = useState(String(globalTime.getHours() % 12 || 12));
  const [minute, setMinute] = useState(
    String(globalTime.getMinutes()).padStart(2, "0")
  );
  const [second, setSecond] = useState(
    String(globalTime.getSeconds()).padStart(2, "0")
  );
  const [ampm, setAmpm] = useState<"AM" | "PM">(
    globalTime.getHours() >= 12 ? "PM" : "AM"
  );
  const zoomPercent = ((zoomLevel - 1) / 9) * 100;
const pickerRef = useRef<HTMLDivElement>(null);
  const togglePlay = () => {
    if (isPlaying) pause();
    else play();
  };

  const handleOpenPicker = (open: boolean) => {
    if (open) {
      setSelectedDate(globalTime);
      const h = globalTime.getHours();
      setHour(String(h % 12 || 12));
      setMinute(String(globalTime.getMinutes()).padStart(2, "0"));
      setSecond(String(globalTime.getSeconds()).padStart(2, "0"));
      setAmpm(h >= 12 ? "PM" : "AM");
    }
    setPickerOpen(open);
  };

  // Sync picker values when globalTime changes (and picker is closed)
  useEffect(() => {
    if (!pickerOpen) {
      setSelectedDate(globalTime);
      const h = globalTime.getHours();
      setHour(String(h % 12 || 12));
      setMinute(String(globalTime.getMinutes()).padStart(2, "0"));
      setSecond(String(globalTime.getSeconds()).padStart(2, "0"));
      setAmpm(h >= 12 ? "PM" : "AM");
      setLastAppliedTime(null); // Clear after store catches up
    }
  }, [globalTime, pickerOpen]);

  const applyDateTime = () => {
    const d = new Date(selectedDate);
    let h = parseInt(hour) || 0;

    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;

    d.setHours(h, parseInt(minute) || 0, parseInt(second) || 0, 0);

    // Set immediately for instant UI feedback
    setLastAppliedTime(d);
    
    // Then trigger store update (which will update globalTime)
    onSeekToDate(d);
    setPickerOpen(false);
  };

  // -----------------------
  // Display either lastAppliedTime (for instant feedback) or computed picker time
  // -----------------------
  const displayTime = useMemo(() => {
    // If we just applied a time, show it immediately (don't wait for store)
    if (lastAppliedTime) {
      return lastAppliedTime;
    }
    // If picker is open, show computed time from inputs
    if (pickerOpen) {
      const h = parseInt(hour) || 0;
      const realHour = ampm === "PM" ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
      return new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        realHour,
        parseInt(minute) || 0,
        parseInt(second) || 0
      );
    }
    // Otherwise show globalTime from store
    return globalTime;
  }, [pickerOpen, selectedDate, hour, minute, second, ampm, globalTime, lastAppliedTime]);

  const handleForwardSpeedSelect = (speed: number) => {
    setSpeed(speed);
    setForwardSpeedOpen(false);
  };

  const handleReverseSpeedSelect = (speed: number) => {
    setSpeed(speed);
    setReverseSpeedOpen(false);
  };

    // ----------------
  // BOOKMARK HANDLER
  // ----------------
  const handleAddBookmark = (name: string, position: number, timestamp: string, camId: string) => {
    if (!camId) return;
    onAddBookmark(name, position, timestamp, camId);
  };

  const handleRemoveBookmark = (id: string, camId: string) => {
    onRemoveBookmark(id, camId);
  };

  const handleJumpToBookmark = (position: number) => {
    const date = new Date(position);
    setLastAppliedTime(date);
    onSeekToDate(date);
    onJumpToBookmark(position);
    play();
  };

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
      setPickerOpen(false); 
    }
  };

  if (pickerOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [pickerOpen]);

  return (
    <div className="flex items-center h-9 px-2 py-3 gap-4 border-t bg-muted/30 text-[11px]">
      {/* LEFT: Clock + Timeline label */}
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span className="font-semibold tracking-wide">TIMELINE</span>
      </div>

      {/* DATE PICKER */}
      <div className="relative">
        <AppTooltip label="Select Date & Time" side="top">
          <button
            onClick={() => handleOpenPicker(!pickerOpen)}
            className="flex items-center gap-1 px-2 py-[2px] rounded bg-muted"
          >
            <CalendarIcon className="h-3 w-3" />
           <span className="text-md font-roboto font-medium text-slate-900">
              {formatIST(displayTime)}
            </span>
          </button>
        </AppTooltip>

        {pickerOpen && (
          
        <div ref={pickerRef} className="absolute bottom-full mt-2 z-50 bg-background border rounded shadow p-3">
  <Calendar
    mode="single"
    selected={selectedDate}
    onSelect={(d) => d && setSelectedDate(d)}
  />

  <div className="flex items-center gap-1 mt-2">
    <Input
      value={hour}
      onChange={(e) =>
        setHour(e.target.value.replace(/\D/g, "").slice(0, 2))
      }
      className="w-10 h-7 text-center"
    />
    :
    <Input
      value={minute}
      onChange={(e) =>
        setMinute(e.target.value.replace(/\D/g, "").slice(0, 2))
      }
      className="w-10 h-7 text-center"
    />
    :
    <Input
      value={second}
      onChange={(e) =>
        setSecond(e.target.value.replace(/\D/g, "").slice(0, 2))
      }
      className="w-10 h-7 text-center"
    />

    {/* AM/PM Buttons with selected highlight */}
    <Button
      size="sm"
      className={`w-12 ${ampm === "AM" ? "bg-slate-600 text-white" : "bg-muted text-gray-700"}`}
      onClick={() => setAmpm("AM")}
    >
      AM
    </Button>
    <Button
      size="sm"
      className={`w-12 ${ampm === "PM" ? "bg-slate-600 text-white" : "bg-muted text-gray-700"}`}
      onClick={() => setAmpm("PM")}
    >
      PM
    </Button>
  </div>

  <Button size="sm" className="w-full mt-2 bg-slate-600" onClick={applyDateTime}>
    Go to Date & Time
  </Button>
</div>
        )}
      </div>

      {/* SYNC SWITCH */}
     <TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <div className="ml-1 flex items-center gap-2 rounded-md bg-muted px-2 py-1">
        <Switch
          checked={isSync}
          onCheckedChange={(v) => setSynced(v)}
          className="h-4 w-7 data-[state=checked]:bg-primary"
        />

        <span className="text-[11px] font-medium text-foreground">
          Synced
        </span>
      </div>
    </TooltipTrigger>

    <TooltipContent side="top">
      <p>
        {isSync
          ? "All cameras seek together"
          : "Seek selected camera only"}
      </p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

      <div className="flex-1" />

      {/* ZOOM CONTROLS */}
     <div className="flex items-center gap-2 bg-timelinebg rounded text-slate-600">

  {/* Zoom Out */}
  <AppTooltip label="Zoom Out" side="top">
    <Button
      size="sm"
      variant="ghost"
      className="h-6 w-6 p-0 [&_svg]:h-3 [&_svg]:w-3"
      onClick={() => onZoomChange(Math.max(1, zoomLevel - 1))}
    >
      <Mountain />
    </Button>
  </AppTooltip>

  {/* Slider */}
  <Slider
    value={[zoomLevel]}
    min={1}
    max={10}
    step={1}
    trackHeight={3}
    thumbSize={10}
    className="w-16"
    onValueChange={(v) => onZoomChange(v[0])}
    thumbClassName="bg-white border-blue-600"
  />

  {/* Zoom In */}
  <AppTooltip label="Zoom In" side="top">
    <Button
      size="sm"
      variant="ghost"
      className="h-6 w-6 p-0 [&_svg]:h-4 [&_svg]:w-4"
      onClick={() => onZoomChange(Math.min(10, zoomLevel + 1))}
    >
      <Mountain />
    </Button>
  </AppTooltip>

</div>

      {/* PLAYBACK CONTROLS */}
      <div className="flex items-center gap-3 bg-muted/60 px-1 rounded">
        <PlaybackControlButton label="Previous Frame" onClick={onSkipBack}>
          <SkipBack className="h-3 w-3" />
        </PlaybackControlButton>
        <PlaybackControlButton
          label={isPlaying ? "Pause" : "Play"}
          onClick={togglePlay}
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </PlaybackControlButton>
        <PlaybackControlButton label="Stop" onClick={onStop}>
          <Square className="h-3 w-3" />
        </PlaybackControlButton>
        <PlaybackControlButton label="Next Frame" onClick={onSkipForward}>
          <SkipForward className="h-3 w-3" />
        </PlaybackControlButton>

        {/* SPEED CONTROLS */}
        <div className="flex items-center bg-timelinebg rounded-full text-slate-600">
          <div className="relative border-r border-slate-300">
            <PlaybackControlButton
              label="Reverse Speed"
              className="rounded-full w-9"
              active={playbackSpeed < 0}
              onClick={() => setReverseSpeedOpen((v) => !v)}
            >
              <Rewind className="h-3 w-3" />
            </PlaybackControlButton>

            {reverseSpeedOpen && (
              <div className="absolute bottom-full left-0 mb-1 bg-background border rounded shadow-md">
                {[-1, -2, -4, -8, -16, -32].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleReverseSpeedSelect(speed)}
                    className={cn(
                      "block w-12 px-2 py-1 text-left hover:bg-muted text-xs",
                      playbackSpeed === speed && "bg-primary text-white rounded-full"
                    )}
                  >
                    {speed}×
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <PlaybackControlButton
              label="Fast Forward Speed"
              active={playbackSpeed > 0}
              className="rounded-full w-9"
              onClick={() => setForwardSpeedOpen((v) => !v)}
            >
              <FastForward className="h-3 w-3" />
            </PlaybackControlButton>

            {forwardSpeedOpen && (
              <div className="absolute bottom-full right-0 mb-1 bg-background border rounded-md shadow-md">
                {[1, 2, 4, 8, 16, 32].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleForwardSpeedSelect(speed)}
                    className={cn(
                      "block w-12 px-2 py-1 text-left hover:bg-muted text-xs",
                      playbackSpeed === speed && "bg-primary text-white rounded"
                    )}
                  >
                    {speed}×
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* OTHER ACTIONS */}
        <PlaybackControlButton label="Filter">
          <Filter className="h-3 w-3" />
        </PlaybackControlButton>

        {/* BOOKMARK POPOVER */}
            {useMemo(() => {
              const dateForBookmarks = lastAppliedTime || globalTime;
              const dayStart = new Date(dateForBookmarks);
              dayStart.setHours(0, 0, 0, 0);
              const dayEnd = new Date(dateForBookmarks);
              dayEnd.setHours(23, 59, 59, 999);
              
              return (
                <PlaybackBookmarkPopover
                  bookmarks={bookmarks}
                  currentPosition={lastSeekTime ? lastSeekTime.getTime() : 0}
                  currentTimestamp={lastSeekTime ? formatIST(lastSeekTime) : "00:00:00"}
                  cameraId={cameraId || ""}
                  fromDate={dayStart.toISOString()}
                  toDate={dayEnd.toISOString()}
                  onAddBookmark={handleAddBookmark}
                  onRemoveBookmark={handleRemoveBookmark}
                  onJumpToBookmark={handleJumpToBookmark}
                />
              );
            }, [bookmarks, lastSeekTime, cameraId, lastAppliedTime, globalTime])}

        <PlaybackControlButton label="Clip">
          <Scissors className="h-3 w-3" />
        </PlaybackControlButton>
        <PlaybackControlButton label="More Options">
          <MoreHorizontal className="h-3 w-3" />
        </PlaybackControlButton>

        <Button
          size="sm"
          className="h-7 text-xs px-3 bg-primary font-roboto font-medium rounded flex items-center gap-1"
        >
          <Download className="h-3 w-3" /> Export
        </Button>
      </div>

       {/* EXPAND */}
      <AppTooltip
        label={isTimelineExpanded ? "Collapse Timeline" : "Expand Timeline"}
        side="top"
      >
        <Button size="icon" variant="ghost" onClick={onToggleTimeline} className="text-primary-foreground h-6 w-6 rounded bg-primary hover:bg-primary/90 hover:text-white">
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isTimelineExpanded && "rotate-180"
            )}
          />
        </Button>
      </AppTooltip>
    </div>
  );
}