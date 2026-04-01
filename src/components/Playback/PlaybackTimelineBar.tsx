import React, { useState, useMemo, useEffect, useRef } from "react";
import { usePlaybackStore } from "@/Store/playbackStore";

import {
  Clock,
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
  ChevronLeft,
  ChevronRight,
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
import { formatIST, toISTISOString } from "@/components/Utils/Time";
import { Slider } from "@/components/ui/slider";
import axios from "axios";
import { APISERVERURL, API_URLS, getAuthHeaders } from "@/components/Config/api";
import { PlaybackBookmarkPopover, PlaybackBookmark } from "@/components/Playback/PlaybackBookmarkPopover";
import { DatePickerIcon } from "@/components/Icons/Svg/PlaybackIcons";

interface Props {
  cameraId?: string;
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
  selectedSlot: number | null;
}

export function PlaybackTimelineBar({
  cameraId,
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
  selectedSlot,
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
    lastSeekTime,
    slotPlaying
  } = usePlaybackStore();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(globalTime);
  const [calendarMonth, setCalendarMonth] = useState<Date>(globalTime);
  const [availableDates, setAvailableDates] = useState<number[]>([]);

  useEffect(() => {
    if (!pickerOpen || !cameraId) return;

    const fetchAvailableDates = async () => {
      try {
        const year = calendarMonth.getFullYear();
        const monthStr = String(calendarMonth.getMonth() + 1).padStart(2, "0");
        const res = await axios.get(`${APISERVERURL}api/recorder/available-dates?cameraId=${cameraId}&month=${year}-${monthStr}`);

        if (res.data?.data) {
          setAvailableDates(res.data.data);
        } else {
          setAvailableDates([]);
        }
      } catch (error) {
        console.error("Failed to fetch available dates:", error);
        setAvailableDates([]);
      }
    };

    fetchAvailableDates();
  }, [pickerOpen, cameraId, calendarMonth]);

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
  const [bookmarks, setBookmarks] = useState<PlaybackBookmark[]>([]);
  const zoomPercent = ((zoomLevel - 1) / 9) * 100;

  const currentSlotPlaying = (!isSync && selectedSlot !== null) 
    ? !!slotPlaying[selectedSlot] 
    : isPlaying;

  const togglePlay = () => {
    if (isSync) {
      if (isPlaying) pause();
      else play();
    } else {
      if (selectedSlot !== null) {
        if (slotPlaying[selectedSlot]) pause(selectedSlot);
        else play(selectedSlot);
      }
    }
  };

  const handleOpenPicker = (open: boolean) => {
    if (open) {
      setSelectedDate(globalTime);
      setCalendarMonth(globalTime);
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
    if (!isPlaying) play();
    setForwardSpeedOpen(false);
  };

  const handleReverseSpeedSelect = (speed: number) => {
    setSpeed(speed);
    if (!isPlaying) play();
    setReverseSpeedOpen(false);
  };

  // ----------------
  // BOOKMARK HANDLER
  // ----------------
  const handleAddBookmark = async (name: string, position: number, timestamp: string, camId: string) => {
    if (!camId) return;

    try {
      const res = await axios.post(
        `${APISERVERURL}${API_URLS.Bookmark}`,
        {
          cameraId: camId,
          bookmarkTime: timestamp,
          title: name,
          note: "Auto bookmark",
          createdBy: 101,
        },
        { headers: getAuthHeaders() }
      );

      if (res.status === 200) {
        const bookmarkData = res.data.data || res.data;
        const bookmarkId = bookmarkData?.id || res.data?.id;

        setBookmarks((prev) => [...prev, {
          id: bookmarkId,
          cameraId: camId,
          name,
          title: name,
          position,
          timestamp,
          bookmarkTime: timestamp,
          createdAt: new Date()
        }]);
      }
    } catch (err) {
      console.error("Failed to add bookmark", err);
    }
  };

  const handleRemoveBookmark = async (id: string, camId: string) => {
    try {
      const res = await axios.delete(
        `${APISERVERURL}${API_URLS.DELETE_BOOKMARK}/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (res.status === 200) {
        setBookmarks(bookmarks.filter((bm) => bm.id !== id));
      }
    } catch (err) {
      console.error("Failed to remove bookmark", err);
    }
  };

  const handleJumpToBookmark = (position: number) => {
    const date = new Date(position);
    onSeekToDate(date);
  };

  return (
    <div className="flex items-center h-9 px-2 py-3 gap-4 border-t text-[11px]
  bg-gradient-to-r 
  from-[#F8FAFC] to-[#E2E8F0] 
  dark:from-[#0F172A] dark:to-[#1E293B]">
      {/* LEFT: Clock + Timeline label */}
      <div className="flex items-center gap-1 text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span className="font-roboto text-slate-500 font-semibold tracking-wide text-xs capitilize">Timelines</span>
      </div>

      {/* DATE PICKER */}
      <div className="relative">
        <AppTooltip label="Select Date & Time" side="top">
          <button
            onClick={() => handleOpenPicker(!pickerOpen)}
            className="flex items-center gap-1 px-2 py-[2px] rounded "
          >
            <div className="w-4 h-4 bg-slate-200 rounded-[3px] flex items-center justify-center">
              <DatePickerIcon size={12} />
            </div>
            <span className="font-roboto  font-semibold text-slate-900">
              {formatIST(displayTime)}
            </span>
          </button>
        </AppTooltip>

        {pickerOpen && (
          <div className="absolute bottom-full mt-2 z-50 bg-background border rounded shadow p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              month={calendarMonth}
              onMonthChange={setCalendarMonth}
              disabled={[{ after: new Date() }]}
              components={{
                DayContent: (props) => {
                  const dayNumber = props.date.getDate();
                  const isCurrentMonth =
                    props.date.getMonth() === calendarMonth.getMonth();
                  const isAvailable = availableDates.includes(dayNumber);

                  return (
                    <div className="relative flex h-full w-full flex-col items-center justify-center pointer-events-none">
                      <span className="pointer-events-none">{dayNumber}</span>

                      {isCurrentMonth && (
                        <div
                          className={cn(
                            "absolute top-[-2px] right-0 w-[6px] h-[6px] rounded-full pointer-events-none",
                            isAvailable ? "bg-green-500" : "bg-red-500"
                          )}
                        />
                      )}
                    </div>
                  );
                },

                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />
              }}
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
          label={currentSlotPlaying ? "Pause" : "Play"}
          onClick={togglePlay}
        >
          {currentSlotPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
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
        <PlaybackBookmarkPopover
          bookmarks={bookmarks}
          currentPosition={(lastSeekTime || globalTime).getTime()}
          currentTimestamp={
            lastSeekTime
              ? toISTISOString(lastSeekTime)
              : toISTISOString(globalTime)
          }
          cameraId={cameraId || ""}
          onAddBookmark={handleAddBookmark}
          onRemoveBookmark={handleRemoveBookmark}
          onJumpToBookmark={handleJumpToBookmark}
        />

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