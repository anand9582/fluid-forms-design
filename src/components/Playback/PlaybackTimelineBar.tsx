import { useState } from "react";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";

import { AppTooltip } from "@/components/ui/AppTooltip"; // common tooltip

import { cn } from "@/lib/utils";
import { formatPlaybackTimestamp } from "@/hooks/use-playback";

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
    setPlaybackSpeed,
  } = usePlaybackStore();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(globalTime);

  // forward/reverse speed dropdown states
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
    isPlaying ? pause() : play();
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
    onSeekToDate(d);
    setPickerOpen(false);
  };

  const handleForwardSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    setForwardSpeedOpen(false);
  };

  const handleReverseSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    setReverseSpeedOpen(false);
  };

  return (
    <div className="flex items-center gap-1 px-3 py-1 border-t bg-background">
      {/* LEFT */}
      <div className="flex items-center gap-1">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[12px] font-medium text-muted-foreground">
          TIMELINE
        </span>
      </div>

      {/* DATE PICKER */}
      <div>
        <AppTooltip label="Select Date & Time" side="top">
          <button
            className="flex items-center gap-1.5 px-2 py-0.5 bg-muted rounded"
            onClick={() => handleOpenPicker(!pickerOpen)}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            <span className="text-[11px] font-mono">
              {formatPlaybackTimestamp(globalTime)}
            </span>
          </button>
        </AppTooltip>
        {pickerOpen && (
          <div className="absolute mt-2 z-50 bg-background border rounded shadow p-3">
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
            <Button
              size="sm"
              className="w-full mt-2"
              onClick={applyDateTime}
            >
              Go to Date & Time
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* ZOOM */}
      <div className="flex items-center gap-1 bg-muted/60 rounded px-1">
        <AppTooltip label="Zoom Out" side="top">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => onZoomChange(Math.max(1, zoomLevel - 1))}
          >
            <Mountain className="h-3 w-3" />
          </Button>
        </AppTooltip>

        <div
          className="w-16 h-[3px] bg-border rounded relative cursor-pointer"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - r.left) / r.width;
            onZoomChange(Math.round(1 + pct * 9));
          }}
        >
          <div
            className="absolute h-full bg-primary rounded"
            style={{ width: `${zoomPercent}%` }}
          />
        </div>

        <AppTooltip label="Zoom In" side="top">
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7"
            onClick={() => onZoomChange(Math.min(10, zoomLevel + 1))}
          >
            <Mountain className="h-3 w-3" />
          </Button>
        </AppTooltip>
      </div>

      {/* TRANSPORT */}
      <div className="flex items-center gap-0.5 ml-1 bg-muted/60 px-1 rounded">
        <AppTooltip label="Rewind" side="top">
          <Button size="icon" variant="ghost" onClick={onRewind}>
            <Rewind className="h-3.5 w-3.5" />
          </Button>
        </AppTooltip>

        <AppTooltip label="Previous Frame" side="top">
          <Button size="icon" variant="ghost" onClick={onSkipBack}>
            <SkipBack className="h-3.5 w-3.5" />
          </Button>
        </AppTooltip>

        <AppTooltip label={isPlaying ? "Pause" : "Play"} side="top">
          <Button size="icon" variant="ghost" onClick={togglePlay}>
            {isPlaying ? (
              <Pause className="h-3.5 w-3.5" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
        </AppTooltip>

        <AppTooltip label="Stop" side="top">
          <Button size="icon" variant="ghost" onClick={onStop}>
            <Square className="h-3.5 w-3.5" />
          </Button>
        </AppTooltip>

        <AppTooltip label="Next Frame" side="top">
          <Button size="icon" variant="ghost" onClick={onSkipForward}>
            <SkipForward className="h-3.5 w-3.5" />
          </Button>
        </AppTooltip>

        {/* FAST + REVERSE SPEED */}
        <div className="flex gap-1">
          {/* FAST FORWARD */}
          <div className="relative">
            <AppTooltip label="Fast Forward Speed" side="top">
              <Button
                size="icon"
                variant="ghost"
                className={cn(playbackSpeed > 0 && "bg-primary text-white")}
                onClick={() => setForwardSpeedOpen((v) => !v)}
              >
                <FastForward className="h-3.5 w-3.5" />
              </Button>
            </AppTooltip>

            {forwardSpeedOpen && (
              <div className="absolute bottom-full right-0 mb-1 bg-background border rounded shadow-md overflow-hidden z-50">
                {[1, 2, 4, 8, 16, 36].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleForwardSpeedSelect(speed)}
                    className={cn(
                      "w-12 px-2 py-1 text-[11px] text-left hover:bg-muted",
                      playbackSpeed === speed &&
                        "bg-primary text-white font-bold"
                    )}
                  >
                    {speed}×
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* REVERSE SPEED */}
          <div className="relative">
            <AppTooltip label="Reverse Speed" side="top">
              <Button
                size="icon"
                variant="ghost"
                className={cn(playbackSpeed < 0 && "bg-primary text-white")}
                onClick={() => setReverseSpeedOpen((v) => !v)}
              >
                <Rewind className="h-3.5 w-3.5" />
              </Button>
            </AppTooltip>

            {reverseSpeedOpen && (
              <div className="absolute bottom-full right-0 mb-1 bg-background border rounded shadow-md overflow-hidden z-50">
                {[-32, -16, -8, -4, -2, -1].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => handleReverseSpeedSelect(speed)}
                    className={cn(
                      "w-12 px-2 py-1 text-[11px] text-left hover:bg-muted",
                      playbackSpeed === speed &&
                        "bg-primary text-white font-bold"
                    )}
                  >
                    {speed}×
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* EXPAND */}
      <AppTooltip
        label={isTimelineExpanded ? "Collapse Timeline" : "Expand Timeline"}
        side="top"
      >
        <Button size="icon" variant="ghost" onClick={onToggleTimeline}>
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