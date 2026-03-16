import React, { useState, useMemo } from "react";
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
import { formatPlaybackTimestamp } from "@/hooks/use-playback";
import { Slider } from "@/components/ui/slider";
interface Props {
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
}

export function PlaybackTimelineBar({
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
  } = usePlaybackStore();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(globalTime);

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

  const applyDateTime = () => {
    const d = new Date(selectedDate);
    let h = parseInt(hour) || 0;

    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;

    d.setHours(h, parseInt(minute) || 0, parseInt(second) || 0, 0);

    onSeekToDate(d); // store update
    setPickerOpen(false);
  };

  // -----------------------
  // Instant live display while picker is open
  // -----------------------
  const displayTime = useMemo(() => {
    if (!pickerOpen) return globalTime;
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
  }, [pickerOpen, selectedDate, hour, minute, second, ampm, globalTime]);

  const handleForwardSpeedSelect = (speed: number) => {
    setSpeed(speed);
    setForwardSpeedOpen(false);
  };

  const handleReverseSpeedSelect = (speed: number) => {
    setSpeed(speed);
    setReverseSpeedOpen(false);
  };

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
            <span className="font-mono">
              {formatPlaybackTimestamp(displayTime)}
            </span>
          </button>
        </AppTooltip>

        {pickerOpen && (
          <div className="absolute bottom-full mt-2 z-50 bg-background border rounded shadow p-3">
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
              <Button size="sm" onClick={() => setAmpm("AM")}>
                AM
              </Button>
              <Button size="sm" onClick={() => setAmpm("PM")}>
                PM
              </Button>
            </div>

            <Button size="sm" className="w-full mt-2" onClick={applyDateTime}>
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
        <PlaybackControlButton label="Bookmark">
          <Bookmark className="h-3 w-3" />
        </PlaybackControlButton>
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