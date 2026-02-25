// hooks/useHlsWithStore.ts
import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { Segment, usePlaybackStore } from "@/Store/playbackStore";

interface Props {
  src: string;
  cameraId: string | null;
  segments: Segment[];
  onReady?: () => void;
}

export function useHlsWithStore({ src, cameraId, segments, onReady }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const retryRef = useRef<number | null>(null);

  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const currentTimestamp = usePlaybackStore((s) => s.currentTimestamp);
  const speed = usePlaybackStore((s) => s.speed);

  /* ---------- HLS SETUP ---------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !cameraId) return;

    console.log("HLS init", cameraId);

    if (Hls.isSupported()) {
      const hls = new Hls({
        lowLatencyMode: true,
        maxBufferLength: 10,
        backBufferLength: 0,
      });
      hlsRef.current = hls;
      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(src);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, async () => {
        onReady?.();
        try {
          await video.play();
          console.log("Autoplay success", cameraId);
        } catch (e) {
          console.warn("Autoplay blocked", e);
        }
      });

      // 🔹 Fragment loaded → force sync with currentTimestamp
      hls.on(Hls.Events.FRAG_LOADED, () => {
        const segment = segments.find(
          (s) =>
            currentTimestamp >= s.startTime && currentTimestamp <= s.endTime
        );
        if (!segment) return;

        const relativeTime =
          (currentTimestamp.getTime() - segment.startTime.getTime()) / 1000;

        if (Math.abs(video.currentTime - relativeTime) > 0.3) {
          console.log("SYNC VIDEO", {
            cameraId,
            currentTimestamp,
            segmentStart: segment.startTime,
            segmentEnd: segment.endTime,
            videoCurrentTime: video.currentTime,
            relativeTime,
          });
          video.currentTime = relativeTime;
        }
      });
    } else {
      video.src = src;
    }

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [src, cameraId]);

  /* ---------- PLAY / SEEK ---------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !cameraId) return;

    const sync = () => {
      if (video.readyState < 3) {
        retryRef.current = window.setTimeout(sync, 50);
        return;
      }

      video.playbackRate = parseFloat(speed.replace("x", "")) || 1;
      if (isPlaying) video.play().catch(() => {});
      else video.pause();

      const segment = segments.find(
        (s) =>
          currentTimestamp >= s.startTime && currentTimestamp <= s.endTime
      );

      if (!segment) {
        const nextSegment = segments.find((s) => currentTimestamp < s.startTime);
        if (nextSegment) {
          usePlaybackStore.getState().setCurrentTimestamp(nextSegment.startTime);
        }
        return;
      }

      const relativeTime = (currentTimestamp.getTime() - segment.startTime.getTime()) / 1000;
      if (Math.abs(video.currentTime - relativeTime) > 0.3) {
        video.currentTime = relativeTime;
      }
    };

    sync();

    return () => {
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [isPlaying, currentTimestamp, speed, segments, cameraId]);

  return videoRef;
}