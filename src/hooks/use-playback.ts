// Playback state management hook
// Manages playhead position, play/pause, speed, seeking, and timestamp calculation

import { useState, useCallback, useEffect, useRef } from "react";

// Timeline represents 24 hours: 12:00 AM to 11:59 PM
const TIMELINE_START_HOUR = 0; // 12:00 AM
const TIMELINE_DURATION_HOURS = 24;
const TIMELINE_DURATION_MS = TIMELINE_DURATION_HOURS * 60 * 60 * 1000;

// Playback speeds: how many real-ms of footage per 1ms of wall-clock
const SPEED_MAP: Record<string, number> = {
  "-2x": -120,
  "-1x": -60,
  "1x": 60,
  "2x": 120,
  "4x": 240,
};

export interface PlaybackState {
  isPlaying: boolean;
  playheadPosition: number; // 0-100 %
  speed: string;
  currentTimestamp: Date;
  isSynced: boolean;
}

export function usePlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(42); 
  const [speed, setSpeed] = useState("1x");
  const [isSynced, setIsSynced] = useState(true);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Convert position (0-100) to a Date
  const positionToTimestamp = useCallback((pos: number): Date => {
    const baseDate = new Date(2025, 11, 23); // Dec 23, 2025
    baseDate.setHours(TIMELINE_START_HOUR, 0, 0, 0);
    const offsetMs = (pos / 100) * TIMELINE_DURATION_MS;
    return new Date(baseDate.getTime() + offsetMs);
  }, []);

  const currentTimestamp = positionToTimestamp(playheadPosition);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const speedMultiplier = SPEED_MAP[speed] || 60;
      // Convert wall-clock delta to timeline delta
      const timelineDeltaMs = delta * speedMultiplier;
      const positionDelta = (timelineDeltaMs / TIMELINE_DURATION_MS) * 100;

      setPlayheadPosition(prev => {
        const next = prev + positionDelta;
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }
        if (next <= 0) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, speed]);

  const play = useCallback(() => {
    if (speed.startsWith("-")) setSpeed("1x");
    setIsPlaying(true);
  }, [speed]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setPlayheadPosition(0);
  }, []);

  const rewind = useCallback(() => {
    setSpeed("-1x");
    setIsPlaying(true);
  }, []);

  const fastForward = useCallback(() => {
    const speeds = ["1x", "2x", "4x"];
    const idx = speeds.indexOf(speed);
    const nextSpeed = speeds[Math.min(idx + 1, speeds.length - 1)];
    setSpeed(nextSpeed);
    setIsPlaying(true);
  }, [speed]);

  const skipBack = useCallback(() => {
    setPlayheadPosition(prev => Math.max(0, prev - 2));
  }, []);

  const skipForward = useCallback(() => {
    setPlayheadPosition(prev => Math.min(100, prev + 2));
  }, []);

  const seekTo = useCallback((position: number) => {
    setPlayheadPosition(Math.max(0, Math.min(100, position)));
  }, []);

  return {
    isPlaying,
    playheadPosition,
    speed,
    currentTimestamp,
    isSynced,
    setIsSynced,
    play,
    pause,
    togglePlay,
    stop,
    rewind,
    fastForward,
    skipBack,
    skipForward,
    seekTo,
  };
}


