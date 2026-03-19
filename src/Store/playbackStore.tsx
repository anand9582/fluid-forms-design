import { create } from "zustand";

export interface Segment {
  startTime: Date;
  endTime: Date;
}

export interface SegmentHour {
  start: number;
  end: number;
  type: "recording" | "gap";
}

export interface PlaybackStore {
  globalTime: Date;
  cameraTimes: Record<number, Date>;
  slotSeeking: Record<number, boolean>;
  segmentsPerSlot: Record<number, SegmentHour[]>;
  dayStart: Date;

  isSync: boolean;
  isPlaying: boolean;
  isSeeking: boolean;
  playbackSpeed: number;

  lastSeekTime: Date | null;
  setLastSeekTime: (date: Date) => void;

  play: () => void;
  pause: () => void;
  stop: () => void;

  setSpeed: (speed: number) => void;
  setSynced: (sync: boolean) => void;
  setSegments: (segments: Record<number, SegmentHour[]>, dayStart: Date) => void;

  seekTo: (date: Date, slotIndex?: number) => void;
  seekBySeconds: (sec: number, slotIndex?: number) => void;
  seekToHour: (absHour: number, slotIndex?: number) => void;

  updateFromVideo: (date: Date, slotIndex?: number) => void;
}

type TimerMap = Record<number, ReturnType<typeof setTimeout>>;

export const usePlaybackStore = create<PlaybackStore>((set, get) => {
  const slotTimers: TimerMap = {};
  let playbackIntervalId: ReturnType<typeof setInterval> | null = null;
  let lastUpdateTime = Date.now();

  const clearSlotTimer = (slotIndex: number) => {
    if (slotTimers[slotIndex]) {
      clearTimeout(slotTimers[slotIndex]);
      delete slotTimers[slotIndex];
    }
  };

  const startSlotSeeking = (slotIndex: number) => {
    clearSlotTimer(slotIndex);

    set((state) => ({
      slotSeeking: {
        ...state.slotSeeking,
        [slotIndex]: true,
      },
    }));

    slotTimers[slotIndex] = setTimeout(() => {
      set((state) => ({
        slotSeeking: {
          ...state.slotSeeking,
          [slotIndex]: false,
        },
      }));

      delete slotTimers[slotIndex];
    }, 3000);
  };

  const stopSlotSeeking = (slotIndex: number) => {
    clearSlotTimer(slotIndex);

    set((state) => ({
      slotSeeking: {
        ...state.slotSeeking,
        [slotIndex]: false,
      },
    }));
  };

  // Helper: Convert hour to date
  const hourToDate = (hour: number, dayStart: Date): Date => {
    const newDate = new Date(dayStart);
    newDate.setHours(Math.floor(hour));
    newDate.setMinutes(Math.floor((hour % 1) * 60));
    newDate.setSeconds(Math.floor((hour * 3600) % 60));
    newDate.setMilliseconds(0);
    return newDate;
  };

  // Helper: Convert date to hour
  const dateToHour = (date: Date, dayStart: Date): number => {
    const ms = date.getTime() - dayStart.getTime();
    return ms / 3600000; // ms to hours
  };

  // Get all recording segments for a slot, sorted by start time
  const getRecordingSegments = (slotIndex: number): SegmentHour[] => {
    const slots = get().segmentsPerSlot;
    return (slots[slotIndex] || [])
      .filter((s) => s.type === "recording")
      .sort((a, b) => a.start - b.start);
  };

  // Find next segment to loop to (for forward playback)
  const getNextSegmentStart = (currentHour: number, segments: SegmentHour[]): number | null => {
    const recordings = segments.filter((s) => s.type === "recording").sort((a, b) => a.start - b.start);
    
    // Find first segment after currentHour
    for (const rec of recordings) {
      if (rec.start >= currentHour) {
        return rec.start;
      }
    }
    
    // If none found, loop to first segment
    return recordings.length > 0 ? recordings[0].start : null;
  };

  // Find previous segment to loop to (for reverse playback)
  const getPreviousSegmentEnd = (currentHour: number, segments: SegmentHour[]): number | null => {
    const recordings = segments.filter((s) => s.type === "recording").sort((a, b) => b.start - a.start);
    
    // Find first segment before currentHour
    for (const rec of recordings) {
      if (rec.end <= currentHour) {
        return rec.end;
      }
    }
    
    // If none found, loop to last segment
    return recordings.length > 0 ? recordings[recordings.length - 1].end : null;
  };

  // Clamp hour to valid recording segments
  const clampToRecordings = (hour: number, segments: SegmentHour[]): number | null => {
    const recordings = segments.filter((s) => s.type === "recording").sort((a, b) => a.start - b.start);
    
    if (recordings.length === 0) return null;

    const first = recordings[0];
    const last = recordings[recordings.length - 1];

    if (hour <= first.start) return first.start;
    if (hour >= last.end) return last.end;

    for (const rec of recordings) {
      if (hour >= rec.start && hour <= rec.end) return hour;
    }

    let nearest = first.start;
    let minDist = Math.abs(hour - nearest);
    for (const rec of recordings) {
      const startDist = Math.abs(hour - rec.start);
      const endDist = Math.abs(hour - rec.end);
      if (startDist < minDist) {
        minDist = startDist;
        nearest = rec.start;
      }
      if (endDist < minDist) {
        minDist = endDist;
        nearest = rec.end;
      }
    }
    return nearest;
  };

  const startPlaybackLoop = () => {
    if (playbackIntervalId) return;

    lastUpdateTime = Date.now();

    playbackIntervalId = setInterval(() => {
      const { isPlaying, playbackSpeed, globalTime, cameraTimes, isSync, segmentsPerSlot, dayStart } = get();

      if (!isPlaying || playbackSpeed === 0 || Object.keys(segmentsPerSlot).length === 0) {
        return;
      }

      const now = Date.now();
      const deltaTime = (now - lastUpdateTime) / 1000; // seconds
      lastUpdateTime = now;

      const updateAmount = deltaTime * playbackSpeed * 1000; // milliseconds

      if (isSync) {
        // SYNC mode: all slots together
        let currentHour = dateToHour(globalTime, dayStart);
        let updateHour = currentHour + (updateAmount / 3600000); // Convert ms to hours

        // Get all recording segments from first slot that has recordings
        let recordings: SegmentHour[] = [];
        for (const slotKey of Object.keys(segmentsPerSlot)) {
          const segs = getRecordingSegments(Number(slotKey));
          if (segs.length > 0) {
            recordings = segs;
            break;
          }
        }

        if (recordings.length === 0) return;

        // Check if we've passed the end of the last segment (forward)
        const lastSeg = recordings[recordings.length - 1];
        if (updateHour > lastSeg.end) {
          // Loop to first segment
          const firstSeg = recordings[0];
          updateHour = firstSeg.start;
        }
        // Check if we've passed the start of the first segment (reverse)
        else if (playbackSpeed < 0) {
          const firstSeg = recordings[0];
          if (updateHour < firstSeg.start) {
            // Loop to last segment
            updateHour = lastSeg.end;
          }
        }

        const newTime = hourToDate(Math.max(0, Math.min(24, updateHour)), dayStart);
        set({ globalTime: newTime });
      } else {
        // ASYNC mode: each slot independently
        const newCameraTimes: Record<number, Date> = { ...cameraTimes };
        let updated = false;

        Object.keys(segmentsPerSlot).forEach((slotKey) => {
          const slotIndex = Number(slotKey);
          const recordings = getRecordingSegments(slotIndex);

          if (recordings.length === 0) return;

          const currentTime = cameraTimes[slotIndex] || globalTime;
          let currentHour = dateToHour(currentTime, dayStart);
          let updateHour = currentHour + (updateAmount / 3600000);

          // Check if we've passed the end of the last segment (forward)
          const lastSeg = recordings[recordings.length - 1];
          if (updateHour > lastSeg.end) {
            // Loop to first segment
            const firstSeg = recordings[0];
            updateHour = firstSeg.start;
          }
          // Check if we've passed the start of the first segment (reverse)
          else if (playbackSpeed < 0) {
            const firstSeg = recordings[0];
            if (updateHour < firstSeg.start) {
              // Loop to last segment
              updateHour = lastSeg.end;
            }
          }

          newCameraTimes[slotIndex] = hourToDate(Math.max(0, Math.min(24, updateHour)), dayStart);
          updated = true;
        });

        if (updated) {
          set({ cameraTimes: newCameraTimes });
        }
      }
    }, 100); // Update every 100ms for smooth playback
  };

  const stopPlaybackLoop = () => {
    if (playbackIntervalId) {
      clearInterval(playbackIntervalId);
      playbackIntervalId = null;
    }
  };

  return {
    globalTime: new Date(),
    cameraTimes: {},
    slotSeeking: {},
    segmentsPerSlot: {},
    dayStart: new Date(),

    isSync: false,
    isPlaying: false,
    isSeeking: false,
    playbackSpeed: 1,

    lastSeekTime: null,
    setLastSeekTime: (date) => set({ lastSeekTime: date }),

    setSegments: (segments, dayStart) =>
      set({ segmentsPerSlot: segments, dayStart }),

    play: () => {
      set({ isPlaying: true });
      startPlaybackLoop();
    },
    pause: () => {
      set({ isPlaying: false });
      stopPlaybackLoop();
    },

    stop: () => {
      stopPlaybackLoop();
      set({
        isPlaying: false,
        playbackSpeed: 1,
        globalTime: new Date(),
        cameraTimes: {},
        slotSeeking: {},
        lastSeekTime: null,
      });
    },

    setSpeed: (speed) => {
      if (speed < 0) {
        set({ playbackSpeed: Math.max(speed, -32) });
      } else {
        set({
          playbackSpeed: Math.min(Math.max(speed, 0.25), 36),
        });
      }
    },

    setSynced: (sync) => {
      const { globalTime, cameraTimes } = get();

      if (sync) {
        set({
          isSync: true,
          cameraTimes: {},
          globalTime: new Date(globalTime),
          slotSeeking: {},
        });
      } else {
        const newTimes: Record<number, Date> = {};

        Object.keys(cameraTimes).forEach((slot) => {
          newTimes[Number(slot)] = new Date(globalTime);
        });

        set({
          isSync: false,
          cameraTimes: newTimes,
        });
      }
    },

    //  MAIN FIXED FUNCTION
    seekTo: (date, slotIndex) => {
      const { isSync } = get();

      set({ lastSeekTime: date });

      if (isSync) {
        // SYNC mode: sab slots ek saath
        set({
          isSeeking: true,
          slotSeeking: {}, // per-slot flags clear
          globalTime: date,
        });

        setTimeout(() => set({ isSeeking: false }), 80);
      } else if (slotIndex !== undefined) {
        startSlotSeeking(slotIndex); 

        set((state) => ({
          globalTime: date,
          cameraTimes: {
            ...state.cameraTimes,
            [slotIndex]: date,
          },
        }));
      }
    },

    seekBySeconds: (sec, slotIndex) => {
      const { isSync, globalTime, cameraTimes } = get();

      if (isSync) {
        const newDate = new Date(globalTime.getTime() + sec * 1000);

        set({
          globalTime: newDate,
          lastSeekTime: newDate,
        });
      } else if (slotIndex !== undefined) {
        const now = cameraTimes[slotIndex] || globalTime;
        const newDate = new Date(now.getTime() + sec * 1000);

        startSlotSeeking(slotIndex);

        set((state) => ({
          globalTime: newDate,
          cameraTimes: {
            ...state.cameraTimes,
            [slotIndex]: newDate,
          },
          lastSeekTime: newDate,
        }));
      }
    },

    seekToHour: (absHour, slotIndex) => {
      const base = get().globalTime;

      const date = new Date(base);
      date.setHours(Math.floor(absHour));
      date.setMinutes(Math.floor((absHour % 1) * 60));
      date.setSeconds(Math.floor((absHour * 3600) % 60));
      date.setMilliseconds(0);

      get().seekTo(date, slotIndex);
    },

    updateFromVideo: (date, slotIndex) => {
      if (slotIndex === undefined || get().isSeeking) return;

      set((state) => ({
        cameraTimes: {
          ...state.cameraTimes,
          [slotIndex]: date,
        },
      }));

      stopSlotSeeking(slotIndex);
    },
  };
});