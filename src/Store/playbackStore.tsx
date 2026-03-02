import { create } from "zustand";

export interface Segment {
  startTime: Date;
  endTime: Date;
}

interface PlaybackStore {
  globalTime: Date;
  isPlaying: boolean;
  isSeeking: boolean;
  playbackSpeed: number;

  segments: Segment[];
  hasVideo: boolean;

  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  seekTo: (date: Date, callback?: () => void) => void;
  updateFromVideo: (date: Date) => void;

  setSegments: (segments: Segment[]) => void;
  setHasVideo: (value: boolean) => void;

  startClock: () => void;
  stopClock: () => void;
}

let clockInterval: NodeJS.Timeout | null = null;

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  globalTime: new Date(),
  isPlaying: false,
  isSeeking: false,
  playbackSpeed: 1,
  segments: [],
  hasVideo: false,

  play: () => {
    set({ isPlaying: true });
    get().startClock();
  },

  pause: () => {
    set({ isPlaying: false });
    get().stopClock();
  },

  setSpeed: (speed) => set({ playbackSpeed: speed }),

  seekTo: (date, callback) => {
    set({ globalTime: date, isSeeking: true });
    setTimeout(() => {
      set({ isSeeking: false });
      if (callback) callback();
    }, 50);
  },

  updateFromVideo: (date) => {
    if (get().isSeeking) return;
    set({ globalTime: date });
  },

  setSegments: (segments) => set({ segments }),
  setHasVideo: (value) => set({ hasVideo: value }),

  startClock: () => {
    if (clockInterval) return;
    clockInterval = setInterval(() => {
      const { globalTime, playbackSpeed, isPlaying } = get();
      if (!isPlaying) return;
      const nextTime = new Date(globalTime.getTime() + 250 * playbackSpeed);
      set({ globalTime: nextTime });
    }, 250);
  },

  stopClock: () => {
    if (clockInterval) {
      clearInterval(clockInterval);
      clockInterval = null;
    }
  },
}));