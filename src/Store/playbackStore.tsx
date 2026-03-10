import { create } from "zustand";

export interface Segment {
  startTime: Date;
  endTime: Date;
}

interface PlaybackStore {
  globalTime: Date;
  cameraTimes: Record<number, Date>;
  isSync: boolean;
  isPlaying: boolean;
  isSeeking: boolean;
  playbackSpeed: number;

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

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  globalTime: new Date(),
  cameraTimes: {},

  isSync: true,
  isPlaying: false,
  isSeeking: false,
  playbackSpeed: 1,

  // ---------------- PLAYBACK ----------------

  play: () => set({ isPlaying: true }),

  pause: () => set({ isPlaying: false }),

  stop: () =>
    set({
      isPlaying: false,
      playbackSpeed: 1,
      globalTime: new Date(),
      cameraTimes: {},
    }),

  // ---------------- SPEED ----------------

  setSpeed: (speed) => {
    if (speed < 0) {
      set({ playbackSpeed: Math.max(speed, -32) });
    } else {
      set({ playbackSpeed: Math.min(Math.max(speed, 0.25), 36) });
    }
  },

  // ---------------- SYNC MODE ----------------

setSynced: (sync) => {
  const { globalTime, cameraTimes } = get();

  if (sync) {

    set({
      isSync: true,
      cameraTimes: {},
      globalTime: new Date(globalTime),
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

  // ---------------- SEEK ----------------

  seekTo: (date, slotIndex) => {
    const { isSync } = get();

    set({ isSeeking: true });

    if (isSync) {
      set({ globalTime: date });
    } else {
      if (slotIndex !== undefined) {
        set((state) => ({
          cameraTimes: {
            ...state.cameraTimes,
            [slotIndex]: date,
          },
        }));
      } else {
        set({ globalTime: date });
      }
    }

    setTimeout(() => set({ isSeeking: false }), 80);
  },

  seekBySeconds: (sec, slotIndex) => {
    const { isSync, globalTime, cameraTimes } = get();

    if (isSync) {
      set({
        globalTime: new Date(globalTime.getTime() + sec * 1000),
      });
    } else {
      if (slotIndex !== undefined) {
        const now = cameraTimes[slotIndex] || globalTime;

        set((state) => ({
          cameraTimes: {
            ...state.cameraTimes,
            [slotIndex]: new Date(now.getTime() + sec * 1000),
          },
        }));
      }
    }
  },

  seekToHour: (absHour, slotIndex) => {
    const base = get().globalTime;
    const date = new Date(base);

    date.setHours(Math.floor(absHour));
    date.setMinutes(Math.floor((absHour % 1) * 60));
    date.setSeconds(Math.floor((absHour * 3600) % 60));

    get().seekTo(date, slotIndex);
  },

  // ---------------- VIDEO FEEDBACK ----------------

  updateFromVideo: (date, slotIndex) => {
    if (get().isSeeking) return;

    const { isSync } = get();

    if (isSync) {
      set({ globalTime: date });
    } else if (slotIndex !== undefined) {
      set((state) => ({
        cameraTimes: {
          ...state.cameraTimes,
          [slotIndex]: date,
        },
      }));
    }
  },
}));
