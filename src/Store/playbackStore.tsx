import { create } from "zustand";

export interface Segment {
  startTime: Date;
  endTime: Date;
}

export interface PlaybackStore {
  globalTime: Date;
  cameraTimes: Record<number, Date>;
  slotSeeking: Record<number, boolean>;

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

  seekTo: (date: Date, slotIndex?: number) => void;
  seekBySeconds: (sec: number, slotIndex?: number) => void;
  seekToHour: (absHour: number, slotIndex?: number) => void;

  updateFromVideo: (date: Date, slotIndex?: number) => void;
}

type TimerMap = Record<number, ReturnType<typeof setTimeout>>;

export const usePlaybackStore = create<PlaybackStore>((set, get) => {
  const slotTimers: TimerMap = {};

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

  return {
    globalTime: new Date(),
    cameraTimes: {},
    slotSeeking: {},

    isSync: false,
    isPlaying: false,
    isSeeking: false,
    playbackSpeed: 1,

    lastSeekTime: null,
    setLastSeekTime: (date) => set({ lastSeekTime: date }),

    play: () => set({ isPlaying: true }),
    pause: () => set({ isPlaying: false }),

    stop: () =>
      set({
        isPlaying: false,
        playbackSpeed: 1,
        globalTime: new Date(),
        cameraTimes: {},
        slotSeeking: {},
        lastSeekTime: null,
      }),

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

    // 🔥 MAIN FIXED FUNCTION
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
        // INDEPENDENT mode: sirf selected slot
        startSlotSeeking(slotIndex); // per-slot seeking flag

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

        startSlotSeeking(slotIndex); // sirf selected slot ka loading

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

      stopSlotSeeking(slotIndex); // sirf us slot ka loading false
    },
  };
});