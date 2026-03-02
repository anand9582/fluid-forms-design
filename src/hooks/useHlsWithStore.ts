// useHlsWithStore.ts
import { useEffect, useMemo, useRef } from "react";
import Hls from "hls.js";
import { Segment, usePlaybackStore } from "@/Store/playbackStore";

interface Props {
  src: string;
  cameraId: string | null;
  segments: Segment[];
}

export function useHlsWithStore({ src, cameraId, segments }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const { globalTime, isPlaying, playbackSpeed, isSeeking, updateFromVideo, setHasVideo } =
    usePlaybackStore();

  /* ============================
     Build segment offsets
  ============================ */
  const segmentOffsets = useMemo(() => {
    let acc = 0;
    return segments.map((s) => {
      const duration = (s.endTime.getTime() - s.startTime.getTime()) / 1000; // sec
      const offset = acc;
      acc += duration;
      return { ...s, offset, duration };
    });
  }, [segments]);

  /* ============================
     Init HLS only once per src
  ============================ */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !cameraId) return;

    if (!hlsRef.current) {
      const hls = new Hls({ maxBufferLength: 15, enableWorker: true, lowLatencyMode: false });
      hls.attachMedia(video);
      hls.loadSource(src);
      hlsRef.current = hls;
    }

    return () => {
      // optional: destroy only if component unmounts
      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    };
  }, [src, cameraId]);

  /* ============================
     MASTER CLOCK → VIDEO SEEK
  ============================ */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !segmentOffsets.length) return;

    const seg =
      segmentOffsets.find((s) => globalTime >= s.startTime && globalTime <= s.endTime) ||
      segmentOffsets.find((s) => globalTime < s.startTime);

    if (!seg) {
      setHasVideo(false);
      video.pause();
      return;
    }

    setHasVideo(true);

    // Calculate target time in segment
    const logicalSeconds = (globalTime.getTime() - seg.startTime.getTime()) / 1000;
    const targetTime = seg.offset + logicalSeconds;

    // Check if targetTime is already buffered
    const buffered = Array.from({ length: video.buffered.length }, (_, i) => ({
      start: video.buffered.start(i),
      end: video.buffered.end(i),
    }));
    const inBuffer = buffered.some((b) => targetTime >= b.start && targetTime <= b.end);

    if (Math.abs(video.currentTime - targetTime) > 0.05) {
      if (video.fastSeek) {
        video.fastSeek(targetTime);
      } else {
        video.currentTime = targetTime;
      }
    }

    if (isPlaying && inBuffer) {
      video.playbackRate = Math.min(playbackSpeed, 16);
      video.muted = playbackSpeed > 4; // high speed mute
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [globalTime, isPlaying, playbackSpeed, segmentOffsets]);

  /* ============================
     VIDEO → MASTER CLOCK (Follow)
  ============================ */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !segmentOffsets.length) return;

    let rafId: number;
    const sync = () => {
      if (!isPlaying || isSeeking) {
        rafId = requestAnimationFrame(sync);
        return;
      }

      const current = video.currentTime;
      const seg = segmentOffsets.find(
        (s) => current >= s.offset && current <= s.offset + s.duration
      );

      if (seg) {
        const realTime = new Date(seg.startTime.getTime() + (current - seg.offset) * 1000);
        updateFromVideo(realTime);
      }

      rafId = requestAnimationFrame(sync);
    };

    rafId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, isSeeking, segmentOffsets]);

  return { videoRef };
}