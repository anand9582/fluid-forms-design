import { create } from "zustand";

export interface Segment {
  startTime: Date;
  endTime: Date;
}

interface PlaybackStore {
  isPlaying: boolean;
  isSeeking: boolean;
  speed: string;
  currentTimestamp: Date;
  segments: Segment[];
  playheadPosition: number;
  hasVideo: boolean;

  setIsPlaying: (v: boolean) => void;
  setIsSeeking: (v: boolean) => void;
  setSegments: (s: Segment[]) => void;
  setHasVideo: (v: boolean) => void;
  seekToDate: (date: Date) => void;
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  isPlaying: false,
  isSeeking: false,
  speed: "1x",
  currentTimestamp: new Date(),
  segments: [],
  playheadPosition: 0,
  hasVideo: false,

  setIsPlaying: (v) => set({ isPlaying: v }),
  setIsSeeking: (v) => set({ isSeeking: v }),
  setSegments: (segments) => set({ segments }),
  setHasVideo: (v) => set({ hasVideo: v }),

  seekToDate: (date) => {
    const { segments } = get();
    if (!segments.length) return;

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const pct =
      ((date.getTime() - dayStart.getTime()) /
        (dayEnd.getTime() - dayStart.getTime())) *
      100;

    set({
      currentTimestamp: date,
      playheadPosition: Math.max(0, Math.min(100, pct)),
    });
  },
}));