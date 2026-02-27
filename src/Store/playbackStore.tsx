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
  togglePlay: () => set(s => ({ isPlaying: !s.isPlaying })),
  setSpeed: (val) => set({ speed: val }),
  setSegments: (segments) => set({ segments }),

  seekToDate: (date) => {
    const segments = get().segments;
    if (!segments.length) return;

    const seg =
      segments.find(s => date >= s.startTime && date <= s.endTime) ||
      segments.find(s => date < s.startTime);

    if (!seg) return;

    const safeTime = date < seg.startTime ? seg.startTime : date;

    const dayStart = new Date(safeTime);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(safeTime);
    dayEnd.setHours(23, 59, 59, 999);

    const pct =
      ((safeTime.getTime() - dayStart.getTime()) /
        (dayEnd.getTime() - dayStart.getTime())) *
      100;

    set({
      currentTimestamp: safeTime,
      playheadPosition: pct,
    });
  },
}));