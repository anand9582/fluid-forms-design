// usePlayback.ts
import { useState, useCallback, useEffect, useRef } from "react";

const SPEED_MAP: Record<string, number> = {
  "-2x": -120,
  "-1x": -60,
  "1x": 60,
  "2x": 120,
  "4x": 240,
};

export function usePlayback() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playheadPosition, setPlayheadPosition] = useState(0); // 0–100
  const [speed, setSpeed] = useState("1x");
  const [isSynced, setIsSynced] = useState(true);

  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      const multiplier = SPEED_MAP[speed] || 60;
      const posDelta = (delta * multiplier) / (24 * 60 * 60 * 1000) * 100;

      setPlayheadPosition(prev => {
        const next = prev + posDelta;
        if (next <= 0 || next >= 100) {
          setIsPlaying(false);
          return Math.max(0, Math.min(100, next));
        }
        return next;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [isPlaying, speed]);

  return {
    isPlaying,
    playheadPosition,
    speed,
    isSynced,
    setIsSynced,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    togglePlay: () => setIsPlaying(p => !p),
    stop: () => {
      setIsPlaying(false);
      setPlayheadPosition(0);
    },
    rewind: () => {
      setSpeed("-1x");
      setIsPlaying(true);
    },
    fastForward: () => {
      const speeds = ["1x", "2x", "4x"];
      setSpeed(s => speeds[Math.min(speeds.indexOf(s) + 1, speeds.length - 1)]);
      setIsPlaying(true);
    },
    skipBack: () => setPlayheadPosition(p => Math.max(0, p - 2)),
    skipForward: () => setPlayheadPosition(p => Math.min(100, p + 2)),
    seekTo: (p: number) => setPlayheadPosition(Math.max(0, Math.min(100, p))),
  };
}