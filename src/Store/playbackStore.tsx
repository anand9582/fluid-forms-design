import { create } from "zustand";

export interface SegmentHour {
  start: number;
  end: number;
  type: "recording" | "gap";
}

export interface PlaybackStore {
  globalTime: Date;
  cameraTimes: Record<number, Date>;
  slotSeeking: Record<number, boolean>;
  slotPlaying: Record<number, boolean>;
  segmentsPerSlot: Record<number, SegmentHour[]>;
  dayStart: Date;

  isSync: boolean;
  isPlaying: boolean;
  playbackSpeed: number;
  isSeeking: boolean;

  lastSeekTime: Date | null;

  play: (slotIndex?: number | null) => void;
  pause: (slotIndex?: number | null) => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  setSynced: (sync: boolean) => void;
  setSeeking: (seeking: boolean) => void;
  setSegments: (segments: Record<number, SegmentHour[]>, dayStart: Date) => void;

  seekTo: (date: Date, slotIndex?: number) => void;
  seekBySeconds: (sec: number, slotIndex?: number) => void;
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => {
  let rAFId: number | null = null;
  let lastUpdateTime = Date.now();
  const slotTimers: Record<number, ReturnType<typeof setTimeout>> = {};
  let seekingTimer: number | null = null;

  const clearSlotTimer = (slotIndex: number) => {
    if (slotTimers[slotIndex]) {
      clearTimeout(slotTimers[slotIndex]);
      delete slotTimers[slotIndex];
    }
  };

  const startSlotSeeking = (slotIndex: number) => {
    clearSlotTimer(slotIndex);
    set((state) => ({
      slotSeeking: { ...state.slotSeeking, [slotIndex]: true },
    }));

    slotTimers[slotIndex] = setTimeout(() => {
      set((state) => ({
        slotSeeking: { ...state.slotSeeking, [slotIndex]: false },
      }));
      delete slotTimers[slotIndex];
    }, 3000);
  };

  const hourToDate = (hour: number, dayStart: Date) => {
    const d = new Date(dayStart);
    d.setHours(Math.floor(hour), Math.floor((hour % 1) * 60), Math.floor((hour * 3600) % 60), 0);
    return d;
  };

  const dateToHour = (date: Date, dayStart: Date) => (date.getTime() - dayStart.getTime()) / 3600000;

  const getRecordingSegments = (slotIndex: number) => {
    const slots = get().segmentsPerSlot;
    return (slots[slotIndex] || [])
      .filter((s) => s.type === "recording")
      .sort((a, b) => a.start - b.start);
  };

  const playbackLoop = () => {
    const { isPlaying, playbackSpeed, globalTime, cameraTimes, isSync, segmentsPerSlot, dayStart } = get();
    if (!isPlaying || playbackSpeed === 0) {
      rAFId = requestAnimationFrame(playbackLoop);
      return;
    }

    const now = Date.now();
    const deltaTime = (now - lastUpdateTime) / 1000; // seconds
    lastUpdateTime = now;
    // playbackSpeed is a multiplier (1x, 2x, etc.) relative to real time
    const deltaHours = (deltaTime * playbackSpeed) / 3600;

    if (isSync) {
      let currentHour = dateToHour(globalTime, dayStart) + deltaHours;

      const recordings = Object.keys(segmentsPerSlot)
        .map(Number)
        .flatMap((slot) => getRecordingSegments(slot))
        .sort((a, b) => a.start - b.start);

      if (recordings.length === 0) {
        rAFId = requestAnimationFrame(playbackLoop);
        return;
      }

      const first = recordings[0];
      const last = recordings[recordings.length - 1];

      if (currentHour > last.end) currentHour = first.start;
      else if (currentHour < first.start) currentHour = last.end;

      set({ globalTime: hourToDate(currentHour, dayStart) });
    } else {
      const { slotPlaying } = get();
      const newCameraTimes: Record<number, Date> = { ...cameraTimes };
      Object.keys(segmentsPerSlot).forEach((slotKey) => {
        const slotIndex = Number(slotKey);
        
        // If not synced, only advance slots that are actually playing
        if (!slotPlaying[slotIndex]) return;

        const segs = getRecordingSegments(slotIndex);
        if (!segs.length) return;

        let currentHour = dateToHour(cameraTimes[slotIndex] || globalTime, dayStart) + deltaHours;
        const first = segs[0];
        const last = segs[segs.length - 1];
        if (currentHour > last.end) currentHour = first.start;
        else if (currentHour < first.start) currentHour = last.end;

        newCameraTimes[slotIndex] = hourToDate(currentHour, dayStart);
      });
      set({ cameraTimes: newCameraTimes });
    }

    rAFId = requestAnimationFrame(playbackLoop);
  };

  const startLoop = () => {
    if (!rAFId) {
      lastUpdateTime = Date.now();
      rAFId = requestAnimationFrame(playbackLoop);
    }
  };

  const stopLoop = () => {
    if (rAFId) {
      cancelAnimationFrame(rAFId);
      rAFId = null;
    }
  };

  return {
    globalTime: new Date(),
    cameraTimes: {},
    slotSeeking: {},
    slotPlaying: {},
    segmentsPerSlot: {},
    dayStart: new Date(),

    isSync: false,
    isPlaying: false,
    playbackSpeed: 1,
    isSeeking: false,
    lastSeekTime: null,

    setSeeking: (seeking: boolean) => set({ isSeeking: seeking }),

    play: (slotIndex?: number | null) => {
      const { isSync, slotPlaying } = get();
      if (isSync || slotIndex === undefined || slotIndex === null) {
        // If sync is ON, or no specific slot targeted, play globally
        set({ isPlaying: true });
      } else {
        // Play only specific slot
        set({
          isPlaying: true, // Keep global true to keep loop running
          slotPlaying: { ...slotPlaying, [slotIndex]: true },
        });
      }
      startLoop();
    },
    pause: (slotIndex?: number | null) => {
      const { isSync, slotPlaying } = get();
      if (isSync || slotIndex === undefined || slotIndex === null) {
        set({ isPlaying: false });
        stopLoop();
      } else {
        const newSlotPlaying = { ...slotPlaying, [slotIndex]: false };
        set({ slotPlaying: newSlotPlaying });
        
        // If NO slot is playing anymore, stop the loop and stop global playing
        if (!Object.values(newSlotPlaying).some(Boolean)) {
          set({ isPlaying: false });
          stopLoop();
        }
      }
    },
    stop: () => {
      stopLoop();
      set({
        isPlaying: false,
        playbackSpeed: 1,
        globalTime: new Date(),
        cameraTimes: {},
        slotSeeking: {},
        slotPlaying: {},
        lastSeekTime: null,
      });
    },

    setSpeed: (speed: number) => {
      set({ playbackSpeed: Math.sign(speed) * Math.min(Math.abs(speed), 36) });
    },

    setSynced: (sync: boolean) => {
      const { globalTime, cameraTimes, isPlaying, segmentsPerSlot } = get();
      if (sync) {
        set({ isSync: true, cameraTimes: {}, globalTime });
      } else {
        const newTimes: Record<number, Date> = {};
        const newSlotPlaying: Record<number, boolean> = {};
        
        Object.keys(segmentsPerSlot).forEach((slot) => {
          newTimes[Number(slot)] = new Date(globalTime);
          newSlotPlaying[Number(slot)] = isPlaying; // Inherit global play state
        });
        
        set({ isSync: false, cameraTimes: newTimes, slotPlaying: newSlotPlaying });
      }
    },

    setSegments: (segments, dayStart) => set({ segmentsPerSlot: segments, dayStart }),

    seekTo: (date, slotIndex) => {
      const isSync = get().isSync;

      if (isSync) {
        set({ lastSeekTime: date, isSeeking: true, globalTime: date });
      } else if (slotIndex !== undefined) {
        startSlotSeeking(slotIndex);
        set((state) => ({
          cameraTimes: { ...state.cameraTimes, [slotIndex]: date },
          globalTime: date,
          lastSeekTime: date
        }));
      }

      if (seekingTimer) {
        window.clearTimeout(seekingTimer);
      }

      seekingTimer = window.setTimeout(() => {
        set({ isSeeking: false });
        seekingTimer = null;
      }, 150);
    },

    seekBySeconds: (sec, slotIndex) => {
      const { isSync, globalTime, cameraTimes } = get();
      const base = isSync ? globalTime : (slotIndex !== undefined ? cameraTimes[slotIndex] : globalTime);
      const newDate = new Date(base.getTime() + sec * 1000);

      if (isSync) {
        set({
          globalTime: newDate,
          lastSeekTime: newDate,
          isSeeking: true,
        });
      } else if (slotIndex !== undefined) {
        startSlotSeeking(slotIndex);
        set({
          cameraTimes: { ...cameraTimes, [slotIndex]: newDate },
          globalTime: newDate,
        });
      }

      if (seekingTimer) window.clearTimeout(seekingTimer);
      seekingTimer = window.setTimeout(() => {
        set({ isSeeking: false });
        seekingTimer = null;
      }, 150);
    },
  };
});