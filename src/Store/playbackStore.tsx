// playbackStore.ts
import { create } from "zustand";

export interface Segment {
  startTime: Date;
  endTime: Date;
}

interface PlaybackStore {
  isPlaying: boolean;
  speed: string;
  currentTimestamp: Date;
  segments: Segment[];
  playheadPosition: number; 
  setIsPlaying: (val: boolean) => void;
  togglePlay: () => void;
  setSpeed: (val: string) => void;
  setCurrentTimestamp: (date: Date) => void;
  setSegments: (segments: Segment[]) => void;
  seekToDate: (date: Date) => void;
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  isPlaying: false,
  speed: "1x",
  currentTimestamp: new Date(),
  segments: [],
  playheadPosition: 0,

  setIsPlaying: (val) => set({ isPlaying: val }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (val) => set({ speed: val }),
  setCurrentTimestamp: (date) => set({ currentTimestamp: date }),

  setSegments: (segments) => set({ segments }),

  seekToDate: (date: Date) => {
    const segments = get().segments;
    const nextSegment =
      segments.find((s) => date >= s.startTime && date <= s.endTime) ||
      segments.find((s) => date < s.startTime);

    if (!nextSegment) {
      console.warn("⛔ No segment available at this timestamp", date);
      return;
    }

    const safeTime = date < nextSegment.startTime ? nextSegment.startTime : date;

    // ✅ Playhead position calculate karo 0-100% me
    const DAY_START = new Date(safeTime);
    DAY_START.setHours(0, 0, 0, 0);
    const DAY_END = new Date(safeTime);
    DAY_END.setHours(23, 59, 59, 999);

    const pct = ((safeTime.getTime() - DAY_START.getTime()) / (DAY_END.getTime() - DAY_START.getTime())) * 100;

    set({ currentTimestamp: safeTime, playheadPosition: pct });
  },
}));