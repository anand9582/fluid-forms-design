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

export function useHlsWithStore({
  src,
  cameraId,
  segments,
  onReady,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const retryRef = useRef<number | null>(null);

  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const currentTimestamp = usePlaybackStore((s) => s.currentTimestamp);
  const speed = usePlaybackStore((s) => s.speed);

  useEffect(() => {
    console.log("🎯 useHlsWithStore render", {
      cameraId,
      src,
      segmentsCount: segments.length,
    });
  }, [cameraId, src, segments]);

  /* ---------- HLS SETUP ---------- */
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !src || !cameraId) return;

    console.log("🔥 HLS init", cameraId);

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
        hls.startLoad(0);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, async () => {
        onReady?.();

        try {
          await video.play();
          console.log("▶️ Autoplay success", cameraId);
        } catch (e) {
          console.warn("⛔ Autoplay blocked", e);
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

      // -------- Safe segment selection --------
      const segment = segments.find(
        (s) =>
          currentTimestamp >= s.startTime &&
          currentTimestamp <= s.endTime
      );

      if (!segment) {
        // Optionally: jump to next available segment if in a gap
        const nextSegment = segments.find((s) => currentTimestamp < s.startTime);
        if (nextSegment) {
          console.log("⏭ Jumping to next segment", nextSegment.startTime);
          usePlaybackStore.getState().setCurrentTimestamp(nextSegment.startTime);
        }
        return; // No valid segment for seeking
      }

      const relativeTime = (currentTimestamp.getTime() - segment.startTime.getTime()) / 1000;

      if (relativeTime < 0) {
        console.warn("⛔ Negative seek blocked", {
          relativeTime,
          current: currentTimestamp,
          segmentStart: segment.startTime,
        });
        return;
      }

      if (Math.abs(video.currentTime - relativeTime) > 0.3) {
        console.log("⏩ SEEK", relativeTime);
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