import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Segment, usePlaybackStore } from "@/Store/playbackStore";

interface Props {
  src: string;
  cameraId: string;
  segments: Segment[];
  onReady?: () => void;
}

export function useHlsWithStore({ src, cameraId, segments, onReady }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const playRetryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const currentTimestamp = usePlaybackStore((s) => s.currentTimestamp);
  const speed = usePlaybackStore((s) => s.speed);

  /* ---------------- HLS setup ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (!hlsRef.current && Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true, maxBufferLength: 10, backBufferLength: 0 });
      hlsRef.current = hls;
      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(src);
        hls.startLoad(0);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        onReady?.();
        if (isPlaying) video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_event, data) => console.error("HLS error:", data));
    } else if (!Hls.isSupported()) {
      video.src = src;
    }

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    return () => {
      if (playRetryRef.current) clearTimeout(playRetryRef.current);
    };
  }, [src, cameraId, onReady]);

  /* ---------------- Play/Pause ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playRetryRef.current) clearTimeout(playRetryRef.current);

    const tryPlay = () => {
      if (!video) return;
      if (video.readyState >= 3) {
        video.playbackRate = parseFloat(speed.replace("x", "")) || 1;
        if (isPlaying) video.play().catch(() => (playRetryRef.current = setTimeout(tryPlay, 50)));
        else video.pause();

        // Timeline seek
        const segment =
          segments.find((s) => currentTimestamp >= s.startTime && currentTimestamp <= s.endTime) ||
          segments.find((s) => currentTimestamp < s.startTime);

        if (segment) {
          const relativeTime = (currentTimestamp.getTime() - segment.startTime.getTime()) / 1000;
          if (Math.abs(video.currentTime - relativeTime) > 0.5) video.currentTime = relativeTime;
        }
      } else playRetryRef.current = setTimeout(tryPlay, 50);
    };
    tryPlay();

    return () => {
      if (playRetryRef.current) clearTimeout(playRetryRef.current);
    };
  }, [isPlaying, currentTimestamp, segments, speed, src]);

  return videoRef;
}