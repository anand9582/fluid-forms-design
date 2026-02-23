// stores/playbackStore.ts
import { create } from "zustand";

export interface Segment {
  startTime: Date; // IST
  endTime: Date;   // IST
  duration: number; // seconds
}

interface PlaybackStore {
  playheadPosition: number; // 0–100
  currentTimestamp: Date;   // IST
  isPlaying: boolean;
  speed: string;
  segments: Segment[];
  selectedDate: Date;

  setSelectedDate: (date: Date) => void;
  setPlayheadPosition: (pos: number) => void;
  seekToDate: (date: Date) => void;

  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  setSegments: (segments: Segment[]) => void;
}

const TIMELINE_DURATION_MS = 24 * 60 * 60 * 1000;

/* ---------- helpers (IST safe) ---------- */
function getDayStart(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  ); // local timezone (IST)
}

function convertPositionToDate(pos: number, baseDate: Date): Date {
  const dayStart = getDayStart(baseDate);
  return new Date(dayStart.getTime() + (pos / 100) * TIMELINE_DURATION_MS);
}

function convertDateToPosition(date: Date): number {
  const dayStart = getDayStart(date);
  return Math.max(
    0,
    Math.min(
      100,
      ((date.getTime() - dayStart.getTime()) / TIMELINE_DURATION_MS) * 100
    )
  );
}

/* ---------- STORE ---------- */
export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  playheadPosition: 0,
  currentTimestamp: getDayStart(new Date()),
  selectedDate: getDayStart(new Date()),
  isPlaying: true,
  speed: "1x",
  segments: [],

  setSelectedDate: (date) => {
    const dayStart = getDayStart(date);
    set({
      selectedDate: dayStart,
      currentTimestamp: dayStart,
      playheadPosition: 0,
    });
  },

  setPlayheadPosition: (pos) => {
    const { selectedDate } = get();
    set({
      playheadPosition: pos,
      currentTimestamp: convertPositionToDate(pos, selectedDate),
    });
  },

  seekToDate: (date) => {
    set({
      currentTimestamp: date,
      playheadPosition: convertDateToPosition(date),
    });
  },

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  setSegments: (segments) => set({ segments }),
}));