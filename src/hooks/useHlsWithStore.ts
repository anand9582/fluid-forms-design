import { useEffect, useRef, useState } from "react";
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
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  const isPlaying = usePlaybackStore((s) => s.isPlaying);
  const currentTimestamp = usePlaybackStore((s) => s.currentTimestamp);
  const speedStr = usePlaybackStore((s) => s.speed);

  const speedMultiplier = parseFloat(speedStr.replace("x", "")) || 1;

  /* ---------------- RESET ---------------- */
  useEffect(() => {
    setFirstFrameReady(false);
  }, [src, cameraId]);

  /* ---------------- INIT HLS ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src || !cameraId) return;

    const hls = new Hls({ lowLatencyMode: true, maxBufferLength: 10 });
    hlsRef.current = hls;

    hls.attachMedia(video);
    hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(src));
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      hls.startLoad(0);
      video.play().catch(() => {});
    });

    video.onplaying = () => {
      setFirstFrameReady(true);
      onReady?.();
    };

    return () => {
      hls.destroy();
      hlsRef.current = null;
    };
  }, [src, cameraId]);

  /* ---------------- SEEK TO TIMESTAMP ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !cameraId || !firstFrameReady) return;

    const seg = segments.find(
      (s) => currentTimestamp >= s.startTime && currentTimestamp <= s.endTime
    );
    if (!seg) return;

    const targetSeconds = (currentTimestamp.getTime() - seg.startTime.getTime()) / 1000;

    // Only seek if difference > 0.3s
    if (Math.abs(video.currentTime - targetSeconds) > 0.3) {
      video.currentTime = targetSeconds;
    }

    // Apply normal playback
    if (isPlaying && speedMultiplier <= 16) {
      video.playbackRate = speedMultiplier;
      video.muted = false;
      video.play().catch(() => {});
    }
  }, [currentTimestamp, cameraId, firstFrameReady, segments, isPlaying, speedMultiplier]);

  /* ---------------- FAST FORWARD / HIGH SPEED (>16x) ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !firstFrameReady) return;
    if (!isPlaying || speedMultiplier <= 16) return;

    video.muted = true; // mute for very high speed
    const interval = setInterval(() => {
      if (!video || video.paused) return;

      const seg = segments.find(
        (s) => currentTimestamp >= s.startTime && currentTimestamp <= s.endTime
      );
      if (!seg) return;

      const delta = 0.1 * speedMultiplier; // jump in seconds
      video.currentTime = Math.min(seg.endTime.getTime() / 1000, video.currentTime + delta);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, firstFrameReady, speedMultiplier, currentTimestamp, segments]);

  /* ---------------- SKIP FORWARD / BACKWARD ---------------- */
  // Isko hook me directly implement karne ki zarurat nahi, skip buttons me
  // directly videoRef.current.currentTime +=/-= interval use karenge

  return { videoRef, firstFrameReady };
}