// // usePlayback.ts
// import { useState, useRef, useEffect, useCallback } from "react";

// // Timeline: 24 hours (12:00 AM to 11:59 PM)
// const TIMELINE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours in ms

// // Playback speeds (real-ms of footage per 1ms wall-clock)
// const SPEED_MAP: Record<string, number> = {
//   "-2x": -120,
//   "-1x": -60,
//   "1x": 60,
//   "2x": 120,
//   "4x": 240,
// };

// export interface PlaybackState {
//   isPlaying: boolean;
//   playheadPosition: number; // 0-100%
//   speed: string;
//   currentTimestamp: Date;
//   isSynced: boolean;
// }

// export function usePlayback() {
//   const [isPlaying, setIsPlaying] = useState(true);
//   const [playheadPosition, setPlayheadPosition] = useState(0);
//   const [speed, setSpeed] = useState("1x");
//   const [isSynced, setIsSynced] = useState(true);

//   const rafRef = useRef<number | null>(null);
//   const lastTimeRef = useRef<number>(0);

//   // Convert playhead % to Date
//   const positionToTimestamp = useCallback((pos: number, baseDate: Date = new Date()) => {
//     const dayStart = new Date(baseDate);
//     dayStart.setHours(0, 0, 0, 0);
//     const offsetMs = (pos / 100) * TIMELINE_DURATION_MS;
//     return new Date(dayStart.getTime() + offsetMs);
//   }, []);

//   const currentTimestamp = positionToTimestamp(playheadPosition);

//   /* ---------------- Animation Loop ---------------- */
//   useEffect(() => {
//     if (!isPlaying) {
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//       return;
//     }

//     lastTimeRef.current = performance.now();

//     const animate = (now: number) => {
//       const delta = now - lastTimeRef.current;
//       lastTimeRef.current = now;

//       const speedMultiplier = SPEED_MAP[speed] ?? 60;
//       const timelineDeltaMs = delta * speedMultiplier;
//       const positionDelta = (timelineDeltaMs / TIMELINE_DURATION_MS) * 100;

//       setPlayheadPosition(prev => {
//         const next = prev + positionDelta;
//         if (next >= 100 || next <= 0) {
//           setIsPlaying(false);
//           return Math.max(0, Math.min(100, next));
//         }
//         return next;
//       });

//       rafRef.current = requestAnimationFrame(animate);
//     };

//     rafRef.current = requestAnimationFrame(animate);
//     return () => rafRef.current && cancelAnimationFrame(rafRef.current);
//   }, [isPlaying, speed]);

//   /* ---------------- Controls ---------------- */
//   const play = useCallback(() => {
//     if (speed.startsWith("-")) setSpeed("1x"); // reset reverse
//     setIsPlaying(true);
//   }, [speed]);

//   const pause = useCallback(() => setIsPlaying(false), []);

// const togglePlay = useCallback(() => {
//   console.log("Before toggle, isPlaying:", isPlaying);
//   if (isPlaying) {
//     pause();
//   } else {
//     play();
//   }
// }, [isPlaying, play, pause]);

//   const stop = useCallback(() => {
//     setIsPlaying(false);
//     setPlayheadPosition(0);
//   }, []);

//   const rewind = useCallback(() => {
//     setSpeed("-1x");
//     setIsPlaying(true);
//   }, []);

//   const fastForward = useCallback(() => {
//     const speeds = ["1x", "2x", "4x"];
//     setSpeed(s => speeds[Math.min(speeds.indexOf(s) + 1, speeds.length - 1)]);
//     setIsPlaying(true);
//   }, []);

//   const skipBack = useCallback(() => setPlayheadPosition(p => Math.max(0, p - 2)), []);
//   const skipForward = useCallback(() => setPlayheadPosition(p => Math.min(100, p + 2)), []);
//   const seekTo = useCallback((pos: number) => setPlayheadPosition(Math.max(0, Math.min(100, pos))), []);

//   // Seek to specific Date
//   const seekToDate = useCallback((date: Date) => {
//     const dayStart = new Date(date);
//     dayStart.setHours(0, 0, 0, 0);
//     const offsetMs = date.getTime() - dayStart.getTime();
//     const pos = Math.max(0, Math.min(100, (offsetMs / TIMELINE_DURATION_MS) * 100));
//     setPlayheadPosition(pos);
//   }, []);

//   return {
//     isPlaying,
//     playheadPosition,
//     speed,
//     currentTimestamp,
//     isSynced,
//     setIsSynced,
//     play,
//     pause,
//     togglePlay,
//     stop,
//     rewind,
//     fastForward,
//     skipBack,
//     skipForward,
//     seekTo,
//     seekToDate,
//   };
// }

/* ---------------- Timestamp Formatters ---------------- */
export function formatPlaybackTimestamp(date: Date): string {
  const day = date.getDate();
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${day} ${month} ${year} ${h12}:${m}:${s} ${ampm}`;
}

export function formatShortTimestamp(date: Date): string {
  const h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `DEC ${date.getDate()} ${h12}:${m}:${s}`;
}